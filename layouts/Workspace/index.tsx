import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Navigate, Outlet } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';
import loadable from '@loadable/component';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelLIst';
import { useParams } from 'react-router';

const Menu = loadable(() => import('@components/Menu'));
const CreateWorkspaceModal = loadable(() => import('@components/CreateWorkspaceModal'));
const CreateChannelModal = loadable(() => import('@components/CreateChannelModal'));
const InviteWorkspaceModal = loadable(() => import('@components/InviteWorkpsaceModal'));
const InviteChannelModal = loadable(() => import('@components/InviteChannelModal'));

const Workspace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);

  const onLogout = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => mutate(false, false));
  }, []);

  const onClickUserProfile = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);

  const toggleWorkspaceMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowWorkspaceMenu((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal((prev) => !prev);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'mp' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} onCloseMenu={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'mp' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceMenu}>Slack</WorkspaceName>
          <MenuScroll>
            {showWorkspaceMenu && (
              <Menu style={{ top: 95, left: 80 }} onCloseMenu={toggleWorkspaceMenu}>
                <WorkspaceMenu>
                  <h2>Slack</h2>
                  <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceMenu>
              </Menu>
            )}
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkspaceModal
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default Workspace;
