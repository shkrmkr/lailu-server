import { MyContext } from '@/myContext.interface';
import { Post } from '@/post/post.model';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  @Mutation(() => User)
  async register(@Args('data') data: RegisterInput, @Context() ctx: MyContext) {
    const user = await this.userService.register(data);
    ctx.req.session.userId = user.id;
    return user;
  }

  @Mutation(() => User)
  async login(@Args('data') data: LoginInput, @Context() ctx: MyContext) {
    const user = await this.userService.validateUser(data);
    ctx.req.session.userId = user.id;
    return user;
  }

  @Query(() => User, { nullable: true })
  me(@Context() { req }: MyContext) {
    return this.userService.findOne({ id: req.session.userId });
  }

  @ResolveField(() => [Post], { name: 'posts' })
  posts(@Parent() user: User) {
    return this.prisma.post.findMany({ where: { userId: user.id } });
  }

  @Mutation(() => Boolean)
  async deleteAccount(@Context() { req }: MyContext) {
    return this.userService.removeUser({ id: req.session.userId });
  }
}
