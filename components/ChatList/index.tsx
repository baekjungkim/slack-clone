import Chat from '@components/Chat';
import { ChatListArea, Section, StickyHeader } from '@components/ChatList/styles';
import { IChat, IDM } from '@typings/db';
import React, { forwardRef, MutableRefObject, useCallback } from 'react';
import { positionValues, Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] } | [];
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, scrollRef) => {
  const onScroll = useCallback(
    (values: positionValues) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        setSize((prevSize) => prevSize + 1).then(() => {
          setTimeout(() => {
            const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
            if (current) {
              current.scrollTop(current.getScrollHeight() - values.scrollHeight);
            }
          }, 100);
        });
      }
    },
    [scrollRef, isReachingEnd, setSize],
  );

  return (
    <ChatListArea>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
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
});

export default ChatList;
