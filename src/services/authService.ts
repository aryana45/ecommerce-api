import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import config from '../config/index.js';
import bcrypt from 'bcrypt';
import { createUserInput } from '../types/types.js';
import AppError from '../utils/appError.js';

const generateToken = (id: string) => {
  const token = jwt.sign({ id: id }, config.jwtSecretKey, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  });
  return token;
};

export const createUser = async (payload: createUserInput) => {
  try {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const { passwordConfirm, ...rest } = payload;
    const user = await prisma.user.create({
      data: { ...rest, password: hashedPassword },
    });
    const token = generateToken(user.id);
    return { token, user };
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (payload: createUserInput) => {
  try {
    console.log(payload);
    if (!payload.email || !payload.password) {
      throw new AppError('Email and Password are requred for login', 400);
    }
    const user = await prisma.user.findFirst({
      where: { email: payload.email },
    });
    if (!user) {
      throw new AppError('Could not find the user', 404);
    }
    const correctPassword = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!correctPassword) {
      throw new AppError('The email or password is incorrect', 401);
    }
    const token = generateToken(user.id);
    return { user, token };
  } catch (err) {
    throw err;
  }
};
