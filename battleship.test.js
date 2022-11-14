const battleship = require('./ship');

let testShip = battleship.Ship(1, 0, false); 
let board = battleship.Gameboard();
board.addVertices(); 
board.createShip(1,1,'Battleship', 'h'); 

test('test sinking', ()=> {
    expect( testShip.isSunk(1,0)).toBe(false); 
});

test('test build on edge', ()=> {
    expect( board.createShip(10,1,'Battleship','h')).toBe(false); 
});

// test('receive target miss', () => {
//     expect( board.receiveAttack(8,1)).toStrictEqual(false);
// });

// test('receive target hit', () => {
//     expect( board.receiveAttack(1,1)).toStrictEqual(true);
// });
