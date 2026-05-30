import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import { createUserInput } from '../types/types.js';
import { promisify } from 'node:util';
import config from '../config/index.js';
import AppError from '../utils/appError.js';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

const generateToken = (id: string) => {
  const token = jwt.sign({ id: id }, config.jwtSecretKey, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  });
  return token;
};

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const verify = promisify(
  jwt.verify as (
    token: string,
    secret: jwt.Secret,
    callback: jwt.VerifyCallback
  ) => void
);

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const decoded = await verify(token, config.jwtSecretKey);
  return decoded as JwtPayload;
};

export const createUser = async (payload: createUserInput) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const { passwordConfirm, ...rest } = payload;
  const user = await prisma.user.create({
    data: { ...rest, password: hashedPassword },
  });
  const token = generateToken(user.id);
  return { token, user };
};

export const loginUser = async (payload: createUserInput) => {
  if (!payload.email || !payload.password) {
    throw new AppError('Email and Password are requred for login', 400);
  }
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError('Could not find the user', 404);
  }
  const correctPassword = await bcrypt.compare(payload.password, user.password);
  if (!correctPassword) {
    throw new AppError('The email or password is incorrect', 401);
  }
  const token = generateToken(user.id);
  return { user, token };
};

export const createRefreshToken = async (userId: string) => {
  const token = generateRefreshToken();
  const tokenHash = hashRefreshToken(token);
  const currentTime = Date.now();

  await prisma.refreshToken.create({
    data: {
      userId: userId,
      tokenHash: tokenHash,
      expiry: new Date(currentTime + config.RefreshTokenExpiresIn),
    },
  });
  return token;
};

export const getAccessTokenBasedOnRefreshToken = async (tokenHash: string) => {
  const refreshTokenModel = await prisma.refreshToken.findUnique({
    where: { tokenHash: tokenHash },
  });
  if (!refreshTokenModel) {
    throw new AppError('Cannot find the user', 404);
  }

  if (Date.now() > refreshTokenModel.expiry.getTime()) {
    throw new AppError('You need to login again', 401);
  }
  await prisma.refreshToken.delete({
    where: { tokenHash: tokenHash },
  });
  const userId = refreshTokenModel.userId;
  const accessToken = generateToken(userId);
  return { accessToken, userId };
};

export const logout = async (token: string) => {
  const tokenHash = hashRefreshToken(token);
  await prisma.refreshToken.delete({
    where: { tokenHash: tokenHash },
  });
};
