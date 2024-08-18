

function prep(board, color) {
    
}


function think(board, color) {

    let moves = Helper.getMoves(board);

    return moves[Math.floor(Math.random()*moves.length)];
    
}

