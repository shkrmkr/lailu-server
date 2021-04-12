import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;

  @Field()
  title: string;

  @Field(() => Int)
  votes: number;

  userId: string;
}
