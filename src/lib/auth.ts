import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "change_this_secret";

// Notice: JWT_EXPIRES_IN must be of type SignOptions["expiresIn"]
// This can be a number (seconds) or string like "1d"
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
