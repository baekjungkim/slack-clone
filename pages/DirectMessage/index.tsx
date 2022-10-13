import { Container, Header } from '@pages/DirectMessage/styles';
import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData, error } = useSWR<IUser | false>(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: myData } = useSWR<IUser | false>('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const onChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!chat) return '';
      setChat('');
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
        <span>
          {userData.nickname}
          {userData.id === myData.id ? '(나)' : ''}
        </span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onChatSubmit={onChatSubmit} />
    </Container>
  );
};

export default DirectMessage;
