import { Post } from '@/post/post.model';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import argon2 from 'argon2';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => User)
  async register(
    @Args('data') { password, ...data }: RegisterInput,
  ): Promise<Partial<User>> {
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

  @Mutation(() => User)
  async login(
    @Args('data') data: LoginInput,
    @Context() ctx: GqlExecutionContext,
  ): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    const error = new BadRequestException('Incorrect username or password.');

    if (!user) {
      throw error;
    }

    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
      throw error;
    }

    return user;
  }

  @Query(() => User)
  me(@Args('id') id: string): Promise<Partial<User>> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  @ResolveField(() => [Post], { name: 'posts' })
  posts(@Parent() user: User): Promise<Post[]> {
    return this.prisma.post.findMany({ where: { userId: user.id } });
  }

  // @Mutation(() => User, { nullable: true })
  // updateAuthor(
  //   @Args('data') { id, ...data }: UpdateUserInput,
  // ): Promise<Partial<User>> {
  //   return this.prisma.author.update({ where: { id }, data });
  // }

  @Mutation(() => Boolean)
  async deleteAuthor(@Args('id') id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
