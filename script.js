// Variáveis globais para armazenar os dados do formulário
let nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero;
let numeroNota, cnpj, dataCompra, perguntaMae;

// Função para salvar os dados do formulário
function salvarDados(aba) {
    if (aba === 1) {
        nome = document.getElementById("nome").value;
        dataNascimento = document.getElementById("dataNascimento").value;
        cpf = document.getElementById("cpf").value;
        telefone = document.getElementById("telefone").value;
        email = document.getElementById("email").value;
        estado = document.getElementById("estado").value;
        cidade = document.getElementById("cidade").value;
        cep = document.getElementById("cep").value;
        logradouro = document.getElementById("logradouro").value;
        bairro = document.getElementById("bairro").value;
        numero = document.getElementById("numero").value;

        // Validações
        if (!validarNome(nome)) return alert('O nome não pode conter números ou caracteres especiais!');
        if (!validarCPF(cpf)) return alert('CPF inválido!');
        if (!validarDataNascimento(dataNascimento)) return alert('Data de nascimento inválida ou menor de 18 anos!');
        if (!validarEmail(email)) return alert('Email inválido!');
        if (!validarTelefone(telefone)) return alert('Telefone inválido!');

        // Mostra a segunda aba
        document.getElementById("aba1").style.display = "none";
        document.getElementById("aba2").style.display = "block";
    }

    if (aba === 2) {
        numeroNota = document.getElementById("numeroNota").value;
        cnpj = document.getElementById("cnpj").value;
        dataCompra = document.getElementById("dataCompra").value;
        perguntaMae = document.getElementById("perguntaMae").value;

        // Validações
        if (!validarCNPJ(cnpj)) return alert('CNPJ inválido!');

        // Envia os dados para o servidor
        const dados = {
            nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero,
            numeroNota, cnpj, dataCompra, perguntaMae
        };

        fetch('http://localhost:3000/salvar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => {
            alert('Erro ao salvar dados: ' + error.message);
        });
    }
}

// Função para validar Nome
function validarNome(nome) {
    return /^[A-Za-záàãâéêíóôõúç ]+$/.test(nome);
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    return true;
}

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    return true;
}

// Função para validar Data de Nascimento (deve ser maior de 18 anos)
function validarDataNascimento(dataNascimento) {
    const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regexData.test(dataNascimento)) return false;

    const [dia, mes, ano] = dataNascimento.split('/').map(Number);
    const dataNasc = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    
    return idade > 18 || (idade === 18 && (hoje.getMonth() > dataNasc.getMonth() || (hoje.getMonth() === dataNasc.getMonth() && hoje.getDate() >= dataNasc.getDate())));
}

// Função para validar Email
function validarEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// Função para validar Telefone
function validarTelefone(telefone) {
    return /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone);
}

// Funções para formatar CPF, CNPJ e Data de Nascimento
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length > 9 ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') :
           cpf.length > 6 ? cpf.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3') :
           cpf.length > 3 ? cpf.replace(/(\d{3})(\d{1,})/, '$1.$2') : cpf;
}

function formatarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.length > 12 ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') :
           cnpj.length > 8 ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3/$4') :
           cnpj.length > 5 ? cnpj.replace(/(\d{2})(\d{3})(\d{1,})/, '$1.$2.$3') :
           cnpj.length > 2 ? cnpj.replace(/(\d{2})(\d{1,})/, '$1.$2') : cnpj;
}

function formatarDataNascimento(data) {
    data = data.replace(/\D/g, '');
    return data.length > 8 ? data.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3') :
           data.length > 4 ? data.replace(/(\d{2})(\d{2})(\d{1,})/, '$1/$2/$3') :
           data.length > 2 ? data.replace(/(\d{2})(\d{1,})/, '$1/$2') : data;
}

// Adicionar eventos de formatação ao digitar
document.getElementById("cpf").addEventListener("input", function() {
    this.value = formatarCPF(this.value);
});

document.getElementById("cnpj").addEventListener("input", function() {
    this.value = formatarCNPJ(this.value);
});

document.getElementById("dataNascimento").addEventListener("input", function() {
    this.value = formatarDataNascimento(this.value);
});
