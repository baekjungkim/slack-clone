import { IChat, IDM } from '@typings/db';
import dayjs from 'dayjs';

const makeSection = (chatList: (IDM | IChat)[]) => {
  const sections: { [key: string]: (IDM | IChat)[] } = {};
  for (const chat of chatList) {
    const monthData = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthData])) {
      sections[monthData].push(chat);
    } else {
      sections[monthData] = [chat];
    }
  }
  return sections;
};

export default makeSection;
