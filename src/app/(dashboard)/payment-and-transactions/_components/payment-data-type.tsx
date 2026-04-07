

export interface PaymentApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Payment[];
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface Payment {
  _id: string;
  user: User;
  subscribe: Subscribe;
  amount: number;
  paymentType: string;
  status: "pending" | "completed" | "failed";
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  // optional কারণ সব user এ নেই
  address?: string;
  city?: string;
  country?: string;
  gender?: string;
  otp?: string;
  otpExpiry?: string;
  phoneNumber?: string;
  profilePicture?: string;
  verifiedForget?: boolean;
  status?: string;
}

export interface Subscribe {
  _id: string;
  planName: string;
  price: number;
  features: string[];
  user: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}