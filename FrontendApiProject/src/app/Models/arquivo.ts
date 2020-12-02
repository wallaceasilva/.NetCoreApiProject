import { Byte } from '@angular/compiler/src/util';

export interface Arquivo
{
    id: number;
    nome: string;
    dtCriacao: Date;
    //file: Byte[];
    file: Array<number>;
}
