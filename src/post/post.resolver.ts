import { Author } from '@/author/author.model';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './post.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Post)
  async post(@Args('id') id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`post with id ${id} not found.`);
    }

    return post;
  }

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  @ResolveField(() => Author)
  async author(@Parent() post: Post) {
    return this.prisma.author.findUnique({ where: { id: post.authorId } });
  }

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput) {
    return this.prisma.post.create({ data });
  }
}
