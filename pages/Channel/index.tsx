import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { Container, Header } from '@pages/Channel/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel | false>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}` : null,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');
  const onChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!chat) return '';
      setChat('');
    },
    [chat, setChat],
  );

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onChatSubmit={onChatSubmit} />
    </Container>
  );
};

export default Channel;
