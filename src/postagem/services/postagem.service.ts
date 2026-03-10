import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Postagem } from "../entities/postagem.entitiy";
import { ILike, Repository } from "typeorm";
import { DeleteResult } from "typeorm/browser";
import { TemaService } from "../../tema/services/tema.service";


@Injectable()
export class PostagemService {

    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        private temaService: TemaService
    ){}

    async findAll(): Promise<Postagem[]>{
        // SELECT * FROM tb_postagens
        return this.postagemRepository.find({
            relations:{
                tema: true,
                usuario: true
            }
        })
    }

    async findById(id: number): Promise<Postagem>{
        // SELECT * FROM tb_postagens Where id = ?;
        const postagem = await this.postagemRepository.findOne({
            where:{
                id
            },
            relations:{
                tema: true,
                usuario: true
            }
        })

        if (!postagem) 
            throw new HttpException("Postagem não encontrada", HttpStatus.NOT_FOUND);
       
        return postagem
    }

    async findAllByTitulo(titulo: string): Promise<Postagem[]>{
        const postagem = this.postagemRepository.find()

        return this.postagemRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            },
            relations:{
                tema: true,
                usuario: true
            }
        })
    }

    async create(postagem: Postagem): Promise<Postagem>{

        if (postagem.tema){

            let tema = await this.temaService.findById(postagem.tema.id)

            if (!tema)
                throw new HttpException("Tema não encontrado", HttpStatus.NOT_FOUND)

                            }
        // INSERT INTO tb_postagens (titulo, texto) VALUES (?, ?)
        return this.postagemRepository.save(postagem)
    }

    async update(postagem: Postagem): Promise<Postagem>{

        if (!postagem.id || postagem.id <= 0)
            throw new HttpException("Id inválido", HttpStatus.BAD_REQUEST)

        await this.findById(postagem.id);

        if (postagem.tema){

            let tema = await this.temaService.findById(postagem.tema.id)

            if (!tema)
                throw new HttpException("Tema não encontrado", HttpStatus.NOT_FOUND)

                    
        }
        
        return this.postagemRepository.save(postagem)
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id);

        //DELETE FROM tb_postagens WHERE id = 1;

        return this.postagemRepository.delete(id)
    }
}