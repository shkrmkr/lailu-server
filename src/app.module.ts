import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthorModule } from './author/author.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    AuthorModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
