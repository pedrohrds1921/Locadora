import Veiculo from './Veiculos';
import inquirer from 'inquirer';




export class Menu {

 static async exebirMenu() {
    const answer= await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'opcaoSelecionada',
                message: 'Escolha uma opção:',
                choices: [
                  'Cadastrar veículo',
                  'Alugar veículo',
                  'Devolver veículo',
                  'Listar veículos disponíveis',
                  'Listar veículos alugados',
                  'Sair',
                ],
              },
            ]) 
            
            switch(answer.opcaoSelecionada){
                case'Cadastrar veículo':
                    this.CadastrarMenu()
                break;
                case 'Alugar veículo':
                    this.LocarMenu()
                break;
                case 'Devolver veículo':
                 this.DevolverMenu()
              break;
                case 'Listar veículos disponíveis':
                   console.table(Veiculo.listarDisponiveis())
                   this.exebirMenu()
                break;
                case  'Listar veículos alugados':
                  console.table(Veiculo.listarLocados())
                  this.exebirMenu()
                break;
                case 'Sair':
                    return
                break;
            }   
}
static async LocarMenu(){
    const answer= await inquirer.prompt([
        {
            type: 'input',
            name: 'Nome',
            message: 'Informe o Nome:',
          },
          {
            type: 'input',
            name: 'Cpf',
            message: 'Informe o Cpf',
          },
          {
            type: 'list',
            name: 'Tipo',
            choices:[
                'A',
                'B'
            ],
            message: 'Informe o tipo do veiculo:',
          },
        ]) 
        await Veiculo.locar(answer.Nome,answer.Cpf,answer.Tipo)
        this.exebirMenu()
}
static async DevolverMenu(){
  const answer= await inquirer.prompt([
      {
        type: 'input',
        name: 'Cpf',
        message: 'Informe o Cpf',
      },
    ])
    
    Veiculo.devolverVeiculo(answer.Cpf)
}
static async CadastrarMenu(){
    const answer= await  inquirer.prompt([
        {
            type: 'input',
            name: 'Placa',
            message: 'Informe a Placa:',
          },
          {
            type: 'input',
            name: 'Modelo',
            message: 'Informe o modelo do veiculo:',
          },
          {
            type: 'list',
            name: 'Tipo',
            choices:[
                'Carro',
                'Moto'
            ],
            message: 'Informe o tipo do veiculo:',
          },

        ]) 
        answer.Modelo = answer.Modelo.toUpperCase();
        answer.Placa = answer.Placa.toUpperCase();
        Veiculo.criar(new Veiculo(answer.Modelo,answer.Placa,answer.Tipo))
        this.exebirMenu()
}
static async ListaCarros(){
    const Lista=Veiculo.listar()
    const listCarros= Lista.filter(veiculo => veiculo.tipo === 'Carro' && !veiculo.locado)
        .map(veiculo => ({
        name: `${veiculo.modelo} - Placa: ${veiculo.placa}`,
        value: veiculo 
        }));
    const answer= await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'veiculo',
            message: 'Escolha uma opção:',
            choices:listCarros
          },
        ]);
        return answer
}
static async ListaMotos(){
  const Lista=Veiculo.listar()
  const listCarros= Lista.filter(veiculo => veiculo.tipo === 'Moto' && !veiculo.locado)
  .map(veiculo => ({
  name: `${veiculo.modelo} - Placa: ${veiculo.placa}`,
  value: veiculo 
  }));
  const answer= await inquirer.prompt([
      {
          type: 'rawlist',
          name: 'veiculo',
          message: 'Escolha uma opção:',
          choices:listCarros
        },
      ]) 
      
      return answer
  
      

}
static async MenuDias(){
    const answer= await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'dia',
            message: 'Escolha quantos dia para locação:',
            choices:[
                10,
                20,
                30,
            ]
          },
        ]) 
        
        return answer.dia
}
}

Menu.exebirMenu()

