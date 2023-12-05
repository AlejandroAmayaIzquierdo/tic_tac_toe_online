import { Server } from "socket.io";


export class Room {
    private id: string;

    private io: Server;

    private playersIDs: string[] = [];

    public constructor(io: Server,roomID: string){
        this.id = `Room:${roomID}`;
        this.io = io;

        // this.socket.join(`Room:${this.id}`);
        // this.server.to(`Room:${newRoom.getID()}`);
    }

    public join = (userID: string) => {
        if(this.playersIDs.find(e => e === userID)) {
            console.log('user Already in');
            return;
        }
        this.playersIDs.push(userID);
    }

    public getID = (): string => this.id;
    public getRoomInfo = () => {return {id: this.id,players: this.playersIDs}};
}