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
  setShowInviteChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const [inviteUserEmail, onChangeinviteUserEmail, setInviteUserEmale] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: memebrMutate } = useSWR<IUser[]>(
    userData && show ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteChannel = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inviteUserEmail || !inviteUserEmail.trim()) return;
      axios
        .post(
          `/api/workspaces/${workspace}/channels/${channel}/members`,
          { email: inviteUserEmail },
          { withCredentials: true },
        )
        .then(() => {
          memebrMutate();
          setShowInviteChannelModal(false);
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
      <form onSubmit={onInviteChannel}>
        <Label id="invite-name-label">
          <span>이메일</span>
          <Input id="invite-name" value={inviteUserEmail} onChange={onChangeinviteUserEmail} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
