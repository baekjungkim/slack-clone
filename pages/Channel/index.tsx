import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { Container, Header } from '@pages/Channel/styles';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import React, { useCallback, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const PAGE_SIZE = 20;

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel | false>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}` : null,
    fetcher,
  );
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) || false;

  const scrollbarRef = useRef<Scrollbars>(null);

  const [chat, onChangeChat, setChat] = useInput('');
  const onChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!chat) return '';
      setChat('');
    },
    [chat, setChat],
  );

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList chatSections={chatSections} setSize={setSize} isReachingEnd={isReachingEnd} ref={scrollbarRef} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onChatSubmit={onChatSubmit} />
    </Container>
  );
};

export default Channel;
