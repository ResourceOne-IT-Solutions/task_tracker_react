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
}
