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
