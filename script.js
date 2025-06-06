let puntos = { X: 0, O: 0 };

function permitirSoltar(event) {
    event.preventDefault();
}

function arrastrar(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function soltar(event) {
    event.preventDefault();
    const destino = event.target;
    // Sólo permitir soltar sobre una caja vacía
    if (!destino.classList.contains("caja") || destino.children.length > 0) {
        return;
    }

    const idFicha = event.dataTransfer.getData("text");
    const ficha = document.getElementById(idFicha);
    if (!ficha) return;

    destino.appendChild(ficha);
    // Remove the draggable attribute from the moved piece
    ficha.removeAttribute('draggable');
    // Remove the parent cajaArrastre as it's now empty
    if (ficha.parentNode && ficha.parentNode.classList.contains('cajaArrastre')) {
        ficha.parentNode.remove();
    }

    setTimeout(verificarGanador, 100);
}

function verificarGanador() {
    const cajas = document.querySelectorAll('.tablero .caja');
    const combinaciones = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let ganadorEncontrado = false;
    for (let combinacion of combinaciones) {
        const [a, b, c] = combinacion;
        const fichaA = cajas[a].firstChild;
        const fichaB = cajas[b].firstChild;
        const fichaC = cajas[c].firstChild;

        if (fichaA && fichaB && fichaC) {
            if (
                fichaA.className === fichaB.className &&
                fichaA.className === fichaC.className
            ) {
                const tipo = fichaA.classList.contains('cruz') ? 'X' : 'O';
                const nombre = tipo === 'X'
                    ? document.getElementById('jugadorX').value || 'Jugador X'
                    : document.getElementById('jugadorO').value || 'Jugador O';

                document.getElementById('mensajeGanador').textContent = `¡Ganador: ${nombre}!`;
                puntos[tipo]++;
                document.getElementById(tipo === 'X' ? 'puntosX' : 'puntosO').textContent = puntos[tipo];
                ganadorEncontrado = true;

                document.querySelectorAll('.cruz, .circulo').forEach(ficha => {
                    ficha.removeAttribute('draggable');
                });
                break;
            }
        }
    }

    if (!ganadorEncontrado) {
        let todasLasCajasLlenas = true;
        for (let i = 0; i < cajas.length; i++) {
            if (cajas[i].children.length === 0) {
                todasLasCajasLlenas = false;
                break;
            }
        }

        if (todasLasCajasLlenas) {
            document.getElementById('mensajeGanador').textContent = "¡Es un Empate!";
            document.querySelectorAll('.cruz, .circulo').forEach(ficha => {
                ficha.removeAttribute('draggable');
            });
        }
    }
}

function reiniciarJuego() {
    const contenedorX = document.getElementById('contenedorX');
    const contenedorO = document.getElementById('contenedor');

    contenedorX.innerHTML = '';
    contenedorO.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const cajaArrastre = document.createElement('div');
        cajaArrastre.className = 'cajaArrastre';
        const cruz = document.createElement('div');
        cruz.className = 'cruz';
        cruz.draggable = true;
        cruz.id = `x${i}`;
        cruz.addEventListener('dragstart', arrastrar);
        cajaArrastre.appendChild(cruz);
        contenedorX.appendChild(cajaArrastre);
    }

    for (let i = 1; i <= 5; i++) {
        const cajaArrastre = document.createElement('div');
        cajaArrastre.className = 'cajaArrastre';
        const circulo = document.createElement('div');
        circulo.className = 'circulo';
        circulo.draggable = true;
        circulo.id = `o${i}`;
        circulo.addEventListener('dragstart', arrastrar);
        cajaArrastre.appendChild(circulo);
        contenedorO.appendChild(cajaArrastre);
    }

    // Limpia el tablero
    document.querySelectorAll('.tablero .caja').forEach(caja => {
        while (caja.firstChild) {
            caja.removeChild(caja.firstChild);
        }
    });

    document.getElementById('mensajeGanador').textContent = "";
}

document.getElementById('reiniciar').addEventListener('click', reiniciarJuego);

document.querySelectorAll('.cruz, .circulo').forEach(ficha => {
    ficha.addEventListener('dragstart', arrastrar);
});