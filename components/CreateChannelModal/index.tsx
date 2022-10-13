import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: React.MouseEventHandler<HTMLElement>;
  setShowCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChannelModal: FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannelName, onChangeNewChannelName, setnewChannelName] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: channelMudate } = useSWR<IChannel[]>(
    userData && show ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newChannelName || !newChannelName.trim()) return;
      axios
        .post(`/api/workspaces/${workspace}/channels`, { name: newChannelName }, { withCredentials: true })
        .then(() => {
          channelMudate();
          setShowCreateChannelModal(false);
          setnewChannelName('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'top-center' });
        });
    },
    [newChannelName],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-name-label">
          <span>채널 명</span>
          <Input id="channel-name" value={newChannelName} onChange={onChangeNewChannelName} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
