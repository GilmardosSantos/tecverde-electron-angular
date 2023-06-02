import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Cep, Documento, Tabela01, Usuario,kUsuario } from '../../../models/usuario';
import {select,Kits} from '../../../models/termo'
import { GlpiService } from 'src/app/services/glpi.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import * as XLSX from 'xlsx'

const user = new Usuario('Gilmar','Ribeiro','Assistente de T.I','118.812.869-83',
'Cachoeira','83701-635',null,'Janaina Assef','490','Araucária','PR',false,false,'','',[],'19/05/2023')

const ipcRenderer = (window as any).ipcRenderer


@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.scss']
})
export class TermoComponent{
  public buttons = {
    tabela:false,
    table:true
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

  public loaded = {
    glpi:false
  }

  public enderecos = <any>[]

  constructor(
    private toast: ToastService,
    private glpi: GlpiService,
    public fb: FormBuilder

    ){

    this.glpi = new GlpiService(this.toast);
    this.loadGlpi()
    this.forms.usuario.data = this.setData().data
    this.forms.item_tabela.data_tabela = this.setData().data_tabela
  }

    async loadPlanilha(){
    let res = new Promise((resolve,reject) =>{
      const request = new XMLHttpRequest();
      request.open('GET','assets/TI.xlsx', true)
      request.responseType = 'arraybuffer';
      request.onload = () => {
        const data = new Uint8Array(request.response);
        const workbook: XLSX.WorkBook = XLSX.read(data,{type:'array'})
        const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet,{header:0})
        resolve(jsonData)
      }
      request.send()
    })
    let r = await res
    return r
  }
  
  loadGlpi(){
    this.glpi.load().then(async(res) =>{
      this.setSelectUsers()
      this.enderecos = await this.loadPlanilha()
      console.log(this.enderecos)

      this.buttons.table = res;
      this.loaded.glpi = true;
    }).catch((err) =>{
      this.buttons.table = false;
      this.toast.error('Itens do GLPI náo foram carregados, tentando novamente','try-glpi')
      this.loadGlpi.bind(this);
    })
  }

  setSelectUsers(){
    this.glpi.itens.User.map
      ((user:any) =>{
        let i = <any>{}
        i.value = user.name;
        i.label = `${user.firstname} ${user.realname}`
        if(i.label != null){
          this.selects.users.push(i)
        }
      })
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
    console.clear()
    delete objeto.observacao && objeto.data
    console.log(objeto)
    for(let prop in objeto){
      if(objeto.hasOwnProperty(prop)){
        console.log(`[prop][${prop}]`,objeto[prop])
        if(objeto[prop] == null || objeto[prop] == undefined|| objeto[prop].length == 0){
          console.log('returnin false')
          return false
        } 
      }
    }
    return true
  }

  async inputNome(value:any){
    console.log(value)

    if(this.loaded.glpi){
      const res = this.glpi.itens.User.find(((user:any) => user.name.toLowerCase() == value.toLowerCase())) as any
      if(res){
        console.log('GLPI RES =>', res)
        this.forms.usuario.nome = res.firstname;
        this.forms.usuario.sobrenome = res.realname
        this.forms.usuario.cargo = (await this.glpi.getAny('UserTitle',res.usertitles_id)).name
        let i = 0;
        let name_arr:String[] = `${res.firstname} ${res.realname}`.split(' ');
        let excel = <any>{}
        let filtered = name_arr.slice(0, name_arr.length - 1).join(' ')
        console.log(filtered)
        for(let xlsx of this.enderecos){
          console.log(xlsx)
          if(xlsx.NOME.toUpperCase().includes(filtered.toUpperCase())){
            excel = xlsx
            // console.log(xlsx)
          }
        }
        this.enderecos.find((item:any) =>{

        })
        // const excel = this.enderecos.find((item:any) =>{
        //   for(let name of name_arr.filter(n => n.toLowerCase() != 'de')){
        //     console.log(name)
        //     if(item.NOME.toLowerCase().includes(name.toLowerCase())){
        //       console.log('find', name)
        //       i++
        //     }
        //     if(i == 2){
        //       return true;
        //     }
        //   }
        //   i = 0 ;
        //   return null;
        // })
        console.log('EXCEL Search:',name_arr)
        console.log(excel)
        if(excel){
          this.toast.success(excel.NOME,excel.CPF)
          let cpf = String(excel.CPF).replace(/[^\w\s]/gi, '')
          cpf = cpf.length < 11 ? '0'+cpf : cpf;
          cpf = cpf.length < 10 ? '00'+cpf : cpf;
          this.getDocumento(cpf)
          this.getCep(excel.CEP.replace(/[^\w\s]/gi, ''))
          this.forms.usuario.numero = excel['Nº']
        }
        return
      }else{
        // this.forms.usuario.nome = value
      }
      return
    }
    console.log('doing value',value)
    // this.forms.usuario.nome = value;
    
  }

  e(value:any){

  }

