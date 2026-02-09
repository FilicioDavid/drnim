let currentPos = 0;
const target = 9;
let gamesPlayed = 0;
let isNimThinking = false;

const phrases = [
    "Analisando sua trajetória...",
    "Interessante... você joga com lógica.",
    "Processando padrões...",
    "Minha rede neural está se ajustando.",
    "A vitória é apenas uma questão de cálculo."
];

function initBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 1; i <= target; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `c-${i}`;
        cell.innerHTML = i === target ? '💎' : i;
        board.appendChild(cell);
    }
    updateButtons();
}

function updateUI(isNim = false) {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('active', 'nim-active'));
    if (currentPos > 0) {
        const activeCell = document.getElementById(`c-${currentPos}`);
        if (activeCell) {
            activeCell.classList.add('active');
            if (isNim) activeCell.classList.add('nim-active');
        }
    }
    
    // Barra de progresso (Inteligência)
    const intel = Math.min(gamesPlayed * 34, 100);
    document.getElementById('learning-bar').style.width = intel + "%";
    
    updateButtons();
}

function updateButtons() {
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');

    // Se o Dr. Nim estiver pensando ou o jogo acabou, desativa tudo
    if (isNimThinking || currentPos >= target) {
        btn1.disabled = true;
        btn2.disabled = true;
    } else {
        // Bloqueia avanço de 1 se passar de 9 (raro)
        btn1.disabled = (currentPos + 1 > target);
        // Bloqueia avanço de 2 se passar de 9
        btn2.disabled = (currentPos + 2 > target);
    }
}

async function handleMove(steps) {
    if (isNimThinking || (currentPos + steps > target)) return;

    currentPos += steps;
    updateUI();

    if (currentPos === target) {
        endGame("Você venceu! Dr. Nim está recalibrando...", true);
        return;
    }

    isNimThinking = true;
    updateButtons();
    document.getElementById('message').innerText = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Pequena pausa para o "pensamento" do Dr. Nim
    setTimeout(drNimMove, 1200);
}

function drNimMove() {
    let move;

    // Lógica de "Aprendizado"
    if (gamesPlayed < 2) {
        // Fase boba: joga aleatório
        move = Math.random() > 0.5 ? 1 : 2;
        // Se o movimento aleatório for ganhar, ele "erra" de propósito no começo
        if (currentPos + move === target && gamesPlayed < 1) {
            move = (move === 1) ? 2 : 1; 
        }
    } else {
        // Fase Invencível: busca múltiplos de 3 (3, 6, 9)
        move = (currentPos % 3 === 0) ? 1 : (3 - (currentPos % 3));
        document.getElementById('message').classList.add('glitch');
    }

    // Impede que o Dr. Nim tente pular para fora do tabuleiro
    if (currentPos + move > target) {
        move = target - currentPos;
    }

    currentPos += move;
    updateUI(true);

    if (currentPos === target) {
        endGame("DR. NIM VENCEU! 'Eu previ este resultado.'", false);
    } else {
        isNimThinking = false;
        document.getElementById('message').classList.remove('glitch');
        document.getElementById('message').innerText = "Sua vez.";
        updateButtons();
    }
}

function endGame(msg, playerWon) {
    document.getElementById('message').innerText = msg;
    gamesPlayed++;
    isNimThinking = true; // Trava os botões
    updateButtons();
    
    // Reinicia o jogo automaticamente após 3 segundos
    setTimeout(resetGame, 3000);
}

function resetGame() {
    currentPos = 0;
    isNimThinking = false;
    document.getElementById('message').classList.remove('glitch');
    document.getElementById('message').innerText = "Nova rodada. Pode começar.";
    initBoard();
    updateUI();
}

// Inicialização
initBoard();