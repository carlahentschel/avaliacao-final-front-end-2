let indiceAtualizado = -1;

const usuarioLogado = buscarDadosDoLocalStorage('usuarioLogado');

const meuModalCriarRecado = new bootstrap.Modal('#criar-recado');
const meuModalEditar = new bootstrap.Modal('#modal-editar');
const meuModalExcluir = new bootstrap.Modal('#modal-excluir');

const toastRecado = document.getElementById('toast-recados');
const toastBS = new bootstrap.Toast(toastRecado);

document.addEventListener('DOMContentLoaded', () => {
    if(!usuarioLogado.email) {
        window.location.href = './login.html'
    } else {
        montarRegistrosNoHTML()
    }
})

const formRecado = document.getElementById('form-recado');
const formEditar = document.getElementById('form-editar');
const tbody = document.getElementById('registros');

formRecado.addEventListener('submit', (evento) => {
    evento.preventDefault()

    if(!formRecado.checkValidity()) {
        formRecado.classList.add('was-validated');
        return
    }

    const tarefa = document.getElementById('tarefa').value 
    const detalhamento = document.getElementById('detalhamento').value 

    const novoRecado = {
        id: gerarID(),
        tarefa: tarefa,
        detalhamento: detalhamento,
    }

    usuarioLogado.recados.push(novoRecado);
    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    meuModalCriarRecado.hide();

    formRecado.reset();

    montarRegistrosNoHTML();

    console.log(listaRecados);
})

formEditar.addEventListener('submit', (evento) => {
    evento.preventDefault()

    if(!formEditar.checkValidity()) {
        formEditar.classList.add('was-validated')
        return
    }

    const tarefaAtualizada = document.getElementById('editar-tarefa').value;
    const detalhamentoAtualizado = document.getElementById('editar-detalhamento').value;

    usuarioLogado.recados[indiceAtualizado].tarefa = tarefaAtualizada;
    usuarioLogado.recados[indiceAtualizado].detalhamento = detalhamentoAtualizado;

    guardarNoLocalStorage('usuarioLogado', usuarioLogado);

    montarRegistrosNoHTML();

    meuModalEditar.hide();
    formEditar.classList.remove('was-validated');
    formEditar.reset();

    mostrarAlerta('success', 'Recado atualizado com sucesso!')

    indiceAtualizado= -1
})

function montarRegistrosNoHTML() {
    
    tbody.innerHTML = '';

    usuarioLogado.recados.forEach((valor, index) => {
        tbody.innerHTML += `
            <tr id="${valor.id}">
                <td>${index+1} </td>
                <td class= "td-responsive" style="width:20%">${valor.tarefa}</td>
                <td class= "td-responsive" style="width:80%">${valor.detalhamento}</td>
                <td>
                    <button class="btn btn-success m-1 fs-4" aria-label="Editar" onclick="prepararEdicao(${index})">
                        <i class="bi bi-pencil-square"></i>                       
                    </button> 
                    <button class="btn btn-danger m-1 fs-4" aria-label="Apagar" onclick="prepararExclusao(${index}, ${valor.id})">
                        <i class="bi bi-trash3"></i>                       
                    </button>
                </td>
            </tr>
        `
    })
}

function gerarID() {
    return new Date().getTime()
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
        return {}
    }
}

function prepararExclusao(index, id) {
    meuModalExcluir.show();

    const botaoExcluir = document.getElementById('btn-delete');

    botaoExcluir.setAttribute('onclick', `apagarRecado(${index}, ${id})`);
}

function apagarRecado(index, id) {
    console.log(index);

    usuarioLogado.recados.splice(index, 1)

    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    const tr = document.getElementById(id)
    tr.remove()

    montarRegistrosNoHTML()

    meuModalExcluir.hide();

    mostrarAlerta('success', 'Recado excluído com sucesso!')
}

function prepararEdicao(index, id) {

    const recadoAtualizar = usuarioLogado.recados[index]

    console.log(recadoAtualizar);

    meuModalEditar.show();
    
    const inputEditarTarefa = document.getElementById("editar-tarefa");
    const inputEditarDetalhamento = document.getElementById("editar-detalhamento");

    inputEditarTarefa.value = usuarioLogado.recados[index].tarefa
    inputEditarDetalhamento.value = usuarioLogado.recados[index].detalhamento

    indiceAtualizado = index
}

function sairDaAplicacao() {
    salvarRecados();
    window.localStorage.removeItem("usuarioLogado");
    window.location.href = './login.html';
}

function salvarRecados() {
    const listaUsuarios = buscarDadosDoLocalStorage('usuarios')

    const acharUsuario = listaUsuarios.findIndex( (valor) => valor.email === usuarioLogado.email)

    listaUsuarios[acharUsuario].recados = usuarioLogado.recados

    guardarNoLocalStorage('usuarios', listaUsuarios)
}

function mostrarAlerta(tipo, mensagem) {

    toastRecado.classList.add(`text-bg-${tipo}`)
    const espacoMensagem = document.getElementById('alerta-recados')
    espacoMensagem.innerHTML = mensagem

    toastBS.show()

    setTimeout(() => {
        toastBS.hide()

        toastRecado.classList.remove(`text-bg-${tipo}`)

    }, 5000)
}