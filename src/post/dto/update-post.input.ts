import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Post } from '../post.model';

@InputType()
export class UpdatePostInput implements Partial<Post> {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  title: string;
}
