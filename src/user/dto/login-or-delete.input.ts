import { User } from '.prisma/client';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginOrDeleteInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;
}
