export interface RequestsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: IMeta;
  data: UserRequest[];
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export type RequestStatus = "approved" | "suspended" | "pending";

export interface UserRequest {
  _id: string;
  fullName: string;
  userRole: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}
