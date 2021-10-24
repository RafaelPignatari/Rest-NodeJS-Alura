class Tabelas
{
    init(conexao)
    {
        this.conexao = conexao
        this.criarAtendimentos()
    }

    criarAtendimentos()
    {
        const sql = 'USE "Alura-NodeJS";' +
        "if object_id('Atendimentos') is null BEGIN " +
        'CREATE TABLE Atendimentos (id INT NOT NULL IDENTITY(1,1),' +
        'cliente VARCHAR(50) NOT NULL, pet VARCHAR(20), servico VARCHAR(20) NOT NULL, ' +
        'data DATETIME NOT NULL, dataCriacao DATETIME NOT NULL, ' +
        'status VARCHAR(20) NOT NULL, observacoes TEXT, PRIMARY KEY(id)); END'

        this.conexao.query(sql, (erro) => 
        {
            if(erro)
                console.log(erro)
            else
                console.log('Tabela Atendimentos criada com sucesso!')
        })
    }
}

module.exports = new Tabelas