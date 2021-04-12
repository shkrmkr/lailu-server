import { Field, InputType } from '@nestjs/graphql';
import { Post } from '../post.model';

@InputType()
export class CreatePostInput implements Partial<Post> {
  @Field()
  authorId: string;

  @Field()
  title: string;
}
