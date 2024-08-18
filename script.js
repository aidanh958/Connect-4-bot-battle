let c = document.getElementById("c");
let ctx = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.style.margin = 0;
document.body.style.overflow = "hidden";

let mouseX = 0;
let mouseY = 0;

let board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
let turn = 1;
let gameOver = true;
let winner = false;
let animation = [false, [0, 0], performance.now()]; // [active?, square, sTime];

/*
modes:
    0: player vs player
    1: player vs bot1
    2: bot1 vs bot2
*/
let mode = 2;

let bot1 = {};
let bot2 = {};


if (mode == 0) {
    gameOver = false;
}
if (mode == 1) {
    bot1 = {
        color: (Math.random()>0.5)?1:2,
        brain: new Worker("BotHelper.js")
    };

    bot1.brain.onmessage = function(e) {
        
        // bot is ready (startup)
        if (e.data.type === "ready") {
            gameOver = false;

            if (bot1.color == 1) {
                // bot1 makes move
                bot1.brain.postMessage({type: "makeMove", board: board});
            }
        }

        // bot makes move
        if (e.data.type === "move") {

            let h = board.length-1;
            while (h >= 0 && board[h][e.data.value] !== 0) h--;
            if (h < 0) { return }; // TODO: autokill bot
        
            board[h][e.data.value] = turn;
            if (turn == 1) { turn = 2; }
            else { turn = 1 };
        
            animation[0] = true;
            animation[1] = [ e.data.value, h ];
            animation[2] = performance.now();
        
            checkForWin();
            
        }

        
    }

    bot1.brain.postMessage({type: "startup", board: board, color: bot1.color, src: "./bots/exampleBot1.js" });
}

if (mode == 2) {
    bot1 = {
        color: (Math.random()>0.5)?1:2,
        brain: new Worker("BotHelper.js"),
        ready: false
    };
    bot2 = {
        color: bot1.color==1?2:1,
        brain: new Worker("BotHelper.js"),
        ready: false
    }
    bot1.brain.onmessage = function(e) {
        // bot is ready (startup)
        if (e.data.type === "ready") {
            bot1.ready = true;
            
            if (bot2.ready) {
                gameOver = false;
                if (bot1.color == 1) {
                    bot1.brain.postMessage({type: "makeMove", board: board});
                } else {
                    bot2.brain.postMessage({type: "makeMove", board: board});
                }
            }
        }
        // bot makes move
        if (e.data.type === "move") {
            let h = board.length-1;
            while (h >= 0 && board[h][e.data.value] !== 0) h--;
            if (h < 0) { return }; // TODO: autokill bot
            board[h][e.data.value] = turn;
            if (turn == 1) { turn = 2; }
            else { turn = 1 };
            animation[0] = true;
            animation[1] = [ e.data.value, h ];
            animation[2] = performance.now();
            checkForWin();

            if (mode == 2 && !gameOver) {
                setTimeout(() => { bot2.brain.postMessage({type: "makeMove", board: board}); }, 500);
            }
        }
    }
    bot2.brain.onmessage = function(e) {
        // bot is ready (startup)
        if (e.data.type === "ready") {
            bot2.ready = true;
            
            if (bot1.ready) {
                gameOver = false;
                if (bot1.color == 1) {
                    bot1.brain.postMessage({type: "makeMove", board: board});
                } else {
                    bot2.brain.postMessage({type: "makeMove", board: board});
                }
            }
        }
        // bot makes move
        if (e.data.type === "move") {
            let h = board.length-1;
            while (h >= 0 && board[h][e.data.value] !== 0) h--;
            if (h < 0) { return }; // TODO: autokill bot
            board[h][e.data.value] = turn;
            if (turn == 1) { turn = 2; }
            else { turn = 1 };
            animation[0] = true;
            animation[1] = [ e.data.value, h ];
            animation[2] = performance.now();
            checkForWin();

            if (mode == 2 && !gameOver) {
                setTimeout(() => { bot1.brain.postMessage({type: "makeMove", board: board}); }, 500);
            }
        }
    }

    bot1.brain.postMessage({type: "startup", board: board, color: bot1.color, src: "./bots/exampleBot1.js" });
    bot2.brain.postMessage({type: "startup", board: board, color: bot1.color, src: "./bots/exampleBot1.js" });
}













