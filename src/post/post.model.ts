import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  votes: number;

  authorId: string;
}
