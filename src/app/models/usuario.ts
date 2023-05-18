export class Usuario {
    
    nome:string = ''
    sobrenome?:string = ''
    cargo:string = ''
    numero_documento:string = ''
    bairro:string = ""
    cep?: string = ""
    acao?: any = {}
    rua:string = ''
    numero:any = 0
    cidade:string = ''
    estado:string = ''
    retirando:any = false;
    devolvendo:any = false;
    estado_equipamentos:string = ''
    observacao:string = ''
    // tabela01 = new Array<Tabela01>()
    tabela01: Array<Tabela01> = [
    ]
    data = ''
}

export class Tabela01 {
    [key: string]: string | undefined;
    acao:string = "retirada";
    serial?: string = "";
    produto:string = "";
    marca:string = "";
    modelo?: string = "";
    patrimonio?: string = "";
    data_tabela: string = "";
    observacao?:string = "";
}

export interface Cep {
    bairro:string
    cep: string;
    complemento: string;
    ddd: string;
    gia: string;
    ibge: string;
    localidade: string;
    logradouro:string;
    siafi: string;
    uf: string;
}

export type kUsuario = keyof Usuario;