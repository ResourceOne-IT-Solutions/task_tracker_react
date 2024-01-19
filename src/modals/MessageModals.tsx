import { Type } from "./UserModals";

export interface ChatRequestInterface {
  date: string;
  isPending: boolean;
  opponent: { name: string; id: string };
  sender: { name: string; id: string };
  time: string;
  __v: number;
  _id: string;
}
export interface TicketRequestInterface {
  date: string;
  isPending: boolean;
  client: { name: string; id: string };
  sender: { name: string; id: string };
  time: string;
  __v: number;
  _id: string;
}

export interface FileModel {
  fileName: string;
  size: number;
  type: Type;
  _id: string;
  data: {
    data: Buffer;
    type: string;
  };
}

export interface MessageModel {
  from: {
    name: string;
    id: string;
  };
  to: string;
  content: string;
  type: Type;
  opponentId: string;
  time: string;
  date: string;
  fileLink: string;
  _id: string;
}
