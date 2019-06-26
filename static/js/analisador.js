acoesS = {
    a: "aCb",
    b: "-",
    c: "-",
    $: "-"
}
acoesA = {
    a: "-",
    b: "bC",
    c: "cSa",
    $: "-"
}
acoesB = {
    a: "aAc",
    b: "ep",
    c: "ep",
    $: "-"
}
acoesC = {
    a: "-",
    b: "bB",
    c: "cAb",
    $: "-"
}
acoes = {
    S: acoesS,
    A: acoesA,
    B: acoesB,
    C: acoesC
}
var pilha = "$S";
var pilhaGerarSentenca = "S";
var iteracoes = 0;
var cabecote = "";
var error = false;
var html = "";
var tBody = "";
var win = 0;
var doc = 0;
var concluido = false;
$(document).ready(function () {
    win = $(window).height();
    doc = $(document).height();
});
function gerarPilha() {
    var stepByStep = $("#stepByStep").prop("checked");
    var sentenca = $("#sentenca").val();
    tBody = $(".table-pilha tbody");

    cabecote = sentenca + "$";
    error = false;
    iteracoes = 0;
    pilha = "$S";

    $(".table-first-follow").addClass("css-none");
    $(".table-pilha").removeClass("css-none");

    html = "";
    if (stepByStep && !$(".stepByStep").is(":visible")) {
        $(".stepByStep").removeClass("css-none");
        executar();
    } else {
        if (!concluido) {
            while (cabecote != "$$" && error == false) {
                executar();
                //scrollToFooter();
            }
        }
    }


}

function nextStep() {
    executar();
    // scrollToFooter();
    doc = $(document).height();
    if (doc > win) {
        $(".btn-next-footer").removeClass("css-none");
    }
}

function executar() {
    if (!concluido) {
        iteracoes++;
        var cabecaCabecote = cabecote.substring(0, 1);

        var acao = verificaPilhaComEntrada(pilha.substring(pilha.length - 1, pilha.length), cabecaCabecote);

        if (acao == 'S' || acao == 'A' || acao == 'B' || acao == 'C') {
            var pilhaAcao = acoes[acao][cabecaCabecote];

        }
        if (pilha == '$' && cabecaCabecote == '$') {
            html += "<tr>" +
                "<th scope='col'>" + pilha + "</th>" +
                "<th scope='col'>" + cabecote + "</th>" +
                "<th scope='col'>Aceito em " + iteracoes + " iteracoes </th>" +
                "</tr>";
            cabecote = "$$";
            concluido = true;
        } else if (acao == "erro") {
            html += "<tr>" +
                "<th scope='col'>" + pilha + "</th>" +
                "<th scope='col'>" + cabecote + "</th>" +
                "<th scope='col'>Erro em " + iteracoes + " iterações</th>" +
                "</tr>";
            error = true;
            concluido = true;
        } else if (acao == "ler") {
            html += "<tr>" +
                "<th scope='col'>" + pilha + "</th>" +
                "<th scope='col'>" + cabecote + "</th>" +
                "<th scope='col'>Ler " + cabecaCabecote + "</th>" +
                "</tr>";
            cabecote = cabecote.substring(1, cabecote.length);
            pilha = pilha.substring(0, pilha.length - 1);
        } else if (pilhaAcao == "ep") {
            html += "<tr>" +
                "<th scope='col'>" + pilha + "</th>" +
                "<th scope='col'>" + cabecote + "</th>" +
                "<th scope='col'>" + acao + " -> ε</th>" +
                "</tr>";
            pilha = pilha.substring(0, pilha.length - 1);

        } else {
            if (pilhaAcao == "-") {
                html += "<tr>" +
                    "<th scope='col'>" + pilha + "</th>" +
                    "<th scope='col'>" + cabecote + "</th>" +
                    "<th scope='col'>Erro em " + iteracoes + " iterações</th>" +
                    "</tr>";
                error = true;
                concluido = true;
            } else {
                html += "<tr>" +
                    "<th scope='col'>" + pilha + "</th>" +
                    "<th scope='col'>" + cabecote + "</th>" +
                    "<th scope='col'>" + acao + " -> " + pilhaAcao + "</th>" +
                    "</tr>";
                pilha = pilha.substring(0, pilha.length - 1);
                pilha += pilhaAcao.split('').reverse().join('');

            }

        }

        tBody.html(html);
    }
    if (!concluido) {

        scrollToFooter();
    } else {
        $(".btn-next-footer").addClass("css-none");
    }

}

