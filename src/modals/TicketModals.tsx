interface TicketUserModal {
  name: string;
  id: string;
}
type Status =
  | "Not Assigned"
  | "Assigned"
  | "In Progress"
  | "Pending"
  | "Resolved"
  | "Improper Requirment";
interface Updates {
  description: string;
  comments: string;
  date: string;
  status: Status;
}

export interface TicketModal {
  _id: string;
  addOnResource: TicketUserModal[];
  client: TicketUserModal;
  comments: string;
  conversation: string[];
  description: string;
  receivedDate: Date;
  status: string;
  technology: string;
  updates: Updates[];
  user: TicketUserModal;
  assignedDate: Date;
  closedDate: Date;
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
}

export interface AddOnResourcePayload {
  id: string;
  data: { addOnResource: { name: string; id: string } };
}

export interface CreateTicketModal {
  client: { name: string; id: string; mobile: string };
  user: { name: string; id: string };
  technology: string;
  description: string;
  targetDate: string;
}
