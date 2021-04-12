import { Field, InputType } from '@nestjs/graphql';
import { User } from '../user.model';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;
}
