const listaUsuarios = buscarDadosDoLocalStorage('usuarios');

const form = document.getElementById('formulario-login');

const toastLogin = document.getElementById('toast-login');
const toastBS = new bootstrap.Toast(toastLogin);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputEmail = document.getElementById('email').value 
    const inputPassword = document.getElementById('senha').value 

    if(!inputEmail || !inputPassword || !inputEmail.includes('@')) {
        form.classList.add('was-validated')
        return
    }

    const usuarioEncontrado = listaUsuarios.find( (valor) => valor.email === inputEmail && valor.senha === inputPassword)

    if(usuarioEncontrado) {
        guardarNoLocalStorage('usuarioLogado', usuarioEncontrado)
        window.location.href = './recados.html'
    } else {
        mostrarAlerta('danger', 'Usuário não encontrado! Verifique se seu e-mail ou senha estão corretos')
        form.reset()
    }
})

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

function mostrarAlerta(tipo, mensagem) {

    toastLogin.classList.add(`text-bg-${tipo}`)
    const espacoMensagem = document.getElementById('alerta-login')
    espacoMensagem.innerHTML = mensagem

    toastBS.show()

    setTimeout(() => {
        toastBS.hide()

        toastLogin.classList.remove(`text-bg-${tipo}`)

    }, 5000)
}