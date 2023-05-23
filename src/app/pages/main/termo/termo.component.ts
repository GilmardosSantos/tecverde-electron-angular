import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Cep, Documento, Tabela01, Usuario,kUsuario } from '../../../models/usuario';
import {select,Kits} from '../../../models/termo'
import { GlpiService } from 'src/app/services/glpi.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const user = new Usuario('Gilmar','Ribeiro','Assistente de T.I','118.812.869-83',
'Cachoeira','83701-635',null,'Janaina Assef','490','Araucária','PR',false,false,'','',[],'19/05/2023')

@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.scss']
})
export class TermoComponent{
  public buttons = {
    tabela:true
  }
  public editando_tabela = {
    is:false,
    index:null || 0,
  };
  public forms = {
    usuario: user,
    item_tabela: new Tabela01()
  }
  public selects = select
  public columns = ['acao']

  public itens = {
    computers:new Array<any>(),
    monitors:new Array<any>(),
    phones:new Array<any>(),
    lines:new Array<any>(),
    kits: Kits,
  }
  public form_usuario!: FormGroup;
  
  public form_tabela:FormGroup = this.fb.group({
    produto:new FormControl(''),
    patrimonio:new FormControl(''),
    marca:new FormControl(''),
    modelo:new FormControl(''),
    serial:new FormControl(''),
    observacao:new FormControl('')
  })

  constructor(
    private toast: ToastService,
    private glpi: GlpiService,
    public fb: FormBuilder

    ){
    this.form_usuario = this.fb.group({
      nome:[''],
      sobrenome:[''],
      numero_documento:[''],
      cargo:[''],
      cep:[''],
      rua:[''],
      numero:[''],
      bairro:[''],
      cidade:[''],
      estado:[''],
      acao:[''],
      estado_equipamentos:['']
    })

    console.clear()
    console.log(this.glpi)
    this.forms.usuario.data = this.setData().data
    this.forms.item_tabela.data_tabela = this.setData().data_tabela
    
  }
  
  usuarioChange(value:string,key: keyof Usuario){
    this.forms.usuario = {...this.forms.usuario, [key]:value}
    this.forms.usuario.data = this.setData().data
    this.forms.item_tabela.data_tabela = this.setData().data_tabela
  }

  tabelaChange(value:string,key: keyof Tabela01){
    console.log(value,key)
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
    delete objeto.observacao
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

  selectProduto(value:any){
    this.forms.item_tabela = {...new Tabela01(), produto:value}
    console.log(this.forms.item_tabela)
    this.selects.patrimonios = []
    this.searchGlpi(value)
  }

  selectPatrimonio(value:any){
    console.log(value)
    let res = <any>{}
    for(let key of Object.values(this.itens)){
      console.log(key)
      res = key.find(item => item.name.toUpperCase() == value.toUpperCase())
      if(res != undefined) break
    }
    switch(this.forms.item_tabela.produto){
      case ('Notebook'):
      case ('Desktop'):
        this.forms.item_tabela = {
          ...this.forms.item_tabela,
          marca: res.manufacturer.name,
          modelo: res.computermodel.name,
          patrimonio:value,
          serial: res.serial
        }
        break;
      case ('Monitor'):
        this.forms.item_tabela = {
          ...this.forms.item_tabela,
          marca: res.manufacturer.name,
          modelo: res.monitormodel.name,
          patrimonio:value,
          serial:res.serial
        }
        break;
      case ('Celular'):
      case ('Tablet'):
        this.forms.item_tabela = {
          ...this.forms.item_tabela,
          marca: res.manufacturer.name,
          modelo: res.phonemodel.name,
          patrimonio:value,
          serial:res.serial
        }
        break;
      case ('Linha'):
        this.forms.item_tabela = {
          ...this.forms.item_tabela,
          marca: 'Vivo',
          modelo: 'Micro',
          patrimonio: value.trim()
        }
        break;
      case ('Kit'):
        this.forms.item_tabela = {
          ...this.forms.item_tabela,
          marca: res.manufacturer.name,
          modelo: res.model.name,
          patrimonio:res.name,
          serial:res.serial
        }
        break;
    }
    console.log('out switch')
    this.buttons.tabela = this.check(this.forms.item_tabela)
    return
  }

  inputMarca(value:any, a?:any){
    this.forms.item_tabela.marca = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)

  }

