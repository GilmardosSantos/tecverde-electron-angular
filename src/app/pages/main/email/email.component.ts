import { Component } from '@angular/core';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {

  public usuario = {
    nome:'Gilmar',
    sobrenome:'Antonio',
    cargo:'T.I',
    email:'gilmar.ribeiro@tecverde.com.br',
    telefone:'(41) 3607-4146',
    url_imagem:'https://firebasestorage.googleapis.com/v0/b/tecverde-glpi.appspot.com/o/email%2Fgilmar-antonio-ribeiro-dos-santos?alt=media&token=0c3f81cd-dad8-4027-b4ec-7311d64ae920&_gl=1*9rnt76*_ga*MTE3OTM3MTk2Ni4xNjg0MTUyMTgw*_ga_CW55HF8NVT*MTY4NTcxOTE5OS44LjEuMTY4NTcyMDA2NS4wLjAuMA..'
  }

  public show_email = true;


  public assets = (path:string) => {
    return `https://firebasestorage.googleapis.com/v0/b/tecverde-glpi.appspot.com/o/assets%2F${path}.png?alt=media&token=1492189d-5dc8-47d7-a9f1-f869db8cca94`
  }

  public show(){
    this.show_email = !this.show_email;
  }

  public generate(){
    const clone = this.cloneDiv('.emailsignature') as HTMLDivElement
    if(clone){
      if(this.usuario.url_imagem.length < 10){
        clone.querySelector('#display-image-user')?.remove()
      }else{
        clone.querySelector('#mail_image')?.setAttribute('width','150')
        clone.querySelector('#mail_image')?.setAttribute('height','150')
      }
    }
    const doc = clone
    const blob = new Blob([doc.innerHTML],{type:'text/html'});
    const item = new ClipboardItem({['text/html']:blob})
    navigator.clipboard.write([item])
  }

  setTelefone(telefone:string){
    console.log(telefone)
    this.usuario.telefone = this.formatPhone(telefone)
    console.log(telefone)

  }

  formatPhone(number:string){
    console.log(`pong` )
    const prefix = number.slice(0,2)
    if(number.length <= 9){
        const prefix = '41'
        const n1 = number.slice(0,5)
        const n2 = number.slice(5)
        const newNumber = `(${prefix}) ${n1} - ${n2}`
        console.log(newNumber)
        return newNumber
    }
    else{
        const n1 = number.slice(2,7)
        const n2 = number.slice(7)
        const newNumber = `(${prefix}) ${n1} - ${n2}`
        console.log(newNumber)
        return newNumber
    }
  }

  cloneDiv(divname:string){
    const div = document.querySelector(divname)
    const clone = document.createElement('div')
    const className = div?.getAttribute('class');
    if(className){
      clone.classList.add(className)
    }
    if(div){
      Array.from(div.children).forEach(function(child){
        clone.appendChild(child.cloneNode(true))
      })
    }
    return clone;

  }
}
