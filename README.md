# Connect-4-bot-battle
## how to start?
run `git clone "https://github.com/aidanh958/Connect-4-bot-battle.git"` then run `node host.js` and open `localhost:8080/index.html`.

## how to make a bot?
inside the bots folder there is a file called `exampleBot1.js` that serves as a basic example. <br/>
inside the `script.js` file on line 9 there is an array called `links` edit the links to point to whatever file you want and it will be treated as the bot.

## competition modes
the mode variable can be set to `0`, `1`, or `2`. <br/>
Mode `0` is human vs human. <br/>
Mode `1` is a bot vs human. <br/>
Mode `2` is a bot vs bot.

## prep function
The prep function is optional and will be run before the first move for preperation.

## think function
The think function is required and is called when it is the bots turn to make a move. <br/>
The return value is treated as the move.

## API
### Helper.getBoard()
returns a 7x6 array of either `0`, `1`, or `2`. <br/>
`0` represents an empty spot <br/>
`1` represents a red spot <br/>
`2` represents a yellow spot

### Helper.getColor()
returns either `1` or `2` representing your color. <br/>
`1` represents red <br/>
`2` represents yellow

### Helper.getMoves(board)
returns an array with each x axis you could make a move on.




