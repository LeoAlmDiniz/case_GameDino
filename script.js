const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
//GAME SETTINGS:
const dino_style = getComputedStyle(dino);
const x0 = parseInt(dino_style.left);
const y0 = parseInt(dino_style.bottom);
const dino_w = parseInt(dino_style.width);
const dino_h = parseInt(dino_style.height);
const background_style = getComputedStyle(background);
const x_max = parseInt(background_style.width)


//INITIALIZE GAME VARS
let isJumping = false;
let permitJump = true
let permitPressure = true;
let y = y0;
var pressure = false
var isGameOver = false
var gameVelocity = 4;

createCactus();
document.addEventListener('keyup', handleKeyUp);
document.addEventListener('keydown', handleKeyDown);

function handleKeyUp(evento) {
    if (evento.keyCode === 32) {
        if (isJumping) {
            permitJump = true
            pressure = false
        } else if (y <= y0) {
            permitJump = true;
        }
    }
}

function handleKeyDown(evento) {
    if (evento.keyCode === 32) {
        if (!isJumping && permitJump) {
            permitJump = false
            pressure = true
            jump();
        } else if (isJumping && permitPressure) {
            pressure = true;
        }
    }
}

function jump() {
    isJumping = true;
    let upInterval = setInterval(() => {
        if (y >= 160+y0 || !pressure) {
            //para de subir
            clearInterval(upInterval);
            //descendo
            let downInterval = setInterval(() => {
                if (y <= y0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    permitPressure = true;
                } else {
                    var downMove = Math.min(Math.max(10 *(1/(y-y0)),2),20)
                    y = Math.max(y0, y - downMove);
                    dino.style.bottom = y+'px';
                }
            }, 1);
        } else {
            //Subindo
            y = Math.min(160, y + 0.0007*(160-y)**2);
            if (y>150) {
                pressure = false;
                permitPressure = false;
            }
            dino.style.bottom = y+'px'//tudo aqui vai ser executado sem parar no intervalo que definirmos
        }    
    }, 3)
};//vai ser executado no intervlao de 20 ms

function createCactus() {
    gameVelocity += Math.random() > 0.5 ? 1 : 0;
    const cactus = document.createElement('div');
    let randomTime = Math.random()*4000;
    if (isGameOver) return
    cactus.classList.add('cactus');
    //============================================
    background.appendChild(cactus);
    //CACTUS CONSTANTS
    const cactus_style = getComputedStyle(document.querySelector('.cactus'));
    const cactus_w = parseInt(cactus_style.width);
    let cactus_x = x_max-cactus_w;
    cactus.style.left = cactus_x +'px';
    const cactus_h = parseInt(cactus_style.height);
    let leftInterval = setInterval(() => {
        if (cactus_x < -0) {
            clearInterval(leftInterval);
            background.removeChild(cactus);
        } else if (cactus_x > x0 && cactus_x < dino_w && y < cactus_h+y0) {
            //GameOver
            clearInterval(leftInterval)
            gameOver();
        } 
        else {
            cactus_x -=gameVelocity;
            cactus.style.left = cactus_x + 'px'
        }
    },20)
    setTimeout(createCactus, randomTime);
}

function gameOver() {
    isGameOver = true;
    document.body.innerHTML = '<h1 class="game-over" onclick="reiniciaJogo()" >Fim de jogo</h1>';
} // Fim da função gameOver();

 //creio que o contexto é dado por0
//addeventlisterner, que é aplicado em document, por isso quem é passado para a 
//função é o evento (deve ser algo asssim)