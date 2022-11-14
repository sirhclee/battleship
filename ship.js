function Ship(size, hits, direction){
    return {size: size,
        hits: hits,
        direction: direction, 
        sunk: false,
        hit(){ 
            this.hits+= 1; 
            this.isSunk();  
        }, 

        isSunk(hits= this.hits, size=this.size){
            if (hits==size){
                this.sunk = true; return true; 
            } else {this.sunk = false; return false }; 
        }
    };
}

function Gameboard( ){
    return {board: new Map(),
            ships: {}, 
            lengths: {'Carrier': 5, 'Battleship':4, 'Cruiser':3, 'Destroyer':2},

        addVertices(size = 10){ //Create 10x10 grid
            for (let i=0; i<size; i++){
                for (let j=0; j<size; j++){
                    this.board.set( `${[j,i]}`,[-1]); //creates hash
                }
            }  
        },

        drawGraph(player1, player2, board=this.board){
            let divID = player1.player; 
            const container = document.getElementById(divID); 

            container.style.gridTemplateRows = `repeat(10,25px)`; // For each row, set to row width based on .grid class width 
            container.style.gridTemplateColumns = `repeat(10,25px)`; // Repeat for col
            container.style.display = 'grid';

            for (let [pos] of board){ 
                let cell = document.createElement('tile'); 
                cell.style.border = '1px solid black';
                
                cell.id = pos+player1.player;
                if (player1.player == 'HUM'){
                    cell.style.backgroundColor = 'dimgrey'}
                else {cell.style.backgroundColor = 'lightgrey';}

                if( !board.get(pos).includes(-1)){ //color boats
                    if (player1.player =='COM'){
                        cell.style.backgroundColor = 'blue' }
                    //else {cell.style.backgroundColor = 'red';} // computer
                }
    
                cell.addEventListener('click', () => {
                    if (player1.player =='HUM' && player1.turn){
                        
                        if (!board.get(pos).includes(-2)){
                            let hit = player1.board.receiveAttack(parseInt(pos[0]), parseInt(pos[2])); //attack PC board
                            this.updateGraph(player1, pos, hit[1]); 
                            player1.playerTurn(player1, player2);
                        }
                    }
    
                })
                container.append(cell);
                
            }
            const label = document.createElement('label');
            label.textcontent = '`${player1.player}`'; 
            container.append(label);
        },
        updateGraph(player, pos, hit){
            let cellX = document.getElementById(pos+player.player);
            if (hit){cellX.style.backgroundColor = 'orange'}
            else (cellX.style.backgroundColor = 'black'); 

            //if
        },

        receiveAttack(x, y, board=this.board){
            if (board.get(`${[x,y]}`).includes(-2)) {return false;} //already hit

            if (board.get(`${[x,y]}`).includes(-1) ){  // if empty
                board.set(`${[x,y]}`, [-2]); 
                return [true, false];
                } 
            else { // hit!
                this.ships[ board.get(`${[x,y]}`) ].hit(); //update hit count
                board.set(`${[x,y]}`, [-2]); // update to hit target
                return [true, true]; 
            }
        },

        createShip(x, y, type, direct, board=this.board){
            if (x+this.lengths[type]>10 && direct =='h') {return false;}
            if (y+this.lengths[type]>10 && direct=='v') {return false;}

            let addLength = {'h': [1,0], 'v': [0,1]};
            let newShip = new Ship(this.lengths[type], 0, direct); 
            for (let i=0; i<this.lengths[type]; i++){ // check
                if (!board.get(`${[x+i*addLength[direct][0],y+i*addLength[direct][1]]}`).includes(-1)){ return false}; //check entire length before build
            }
            for (let i=0; i<this.lengths[type]; i++){
                board.set(`${[x+i*addLength[direct][0],y+i*addLength[direct][1]]}`, `${[x,y]}`); //Set grid as [node, origin]
                }
            this.ships[`${[x,y]}`] = newShip; // create ship: ships[origin] = ship object
                return true; 
            },
        } 
};


function Player(player, num){
    return{player: player,
            num: num,
            turn: false,
            board: new Gameboard(), //creates gameboard
            win: false,
            
            setupBoard(board=this.board){
                let direct = ['v', 'h']; 
                let shipTypes = ['Carrier', 'Battleship', 'Cruiser', 'Destroyer']; 
                for (let i=0; i<shipTypes.length; i++){  //shipTypes.length
                    let x = Math.floor(Math.random()*10); 
                    let y = Math.floor(Math.random()*10); 
                    let z = Math.floor(Math.random()*2); 
                    
                    let build = board.createShip(x,y, shipTypes[i], direct[z]); 
                    if (!build){i--}; //try again if build fails;
                } 
            }, 

            winCondition(board=this.board){
                let result = true;
                Object.keys(board.ships).forEach(function (key){
                    if (![board.ships[key]][0].sunk) {result = false;}
                }) 
                return result; 
                
            },
        
            playerTurn(player1, player2){
                if (!player1.win && !player2.win){
                    player1.turn = !player1.turn;
                    player2.turn = !player1.turn; 
                    
                    if (player2.turn) { setTimeout(function() {
                        let atk = player2.PCattack(player2, player1)
                        while (!atk){ // repeat new tile hit
                            atk = player2.PCattack(player2, player1);
                            }
                        }
                        , 1000); } //Add delay
                }
                if (player1.winCondition()){player1.win = true; console.log('Human wins!')}
                else if (player2.winCondition()) {player2.win = true; console.log('Robots rule!')}; 
                player1.display(player1); 
            },

            PCattack(player1, player2){//input opposite gameboard
                    let x = Math.floor(Math.random()*10); 
                    let y = Math.floor(Math.random()*10);                

                    let hit = player1.board.receiveAttack(x,y);//player2 = HUM 
                    if (!hit){return false}; 
                    player1.board.updateGraph(player1, [x,y], hit[1]); 
                    player2.playerTurn(player2, player1);
                    return true;
                    
            },

            display(player){
                const display = document.getElementById("display"); 
                document.getElementById("display").innerHTML="";
                let displayPlayer = document.createElement('player'); 
                if (!player.win){
                    if (player.turn){displayPlayer.textContent = `${player.player} Turn`}
                    else (displayPlayer.textContent = 'COM Turn' );
                }
                else {displayPlayer.textContent = `${player.player} wins!!`}
                display.append(displayPlayer); 


                    
                },   
        }
}

const computer = new Player('COM', 1);
const human = new Player('HUM', 2); 

human.board.addVertices();
computer.board.addVertices();
human.setupBoard(); 
computer.setupBoard();

human.playerTurn(human, computer);



// computer.playerTurn(computer, human); 
human.board.drawGraph(human, computer);
computer.board.drawGraph(computer, human);




//module.exports = {Gameboard, Ship, Player}; 