function verificaPilhaComEntrada(pilha, cabecote) {
    var naoTerminal = verificaNaoTerminal(pilha);

    if (naoTerminal) {
        return pilha;

    } else if (pilha == cabecote) {
        return "ler";

    } else {
        return "erro";
    }


}

function verificaNaoTerminal(caracter) {
    if (caracter.charCodeAt(0) >= 65 && caracter.charCodeAt(0) <= 90) {
        return true;
    }
    return false;
}

function clean() {
    $(".table-pilha tbody").html("");
    $(".table-pilha").addClass("css-none");
    $(".btn-next-footer").addClass("css-none");
    $(".table-first-follow").removeClass("css-none");
    $("#sentenca").val("");
    $("#stepByStep").prop("checked", false);
    $("html").animate({ scrollTop: 0 }, "slow");
    concluido = false;
}

function scrollToFooter() {

    $("html").animate({ scrollTop: doc }, "slow");
}

function gerarSentenca() {
    $("#modalGerarSentenca").show();
    $("#modalGerarSentenca").removeClass("fade");
    $(".modal-backdrop").addClass("show");
    $(".row-S").addClass("row-to-select");
}

function addAcao(naoTerminal, terminal) {
    if (!$(".row-" + naoTerminal).hasClass("block")) {
        $(".row-" + naoTerminal).removeClass("row-to-select");
        var input = pilhaGerarSentenca;
        var nextAction = acoes[naoTerminal][terminal];
        if (nextAction != "ep") {
            input = input.replace(naoTerminal, nextAction);

            for (var i = 0; i < nextAction.length; i++) {
                var naoTerminalFlag = verificaNaoTerminal(nextAction[i]);
                if (naoTerminalFlag) {
                    $(".row-" + nextAction[i]).addClass("row-to-select");
                    $(".row-" + nextAction[i]).removeClass("block");
                    break;
                }
            }
            pilhaGerarSentenca = input;
            $("#sentenca-gerar").val(input);
        } else {
            input = "";
            var countNaoTerminal = 0;
            var hasNaoTerminal = false;
            for (var i = 0; i < pilhaGerarSentenca.length; i++) {
                var naoTerminalFlag = verificaNaoTerminal(pilhaGerarSentenca[i]);
                if (naoTerminalFlag && countNaoTerminal == 0) {
                    $(".row-" + pilhaGerarSentenca[i]).removeClass("row-to-select");
                    $(".row-" + nextAction[i]).addClass("block");


                } else if (naoTerminal) {
                    if (!hasNaoTerminal) {
                        $(".row-" + pilhaGerarSentenca[i]).addClass("row-to-select");
                        $(".row-" + nextAction[i]).removeClass("block");
                        hasNaoTerminal = true;

                    }
                    input += pilhaGerarSentenca[i];
                } else {
                    input += pilhaGerarSentenca[i];
                }
            }
            if (!hasNaoTerminal) {
                $(".row-" + naoTerminal).removeClass("row-to-select");
                $(".row-" + nextAction[i]).addClass("block");
            }
            pilhaGerarSentenca = input;
            $("#sentenca-gerar").val(input);
        }
    }

}

function closeModal() {
    $(".modal-backdrop").addClass("fade");
    $(".modal-backdrop").removeClass("show");
    $("#modalGerarSentenca").hide();
    $("#sentenca-gerar").val("");
    pilhaGerarSentenca = "S";
}

function copiarSentenca() {

    var inputSentenca = $("#sentenca-gerar").val();
    $("#sentenca").val(inputSentenca);
    closeModal();
}