import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Cep, Documento, Tabela01, Usuario,kUsuario } from '../../../models/usuario';

const user = new Usuario('Gilmar','Ribeiro','Assistente de T.I','118.812.869-83',
'Cachoeira','83701-635',null,'Janaina Assef','490','Araucária','PR',false,false,'','',[],'19/05/2023')

@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.scss']
})
export class TermoComponent{

  public select_acao = [
    {
      value:"devolucao",
      label:"Devolução"
    },
    {
      value:"retirada",
      label:"Retirada"
    }
  ]
  public select_estado_equipamento = [
    {
      value:'perfeito',
      label:'Perfeito'
    },
    {
      value:'defeito',
      label:'Defeito'
    },
    {
      value:'faltando',
      label:'Faltando algo'
    }
  ]
  public buttons = {
    tabela:true
  }
  public editando_tabela = {
    is:false,
    index:null || 0,
  };
  public forms = {
    usuario: new Usuario(),
    item_tabela: new Tabela01()
  }
  public columns = ['acao']

  constructor(){
    this.forms.usuario.data = this.setData().data
    this.forms.item_tabela.data_tabela = this.setData().data_tabela
  }
  
  usuarioChange(value:string,key: keyof Usuario){
    this.forms.usuario = {...this.forms.usuario, [key]:value}
    this.forms.usuario.data = this.setData().data
    this.forms.item_tabela.data_tabela = this.setData().data_tabela
  }

  tabelaChange(value:string,key: keyof Tabela01){
    if(this.editando_tabela.is){
      this.forms.item_tabela = {...this.forms.item_tabela, [key]:value}
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
      return
    }
    this.forms.item_tabela = {...this.forms.item_tabela, [key]:value}
    const {item_tabela} = this.forms
    delete item_tabela.observacao;
    if(this.check(item_tabela)) this.buttons.tabela = false;
    this.forms.usuario.data = this.setData().data
    this.forms.item_tabela.data_tabela = this.setData().data_tabela
  }

  check(objeto:any){
    console.log(objeto)
    for(let prop in objeto){
      if(objeto.hasOwnProperty(prop)){
        console.log(`[prop][${prop}]`,objeto[prop])
        if(objeto[prop] === null || objeto[prop] == undefined|| objeto[prop].length == 0){
          return false
        } 
      }
    }
    return true
  }

  selectAcao(value:any){
    value.includes('devolucao') ? this.forms.usuario.devolvendo = true : this.forms.usuario.devolvendo = false
    value.includes('retirada') ? this.forms.usuario.retirando = true : this.forms.usuario.retirando = false
  }

  selectEquipamento(value:any){
    this.forms.usuario.estado_equipamentos = value;
  }

  getDocumento(value:string){
    value = value.replace(/[^a-zA-Z0-9]/g, "")
    if(value.length == 11){
      const cpfNumeros = value.replace(/\D/g, '');
      const regexCPF = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
      this.forms.usuario.numero_documento = cpfNumeros.replace(regexCPF, '$1.$2.$3-$4');
    }
    else if(value.length == 14){
      const cnpjNumeros = value.replace(/\D/g, '');
      const regexCNPJ = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
      this.forms.usuario.numero_documento = cnpjNumeros.replace(regexCNPJ, '$1.$2.$3/$4-$5');
    }
  }

  async getCep(value:string){
    console.clear()
    console.log(value)
    if(value.length >= 8){
      const res = await fetch(`http://viacep.com.br/ws/${value}/json`)
      const data = await res.json() as Cep      
      this.forms.usuario = {
        ...this.forms.usuario,
        bairro:data.bairro,
        cep: data.cep,
        cidade: data.localidade,
        estado: data.uf,
        rua: data.logradouro,
        
      }
    }
  }

  setTabela(key:string){
    if(key == 'devolucao')this.forms.item_tabela.acao = 'devolucao'
    if(key == 'retirada')this.forms.item_tabela.acao = 'retirada'
    if(this.editando_tabela.is){
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
      this.buttons.tabela = true
      this.forms.item_tabela = new Tabela01();
      return
    }


    console.log(this.forms.item_tabela)
    this.forms.usuario = {
      ...this.forms.usuario,
      tabela01: [this.forms.item_tabela, ...this.forms.usuario.tabela01]
    }
    this.buttons.tabela = true;
    this.forms.item_tabela = new Tabela01()

  }

  salvar(){
    const u = this.forms.usuario
    let tabela = [];
    for(let item of u.tabela01){
      let i = <any>{}
      i.acao = item.acao;
      i.produto = `${item.produto}/${item.serial}(${item.patrimonio})`;
      i.marca = `${item.marca}/${item.modelo}`;
      i.data_tabela = item.data_tabela;
      i.observacao = item.observacao || '';
      tabela.push(i)
    }
    const documento = new Documento(`${u.nome} ${u.sobrenome}`,u.cargo,u.numero_documento,u.rua,u.numero,u.bairro,u.cidade,u.estado,u.retirando,u.devolvendo,u.estado_equipamentos,u.observacao,tabela)
    console.log(documento)
  }

  limpar(){
    this.clearValues()
  }

  mudarAcao(i:number){
    this.forms.usuario.tabela01.splice(i,1)
  }

  editTabela(i:number){
    this.forms.item_tabela = this.forms.usuario.tabela01[i]
    this.editando_tabela.index = i;
    this.editando_tabela.is = true;
    this.buttons.tabela = false;
    console.log(i)
  }

  clearValues(){
    this.forms = {
      usuario: new Usuario(),
      item_tabela: new Tabela01()
    }
  }

  setData(){
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
    const [dia,mes,ano] = [data.substring(0,2), (data.substring(3,5)), data.substring(6)]
    const datas = {
        data:`${dia} de ${meses[Number(mes)- 1]} de ${ano}`,
        data_tabela: `${dia}/${mes}/${ano}`
    }
    return datas
  }
}
