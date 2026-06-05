import { UserRole, UserStatus } from '@proxi/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string | null;
}
