export interface SubscribeApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: SubscribePlan[];
  };
}

export interface SubscribePlan {
  _id: string;
  planName: string;
  price: number;
  features: string[];
  user: User[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}
