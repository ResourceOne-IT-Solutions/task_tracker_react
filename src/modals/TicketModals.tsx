import { ClientLocationModal } from "./ClientModals";
import { NameIdInterface } from "./UserModals";

interface TicketUserModal {
  name: string;
  id: string;
  email: string;
  location: ClientLocationModal;
}
type Status =
  | "Not Assigned"
  | "Assigned"
  | "In Progress"
  | "Pending"
  | "Closed"
  | "Improper Requirment";
export interface TicketUpdates {
  description: string;
  comments: string;
  date: string;
  status: Status;
  updatedBy: NameIdInterface;
  _id: string;
}

export interface TicketModal {
  _id: string;
  addOnResource: TicketUserModal[];
  client: TicketUserModal;
  comments: string;
  requirement: string;
  conversation: string[];
  description: string;
  receivedDate: Date;
  status: string;
  technology: string;
  updates: TicketUpdates[];
  user: TicketUserModal;
  assignedDate: Date;
  closedDate: Date;
  targetDate: Date;
  updatedAt: Date;
  isClosed: boolean;
  createdBy: NameIdInterface;
  serialNo: number;
  closedBy: NameIdInterface;
}

export interface UpdateTicketProps {
  show: boolean;
  onHide: () => void;
  ticketData: TicketModal;
  updateTableData: (updatedTicket: TicketModal) => void;
}

export interface UpdateTicketPayload {
  description: string;
  comments: string;
  status: string;
  updatedBy: { id: string; name: string };
}

export interface AddOnResourcePayload {
  id: string;
  data: { addOnResource: NameIdInterface };
}
export interface AddOnUserResourcePayload {
  id: string;
  data: { user: NameIdInterface; status: string };
}

export interface CreateTicketModal {
  client: {
    name: string;
    id: string;
    mobile: string;
    email: string;
    location: ClientLocationModal;
  };
  user: NameIdInterface;
  technology: string;
  description: string;
  targetDate: string;
  createdBy?: NameIdInterface;
}
export interface SendTicketEmail {
  to: string;
  content: TicketModal;
  updateType: string;
}
export interface TicketUpdateMessage {
  message: string;
}
export interface TicketStatsInterface {
  count: number;
  status: string;
}
