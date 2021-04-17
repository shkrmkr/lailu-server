import { AppContext } from '@/app-context.interface';
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
import { LoginOrDeleteInput } from './dto/login-or-delete.input';
import { SignupInput } from './dto/signup.input';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  @Mutation(() => User)
  async register(@Args('data') data: SignupInput, @Context() ctx: AppContext) {
    const user = await this.userService.register(data);
    ctx.req.session.userId = user.id;
    return user;
  }

  @Mutation(() => User)
  async login(
    @Args('data') data: LoginOrDeleteInput,
    @Context() ctx: AppContext,
  ) {
    const user = await this.userService.validateUser(data);
    ctx.req.session.userId = user.id;
    return user;
  }

  @Query(() => User)
  me(@Context() { req }: AppContext) {
    return this.userService.findUser({ id: req.session.userId });
  }

  @ResolveField(() => [Post], { name: 'posts' })
  posts(@Parent() user: User) {
    return this.prisma.post.findMany({ where: { userId: user.id } });
  }

  @Mutation(() => Boolean)
  async deleteAccount(
    @Context() { req }: AppContext,
    @Args('password') password: string,
  ) {
    return this.userService.removeUser(req.session.userId, password);
  }
}
