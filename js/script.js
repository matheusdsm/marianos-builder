"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // SELETORES

    const seletor = (argumento) => {
        return document.querySelector(argumento);
    };

    const DOM = {
        slider: seletor("#posiçãoSlider"),
        sliderSaida: seletor("#elixirSlider"),
        sliderSaidaCarta: seletor("#elixirSliderCarta"),
        sliderCarta: seletor("#máximoSlider"),
        container: seletor(".lista-resultado"),
        topoLink: seletor(".topo-link"),
        spinner: seletor("#spinner"),
    };

    // ATRIBUIÇÕES

    DOM.sliderSaida.textContent = DOM.slider.value;

    DOM.sliderSaidaCarta.textContent = DOM.sliderCarta.value;

    let custoMáximo = DOM.sliderCarta.value || 6; // 6

    let sliderValor = DOM.slider.value || 1; // 1

    // EVENTOS

    DOM.topoLink.onclick = function (evento) {
        evento.preventDefault();
        let href = DOM.topoLink.getAttribute("href");
        href = href.replace("#", "");
        const link = document.getElementById(href);
        link.scrollIntoView({ behavior: "smooth" });
    };

    atualizarCombos();

    DOM.slider.oninput = debounce(function (evento) {
        evento.preventDefault();
        DOM.sliderSaida.textContent = this.value;
        sliderValor = Number(this.value);
        atualizarCombos();
    }, 100);

    DOM.sliderCarta.oninput = debounce(function (evento) {
        evento.preventDefault();
        custoMáximo = Number(this.value);
        DOM.sliderSaidaCarta.textContent = this.value;
        atualizarCombos();
    }, 100);

    // FUNÇÕES

    function comboLoop(combos) {
        DOM.container.innerHTML = "";
        if (combos.length === 0) {
            DOM.container.innerHTML = "<b> Nenhum resultado </b>";
            return;
        }
        const listaTag = document.createElement("ol");
        const fragmento = document.createDocumentFragment();
        combos.forEach((valorAtual, indexAtual) => {
            const indexLista = indexAtual + 1;
            const listaÍndice = document.createElement("li");
            listaÍndice.classList.add("index");
            listaÍndice.innerHTML =
                "<b>" + indexLista + "º: </b> " + valorAtual.join(", ");
            fragmento.appendChild(listaÍndice);
        });
        listaTag.appendChild(fragmento);
        DOM.container.appendChild(listaTag);
    }

    function atualizarCombos() {
        DOM.container.innerHTML = "";
        mostrarSpinner(true);
        setTimeout(() => {
            const combos = calcularElixir(sliderValor, custoMáximo);
            comboLoop(combos);
            mostrarSpinner(false);
        }, 0);
    }

    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function mostrarSpinner(booleano) {
        DOM.spinner.classList.toggle("oculto", !booleano);
    }

    function calcularElixir(
        valorAtual,
        custoMáximo,
        tamanhoBaralho = 8,
        custoMínimo = 1
    ) {
        const media = Math.round(tamanhoBaralho * valorAtual);
        const combinações = [];

        function retroceder(somaPendente, cartasPendentes, custoInicial, temp) {
            if (cartasPendentes === 0) {
                if (somaPendente === 0) combinações.push([...temp]);
                return;
            }
            if (
                somaPendente < cartasPendentes * custoMínimo ||
                somaPendente > cartasPendentes * custoMáximo
            )
                return;

            for (let custo = custoInicial; custo <= custoMáximo; custo++) {
                if (custo > somaPendente) break;
                temp.push(custo);
                retroceder(
                    somaPendente - custo,
                    cartasPendentes - 1,
                    custo,
                    temp
                );
                temp.pop();
            }
        }
        retroceder(media, tamanhoBaralho, custoMínimo, []);
        return combinações;
    }
});
