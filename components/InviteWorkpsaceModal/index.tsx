import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: React.MouseEventHandler<HTMLElement>;
  setShowInviteWorkspaceModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const [inviteUserEmail, onChangeinviteUserEmail, setInviteUserEmale] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { mutate: memebrMutate } = useSWR<IUser[]>(
    userData && show ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteWorkspace = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inviteUserEmail || !inviteUserEmail.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/members`,
          { email: inviteUserEmail },
          { withCredentials: true },
        )
        .then(() => {
          memebrMutate();
          setShowInviteWorkspaceModal(false);
          setInviteUserEmale('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'top-center' });
        });
    },
    [inviteUserEmail],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteWorkspace}>
        <Label id="invite-name-label">
          <span>이메일</span>
          <Input id="invite-name" value={inviteUserEmail} onChange={onChangeinviteUserEmail} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
