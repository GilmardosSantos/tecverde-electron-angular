export class Usuario {
    nome = ''
    sobrenome?:string = ''
    cargo = ''
    numero_documento = ''
    bairro = ""
    cep?: string = ""
    rua = ''
    numero = 0
    cidade = ''
    estado = ''
    retirando = false;
    devolvendo = false;
    estado_equipamentos = ''
    observacao = ''
    tabela01 = new Array<Tabela01>()
    data = ''
}

export interface Tabela01 {
    acao:string;
    serial?: string;
    produto:string;
    marca:string;
    modelo?: string;
    patrimonio?: string;
    data_tabela: string;
    observacao:string;
}

export type kUsuario = keyof Usuario;