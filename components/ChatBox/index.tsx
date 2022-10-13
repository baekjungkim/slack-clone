import { ChatBoxArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import autosize from 'autosize';
import { Mention, OnChangeHandlerFunc } from 'react-mentions';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';

interface Props {
  chat: string;
  onChatSubmit: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: FC<Props> = ({ chat, onChatSubmit, onChangeChat, placeholder }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onChatKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onChatSubmit(e);
          if (textareaRef.current) {
            autosize.update(textareaRef.current);
          }
        }
      }
    },
    [onChatSubmit],
  );

  return (
    <ChatBoxArea>
      <Form onSubmit={onChatSubmit}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onChatKeyDown}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={
              userData
                ? memberData
                    ?.filter((member) => member.id !== userData.id)
                    .map((member) => ({ id: member.id, display: member.nickname })) || []
                : []
            }
            // renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatBoxArea>
  );
};

export default ChatBox;
