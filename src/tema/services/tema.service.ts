import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tema } from "../entities/tema.entity";
import { ILike, Repository } from "typeorm";
import { DeleteResult } from "typeorm/browser";


@Injectable()
export class TemaService {

    constructor(
        @InjectRepository(Tema)
        private temaRepository: Repository<Tema>
    ){}

    async findAll(): Promise<Tema[]>{
        return await this.temaRepository.find({
            relations:{
                postagem: true
            }
        });
    }

    async findById(id: number): Promise<Tema>{
        // SELECT * FROM tb_postagens Where id = ?;
        const tema = await this.temaRepository.findOne({
            where:{
                id
            },
            relations:{
                postagem: true
            }
        })

        if (!tema) 
            throw new HttpException("Tema não encontrado", HttpStatus.NOT_FOUND);
       
        return tema
    }

    async findByDescricao(titulo: string): Promise<Tema[]>{
        const tema = this.temaRepository.find()

        return this.temaRepository.find({
            where:{
                descricao: ILike(`%${titulo}%`)
            },
            relations:{
                postagem: true
            }
        })
    }

    async create(tema: Tema): Promise<Tema>{
        // INSERT INTO tb_postagens (titulo, texto) VALUES (?, ?)
        return this.temaRepository.save(tema)
    }

    async update(tema: Tema): Promise<Tema>{

        if (!tema.id || tema.id <= 0)
            throw new HttpException("Id inválido", HttpStatus.BAD_REQUEST)

        await this.findById(tema.id);
        // UPDATE INTO tb_temas SET descricao = ?, 
        // texto = ? , data = CURRENT_TIMESTAMP();
        // WHERE id = ?;
        return this.temaRepository.save(tema)
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id);

        //DELETE FROM tb_postagens WHERE id = 1;

        return this.temaRepository.delete(id)
    }
}