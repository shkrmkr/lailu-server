import { Author } from '@/author/author.model';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './post.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Post)
  createPost(@Args('data') data: CreatePostInput): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  @Query(() => Post, { nullable: true })
  post(@Args('id') id: string): Promise<Post> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  @ResolveField(() => Author)
  author(@Parent() post: Post): Promise<Partial<Author>> {
    return this.prisma.author.findUnique({ where: { id: post.authorId } });
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Args('data') { id, ...data }: UpdatePostInput,
  ): Promise<Post> {
    try {
      const post = await this.prisma.post.update({ where: { id }, data });
      return post;
    } catch (error) {
      return null;
    }
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string): Promise<boolean> {
    try {
      await this.prisma.post.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
