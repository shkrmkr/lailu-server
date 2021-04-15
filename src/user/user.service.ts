import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Partial<User> | null> {
    return this.prisma.user.findUnique({ where });
  }

  async register({
    password,
    ...data
  }: RegisterInput): Promise<Omit<User, 'posts'>> {
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
  }: LoginInput): Promise<Omit<User, 'posts'>> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    const error = new UnauthorizedException('Wrong username or password.');
    if (!user) throw error;
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) throw error;

    return user;
  }

  async removeUser(where: Prisma.UserWhereUniqueInput): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where });
      return true;
    } catch (error) {
      return false;
    }
  }
}
