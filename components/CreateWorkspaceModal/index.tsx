import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: React.MouseEventHandler<HTMLElement>;
  setShowCreateWorkspaceModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowCreateWorkspaceModal }) => {
  const { mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const [newWorkspaceName, onChangeNewWorkspaceName, setNewWorkspaceName] = useInput('');
  const [newWorkspaceUrl, onChangeNewWorkspaceUrl, setNewWorkspaceUrl] = useInput('');

  const onCreateWorkspace = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newWorkspaceName || !newWorkspaceName.trim()) return;
      if (!newWorkspaceUrl || !newWorkspaceUrl.trim()) return;
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          { workspace: newWorkspaceName, url: newWorkspaceUrl },
          { withCredentials: true },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspaceName('');
          setNewWorkspaceUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'top-center' });
        });
    },
    [newWorkspaceName, newWorkspaceUrl],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-name-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace-name" value={newWorkspaceName} onChange={onChangeNewWorkspaceName} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크스페이스 url</span>
          <Input id="workspace-url" value={newWorkspaceUrl} onChange={onChangeNewWorkspaceUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
