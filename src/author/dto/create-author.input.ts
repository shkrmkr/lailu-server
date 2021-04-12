import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Author } from '../author.model';

@InputType()
export class CreateAuthorInput implements Partial<Author> {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;
}
