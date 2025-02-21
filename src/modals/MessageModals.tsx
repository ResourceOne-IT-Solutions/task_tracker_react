import { NameIdInterface, Type } from "./UserModals";

export interface ChatRequestInterface {
  date: string;
  isPending: boolean;
  opponent: NameIdInterface;
  sender: NameIdInterface;
  time: Date;
  _id: string;
}
export interface GroupChatRequestInterface {
  date: string;
  description: string;
  members: NameIdInterface[];
  requestdBy: NameIdInterface;
  name: string;
  status: string;
  time: Date;
  _id: string;
}
export interface TicketRequestInterface {
  date: Date;
  isPending: boolean;
  client: NameIdInterface;
  sender: NameIdInterface;
  time: Date;
  _id: string;
}
export interface TicketRaiseInterface {
  date: Date;
  isPending: boolean;
  sender: NameIdInterface;
  time: Date;
  _id: string;
  content: string;
}
export interface AdminMessageInterface {
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
export interface RaiseTicketInterface {
  content: string;
  date: string;
  isPending: boolean;
  sender: NameIdInterface;
  time: string;
  _id: string;
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
export interface TicketRaiseCardProps {
  message: TicketRaiseInterface;
  isNew: boolean;
}

export interface AdminRequestCardProps {
  id: string;
  sender: string;
  receiver?: string;
  members?: NameIdInterface[];
  isPending: boolean | string;
  onApprove: (id: string, type: string, isRejected?: boolean) => void;
  type: string;
  time: Date;
  isNew: boolean;
  accessIds?: string[];
  handleCheckBoxChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
  handleChatExport?: (id: string) => void;
}

export interface AdminMessageCardProps {
  message: AdminMessageInterface;
  isAdmin: boolean;
  onConfirm?: (message: AdminMessageInterface) => void;
  isNew: boolean;
  currentUserId: string;
}
export interface UserRequestCardProps {
  sender: string;
  receiver: string;
  type: string;
  time: Date;
  isPending: boolean;
  onApprove: () => void;
}
