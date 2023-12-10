import { Db } from "../database/dbConnection.js";
import { Room } from "./Room.js";
import { Socket as socketIO } from "socket.io";
import { SocketHandler } from "./Sockets.js";


export class RoomManager {

    public static rooms: Room[] = [];


    public static joinRoom = async (socket: socketIO,roomID: number,userID: string) => {
        try {
            const query = await Db.getInstance().query(`select * from rooms where id ='${roomID}'`) as Api.Room[];
    
            if(query.length > 0 || query.length < 2){
                if(query[0].isEnded === 1)
                    socket.emit('joinedRoom',false);
                    

                const isRoomCreated = this.rooms.find(e => e.getID() === roomID + "");
                if(isRoomCreated){
                    socket.join(isRoomCreated.getID());
                    isRoomCreated.join(userID);
                    console.log(isRoomCreated);
                }else{
                    this.createRoom(socket,roomID,userID,query[0].maxUsers);
                }
            }else {
                socket.emit('joinedRoom',false);
            }

            
        } catch (err) {
            SocketHandler.disconnectUser(socket);
        }
    }

    public static isUserOnAnyRoom = (userID: string) => {
        return RoomManager.rooms.find(e => {
            const users = e.getPlayers();

            return users.find(j => j === userID);
        });
    }

    public static removeRoom(roomID: string) {
        const index = this.rooms.findIndex(room => room.getID() === roomID);
        if (index !== -1) {
            this.rooms.splice(index, 1);
        }
    }

    public static onClick = async (roomID: number,rowIndex: number,columnIndex: number) => {
        const room = this.rooms.find(e => e.getID() === roomID + "");
        room?.getGame().click(rowIndex,columnIndex);

    }

    private static createRoom = async (socket: socketIO,roomID: number,userID: string,maxUsers: number) => {
        console.log('CreatingRoom')
        const room = new Room(roomID,maxUsers);
        socket.join(roomID + "");
        room.join(userID);

        this.rooms.push(room);
        console.log(this.rooms);
        
    }
}