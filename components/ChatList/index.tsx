import Chat from '@components/Chat';
import { ChatListArea, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC } from 'react';

interface Props {
  chatData: IDM[];
}

const ChatList: FC<Props> = ({ chatData }) => {
  return (
    <ChatListArea>
      <Section>
        {chatData.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Section>
    </ChatListArea>
  );
};

export default ChatList;
