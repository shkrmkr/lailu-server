import { Post } from '@/post/post.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  createdAt: Date;
  updatedAt: Date;

  @Field()
  username: string;

  password: string;

  @Field(() => [Post])
  posts: Post[];
}
