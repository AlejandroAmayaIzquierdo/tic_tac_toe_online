import { Server as ServerIO,Socket as socketIO } from "socket.io";
import { AuthManager } from "../database/AuthManager.js";
import { RoomManager } from "./RoomManager.js";
import { Application } from "../index.js";


export class SocketHandler {

    public static handleConnections = (io: ServerIO) => {
        io.on('connection', async (socket) => {
            await this.handleAuth(socket);

            socket.on('joinRoom', async (roomID: number) => {
                const token = socket.request.headers.authorization;
                if(!token) {this.disconnectUser(socket); return;}
                const session = await AuthManager.getInstance().getAuth()?.validateSession(token) as Lucia.Session;
                RoomManager.joinRoom(socket,roomID,session.user.userId);
            });

            socket.on('onClick', async (data: {roomID: number,rowIndex: number,columnIndex: number}) => {
                console.log('Clicket at ' + data.rowIndex + " " + data.columnIndex);
                const token = socket.request.headers.authorization;
                if(!token) {this.disconnectUser(socket); return;}
                RoomManager.onClick(data.roomID,data.rowIndex,data.columnIndex);
            });

            socket.on('disconnect',async() => {
                const token = socket.request.headers.authorization;
                if(!token)  return;
                const session = await AuthManager.getInstance().getAuth()?.validateSession(token) as Lucia.Session;
                console.log("User Disconnected");
                const isUserOnRoom = RoomManager.isUserOnAnyRoom(session.user.userId);

                if(isUserOnRoom){
                    Application.io.to(isUserOnRoom.getID()).emit('disconnectedUser', null);
                    isUserOnRoom.done();
                }
            });
        });
    }

    private static handleAuth = async (socket: socketIO) =>  {
        const token = socket.request.headers.authorization;
        if(!token) { this.disconnectUser(socket); return;}


        const isValid = await AuthManager.getInstance().getAuth()?.validateSession(token);
        if(!isValid)
            this.disconnectUser(socket);
    }

    public static disconnectUser = (socket: socketIO) => {
        console.log("Unauthorize user!");
        socket.emit('error', {status: 0, message: "Unauthorize user!"});
        socket.disconnect(true);
    }
}