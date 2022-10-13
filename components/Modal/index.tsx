import { CloseModalButton, CreateModal } from '@components/Modal/styles';
import React, { FC, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  show: boolean;
  onCloseModal: React.MouseEventHandler<HTMLElement>;
  closeButton?: boolean;
}

const Modal: FC<Props> = ({ children, show, onCloseModal, closeButton = true }) => {
  const onStopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={onStopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
