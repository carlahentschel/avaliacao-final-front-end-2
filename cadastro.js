const listaUsuarios = buscarDadosDoLocalStorage('usuarios');

const form = document.getElementById('formulario-cadastro')

const toastCadastro = document.getElementById('toast-cadastro');
const toastBS = new bootstrap.Toast(toastCadastro);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputEmail = document.getElementById('email').value; 
    const inputPassword = document.getElementById('senha').value; 
    const inputPasswordConfirmada = document.getElementById('senha-confirmada').value; 
    
    if(!inputEmail || !inputPassword || !inputPasswordConfirmada || !inputEmail.includes('@')) {
        form.classList.add('was-validated')
        return
    }

    if(inputPassword !== inputPasswordConfirmada) {
        mostrarAlerta('danger', 'As senhas precisam ser iguais!')
        form.reset()
        return
    }
    
    const novoUsuario = {
        email: inputEmail,
        senha: inputPassword,
        recados: []
    }

    const existe = listaUsuarios.some((valor) => valor.email === novoUsuario.email)

    if(existe) {
        mostrarAlerta('danger', 'Este e-mail já foi cadastrado!');
        form.reset()
        return   
    }

    listaUsuarios.push(novoUsuario)
    guardarNoLocalStorage('usuarios', listaUsuarios)

    // form.classList.remove('was-validated')
    form.reset()
    // NÃO ESTÁ MOSTRADO O ALERTA E ESTÁ INDO DIRETO PRA PÁGINA DE LOGIN
    mostrarAlerta('sucess', 'Cadastro realizado com sucesso!')
   
    window.location.href = './login.html'
})

function mostrarAlerta(tipo, mensagem) {
    
    toastCadastro.classList.add(`text-bg-${tipo}`)
    const espacoMensagem = document.getElementById('alerta-cadastro')
    espacoMensagem.innerHTML = mensagem

    toastBS.show()

    setTimeout(() => {
        toastBS.hide()
        
        toastCadastro.classList.remove(`text-bg-${tipo}`)

    }, 5000)

}

function guardarNoLocalStorage(chave, valor) {
    const valorJSON = JSON.stringify(valor)

    localStorage.setItem(chave, valorJSON)
}

function buscarDadosDoLocalStorage(chave) {
    const dadoJSON = localStorage.getItem(chave)

    if(dadoJSON) {
        const listaDados = JSON.parse(dadoJSON)
        return listaDados
    } else {
        return []
    }
}