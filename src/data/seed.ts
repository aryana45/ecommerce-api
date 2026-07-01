import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8')
);
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
const sellers = JSON.parse(
  fs.readFileSync(`${__dirname}/sellers.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const main = async () => {
  await prisma.$connect();
  console.log('Database connected');
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.category.createMany({
    data: categories,
  });
  await prisma.user.createMany({
    data: users,
  });
  for (let seller of sellers) {
    const user = await prisma.user.findFirst({
      where: { email: seller.userEmail },
    });
    await prisma.sellerProfile.create({
      data: {
        storeName: seller.storeName,
        storeDescription: seller.storeDescription,
        status: seller.status,
        userId: user!.id,
      },
    });
  }
  for (let product of products) {
    const user = await prisma.sellerProfile.findFirst({
      where: { storeName: product.seller },
    });
    const cateog = await prisma.category.findFirst({
      where: { name: product.category },
    });
    const { category, seller, ...rest } = product;
    await prisma.product.create({
      data: { ...rest, categoryId: cateog!.id, sellerId: user!.id },
    });
  }
};

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
