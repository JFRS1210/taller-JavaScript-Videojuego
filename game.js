const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')
const btnArriba = document.querySelector('#Arriba')
const btnIzquierda = document.querySelector('#Izquierda')
const btnDerecha = document.querySelector('#Derecha')
const btnAbajo = document.querySelector('#Abajo')
const spanVidas = document.querySelector('#lives')
const spanTime = document.querySelector('#tiempo')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')

let canvasSize
let elementSize
let nivel = 0
let lives = 3
let timeStart
let timePlayer
let timeInterval
const playerPosition = {
    x: undefined,
    y: undefined
}
const giftPosition = {
    x: undefined,
    y: undefined
}
let bombsPositions = []

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)
function setCanvasSize(){
    if( window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8
    } else {
        canvasSize = window.innerHeight * 0.8
    }
    canvas.setAttribute('width',canvasSize)
    canvas.setAttribute('height',canvasSize)

    elementSize = canvasSize / 10
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}
function startGame(){
    game.font = elementSize + 'px Verdana'
    game.textAlign = "end"
    bombsPositions = []
    const map = maps[nivel]
    if(!map){
        gameWin()
        return
    }
    if(!timeStart){
        timeStart = Date.now()
        timeInterval = setInterval(fillTiempo,100)
        showRecord()
    }
    showLives()
    const mapFilas = map.trim().split('\n')
    const mapFilasCols = mapFilas.map(fila => fila.trim().split(''))
    
    game.clearRect(0,0,canvasSize,canvasSize)
    mapFilasCols.forEach((fila, filaI) => {
        fila.forEach((col, colI) => {
            const posx = elementSize * (colI + 1)
            const posy = elementSize * (filaI + 1)
            if(col == 'O' && playerPosition.x == undefined && playerPosition.y == undefined){
                playerPosition.x = posx
                playerPosition.y = posy
            } else if(col == 'I'){
                giftPosition.x = posx
                giftPosition.y = posy
            } else if(col == 'X'){
                bombsPositions.push({
                    x: posx,
                    y: posy
                })
            }
            game.fillText(emojis[col],posx,posy)
        })
    });
    
    movePlayer()
}
function gameWin(){
    clearInterval(timeInterval)
    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now() - timeStart
    if(recordTime){
        if(playerTime <= recordTime){
            localStorage.setItem('record_time', playerTime)
            pResult.innerHTML = "Record Superado SIUU"
        } else {
            pResult.innerHTML = "Na que hacer"
        }
    } else {
        pResult.innerHTML = "Primer Juego"
        localStorage.setItem('record_time', playerTime)
    }
    console.log({recordTime, playerTime})
}
function showLives(){
    const arryVidas = Array(lives).fill(emojis['HEART'])
    spanVidas.innerHTML = ""
    arryVidas.forEach(element => spanVidas.append(element))
}
btnArriba.addEventListener('click', moveUp)
btnAbajo.addEventListener('click', moveDown)
btnDerecha.addEventListener('click', moveRight)
btnIzquierda.addEventListener('click', moveLeft)

window.addEventListener('keydown', moveByKeys)
function fillTiempo(){
    spanTime.innerHTML = Date.now() - timeStart
}
function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time')
}
function movePlayer(){
    const giftColisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3)
    const giftColisiony = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3)
    const giftColision = giftColisionX && giftColisiony
    if(giftColision){
        levelWin()
    } 

    const bombsColision = bombsPositions.find(enemy => {
        const bombsColisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3)
        const bombsColisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
        return bombsColisionX && bombsColisionY
    })
    
    if(bombsColision){
        levelFailed()
    }
    game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y)
}
function levelFailed(){
    if(lives > 0){
        lives -= 1
        
    } 
    if(lives <= 0){
        lives = 3
        nivel = 0
        timeStart = undefined
    }
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}
function levelWin(){
    nivel += 1
    startGame()
}
function moveByKeys(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowDown') moveDown();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
}
function moveUp(){
    if(playerPosition.y > elementSize){
        playerPosition.y -= elementSize
        startGame()
    } 
}
function moveDown(){
    if(playerPosition.y < canvasSize){
        playerPosition.y += elementSize
        startGame()
    } 
}
function moveRight(){
    if(playerPosition.x < canvasSize){
        playerPosition.x += elementSize
        startGame()
    }
}
function moveLeft(){
    if(playerPosition.x > elementSize){
        playerPosition.x -= elementSize
        startGame()
    } 
}