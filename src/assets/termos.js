const PizZip = require ('pizzip')
const Docxtemplater = require ('docxtemplater')
const expressionParser = require("docxtemplater/expressions.js")
const path = require ('path')
const {dirname} = require('path')
const fs = require ('fs')
const { fileURLToPath } = require ('url')
const { ipcMain, dialog, app } = require ('electron')


class Termo{
    __dirname = __dirname
    constructor(){
        this.__dirname = __dirname
    }
    get getDoc(){
        return this.doc
    }
    get getBuf(){
        return this.buf
    }

    genDoc(doc_name){
        const assetsPath = path.join(app.getAppPath(), 'public/assets')
        this.content = fs.readFileSync(
            path.resolve(assetsPath, `${doc_name}.docx`),
            "binary"
        )
        this.zip = new PizZip(this.content)
        this.doc = new Docxtemplater(this.zip, {
            parser: expressionParser
        }) 
    }

   async save(fileName){
        try{
            // fileName = this.verify(fileName)
            dialog.showOpenDialog({
                properties:['openDirectory']
            }).then(result =>{
                const diretorio = result.filePaths[0]
                console.log(diretorio)
                fs.writeFileSync(path.resolve(diretorio,`${fileName}.docx`),this.buf)
            }).catch(err =>{
                console.log(err)
            })
        }
        catch{

        }
    }

    verify(name){
        console.log(name)
        var exist = true;
        // const dir = fileURLToPath(import.meta.url)
        const __dirname = path.join(dirname(dir))
        var file_name = fs.existsSync(path.join(__dirname,"results",`${name}.docx`));
        var file = ''
        do{
            if(file_name){
                file = name
                this.i += 1;
                if(!fs.existsSync(path.join(__dirname,"results",`${name}(${this.i}).docx`))){
                    file = `${name}(${this.i})`
                    exist = false;
                }
            }else{
                file = name
                exist = false;
            }
        }
        while(exist == true);
        return file;
    }
    
    edit(object){
        var doc_name = 'termo_funcionario'
        if(object.tipo_documento == 'estagiario'){
            doc_name = 'termo_estagiario'
        }else if(object.tipo_documento == 'cpf'){
            doc_name = 'termo_funcionario'
        }else{
            doc_name = 'termo_pj'
        }
        console.log(doc_name)
        this.genDoc(doc_name)
        this.doc.setData(object)
        this.doc.render()
        this.buf = this.doc.getZip().generate({
            type:"nodebuffer",
            compression:"DEFLATE"
        })
        return this.save(`Termo de Responsabilidade (${object.nome})`)
    }
}



module.exports = {
    Termo: Termo
}