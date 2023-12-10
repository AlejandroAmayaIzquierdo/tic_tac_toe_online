import { Db } from "../database/dbConnection.js";
import { Game } from "../game/Game.js";
import { Application } from "../index.js";
import { RoomManager } from "./RoomManager.js";


export class Room {
    private id: string;

    private playersIDs: string[] = [];

    private maxPlayers: number = 2;

    private game: Game;

    private interval: NodeJS.Timeout | undefined;

    public constructor(roomID: number,maxUsers?: number,players?: string[]){
        this.id = `${roomID}`;
        if(maxUsers)
            this.maxPlayers = maxUsers;

        if(players)
            this.playersIDs = [...this.playersIDs, ...players];
        this.game = new Game();
    }

    public join = async (userID: string) => {
        if(this.playersIDs.length < this.maxPlayers && !this.playersIDs.find(e => e === userID))
            this.playersIDs.push(userID);
        Application.io.to(this.id).emit('joinedRoom',true);


        if(this.playersIDs.length === this.maxPlayers){
            await Db.getInstance().query(`UPDATE rooms SET players="${this.playersIDs.join(',')}",isActive=1 WHERE id='${this.id}'`);
            this.game.startGame();
            this.handle();
        }
    }

    public handle = () => {
        this.interval = setInterval(async () => {
            Application.io.to(this.id).emit('updateRoom',this.game.getGameData());
            if(this.game.getGameData().done){
                const now = new Date();
                const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
                await Db.getInstance().query(`UPDATE rooms SET players="${this.playersIDs.join(',')}",isActive=0,isEnded=1,endedAt="${formattedDate}" WHERE id="${this.id}"`);
                this.done();
            }
        },1000);
    }

    public done = () => {
        if(this.interval)
            clearInterval(this.interval);
        RoomManager.removeRoom(this.id);
    }

    public getID = () => this.id;
    public getGame = () => this.game;
    public getPlayers = () => this.playersIDs;
}