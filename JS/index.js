import {DIRECTIONS, GRID_SIZE, LEVEL, OBJECT_TYPE} from './setup.js';
import Board from './board.js';
import Pacman from './pacman.js';

import { BlinkyMove,PinkyMove, InkyMove, ClydeMove } from './ghostMoves.js';
import Ghost from './ghosts.js';

const soundDot = '../sounds/munch.wav'
const soundPill = '../sounds/pill.wav'
const soundStart = '../sounds/game_start.wav'
const soundGameOver = '../sounds/death.wav'
const soundGhost = '../sounds/eat_ghost.wav'

const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

const POWER_PILL_TIME = 2000;
const GLOBAL_SPEED = 60;
const board = new Board(gameGrid, LEVEL)

let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

let scatterTimes = 0;
let scatterTimer = null;
let canScatter = true;

function play_audio(audio)
{
    const soundEffect = new Audio(audio);
    soundEffect.play();
}

function gameOver(pacman)
{
    if(!gameWin) play_audio(soundGameOver)
    document.removeEventListener('keydown', e => pacman.handleKeyInput(e, board.objectExists));
    board.rotateDiv(pacman.pos, 0, 1)
    board.showStatus(gameWin);
    clearInterval(timer);
    startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts)
{
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);
    if(collidedGhost && !collidedGhost.dead)
    {
        if(powerPillActive)
        {
            play_audio(soundGhost)
            board.removeObject(collidedGhost.pos, [OBJECT_TYPE.GHOST]);
            collidedGhost.dead = true;
            score += 100;
        }
        else
        {
            board.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN])
            board.rotateDiv(pacman.pos, 0)
            gameOver(pacman)
        }
    }
}

function gameLoop(pacman, ghosts)
{
    pacman.move();
    checkCollision(pacman, ghosts);
    ghosts.forEach(ghost => ghost.move());
    checkCollision(pacman, ghosts);
    if(board.objectExists(pacman.pos, OBJECT_TYPE.DOT))
    {
        play_audio(soundDot)
        board.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        board.dotCount --;
        score += 10;
    }
    
    if(board.objectExists(pacman.pos, OBJECT_TYPE.PILL))
    {
        play_audio(soundPill)
        board.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        powerPillActive = true
        pacman.powerPill = true;
        ghosts.forEach(ghost => 
        {
            ghost.powerPill = true;
            if(ghost.dir.movement == -1) ghost.dir = DIRECTIONS['ArrowRight']
            else if(ghost.dir.movement == 1) ghost.dir = DIRECTIONS['ArrowLeft']
            else if(ghost.dir.movement == GRID_SIZE) ghost.dir = DIRECTIONS['ArrowDown']
            else ghost.dir = DIRECTIONS['ArrowUp']
        });

        score += 50;
        clearTimeout(powerPillTimer)
        powerPillTimer = setTimeout(() => 
        {
            powerPillActive = false
            pacman.powerPill = false;
            ghosts.forEach(ghost => ghost.powerPill = false)
        }, POWER_PILL_TIME);
        
    }

    if (board.dotCount === 0)
    {
        gameWin = true;
        gameOver(pacman);
    }

    scoreTable.innerHTML = score;

    if(canScatter && Math.floor(Math.random() * 1000 === 1000))
    {
        canScatter = false;
        ghosts.forEach(ghost => 
        {
            ghost.scatter = true
            if(ghost.dir.movement == -1) ghost.dir = DIRECTIONS['ArrowRight']
            else if(ghost.dir.movement == 1) ghost.dir = DIRECTIONS['ArrowLeft']
            else if(ghost.dir.movement == GRID_SIZE) ghost.dir = DIRECTIONS['ArrowDown']
            else ghost.dir = DIRECTIONS['ArrowUp']
        });
        scatterTimer = setTimeout(() => 
        {
            scatterTimes ++;
            if(scatterTimes < 5) canScatter = true;
            ghosts.forEach(ghost => 
            {
                ghost.scatter = false
                if(ghost.dir.movement == -1) ghost.dir = DIRECTIONS['ArrowRight']
                else if(ghost.dir.movement == 1) ghost.dir = DIRECTIONS['ArrowLeft']
                else if(ghost.dir.movement == GRID_SIZE) ghost.dir = DIRECTIONS['ArrowDown']
                else ghost.dir = DIRECTIONS['ArrowUp']
            });
        }, ((Math.random() * (5000 - 2000)) + 2000));
    } 
    
    
}

function startGame()
{
    play_audio(soundStart)
    score = 0;
    timer = null;
    gameWin = false;
    powerPillActive = false;
    powerPillTimer = null;
    scatterTimes = 0;

    startButton.classList.add('hide');
    board.createGrid(LEVEL);

    const pacman = new Pacman(5, 361, board);
    const ghosts = [
        new Ghost(10, 158, board, BlinkyMove, OBJECT_TYPE.BLINKY, pacman, true, 30),
        new Ghost(15, 159, board, PinkyMove, OBJECT_TYPE.PINKY, pacman, false, 55),
        new Ghost(8, 160, board, ClydeMove, OBJECT_TYPE.CLYDE, pacman, false, 436),
        
    ];
    ghosts.push(new Ghost(6, 462, board, InkyMove, OBJECT_TYPE.INKY, pacman, false, 462, ghosts[0]))

    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

startButton.addEventListener('click', startGame);