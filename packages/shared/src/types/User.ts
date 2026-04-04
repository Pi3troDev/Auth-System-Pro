export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
