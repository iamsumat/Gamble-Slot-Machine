// 1. Deposit some money.
// 2. Determine number of lines to bet on.
// 3. Collect a bet amount for the slot machine.
// 4. Roll the slot machine. --
// 5. Check if user won.
// 6. Give user their winnings.
// 7. Play again.

const prompt = require("prompt-sync")();    // import with node

const ROWS = 3;                             // global variables are in ALL CAPS
const COLS = 3;

const SYMBOLS_COUNT = {                     // object = keys mapped with values
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}                                           // these are the symbols we have in each column (reel) to be randomly selected when the slot machine runs.

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}                                           // values of each of the symbols (points); multiplier of each symbol for the bet


const deposit = () => {
    
    while(true) {                           // meaning forever
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount)    // parseFloat function to convert string to integer

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.")
        } else {
            return numberDepositAmount;
        }
    }
}

const getNumberofLines = () => {
    while(true) {           // meaning forever
        const lines = prompt("Enter number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines)    // parseFloat function to convert string to integer

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines entered, try again.")
        } else {
            return numberOfLines;
        }
    }
}


const getBet = (balance, lines) => { // need to pass a balance when calling the function, it will be used to determine what is max bet.
    while(true) {           // meaning forever
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet)    // parseFloat function to convert string to integer

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance/lines) {
            console.log("Invalid bet, try again.")
        } else {
            return numberBet;
        }
    }
}


const spin = () => {
    const symbols = []; // array = reference datatype
    for (const[symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for(let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([])
        const reelSymbols = [...symbols];           // to remove elements in one reel to be used again; but get the elements again in 2nd reel so we copying it
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // remove the element from this reelSymbols
        }
    }

    return reels;
}

const transpose = (reels) => {
    const rows = [];

    for (let i=0; i < ROWS; i++) {
        rows.push([]);
        for (let j=0; j < COLS; j++) {
            rows[i].push(reels[j][i]); // column first then that column's corresponding row
        }
    }

    return rows
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        
        for(const symbol of symbols) {          // loop through every symbol that we have
            if(symbol != symbols[0]) {           // each of them should be same as the first symbol = all are same
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }

    return winnings;
}
 

const game = () => {
    let balance = deposit(); // balance is essentially what they deposit initally // let used because it lets you change the value of the thing
    
    while(true){
        console.log("\n\nYou have a balance of $" + balance)
        const numberOfLines = getNumberofLines(); // const used because the value is constant and cannot be changed again
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin()
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines)
        balance += winnings;
        console.log("\nYou won, $" + winnings.toString())

        if (balance <= 0) {
            console.log("\nYou ran out of money!")
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n)")
        if (playAgain != "y") break;              // one line if statement no need for {}
    }
}

game();

