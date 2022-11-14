function Gameboard( ){
    return {size: size,
        hits: hits,
        sunk: sunk,
        hit(){ 
            hits+= 1;  
        }, 

        createShip(){
            

        }



        isSunk(hits= this.hits, size=this.size){
            if (hits==size){
                sunk = true; return true; 
            } else {sunk = false; return false }; 
        }
    };


}

module.exports = Gameboard; 