import { Container, Header } from '@pages/DirectMessage/styles';
import React, { useCallback, useEffect, useRef } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { IUser, IDM } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { toast } from 'react-toastify';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars-2';

const PAGE_SIZE = 20;

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser | false>(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: myData } = useSWR<IUser | false>('/api/users', fetcher);
  const {
    data: chatData,
    mutate: chatMutate,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) || false;

  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, onChangeChat, setChat] = useInput('');
  const onChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!chat || !chat.trim()) return '';
      axios
        .post(`/api/workspaces/${workspace}/dms/${id}/chats`, { content: chat }, { withCredentials: true })
        .then(() => {
          chatMutate();
          setChat('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'top-center' });
        });
    },
    [chat, id, chatMutate, setChat, workspace],
  );

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
        <span>
          {userData.nickname}
          {userData.id === myData.id ? '(나)' : ''}
        </span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onChatSubmit={onChatSubmit} />
    </Container>
  );
};

export default DirectMessage;
