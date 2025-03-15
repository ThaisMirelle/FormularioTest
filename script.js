// Função para salvar os dados do formulário
function salvarDados(aba) {
    let nome, dataNascimento, cpf, telefone, email, estado, cidade, cep, logradouro, bairro, numero, numeroNota, cnpj, dataCompra, perguntaMae;

    // Validações
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

        // Validação do nome
        if (!validarNome(nome)) {
            alert('O nome não pode conter números ou caracteres especiais!');
            return;
        }

        // Validações do CPF
        if (!validarCPF(cpf)) {
            alert('CPF inválido!');
            return;
        }

        // Validações da Data de Nascimento (Maior que 18 anos e formato correto)
        if (!validarDataNascimento(dataNascimento)) {
            alert('Data de nascimento inválida ou a pessoa não tem 18 anos!');
            return;
        }

        // Validações do Email
        if (!validarEmail(email)) {
            alert('Email inválido!');
            return;
        }

        // Validações do Telefone
        if (!validarTelefone(telefone)) {
            alert('Telefone inválido!');
            return;
        }

        // Mostra a segunda aba
        document.getElementById("aba1").style.display = "none";
        document.getElementById("aba2").style.display = "block";
    }

    if (aba === 2) {
        numeroNota = document.getElementById("numeroNota").value;
        cnpj = document.getElementById("cnpj").value;
        dataCompra = document.getElementById("dataCompra").value;
        perguntaMae = document.getElementById("perguntaMae").value;

        // Validações do CNPJ
        if (!validarCNPJ(cnpj)) {
            alert('CNPJ inválido!');
            return;
        }

        // Envia os dados para o servidor
        const dados = {
            nome,
            dataNascimento,
            cpf,
            telefone,
            email,
            estado,
            cidade,
            cep,
            logradouro,
            bairro,
            numero,
            numeroNota,
            cnpj,
            dataCompra,
            perguntaMae
        };

        fetch('http://localhost:3000/salvar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)  // Alterei formData para dados
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => {
            alert('Erro ao salvar dados: ' + error);
        });
    }
}

// Função para validar Nome (não pode conter números)
function validarNome(nome) {
    const regexNome = /^[A-Za-záàãâéêíóôõúç ]+$/;
    return regexNome.test(nome);
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[.-]/g, "");  // Remove pontos e hífens
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;  // Verifica se o CPF contém números repetidos
    return true;
}

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    return true;
}

// Função para validar Data de Nascimento (não pode conter letras ou caracteres inválidos)
function validarDataNascimento(dataNascimento) {
    const regexData = /^\d{2}\/\d{2}\/\d{4}$/; // Formato dd/mm/aaaa
    if (!regexData.test(dataNascimento)) {
        return false;
    }
    
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento.split('/').reverse().join('-'));
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    const dia = hoje.getDate() - dataNasc.getDate();

    if (idade < 18 || idade > 100 || (idade === 100 && mes < 0) || (idade === 100 && mes === 0 && dia < 0)) {
        return false;
    }
    return true;
}

// Função para validar Email
function validarEmail(email) {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
}

// Função para validar Telefone
function validarTelefone(telefone) {
    const regexTelefone = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regexTelefone.test(telefone);
}

// Funções de formatação para CPF, CNPJ e Data de Nascimento

// Formatação do CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for número
    if (cpf.length <= 3) {
        return cpf;
    } else if (cpf.length <= 6) {
        return cpf.replace(/(\d{3})(\d{1,})/, '$1.$2');
    } else if (cpf.length <= 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3');
    } else {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3-$4');
    }
}

// Formatação do CNPJ
function formatarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo que não for número
    if (cnpj.length <= 2) {
        return cnpj;
    } else if (cnpj.length <= 5) {
        return cnpj.replace(/(\d{2})(\d{1,})/, '$1.$2');
    } else if (cnpj.length <= 8) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{1,})/, '$1.$2.$3');
    } else if (cnpj.length <= 12) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3/$4');
    } else {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,})/, '$1.$2.$3/$4-$5');
    }
}

// Formatação da Data de Nascimento
function formatarDataNascimento(data) {
    data = data.replace(/\D/g, ''); // Remove tudo que não for número
    if (data.length <= 2) {
        return data.replace(/(\d{2})/, '$1/');
    } else if (data.length <= 4) {
        return data.replace(/(\d{2})(\d{2})/, '$1/$2');
    } else {
        return data.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
}

// Adicionar formatação ao digitar
document.getElementById("cpf").addEventListener("input", function() {
    this.value = formatarCPF(this.value);
});

document.getElementById("cnpj").addEventListener("input", function() {
    this.value = formatarCNPJ(this.value);
});

document.getElementById("dataNascimento").addEventListener("input", function() {
    this.value = formatarDataNascimento(this.value);
});
