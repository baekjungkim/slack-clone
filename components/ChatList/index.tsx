import Chat from '@components/Chat';
import { ChatListArea, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC, useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  chatData: IDM[];
}

const ChatList: FC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatListArea>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        <Section>
          {chatData.map((chat) => (
            <Chat key={chat.id} data={chat} />
          ))}
        </Section>
      </Scrollbars>
    </ChatListArea>
  );
};

export default ChatList;
