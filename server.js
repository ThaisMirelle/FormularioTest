const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./banco_de_dados.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        dataNascimento TEXT,
        cpf TEXT,
        telefone TEXT,
        email TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS enderecos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        estado TEXT,
        cidade TEXT,
        cep TEXT,
        logradouro TEXT,
        bairro TEXT,
        numero TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        numeroNota TEXT,
        cnpj TEXT,
        dataCompra TEXT,
        perguntaMae TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )`);
});

app.post('/salvar', (req, res) => {
    const { nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero, numeroNota, cnpj, dataCompra, perguntaMae } = req.body;

    const sqlCliente = `INSERT INTO clientes (nome, dataNascimento, cpf, telefone, email) VALUES (?, ?, ?, ?, ?)`;

    db.run(sqlCliente, [nome, dataNascimento, cpf, telefone, email], function(err) {
        if (err) {
            console.error('Erro ao salvar cliente:', err);
            return res.status(500).json({ message: "Erro ao salvar cliente", error: err.message });
        }

        const clienteId = this.lastID;

        const sqlEndereco = `INSERT INTO enderecos (cliente_id, estado, cidade, cep, logradouro, bairro, numero) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(sqlEndereco, [clienteId, estado, cidade, cep, logradouro, bairro, numero], function(err) {
            if (err) {
                console.error('Erro ao salvar endereço:', err);
                return res.status(500).json({ message: "Erro ao salvar endereço", error: err.message });
            }

            const sqlNota = `INSERT INTO notas (cliente_id, numeroNota, cnpj, dataCompra, perguntaMae) VALUES (?, ?, ?, ?, ?)`;
            db.run(sqlNota, [clienteId, numeroNota, cnpj, dataCompra, perguntaMae], function(err) {
                if (err) {
                    console.error('Erro ao salvar nota:', err);
                    return res.status(500).json({ message: "Erro ao salvar nota", error: err.message });
                }
                res.status(200).json({ message: "Dados salvos com sucesso!" });
            });
        });
    });
});

app.get('/consultar', (req, res) => {
    const sql = `
        SELECT clientes.*, enderecos.estado, enderecos.cidade, enderecos.cep, enderecos.logradouro, 
               enderecos.bairro, enderecos.numero, notas.numeroNota, notas.cnpj, notas.dataCompra, notas.perguntaMae
        FROM clientes
        LEFT JOIN enderecos ON clientes.id = enderecos.cliente_id
        LEFT JOIN notas ON clientes.id = notas.cliente_id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar os dados:', err);
            return res.status(500).json({ message: "Erro ao consultar os dados", error: err.message });
        }
        res.status(200).json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
