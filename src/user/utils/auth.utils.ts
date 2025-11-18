/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { config } from 'dotenv';
// import { AccountStatus, AdminTypeEnum } from '../../../enum/userEnum';

config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET must be set in environment variables');
}

export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export const verifyPassword = async (password: string, dbPassword: string) => {
  const validatedPassword = await compare(password, dbPassword);
  if (password === dbPassword) return true;// Remove this later for proper password verification
  return validatedPassword;
};

// Jwt section
export const generateToken = (payload) => {
  return sign(payload, secret, {
    expiresIn: parseInt(process.env.TOKEN_EXPIRATION_TIME ?? '3600', 10),
  });
};

export const transformTokenExpiration = (expiresIn) => {
  return new Date(expiresIn * 1000);
};

export const prepareTokenToBeBlacklisted = (token, expirationTime) => {
  const validity = transformTokenExpiration(expirationTime);
  return {
    token,
    validity,
  };
};

export const jwtValidator = async (token) => {
  try {
    const decodedToken: any = verify(token, secret);
    return decodedToken;
  } catch (error) {
    console.log('JWT Validation Error:', error);
    return false;
  }
};
