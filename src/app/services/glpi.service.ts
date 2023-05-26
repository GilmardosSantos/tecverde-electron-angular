import { Inject, Injectable } from '@angular/core';
import axios from 'axios';
import { ToastService } from './toast.service';

const api_url = "http://192.168.1.198/glpi/apirest.php";
const app_token = "fPRuSOyh66vngdTb83E2c7rGUx6dHegfnmIfzs4i"

const request = (sessionToken:string,getUrl:any,id:string = '', params = {'range':'0-999'}) =>{
  return axios.create(
    {
      baseURL:api_url,
      headers:{
        'App-Token': app_token,
        'Session-Token': sessionToken 
      },
      params:params
    }
  ).get(`${getUrl}/${id}`)
}

const login = () => {
  return axios.post(`${api_url}/initSession`,{
    'app_token':app_token,
    'user_token':'B0EHEDyCQIacLKykuPQhMv7HlhRZgplLvBhpeiip'
  })
}

@Injectable({
  providedIn: 'root'
})
export class GlpiService {


  private sessionToken = '';
  public itens = {
    Group:[],
    Manufacturer:[],
    User:[],
    ComputerModel:[],
    MonitorModel:[],
    PhoneModel:[],
  }
  constructor(
    private toast:ToastService
  ) {
    // const loading = this.toast.loading('Entrando no GLPI', 'glpi')
    // this.auth().then(async() =>{
    //   let glpi = <any>{} 
    //   for(let key of Object.keys(this.itens)){
    //     glpi[key] = await this.getAny(key) 
    //   }
    //   this.itens = glpi;
    //   loading.close();
    //   this.toast.success('GLPI Carregado','glpisuccess')
    //   const log = this.itens
    //   console.log(log)
    // })
  }

  async load(){
    try{
      const loading = this.toast.loading('Entrando no GLPI', 'glpi')
      let auth = await this.auth();
      let glpi = <any>{} 
      for(let key of Object.keys(this.itens)){
        glpi[key] = await this.getAny(key) 
      }
      this.itens = glpi;
      loading.close();
      this.toast.success('GLPI Carregado','glpisuccess')
      return false
    }catch{
      return true
    }
  }




  async auth():Promise<void>{
    try{
      return this.sessionToken = (await login()).data.session_token
    }
    catch(err){
      this.sessionToken = ''
      this.toast.error('Não foi possível realizar o login', 'login')
    }
  }

