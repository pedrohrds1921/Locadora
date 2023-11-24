import * as fs from 'fs'
import Cliente from './Cliente';
import { Menu } from './App';

class Veiculo {
    constructor(
       public modelo: string,
       public placa: string,
       public tipo: string,
       public locado: boolean = false,
       public cpf_cliente?: string
    ) { }

    static criar(veiculo: Veiculo) {
        const veiculos = Veiculo.listar();

    let validar_placa:boolean = false; 
    if (veiculos && veiculos.length > 0) {
        validar_placa = veiculos.map((veiculo: Veiculo) => veiculo.placa).includes(veiculo.placa);
    }
        if (validar_placa) {
            console.log(`Veiculo com placa ${veiculo.placa} já Cadastrado.`);
        } else {
            veiculos.push(veiculo);
            fs.writeFileSync('src/db/veiculos.json', JSON.stringify(veiculos));
            console.log('Veiculo Cadastrado ')
        }
    }

    static listar(): Veiculo[] {
            const content = fs.readFileSync('src/db/veiculos.json', 'utf-8');
            const veiculos = JSON.parse(content);
            return veiculos;
    }

    static listarDisponiveis(): Veiculo[] | undefined{
        const content = fs.readFileSync('src/db/veiculos.json', 'utf-8');
        const veiculos = JSON.parse(content);
        const veiculosDisponiveis= veiculos.filter((veiculo: Veiculo) => !(veiculo.locado));
        if(veiculosDisponiveis.length<=0){
            console.log('Não temos veiculos disponiveis')
            return
        }
        return veiculosDisponiveis
    }

    static listarLocados(): Veiculo[] |undefined {
        const content = fs.readFileSync('src/db/veiculos.json', 'utf-8');
        const veiculos = JSON.parse(content);
        const veiculosLocados=veiculos.filter((veiculo: Veiculo) => veiculo.locado);
        console.log(veiculosLocados.length)
            if(veiculosLocados.length<=0){
            console.log('Não temos veiculos locados')
            return
        }
        
        return veiculosLocados
    }

    static alterar(modelo: string, placa: string, locado: boolean, cpf_cliente?: string) {
        const veiculos = Veiculo.listar();
        const veiculo = veiculos.find((veiculo: Veiculo) => veiculo.placa === placa);
        if (veiculo) {
            veiculo.modelo = modelo;
            veiculo.placa = placa;
            veiculo.locado = locado;
            veiculo.cpf_cliente = cpf_cliente;
            fs.writeFileSync('src/db/veiculos.json', JSON.stringify(veiculos));
        } else {
            console.log(`Veiculo com Placa ${placa} não foi encontrado.`);
        }

    }

    static excluir(placa: string) {
        const veiculos = Veiculo.listar();
        const index = veiculos.findIndex((veiculo: Veiculo) => veiculo.placa === placa);
        if (index !== -1) {
            veiculos.splice(index, 1);
            fs.writeFileSync('src/db/veiculos.json', JSON.stringify(veiculos));
        } else {
            console.log(`Cliente com placa ${placa} não foi encontrado.`);
        }
    }

    static async locar(nome: string, cpf: string, tipo_cnh: string) {
        const veiculos = Veiculo.listar();
        const clientes = Cliente.listar();
        const valorDiaria=150
        let veiculo;
        let cliente;

        cliente = clientes.find((cliente: Cliente) => cliente.cpf === cpf );
        
        if (!cliente) {
            Cliente.criar(new Cliente(nome, cpf, tipo_cnh));
        }
        if(cliente?.placa_veiculo){
            console.log(`Cliente esta locando o veiculo de placa  ${cliente.placa_veiculo}`)
        }

        switch (tipo_cnh) {
            case 'A':
                veiculo = veiculos.filter((veiculo: Veiculo) => (veiculo.tipo === 'Moto' && !(veiculo.locado)));
                if (veiculo) {
                    const {veiculo}= await Menu.ListaMotos()
                    const dia=await Menu.MenuDias()
                    
                    Veiculo.alterar(veiculo.modelo,veiculo.placa,true,cpf);
                    Cliente.alterar(nome,cpf,tipo_cnh,veiculo.placa);
                    const valorDaLocado=Number((valorDiaria*dia)*1.05).toFixed(2)
                    console.log(`Moto ${veiculo.modelo} locado para ${nome} por ${dia} dias no valor de R$ ${valorDaLocado}`)
                }
                else {
                    console.log('Nenhuma Moto Disponível')
                }
                break;
            case 'B':
                veiculo = veiculos.find((veiculo: Veiculo) => (veiculo.tipo === 'Carro' && !(veiculo.locado)));
                if (veiculo) {
                    const {veiculo}= await Menu.ListaCarros()
                    const dia=await Menu.MenuDias()
                    Veiculo.alterar(veiculo.modelo,veiculo.placa,true,cpf);
                    Cliente.alterar(nome,cpf,tipo_cnh,veiculo.placa);

                    const valorDaLocado=Number((valorDiaria*dia)*1.10).toFixed(2)
                    console.log(`Carro ${veiculo.modelo} locado para ${nome} por ${dia} dia  no valor de R$${valorDaLocado}`)

                }
                else {
                    console.log('Nenhum Carro Disponível')
                }
                break;
        }

    }

    static devolverVeiculo(cpf: string) {

        const veiculos = Veiculo.listar();

        const veiculo = veiculos.find((veiculo: Veiculo) => veiculo.cpf_cliente === cpf);
        if (veiculo) {
            const clientes = Cliente.listar();
            const cliente = clientes.find((cliente: Cliente) => cliente.cpf === cpf);
            Veiculo.alterar(veiculo.modelo, veiculo.placa, false, undefined)
            if (cliente) {
                Cliente.alterar(cliente.nome, cliente.cpf, cliente.tipo_cnh, undefined);
                console.log(`Veiculo da Placa ${veiculo.placa} foi devolvido com susseco !`)
            }
        } else {
            console.log(`Cliente com cpf ${cpf} não possui veiculo locado`)
        }

    }

}

export default Veiculo;