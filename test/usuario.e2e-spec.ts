import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any
  let usuarioId: number
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe)
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  })

  it("01 - Deve Cadastrar um novo usuário", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com.br',
        senha: 'rootroot',
        foto: '-'
      })
      .expect(201);

    usuarioId = resposta.body.id;
  })

  it("02 - Não Deve Cadastrar um usuário repitido", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com.br',
        senha: 'rootroot',
        foto: '-'
      })
      .expect(400);
  })

  it("03 - Não deve Autorizar a listagem de usuários", async () => {
    const resposta = await request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .expect(401);
  })

  it("04 - Deve Autenticar um usuário cadastrado", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com.br',
        senha: 'rootroot',
      })
      .expect(200);

      token = resposta.body.token
  })

  it("05 - Deve Listar todos os usuários cadastrados", async () => {
    const resposta = await request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .expect(200);
  })

  it("06 - Deve Atualizar os dados de um usuário já existente", async () => {
    const resposta = await request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root Atualizado',
        usuario: 'rootAtualizado@root.com.br',
        senha: 'rootroot',
        foto: '-'
      })
      .expect(200)
  })

  it("07 - Deve Listar um usuário cadastrado por ID", async () => {
    const resposta = await request(app.getHttpServer())
      .get(`/usuarios/${usuarioId}`)
      .set('Authorization', `${token}`)
      .expect(200);
  })

  it("08 - Deve falhar em encontrar um usuario por id", async () => {
    const resposta = await request(app.getHttpServer())
      .get(`/usuarios/${usuarioId + 1}`)
      .set('Authorization', `${token}`)
      .expect(404);
  })
  
});
