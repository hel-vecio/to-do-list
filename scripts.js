class Tarefa {

    constructor(nome, horario) {
        this.nome = nome;
        this.horario = horario;
    }

    novaTarefa = `<div class="col-md-12 task centeritems">
    <div class="col-md-1 alignitems">
        <i class="fas fa-ellipsis-v"></i>
    </div>
    <div class="col-md-7 taskname">
        <span class="tasktitle">
            ${nome}
        </span>
    </div>
    <div class="col-md-4 actions centeritems">
        <i class="far fa-clock"></i><span class="time">${horario}</span>
        <i class="fas fa-check submitbotao" onclick="fecharChamado($(this));"></i>
    </div>

</div>`


}


nenhumaTarefa = $('.none');

function fecharChamado(botao) {
    Swal.fire({
        title: 'Opa! Só um momentinho',
        text: 'Deseja mesmo encerrar essa tarefa?',
        icon: 'warning',
        showCancelButton: 'true',
        cancelButtonText: 'Não, foi engano!',
        showConfirmButton: 'true',
        confirmButtonText: 'Sim, pode encerrar!',
        confirmButtonColor: '#00fa04',
        cancelButtonColor: '#fa1900',
        reverseButtons: 'true'
    }).then(function (isConfirm) {
        if (isConfirm.value) {
            $(botao).closest('.task').remove();
            removerDoArray(botao);
            Swal.fire({
                title: 'Pronto!',
                text: 'Tarefa removida com sucesso',
                icon: 'success',
                timer: 2500,
                timerProgressBar: true
            })
        }
    }).then(function () { checaTarefas(); })

}
function checaTarefas() {
    if (!($('.title').next().hasClass('task'))) {
        $('.title').after(nenhumaTarefa);
    }
}
function abrirFormulario() {
    $('.form-novatarefa').css('display', 'block')
}
horarioNotificacao = [];
function envioTarefa() {
    nome = $('input[type=text]:nth-child(1)').val();
    horario = $('input[placeholder="Horário"]').val()
    if (nome == '') {
        Swal.fire({
            title: 'Erro',
            text: 'Não é possível criar uma tarefa vazia',
            icon: 'error',
            confirmButtonText: 'Fechar',
            timer: 3000,
            timerProgressBar: true,
        })
    } else if (horario == '') {
        horario = 'N/D';
    } else {
        $('.form-novatarefa').css('display', 'none');
        nenhumaTarefa.remove();
        Swal.fire({
            title: 'Prontinho!',
            text: 'Tarefa criada com sucesso',
            icon: 'success',
            confirmButtonText: 'Fechar',
            timer: 3000,
            timerProgressBar: true,
        })
        criarNovaTarefa(nome, horario);
        horarioNotificacao.unshift(horario);
    }
}

function criarNovaTarefa(nome, horario) {
    let tarefa = new Tarefa(nome, horario);
    $('.title').after(tarefa.novaTarefa);
}

function getHoraAtual() {
    tempo = new Date();
    horas = tempo.getHours();
    minutos = tempo.getMinutes();
    horas < 10 && horas > 0 ? horas = '0' + tempo.getHours() : tempo.getHours()
    minutos < 10 && minutos > 0 ? minutos = '0' + tempo.getMinutes() : tempo.getMinutes()
    horarioAtual = `${horas}:${minutos}`;
}

function removerDoArray(hr) {
    horarioRemovido = $(hr).parent().find('.time').text()
    console.log(horarioRemovido)
    indexHorarioRemovido = horarioNotificacao.indexOf(horarioRemovido)
    horarioNotificacao.splice(indexHorarioRemovido, 1);
}


var compararHorarios = function () {
    horarioNotificacao.forEach(function (e) {
        console.log(e)
        if (e == horarioAtual) {
           disparoAlertaAlarme(e);
           sirene.play();
        } else {
            console.log('Não tá na hora do alarme')
        }
    })
}
function sirene(){
    sirene = new Audio('http://audiocidades.utopia.org.br/biblioteca/sons/sons_avisos/navio1.wav')
}

var disparoAlertaAlarme = function(e) {
    Swal.fire({
        title: 'Atenção!',
        text: 'Você tem uma tarefa a ser feita agora',
        icon: 'warning',
        confirmButtonText: 'Fechar'
    }).then(function (isConfirm) {
        if (isConfirm.value) {
            removerDoArray(e);
            sirene.pause();
            clearInterval(disparoAlertaAlarme);
        }
    })
}


$(function () {
   setInterval(function () {
        getHoraAtual();
        compararHorarios();
    }, 1000);
    sirene()
})

