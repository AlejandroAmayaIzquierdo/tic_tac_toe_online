
export class Game {

    private board = [['', '', ''], ['', '', ''], ['', '', '']];
    private turn = 'X';

    private done = false;
    private started = false;

    private winner: string | null = null;
    

    public startGame = () => {
        this.started = true;
    }

    public click = (rowIndex: number, columnIndex: number) => {
        if(!this.started) return;

        if (!this.done && !this.board[rowIndex][columnIndex]) {
            this.board[rowIndex][columnIndex] = this.turn;
            this.turn = this.turn === "X" ? "O" : "X";


            const winner = this.checkWin(this.board);

            if(winner){
                this.done = true;
                this.winner = this.turn;
            }else if(this.isBoardFull(this.board)){
                this.done = true;
            }
        }
    }

    public checkWin = (board: string[][]): string | undefined => {
        for (let row = 0; row < 3; row++) {
            if (
                board[row][0] === board[row][1] &&
                board[row][0] === board[row][2]
            ) {
                return board[row][0];
            }
        }
    
        for (let column = 0; column < 3; column++) {
            if (
                board[0][column] === board[1][column] &&
                board[0][column] === board[2][column]
            ) {
                return board[0][column];
            }
        }
    
        if (board[0][0] === board[1][1] && board[0][0] == board[2][2]) {
            return board[0][0];
        }
    
        if (board[0][2] === board[1][1] && board[0][2] == board[2][0]) {
            return board[0][2];
        }
        return undefined;
    }

    public isBoardFull = (board: string[][]): boolean => {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                if (!board[row][column]) {
                    return false;
                }
            }
        }
    
        return true;
    }

    public getGameData = () => {return {
        board: this.board,
        turn: this.turn,
        done: this.done,
        winner: this.winner
    }};
}