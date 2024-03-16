import { NameIdInterface } from "./UserModals";

export interface ClientLocationModal {
  area: string;
  zone: string;
}

export interface ClientModal {
  firstName: string;
  location: ClientLocationModal;
  mobile: string;
  technology: string;
  email: string;
  _id: string;
  companyName: string;
  applicationType: string;
  createdAt: string;
  createdBy: NameIdInterface;
  ticketsCount: number;
}
export interface Location {
  area: string;
  zone: string;
}
export interface CreateClientModal {
  firstName: string;
  email: string;
  mobile: string;
  area: string;
  zone: string;
  technology: string;
  companyName: string;
  applicationType: string;
  createdBy?: NameIdInterface;
  location?: Location;
}
