import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import { createUserInput } from '../types/types.js';
import { promisify } from 'node:util';
import config from '../config/index.js';
import AppError from '../utils/appError.js';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const generateToken = (id: string) => {
  const token = jwt.sign({ id: id }, config.jwtSecretKey, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  });
  return token;
};

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
