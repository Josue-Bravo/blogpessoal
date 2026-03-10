import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tema } from "../../tema/entities/tema.entitiy";
import { Usuario } from "../../usuario/entities/usuario.entity";


@Entity({name: "tb_postagens"})  // CREATE TABLE tb_postagens
export class Postagem {

    @PrimaryGeneratedColumn() // PRIMARY KEY(id) AUTO_INCREMENT
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim()) //Remover espaços em branco Inicio e Fim
    @IsNotEmpty() // Recusa valor vazio
    @Column({length: 100, nullable: false}) // VARCHAR(100) NOT NULL
    titulo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim()) //Remover espaços em branco Inicio e Fim
    @IsNotEmpty() // Recusa valor vazio
    @Length(10, 1000, {message: "O Texto deve ter entre 10 e 1000 caracteres"})
    @Column({length: 1000, nullable: false}) // VARCHAR(1000) NOT NULL
    texto: string;

    @UpdateDateColumn()
    data: Date;

    @ManyToOne(() => Tema, (tema) => tema.postagem, {
        onDelete: "CASCADE"
    })
    tema: Tema

    @ManyToOne(() => Usuario, (usuario) => usuario.postagem, {
        onDelete: "CASCADE"
    })
    usuario: Usuario
    
}