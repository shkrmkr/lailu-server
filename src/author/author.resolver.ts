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

  @Mutation(() => Author)
  createAuthor(
    @Args('data') data: CreateAuthorInput,
  ): Promise<Partial<Author>> {
    return this.prisma.author.create({ data });
  }

  @Query(() => Author)
  author(@Args('id') id: string): Promise<Partial<Author>> {
    return this.prisma.author.findUnique({ where: { id } });
  }

  @Query(() => [Author])
  authors(): Promise<Partial<Author>[]> {
    return this.prisma.author.findMany();
  }

  @ResolveField(() => [Post], { name: 'posts' })
  posts(@Parent() author: Author): Promise<Post[]> {
    return this.prisma.post.findMany({ where: { authorId: author.id } });
  }

  @Mutation(() => Author, { nullable: true })
  updateAuthor(
    @Args('data') { id, ...data }: UpdateAuthorInput,
  ): Promise<Partial<Author>> {
    return this.prisma.author.update({ where: { id }, data });
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
}
