import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import { LoginOrDeleteInput } from './dto/login-or-delete.input';
import { SignupInput } from './dto/signup.input';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async verifyPassword(hashed: string, plain: string): Promise<void> {
    const isValid = await argon2.verify(hashed, plain);
    if (!isValid) {
      throw new BadRequestException('Incorrect credential.');
    }
  }

  async findUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'posts'>> {
    const user = await this.prisma.user.findUnique({ where });
    if (!user) {
      throw new BadRequestException('Incorrect credential.');
    }
    return user;
  }

  async register({
    password,
    ...data
  }: SignupInput): Promise<Omit<User, 'posts'>> {
    const hashedPassword = await argon2.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username already taken.');
      }
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async validateUser({
    username,
    password,
  }: LoginOrDeleteInput): Promise<Omit<User, 'posts'>> {
    const user = await this.findUser({ username });
    await this.verifyPassword(user.password, password);
    return user;
  }

  async removeUser(
    id: Prisma.UserWhereUniqueInput['id'],
    password: string,
  ): Promise<boolean> {
    try {
      const user = await this.findUser({ id });
      await this.verifyPassword(user.password, password);
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
