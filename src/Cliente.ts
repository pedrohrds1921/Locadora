import * as fs from 'fs'

class Cliente {
    constructor(
        public nome: string,
        public cpf: string,
        public tipo_cnh: string,
        public placa_veiculo?: string
    ) { }

    getCpf(): string {
        return this.cpf;
    }

    getPlaca() {
        return this.placa_veiculo;
    }

    static criar(cliente: Cliente) {
        const clientes = Cliente.listar();
        const validar_cpf = clientes.map((cliente: Cliente) => cliente.cpf).includes(cliente.cpf);

        if (validar_cpf) {
            console.log(`Cliente com cpf ${cliente.cpf} já Cadastrado.`);
        } else {
            clientes.push(cliente);
            fs.writeFileSync('src/db/clientes.json', JSON.stringify(clientes));
        }
    }

    static listar(): Cliente[] {
        const content = fs.readFileSync('src/db/clientes.json', 'utf-8');
        const clientes = JSON.parse(content);
        return clientes;
    }

    static alterar(nome: string, cpf: string, tipo_cnh: string, placa_veiculo?: string) {
        const clientes = Cliente.listar();
        const cliente = clientes.find((cliente: Cliente) => cliente.cpf === cpf);
        if (cliente) {
            cliente.nome = nome;
            cliente.tipo_cnh = tipo_cnh;
            cliente.placa_veiculo = placa_veiculo;
            fs.writeFileSync('src/db/clientes.json', JSON.stringify(clientes));
        } else {
            console.log(`Cliente com CPF ${cpf} não foi encontrado.`);
        }

    }

    static excluir(cpf: string) {
        const clientes = Cliente.listar();
        const index = clientes.findIndex((cliente: Cliente) => cliente.cpf === cpf);
        if (index !== -1) {
            clientes.splice(index, 1);
            fs.writeFileSync('src/db/clientes.json', JSON.stringify(clientes));
        } else {
            console.log(`Cliente com CPF ${cpf} não foi encontrado.`);
        }
    }

}

export default Cliente;