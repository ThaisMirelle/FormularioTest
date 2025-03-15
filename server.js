const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('formulario.db');

// Configurando o middleware para permitir CORS
app.use(cors());

// Middleware para lidar com o corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Criação da tabela, caso não exista (Executado apenas uma vez ao iniciar o servidor)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS formulario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        dataNascimento TEXT,
        cpf TEXT,
        telefone TEXT,
        email TEXT,
        estado TEXT,
        cidade TEXT,
        cep TEXT,
        logradouro TEXT,
        bairro TEXT,
        numero TEXT,
        numeroNota TEXT,
        cnpj TEXT,
        dataCompra TEXT,
        perguntaMae TEXT
    )`);
});

// Rota para salvar os dados
app.post('/salvar', (req, res) => {
    const { nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero, numeroNota, cnpj, dataCompra, perguntaMae } = req.body;

    // Inserir os dados no banco de dados
    const sql = `INSERT INTO formulario (nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero, numeroNota, cnpj, dataCompra, perguntaMae) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero, numeroNota, cnpj, dataCompra, perguntaMae], function(err) {
        if (err) {
            console.error('Erro ao salvar os dados:', err);
            return res.status(500).json({ message: "Erro ao salvar os dados", error: err.message });
        }
        res.status(200).json({ message: "Dados salvos com sucesso!" });
    });
});

// Rota para consultar os dados da tabela
app.get('/consultar', (req, res) => {
    const sql = `SELECT * FROM formulario`; // Consulta todos os dados da tabela 'formulario'

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os dados:', err);
            return res.status(500).json({ message: "Erro ao consultar os dados", error: err.message });
        }
        // Exibir os dados no console
        console.log('Dados consultados:', rows);

        // Enviar os dados de volta para o cliente
        res.status(200).json(rows); // Retorna os dados como JSON para o frontend
    });
});

// Configurar o servidor para escutar na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
