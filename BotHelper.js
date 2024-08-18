let Helper = {
    getBoard: function() {
        return Helper.board;
    },
    getColor: function() {
        return Helper.color;
    },
    getMoves: function(b) {
        let moves = [];
        for (let x = 0; x < 7; x++) {
            let h = b.length-1;
            while (h >= 0 && b[h][x] !== 0) h--;
            if (h >= 0) moves.push(x);
        }

        return moves;
    }
};


onmessage = function(e) {
    // setting up before match starts
    if (e.data.type === "startup") {
        Helper.color = e.data.color;
        Helper.board = e.data.board;
        
        importScripts(e.data.src);
        if (typeof prep !== "undefined") {
            prep(e.data.board, e.data.color);
        }

        postMessage({type: "ready"});
    }


    // bots turn to make move
    if (e.data.type === "makeMove") {
        Helper.board = e.data.board;

        let result = think(Helper.board, Helper.color);
        postMessage({type: "move", value: result});
    }
}