  async getAny(type:string,id?:string){
    try{
      return (await request(this.sessionToken,type,id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: ${type}`, type)
      return null;
    }
  }

  async getCable(id?:string){
    try{
      return (await request(this.sessionToken,'Cable',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: CABO`, 'cabo')
      return null;
    }
  }

  async getCartridgeItem(id?:string){
    try{
      return (await request(this.sessionToken,'CartridgeItem',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: CARTUCHOS`, 'cartuchos')
      return null;
    }
  }

  async getComputer(id?:string){
    try{
      var arr = [];
      const res = (await request(this.sessionToken,'Computer',id)).data
      if(typeof res == 'object'){
        const computerkeys = ['computermodel','group','manufacturer','user']
        const glpisearch = ['ComputerModel','Group','Manufacturer','User']
        const arraysearch = ['computermodels_id','groups_id','manufacturers_id','users_id']
        return await this.getSearchItems(res,computerkeys,glpisearch,arraysearch)
      }
      return res
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: COMPUTADOR`, 'computador')
      return null;
    }
  }

  async getComputerModel(id?:string){
    try{
      return (await request(this.sessionToken,'ComputerModel',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: MODELOS DE COMPUTADOR`, 'modeloscomputador')
      return null;
    }
  }

  async getConsumableItem(id?: string){
    try{
      return (await request(this.sessionToken,'ConsumableItem',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: CONSUMÍVEIS`, 'consumiveis')
      return null
    }
  }

  async getGroup(id?:string){
    try{
      return (await request(this.sessionToken,'Group',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: GRUPO`, 'grupos')
      return null;
    }
  }

  async getLine(id?:string){
    try{
      const res = (await request(this.sessionToken,'Line',id)).data
      console.clear()
      console.log(res)
      if(typeof res == 'object'){
        const linekeys = ['group','user']
        const glpisearch = ['Group','User']
        const arraysearch = ['groups_id','users_id']
        return await this.getSearchItems(res,linekeys,glpisearch,arraysearch)
      }
      return res
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: LINHAS`, 'linhas')
      return null;
    }
  }

  async getManufacturer(id?:string){
    try{
      return (await request(this.sessionToken,'Manufacturer',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: FABRICANTE`, 'fabricantes')
      return null
    }
  }

  async getMonitor(id?:string){
    try{
      const res = (await request(this.sessionToken,'Monitor',id)).data
      if(typeof res == 'object'){
        const monitorkeys = ['group','user','monitormodel','manufacturer'];
        const glpisearch = ['Group','User','MonitorModel','Manufacturer']
        const arraysearch = ['groups_id','users_id','monitormodels_id','manufacturers_id']
        return await this.getSearchItems(res,monitorkeys,glpisearch,arraysearch)
      }
      return res
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: MONITOR`, 'monitor')
      return null;
    }
  }

  async getNetworkEquipament(id?:string){
    try{
      return (await request(this.sessionToken,'NetworkEquipament',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: EQUIPAMENTOS DE REDE`, 'equipamentosrede')
      return null
    }
  }

  async getPdu(id?:string){
    try{
      return (await request(this.sessionToken,'Pdu',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: PDU`, 'pdu')
      return null;
    }
  }

  async getPeripheral(id?:string){
    try{
      return (await request(this.sessionToken,'Peripheral',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: PERIFÉRICOS`, 'perifericos')
      return null;
    }
  }

  async getPhone(id?:string){
    try{
      var arr = []
      const res = (await request(this.sessionToken,'Phone',id)).data
      if(typeof res == 'object'){
        arr = res as Array<any>
        const phonekeys = ['group','manufacturer','user','phonemodel'];
        const glpisearch = ['Group','Manufacturer','User','PhoneModel'];
        const arraysearch = ['groups_id','manufacturers_id','users_id','phonemodels_id']
        return await this.getSearchItems(arr,phonekeys,glpisearch,arraysearch)
      }
      return res
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: TELEFONE`, 'telefone')
      return null
    }
  }

  async getSearchItems(arr:any[],objects:string[],glpi:string[],searchs:string[]){
    const db = this.itens as any
    console.log(db)
    arr.forEach(async (item) =>{
      for(const o in objects){
          let obj = objects[o]
          const g = glpi[o]
          const search = searchs[o]
          item[obj] = db[g].find((d:any) => d.id == item[search])
      }
    })
    console.log('HERE',arr)
    return arr;
  }

  async getPrinter(id:string){
    try{
      return (await request(this.sessionToken,'Printer',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: IMPRESSORA`, 'impressora')
      return null
    }
  }

  async getRack(id:string){
    try{
      try{
        return (await request(this.sessionToken,'Rack',id)).data
      }catch{
        return null
      }
    }
    catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: RACK`, 'rack')
      return null
    }
  }

  async getSoftware(id:string){
    try{
      return (await request(this.sessionToken,'Software',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: SOFTWARE`, 'software')
      return null
    }
  }

  async getSoftwareLicense(id?:string){
    try{
      return (await request(this.sessionToken,'SoftwareLicense',id)).data
    }catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: LICENÇA SOFTWARE`, 'licencasoftware')
      return null;
    }
  }

  async getUser(id?:string){
    try{
      return (await request(this.sessionToken,'User',id)).data
    }
    catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: USUARIO`, 'usuario')
      return null;
    }
  }

  async getUserTitle(id?:string){
    try{
      return(await request(this.sessionToken,'UserTitle',id)).data
    }
    catch{
      this.toast.error(`Não foi possível requisitar itens do tipo: CARGO USUARIO`, 'usuario')
      return null
    }
  }

  callToken(){
    console.log(this.sessionToken)
  }
}
