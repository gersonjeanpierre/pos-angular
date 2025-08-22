export interface User {
  id?: string;
  email?: string;
  fullName?: string;
  responsibility?: string;
  isActive?: boolean;
  roles: string[];
}