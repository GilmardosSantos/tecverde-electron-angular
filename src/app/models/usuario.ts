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
        public data = setData().data
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
        public data_tabela = setData().data_tabela

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
        public tabela01 = [{acao:'',produto:'',marca:'',data_tabela:'',observacao:''}],
        public data = setData().data
    ){}
}
export type kUsuario = keyof Usuario;

function setData(){
    const meses = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
    ]
    const data = new Date().toLocaleDateString()
    console.log(data)
    const [dia,mes,ano] = [data.substring(0,2), (data.substring(3,5)), data.substring(6)]
    console.log(dia,mes,ano)
    const datas = {
        data:`${dia} de ${meses[Number(mes)- 1]} de ${ano}`,
        data_tabela: `${dia}/${mes}/${ano}`
    }
    console.log(datas)
    return datas
  }