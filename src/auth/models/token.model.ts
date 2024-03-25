export interface PayloadToken {
  role: string;
  sub: number;
}

export interface VerificationToken {
  email: string;
}

export interface RecoveryToken {
  email: string;
}
