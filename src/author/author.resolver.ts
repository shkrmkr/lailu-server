import { Post } from '@/post/post.model';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Author } from './author.model';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Author])
  async authors(): Promise<Partial<Author>[]> {
    return this.prisma.author.findMany();
  }

  @Query(() => Author)
  async author(@Args('id') id: string): Promise<Partial<Author>> {
    return this.prisma.author.findUnique({
      where: { id },
    });
  }

  @ResolveField(() => [Post], { name: 'posts' })
  async getPosts(@Parent() author: Author): Promise<Post[]> {
    const { id } = author;
    return this.prisma.post.findMany({ where: { authorId: id } });
  }

  @Mutation(() => Author)
  async createAuthor(
    @Args('data') data: CreateAuthorInput,
  ): Promise<Partial<Author>> {
    return this.prisma.author.create({ data });
  }

  @Mutation(() => Boolean)
  async deleteAuthor(@Args('id') id: string): Promise<boolean> {
    try {
      await this.prisma.author.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args('data') { id, ...rest }: UpdateAuthorInput,
  ): Promise<Partial<Author>> {
    const author = await this.prisma.author.update({
      where: { id },
      data: rest,
    });

    return author;
  }
}
