import { Component, OnInit } from '@angular/core';
import { Tabela01, Usuario,kUsuario } from './models/usuario';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'tecverde';
  value = 'clear me'
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
  public usuario: Usuario = new Usuario()
  public item_tabela: Tabela01 = <Tabela01>{}

  usuarioChange(value:string,key: keyof Usuario){
    this.usuario = {...this.usuario, [key]:value}
    console.log(this.usuario)
  }

  tabelaChange(value:string,key: keyof Tabela01){
    this.item_tabela = {...this.item_tabela, [key]:value}
  }
  
  callback(){
    console.log(this.usuario)
  }

}
