import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import { Navigate } from 'react-router-dom';

type Props = {
  children?: React.ReactNode;
};

const Workspace: FC<Props> = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios
      .post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
      .then(() => mutate(false, false));
  }, []);

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
