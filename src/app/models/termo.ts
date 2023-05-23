

export const select = {
    estado_equipamentos:[
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
      ],
      produtos:[
        {
            value: 'Notebook',
            label: 'Notebook',
            filter: 'not'
        },
        {
            value: 'Desktop',
            label: 'Desktop',
            filter: 'des'
        },
        {
            value: 'Monitor',
            label: 'Monitor',
            filter: ''
        },
        {
            value: 'Celular',
            label: 'Celular',
            filter: 'cel'
        },
        {
            value: 'Tablet',
            label: 'Tablet',
            filter: 'tab'
        },
        {
            value: 'Linha',
            label: 'Linhas',
            filter: ''
        },
        {
            value: 'Kit',
            label: 'Kit',
            filter: ''
        }
      ],
      acao:[
        {
            value:"devolucao",
            label:"Devolução"
        },    
        {
            value:"retirada",
            label:"Retirada"
        }
      ],
      patrimonios:<any>[]
}

export const Kits = [
    {
        name: 'MK220',
        manufacturer:{
            name:'Logitech'
        },
        model:{
            name:'MK220'
        },
        serial:'Teclado e Mouse',
    }
]