  selectProduto(value:any){
    if(this.editando_tabela.is){
      this.forms.item_tabela.produto = value;
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela;

      this.searchGlpi(value)
      return
    }
    this.forms.item_tabela = {...new Tabela01(), produto:value}
    this.selects.patrimonios = []
    this.searchGlpi(value)

  }

  selectPatrimonio(value:any){
    this.forms.item_tabela.patrimonio = value;
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
    if(this.editando_tabela.is){
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
    }
    this.buttons.tabela = this.check(this.forms.item_tabela)

    return
  }

  inputMarca(value:any, a?:any){
    this.forms.item_tabela.marca = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)
    if(this.editando_tabela.is){
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
    }
  }

  inputModelo(value:any, a?:any){
    this.forms.item_tabela.modelo = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)
    if(this.editando_tabela.is){
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
    }
  }

  inputSerial(value:any, a?:any){
    this.forms.item_tabela.serial = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)
    if(this.editando_tabela.is){
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
    }
  }

  inputObservacao(value:any, a?:any){
    this.forms.item_tabela.observacao = value;
    this.buttons.tabela = this.check(this.forms.item_tabela)
    if(this.editando_tabela.is){
      this.forms.usuario.tabela01[this.editando_tabela.index] = this.forms.item_tabela
    }
  }

  selectAcao(value:any){
    value.includes('devolucao') ? this.forms.usuario.devolvendo = true : this.forms.usuario.devolvendo = false
    value.includes('retirada') ? this.forms.usuario.retirando = true : this.forms.usuario.retirando = false
  }

  selectEquipamento(value:any){
    this.forms.usuario.estado_equipamentos = value;
  }

  async searchGlpi(value:any){
    const map_itens = (arr:[]) =>{
      var new_arr = new Array<any>()
        arr.map((item:any) =>{
        let i = <any>{}
        i.value = item.name;
        i.label = `${item.name} ${item.user ? `| ${item.user.firstname} ${item.user.realname}` : ''}`
        new_arr.push(i)
      })
      this.toast.success('Carregado','success')
      return new_arr;
    }

    let loading = this.toast.loading('Carregando','search')
    switch(value){
      case 'Notebook':
        this.itens.computers = (await this.glpi.getComputer()).filter((item:any) => item.name.toUpperCase().includes('NOT'))
        this.selects.patrimonios = map_itens(this.itens.computers as any)
        break;
      case 'Desktop':
        this.itens.computers = (await this.glpi.getComputer()).filter((item:any) => item.name.toUpperCase().includes('DES'))
        this.selects.patrimonios = map_itens(this.itens.computers as any)
        break
      case 'Monitor':
        this.itens.monitors = (await this.glpi.getMonitor())
        this.selects.patrimonios = map_itens(this.itens.monitors as any)
        break
      case 'Celular':
        this.itens.phones = (await this.glpi.getPhone()).filter((item:any) => item.name.toUpperCase().includes('CEL'))
        this.selects.patrimonios = map_itens(this.itens.phones as any)
        break
      case 'Tablet':
        this.itens.phones = (await this.glpi.getPhone()).filter((item:any) => item.name.toUpperCase().includes('TAB'))
        this.selects.patrimonios = map_itens(this.itens.phones as any)
        break
      case 'Linha':
        this.itens.lines = (await this.glpi.getLine())
        this.selects.patrimonios = map_itens(this.itens.lines as any)
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

    // function map_itens(this:TermoComponent,arr:[]){

    // }

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
    // console.clear()
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
    this.forms.usuario = {
      ...this.forms.usuario,
      tabela01: [this.forms.item_tabela, ...this.forms.usuario.tabela01]
    }
    this.buttons.tabela = true;
    this.forms.item_tabela = new Tabela01()
    this.editando_tabela.is = false;
  }

  salvar(){
    const u = this.forms.usuario
    let tabela = [];
    console.clear()
    console.log(u.tabela01)
    for(let item of u.tabela01){
      let i = <any>{}
      i.acao = item.acao == 'devolucao' ? 'Devolução' : 'Retirada'
      i.produto = `${item.produto}${item.serial ? `/${item.serial}` : ``}${item.patrimonio ? `(${item.patrimonio})` : ``}`;
      i.marca = `${item.marca}/${item.modelo}`;
      i.data_tabela = item.data_tabela;
      i.observacao = item.observacao || '';
      tabela.push(i)
    }
    const documento = new Documento(`${u.nome} ${u.sobrenome}`,u.cargo,u.numero_documento,u.rua,u.numero,u.bairro,u.cidade,u.estado,u.retirando,u.devolvendo,u.estado_equipamentos,u.observacao,tabela)
    ipcRenderer.send('termo',documento)
    ipcRenderer.on('term-saved',this.toastSave.bind(this))
    ipcRenderer.on('term-error',this.toastError.bind(this))
  }

  toastSave(){
    this.toast.success('Termo salvo com sucesso!','term-saved');
    ipcRenderer.removeListener('term-saved', this.toastSave);
  }

  toastError(){
    this.toast.error('Houve algum erro ao tentar salvar o termo','term-error')
    ipcRenderer.removeListener('term-error', this.toastError);
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
