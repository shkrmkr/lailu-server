import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Author } from '../author.model';

@InputType()
export class UpdateAuthorInput implements Partial<Author> {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;
}
