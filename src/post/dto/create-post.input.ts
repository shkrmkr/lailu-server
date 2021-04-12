import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Post } from '../post.model';

@InputType()
export class CreatePostInput implements Partial<Post> {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  title: string;
}
