import { Container, Header } from '@pages/DirectMessage/styles';
import React from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams, useNavigate } from 'react-router';

const DirectMessage = () => {
  const navigate = useNavigate();
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData, error } = useSWR<IUser | false>(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: myData } = useSWR<IUser | false>('/api/users', fetcher);

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
      {/* <ChatList /> */}
      {/* <ChatBox /> */}
    </Container>
  );
};

export default DirectMessage;
