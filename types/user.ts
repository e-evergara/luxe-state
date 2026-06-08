// ---------------------------------------------------------------------------
// UserRole — the two roles supported by the application
// ---------------------------------------------------------------------------

export type UserRole = 'user' | 'admin';

// ---------------------------------------------------------------------------
// UserRoleRecord — row from user_roles joined with auth.users metadata
// ---------------------------------------------------------------------------

export interface UserRoleRecord {
  userId: string;
  role: UserRole;
  createdAt: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  lastSignInAt?: string;
}
