import { NameIdInterface, Type } from "./UserModals";

export interface ChatRequestInterface {
  date: string;
  isPending: boolean;
  opponent: NameIdInterface;
  sender: NameIdInterface;
  time: string;
  __v: number;
  _id: string;
}
export interface TicketRequestInterface {
  date: string;
  isPending: boolean;
  client: NameIdInterface;
  sender: NameIdInterface;
  time: string;
  __v: number;
  _id: string;
}
export interface MessageRequestInterface {
  content: string;
  date: string;
  deliveredTo: [];
  sender: NameIdInterface;
  time: string;
  viewedBy: [];
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