  inputModelo(value:any, a?:any){
    this.forms.item_tabela.modelo = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)

  }

  inputSn(value:any, a?:any){
    this.forms.item_tabela.serial = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)

  }

  inputObservacao(value:any, a?:any){
    this.forms.item_tabela.observacao = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)

  }


  selectAcao(value:any){
    value.includes('devolucao') ? this.forms.usuario.devolvendo = true : this.forms.usuario.devolvendo = false
    value.includes('retirada') ? this.forms.usuario.retirando = true : this.forms.usuario.retirando = false
  }

  selectEquipamento(value:any){
    this.forms.usuario.estado_equipamentos = value;
  }

  async searchGlpi(value:any){
    let loading = this.toast.loading('Carregando','search')
    switch(value){
      case 'Notebook':
        this.itens.computers = (await this.glpi.getComputer()).filter((item:any) => item.name.toUpperCase().includes('NOT'))
        this.selects.patrimonios = map_itens(this.itens.computers as any,this.toast)
        break;
      case 'Desktop':
        this.itens.computers = (await this.glpi.getComputer()).filter((item:any) => item.name.toUpperCase().includes('DES'))
        this.selects.patrimonios = map_itens(this.itens.computers as any,this.toast)
        break
      case 'Monitor':
        this.itens.monitors = (await this.glpi.getMonitor())
        this.selects.patrimonios = map_itens(this.itens.monitors as any,this.toast)
        break
      case 'Celular':
        this.itens.phones = (await this.glpi.getPhone()).filter((item:any) => item.name.toUpperCase().includes('CEL'))
        this.selects.patrimonios = map_itens(this.itens.phones as any,this.toast)
        break
      case 'Tablet':
        this.itens.phones = (await this.glpi.getPhone()).filter((item:any) => item.name.toUpperCase().includes('TAB'))
        this.selects.patrimonios = map_itens(this.itens.phones as any,this.toast)
        break
      case 'Linha':
        this.itens.lines = (await this.glpi.getLine())
        this.selects.patrimonios = map_itens(this.itens.lines as any,this.toast)
        break
      case 'Kit':
        this.selects.patrimonios = [
          {
            value:'MK220',
            label:'Logitech MK220'
          }
        ]
        break
    }
    loading.close()

    function map_itens(arr:[],toast:ToastService){
      var new_arr = new Array<any>()
        arr.map((item:any) =>{
        let i = <any>{}
        i.value = item.name;
        i.label = `${item.name} ${item.user ? `| ${item.user.firstname} ${item.user.realname}` : ''}`
        new_arr.push(i)
      })
      toast.success('Carregado','success')

      return new_arr;
    }

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
    console.clear()
    console.log(u.tabela01)
    for(let item of u.tabela01){
      let i = <any>{}
      i.acao = item.acao;
      i.produto = `${item.produto}${item.serial ? `/${item.serial}` : ``}${item.patrimonio ? `(${item.patrimonio})` : ``}`;
      i.marca = `${item.marca}/${item.modelo}`;
      i.data_tabela = item.data_tabela;
      i.observacao = item.observacao || '';
      tabela.push(i)
    }
    const documento = new Documento(`${u.nome} ${u.sobrenome}`,u.cargo,u.numero_documento,u.rua,u.numero,u.bairro,u.cidade,u.estado,u.retirando,u.devolvendo,u.estado_equipamentos,u.observacao,tabela)
    this.toast.success('Salvo com sucesso','save')
  }

  limpar(){
    this.clearValues()
    this.glpi.callToken()
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
