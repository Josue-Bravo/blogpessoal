import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostageModule } from './postagem/postagem.module';
import { Postagem } from './postagem/entities/postagem.entitiy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localHost",
      port: 3307,
      username: "root",
      password: "root",
      database: "db_blogpessoal",
      entities: [Postagem],
      synchronize: true
    }),
    PostageModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
