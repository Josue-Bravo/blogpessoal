import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Postagem } from "../../postagem/entities/postagem.entitiy";


@Entity({name: "tb_temas"})  // CREATE TABLE tb_postagens
export class Tema {

    @PrimaryGeneratedColumn() // PRIMARY KEY(id) AUTO_INCREMENT
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim()) //Remover espaços em branco Inicio e Fim
    @IsNotEmpty() // Recusa valor vazio
    @Column({length: 100, nullable: false}) // VARCHAR(100) NOT NULL
    descricao: string;

    @OneToMany(() => Postagem, (postagem) => postagem.tema)
    postagem: Postagem[]
}