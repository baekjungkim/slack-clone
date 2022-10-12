import { CloseMenuButton, CreateMenu } from '@components/Menu/styles';
import React, { FC, useCallback } from 'react';

interface Props {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onCloseMenu: React.MouseEventHandler<HTMLSpanElement>;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, style, onCloseMenu, closeButton = true }) => {
  const onStopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu onClick={onCloseMenu}>
      <div style={style} onClick={onStopPropagation}>
        {closeButton && <CloseMenuButton onClick={onCloseMenu}>&times;</CloseMenuButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
