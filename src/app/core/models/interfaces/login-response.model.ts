import { Stand } from "./stand.model";
import { User } from "./user.model";

export interface LoginResponse {
  user: User,
  stand: Stand,
  accessToken: string,
  refreshToken: string
}