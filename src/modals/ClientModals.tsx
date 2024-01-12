export interface ClientModal {
  firstName: string;
  location: {
    area: string;
    zone: string;
  };
  mobile: string;
  technology: string;
  email: string;
  _id: string;
  companyName: string;
  applicationType: string;
}

export interface CreateClientModal {
  firstName: string;
  email: string;
  mobile: string;
  location: string | { area: string; zone: string };
  technology: string;
  companyName: string;
  applicationType: string;
}
