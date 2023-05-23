import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
@Injectable()
export class ToastService {
  constructor(
    private toastService: HotToastService
    ) { }

  success(msg:string,id:string){
    return this.toastService.success(
      msg,
      {
        id:id,
        position:'bottom-center'
      }
    )
  }

  loading(msg:string,id:string){
    return this.toastService.loading(
      msg,
      {
        id:id,
        position:'bottom-center'
      }
    )
  }
  
  error(msg:string,id:string){
    return this.toastService.error(
      msg,
      {
        id:id,
        position:'bottom-center'
      }
    )
  }
}


