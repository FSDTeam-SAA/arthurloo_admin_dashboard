

export type Contact = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  __v: number;
};

export type ContactsMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ContactsApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: ContactsMeta;
  data: Contact[];
};