function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] == 0) ctx.fillStyle = "rgb(50, 50, 50)";
            if (board[y][x] == 1) ctx.fillStyle = "red";
            if (board[y][x] == 2) ctx.fillStyle = "yellow";
            if (animation[0] && animation[1][0] == x && animation[1][1] == y) ctx.fillStyle = "rgb(50, 50, 50)";

            ctx.beginPath();
            ctx.arc(
                (c.width/2-(3*52)) + x*52, 
                y*52+25, 
                25, 0, 2*Math.PI
            );
            ctx.fill();
        }
    }

    if (animation[0]) {
        let col = board[animation[1][1]][animation[1][0]];
        let t = performance.now()-animation[2];

        let h = t/50;

        if (col == 1) ctx.fillStyle = "red";
        if (col == 2) ctx.fillStyle = "yellow";

        ctx.beginPath();
        ctx.arc(
            (c.width/2-(3*52)) + animation[1][0]*52, 
            h*52+25, 
            25, 0, 2*Math.PI
        );
        ctx.fill();

        if (h >= animation[1][1]) animation[0] = false;
    }


    let mx = (mouseX+25) - (c.width/2-(3*52));
    mx = Math.floor(mx/52)*52;

    if (mx >= 0 && mx < 7*52) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillRect((c.width/2-(3*52)) + mx -25, 0, 50, c.height);
    }

    if (gameOver && winner) {
        ctx.textAlign = "center";
        ctx.font = "100px Arial";
        ctx.fillStyle = "white";
        if (winner == 1) {
            ctx.fillText("red wins!", c.width/2, 3*52 + 50);
        } else if (winner == 2) {
            ctx.fillText("yellow wins!", c.width/2, 3*52 + 50);
        } else {
            ctx.fillText("draw", c.width/2, 3*52);
        }
    }

    
    requestAnimationFrame(render);
}



window.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

window.onclick = function(e) {
    if (gameOver) return;
    if (mode == 2) return;
    if (mode == 1 && turn == bot1.color) return;
    
    let mx = (e.clientX+25) - (c.width/2-(3*52));
    mx = Math.floor(mx/52);

    let h = board.length-1;
    while (h >= 0 && board[h][mx] !== 0) h--;
    if (h < 0) { return }; // no possible move for that row

    board[h][mx] = turn;
    if (turn == 1) { turn = 2; }
    else { turn = 1 };

    animation[0] = true;
    animation[1] = [ mx, h ];
    animation[2] = performance.now();

    checkForWin();

    if (!gameOver) bot1.brain.postMessage({type: "makeMove", board: board});
}

function gameWinner(col) {
    if (col == 1) console.log("red wins!")
    else if (col == 2) console.log("yellow wins!")
    else console.log("draw");

    gameOver = true;
}


function checkForWin() {
    let foundEmpty = false;
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[0].length; x++) {

            let col = board[y][x];
            if (col == 0) {foundEmpty = true; continue }; // empty

            let win = false;
            if (followLine(x, y, [0, 1], col, 1)) win = true;
            if (followLine(x, y, [1, 0], col, 1)) win = true;
            if (followLine(x, y, [1, 1], col, 1)) win = true;
            if (followLine(x, y, [1, -1], col, 1)) win = true;


            if (win) {
                winner = col;
                gameWinner(col);
                return;
            }
        }
    };


    if (!foundEmpty) {winner = 0; gameWinner(0)};
}

function followLine(x, y, dir, col, leng) {
    if (leng >= 4) return true;

    if (
        y+dir[1] >= 6 ||
        x+dir[0] >= 7 ||
        y+dir[1] < 0 ||
        x+dir[0] < 0
    ) {return false};
    
    if (board[y+dir[1]][x+dir[0]] == col) {
        return followLine(x+dir[0], y+dir[1], dir, col, leng+1);
    }
    return false;
}


























render();