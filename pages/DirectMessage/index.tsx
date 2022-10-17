import { Container, Header } from '@pages/DirectMessage/styles';
import React, { useCallback } from 'react';
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

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser | false>(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: myData } = useSWR<IUser | false>('/api/users', fetcher);
  const {
    data: chatData,
    mutate: chatMutate,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

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
      <ChatList chatSections={chatSections} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onChatSubmit={onChatSubmit} />
    </Container>
  );
};

export default DirectMessage;
