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
  date: Date;
  isPending: boolean;
  client: NameIdInterface;
  sender: NameIdInterface;
  time: Date;
  __v: number;
  _id: string;
}
export interface MessageRequestInterface {
  content: string;
  date: Date;
  deliveredTo: string[];
  sender: NameIdInterface;
  time: Date;
  viewedBy: string[];
  __v: number;
  _id: string;
  isSeen: boolean;
}

export interface FileModel {
  fileName: string;
  filename: string;
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
  time: Date;
  date: string;
  fileLink: string;
  _id: string;
}
