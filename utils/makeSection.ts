import { IDM } from '@typings/db';
import dayjs from 'dayjs';

const makeSection = (chatList: IDM[]) => {
  const sections: { [key: string]: IDM[] } = {};
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
