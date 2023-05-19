export class Usuario {
    constructor(
        public nome:string = '',
        public sobrenome?:string,
        public cargo:string = '',
        public numero_documento:string = '',
        public bairro:string = '',
        public cep?:string,
        public acao?: any,
        public rua:string = '',
        public numero:any = 0,
        public cidade:string = '',
        public estado:string = '',
        public retirando:boolean = false,
        public devolvendo:boolean = false,
        public estado_equipamentos:string = '',
        public observacao:string = '',
        public tabela01 = new Array<Tabela01>(),
        public data:string = ''
    ){}
}

export class Tabela01 {
    constructor(
        public acao:string = "retirada",
        public serial?: string,
        public produto:string = "",
        public marca:string = "",
        public modelo?: string,
        public patrimonio?: string,
        public data_tabela: string = "",

    ){}
    public observacao?:string = "";
    [key: string]: string | undefined;

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
export class Documento{
    constructor(
        public nome = '',
        public cargo = '',
        public numero_documento = '',
        public rua = '',
        public numero = '',
        public bairro = '',
        public cidade = '',
        public estado = '',
        public retirando = false,
        public devolvendo = false,
        public estado_equipamentos = '',
        public observacao = '',
        public tabela01 = [{acao:'',produto:'',marca:'',data_tabela:'',observacao:''}]
    ){}
}
export type kUsuario = keyof Usuario;