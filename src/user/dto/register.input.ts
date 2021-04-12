import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../user.model';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
