/* const listaRecados = []; */

const usuarioLogado = buscarDadosDoLocalStorage('usuarioLogado');

const meuModalCriarRecado = new bootstrap.Modal('#criar-recado');
const meuModalEditar = new bootstrap.Modal('#modal-editar');

document.addEventListener('DOMContentLoaded', () => {
    if(!usuarioLogado.email) {
        window.location.href = './login.html'
    } else {
        montarRegistrosNoHTML()
    }
})

const formRecado = document.getElementById('form-recado');
const tbody = document.getElementById('registros')

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

    /* listaRecados.push(novoRecado) */
    usuarioLogado.recados.push(novoRecado);
    guardarNoLocalStorage('usuarioLogado', usuarioLogado)

    meuModalCriarRecado.hide();

    formRecado.reset();

    montarRegistrosNoHTML();

    console.log(listaRecados);
})

function montarRegistrosNoHTML() {
    tbody.innerHTML = '';

    usuarioLogado.recados.forEach((valor, index) => {
        tbody.innerHTML += `
            <tr id="${index}">
                <td>${index +1} </td>
                <td>${valor.tarefa}</td>
                <td>${valor.detalhamento}</td>
                <td>
                    <button id="apagar" class="btn btn-success fs-4" aria-label="Editar" onclick="apagarRecado(${index})">
                        <i class="bi bi-trash3"></i>
                        Apagar
                    </button>
                    <button id="editar" class="btn btn-danger fs-4" type="button" onclick="prepararEdicao(${index})" data-bs-toggle="modal" data-bs-target="#modal-editar" >
                        <i class="bi bi-pencil-square"></i>
                        Editar
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

function apagarRecado(indice) {
    let confirma = window.confirm('Deseja realmente apagar esta tarefa?');

    if(confirma){
        usuarioLogado.recados.splice(indice, 1)

        guardarNoLocalStorage('usuarioLogado', usuarioLogado)

        const tr = document.getElementById(indice)
        tr.remove()
        montarRegistrosNoHTML()
    }
}

function prepararEdicao(indice) {
    
    const inputEditarTarefa = document.getElementById("editar-tarefa");
    const inputEditarDetalhamento = document.getElementById("editar-detalhamento");

    inputEditarTarefa.value = usuarioLogado.recados[indice].tarefa
    inputEditarDetalhamento.value = usuarioLogado.recados[indice].detalhamento

    const formularioEditar = document.getElementById('formulario-editar-recados')
    formularioEditar.addEventListener('submit', (evento) => {
        evento.preventDefault()

        // atualizar a lista de recados
        usuarioLogado.recados[indice].tarefa = inputEditarTarefa.value
        usuarioLogado.recados[indice].detalhamento = inputEditarDetalhamento.value
        console.log(usuarioLogado.recados[indice])

        // atualizar o localStorage
        guardarNoLocalStorage('usuarioLogado', usuarioLogado)

        // atualizar o html
        montarRegistrosNoHTML()

        meuModalEditar.hide()
    })
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