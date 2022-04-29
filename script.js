const MAX_X = 10;
const MAX_Y = 10;
const START_POS = 5;
const BLOCK_SIZE = 20;

const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;

const KEYS_VELOCITY = {
    'ArrowDown': DIR_DOWN,
    'ArrowUp': DIR_UP,
    'ArrowRight': DIR_RIGHT,
    'ArrowLeft': DIR_LEFT,
};
const OPPOSITE_DIR = {
    [DIR_RIGHT]: DIR_LEFT,
    [DIR_LEFT]: DIR_RIGHT,
    [DIR_UP]: DIR_DOWN,
    [DIR_DOWN]: DIR_UP,
};
const VELOCITY_DIR = {
    [DIR_RIGHT]: [1,0],
    [DIR_LEFT]: [-1,0],
    [DIR_UP]: [0,-1],
    [DIR_DOWN]: [0,1],
};

let snake = [[START_POS,START_POS],[START_POS-1,START_POS],[START_POS-2,START_POS]];
let dir = DIR_RIGHT;
let food;
let points = 0;

const canvas = document.getElementById('game');
canvas.width = BLOCK_SIZE * MAX_X;
canvas.height = BLOCK_SIZE * MAX_Y;
const ctx = canvas.getContext('2d');

function render() {
    console.log(dir, snake.toString());
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    snake.forEach(s => ctx.fillRect(s[0] * BLOCK_SIZE, s[1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE));
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food[0] * BLOCK_SIZE, food[1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

const randomPlace = () => [Math.floor(Math.random() * MAX_X), Math.floor(Math.random() * MAX_Y)];
const collides = (a, b) => a[0] == b[0] && a[1] == b[1];
const collidesWithSnake = e => snake.map(s => collides(e, s)).reduce((bool, prevBool) => bool || prevBool, false);
const outOfTheMap = e => e[0] < 0 || e[0] >= MAX_X || e[1] < 0 || e[1] >= MAX_Y;
const gameOver = () => {
    clearInterval(gameLoop);
    alert('GAME OVER');
    location.reload();
};

function generateNewFood() {
    while (true) {
        food = randomPlace();
        if (!collidesWithSnake(food)) {
            return food;
        }
    }
}
generateNewFood();

// main loop
let gameLoop = setInterval(() => {
    let oldHead = snake[0];
    let v = VELOCITY_DIR[dir];
    let newHead = [oldHead[0] + v[0], oldHead[1] + v[1]];

    if (outOfTheMap(newHead)) {
        return gameOver();
    }
    if (collides(newHead, food)) {
        points++;
        generateNewFood();
    } else {
        snake.pop();
    }

    if (collidesWithSnake(newHead)) {
        return gameOver();
    }

    snake.unshift(newHead);
    render();

}, 500);

// keyboard
window.addEventListener('keydown', ev => {
    if (typeof KEYS_VELOCITY[ev.key] != 'undefined' && OPPOSITE_DIR[dir] != KEYS_VELOCITY[ev.key]) {
        dir = KEYS_VELOCITY[ev.key];
    }
});
