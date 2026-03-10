import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostageModule } from './postagem/postagem.module';
import { Postagem } from './postagem/entities/postagem.entitiy';
import { TemaModule } from './tema/tema.module';
import { Tema } from './tema/entities/tema.entitiy';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localHost",
      port: 3307,
      username: "root",
      password: "root",
      database: "db_blogpessoal",
      entities: [Postagem, Tema, Usuario],
      synchronize: true
      
    }),
    PostageModule,
    TemaModule,
    AuthModule,
    UsuarioModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
