const conexao = require('../infraestrutura/conexao')
const moment = require('moment')
class Atendimento
{
    adiciona(atendimento, res)
    {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = 
        [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]
        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros)
        {
            res.status(400).json(erros)
        }
        else
        {
            const sql = "INSERT INTO Atendimentos (cliente, pet, servico, status, observacoes, data, dataCriacao) VALUES ('"+
            atendimento.cliente +"', '" +atendimento.pet +"', '" +atendimento.servico +"', '" +
            atendimento.status +"', '" +atendimento.observacoes +"', '" +data +"', '" +dataCriacao +"')"
            conexao.query(sql, (erro, resultados) =>
            {
                if(erro)
                    res.status(400).json(erro)
                else
                    res.status(201).json(atendimento)
            })
        }
        
    }

    lista(res)
    {
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro,resultados) =>
        {
            if(erro)
                res.status(400).json(erro)
            else
                res.status(200).json(resultados)
        })
    }

    buscaPorId(id, res)
    {
        const sql = 'SELECT * FROM Atendimentos WHERE id = ' +id
        conexao.query(sql, (erro, resultados) =>
        {
            const atendimento = resultados.recordset[0]
            if(erro)
                res.status(400).json(erro)
            else
                res.status(200).json(atendimento)
        })
    }

    altera(id, valores, res){       
        var sql = 'UPDATE Atendimentos SET '
        if(valores.cliente != undefined)
            sql += "cliente = '" +valores.cliente +"', "
        if(valores.pet != undefined)
            sql += "pet = '" +valores.pet +"', "
        if(valores.servico != undefined)
            sql += "servico = '" +valores.servico +"', "
        if(valores.data != undefined)
        {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
            sql += "data = '" +valores.data +"', "
        }
        if(valores.status != undefined)
            sql += "status = '" +valores.status +"', "
        if(valores.observacoes != undefined)
            sql += "observacoes = '" +valores.observacoes +"' "
        sql += 'WHERE id=' +id
        console.log(sql)
        conexao.query(sql.toString(), (erro, resultados) =>
        {
            if(erro)
                res.status(400).json(erro)
            else
                res.status(200).json(valores)
        })
    }

    deleta(id, res)
    {
        const sql = 'DELETE FROM Atendimentos WHERE id = ' +id
        conexao.query(sql, (erro, resultados) =>
        {
            if(erro)
            {
                res.status(400).json(erro)
            }
            else
            {
                res.status(200).json({id}) //devolvemos o id, pois é mais útil para o cliente
            }
        })
    }
}

module.exports = new Atendimento