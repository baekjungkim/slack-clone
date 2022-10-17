import Chat from '@components/Chat';
import { ChatListArea, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import React, { FC, useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  chatSections: { [key: string]: IDM[] } | [];
}

const ChatList: FC<Props> = ({ chatSections }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatListArea>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatListArea>
  );
};

export default ChatList;
