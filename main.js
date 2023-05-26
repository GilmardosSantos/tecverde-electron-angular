const path = require('path');
const isDev = require('electron-is-dev');
const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const fs = require('fs');
const {spawn,exec} = require('child_process');
const PizZip = require('pizzip')
const Docxtemplater = require ('docxtemplater')
const expressionParser = require('docxtemplater/expressions.js');
const { verify } = require('crypto');


class Termo{
    constructor(ipcMain){
        this.ipcMain = ipcMain;
    }

    get getDoc(){
        return this.doc
    }

    get getBuf(){
        return this.buf
    }

    generateDoc(document_name){
        const assetsPath = path.join(app.getAppPath(),'src','assets')
        this.content = fs.readFileSync(
            path.resolve(assetsPath, `${document_name}.docx`),
            'binary'
        )
        this.zip = new PizZip(this.content);
        this.doc = new Docxtemplater(this.zip,{
            parser:expressionParser
        })
    }

    termListener = null;

    async save(fileName,emitter){
        try{
            dialog.showOpenDialog({
                properties:['openDirectory']
            }).then(async(result) =>{
                const directory = result.filePaths[0];
                console.log(directory)
                fileName = this.verify(fileName,directory);
                console.log(fileName)
                fs.writeFileSync(path.resolve(directory,`${fileName}.docx`),this.buf);
                emitter.webContents.send('term-saved')
                this.ipcMain.removeListener('term-save',() => {return});
            }).catch((err) =>{
                emitter.webContents.send('term-error')
                this.ipcMain.removeListener('term-error',() => {return});
            }) 
        }catch{
            return null
        }
    }

    i = 0;

    verify(fname,directory){
        let exist = true;
        let file_name = fs.existsSync(path.join(directory,`${fname}.docx`))
        let file = null;
        do{
            this.i++;
            if(file_name){
                file = fname
                if(!fs.existsSync(path.join(directory,`${fname}(${this.i}).docx`))){
                    file = `${fname}(${this.i})`;
                    exist = false;
                }
            }else{
                file = fname;
                exist = false;
                this.i = 0 ;
            }
        }while(exist == true);
        return file;
    }

    edit(object,emitter){
        let document_name = 'termo_funcionario'
        switch(object.tipo_documento){
            case 'estagiario':
                document_name = 'termo_estagiario';
                break
            case 'termo_pj':
                document_name = 'termo_pj';
                break;
            default:
                document_name = 'termo_funcionario';
                break;
        }
        this.generateDoc(document_name);
        this.doc.setData(object);
        this.doc.render();
        this.buf = this.doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE'
        })
        let name = `Termo de Responsabilidade (${object.nome})`
        let endname = ''
        if(object.devolvendo || object.retirando){
            endname += '-'   
        }
        if(object.retirando){
            endname += "(RETIRADA)"
        }
        if(object.devolvendo){
            endname += "(DEVOLUÇÃO)"
        }
        name += endname
        return this.save(name,emitter);
    }

}

class Emitters{
    silentInstall(){
        ipcMain.on('silentInstall',(event,name) =>{
            // const msiPath = path.join(__dirname,'src','assets','installer',`${name}.msi`);
            const msiPath = 'C:\\projects\\electron\\tecverde-electron\\src\\assets\\silent-installer\\anyconnect.msi'
            const msiOptions = ['/a',msiPath,'/quiet'];
            const msiInstall = spawn('msiexec.exe',msiOptions,{ shell: true, sudo: true });
            msiInstall.stdout.on('data',(data) =>{
                console.log(`Saída da instalação: ${data}`)
            })
            msiInstall.stdout.on('error',(error) =>{
                console.log(`Erro na instalação: ${error}`)
            })
            msiInstall.stdout.on('close',(close) =>{
                console.log(`Instalação finalizada com código: ${close}`)
            })  
        })
    }

    setDiretorio(window){
        ipcMain.on('set-diretorio',(event,data) =>{
            dialog.showOpenDialog({
                properties: ['openDirectory']
                }).then(result => {
                console.log(result.filePaths[0])
                window.webContents.send('get-diretorio',result.filePaths[0])
                }).catch(err => {
                console.log(err)
                })
        })
    }

    setTermo(window){
        ipcMain.on('termo',(event,data,that) =>{
            const termo = new Termo(ipcMain)
            console.log('data',data)
            termo.edit(data,window)
        })
    }

    setWindowClose(window){
        ipcMain.on('close',(event,data) =>{
            window.close();
        })
    }

    setWindowMaximize(window){
        ipcMain.on('expand',(event,data) =>{
            window.isMaximized() ? window.unmaximize() : window.maximize()
        })
    }

    setWindowMinimize(window){
        ipcMain.on('hide',(event,data) =>{
            window.minimize();
        })
    }
    
    setWindowMove(window){
        const position = this.window.getPosition();
        window.webContents.send('windowPos',position)
    }

    isSaved(){
    }

    getIp(window){
        ipcMain.on('getip',(event,data) =>{
            console.log('a')
            exec('nslookup myip.opendns.com. resolver1.opendns.com',(err,stdout,stderr) =>{
                if (err) {
                    console.error(`Erro: ${err}`);
                    return;
                  }
                  const regex = /Address: (.+)/;
                  const match = stdout.match(regex);
                  if (match) {
                    window.webContents.send('getip',stdout)
                  } else {
                    console.error('Não foi possível obter o endereço IP público.');
                  }
            })
        })
    }
}


class MainWindow extends Emitters{
    window
    createMainWindow(){
        this.window = new BrowserWindow({
            width:1280,
            height:720,
            // frame:false,
            webPreferences:{
                contextIsolation:true,
                nodeIntegration:true,
                preload: path.join(__dirname,'preload.js')
            }
        });
        console.log(isDev)
        let startUrl = isDev ? 'http://localhost:4200' : path.join(__dirname,'dist/index.html') ;
        console.log(startUrl)
        this.window.loadURL(startUrl)

    }
    startApp(){
        app.on('ready',() =>{
            this.createMainWindow()
            this.setEventEmitters()
        })
    }

    setEventEmitters(){
        this.setTermo(this.window);
        this.setWindowClose(this.window);
        this.setWindowMaximize(this.window);
        this.setWindowMinimize(this.window);
        this.setDiretorio(this.window);
        this.isSaved(this.window);
        this.silentInstall();
        this.getIp(this.window);
    }
}




new MainWindow().startApp();