import { Server as NodeServer } from 'node:http';
import { Server,Socket as socketIO } from "socket.io";
import { AuthManager } from '../database/AuthManager.js';
import { Room } from './Room.js';


export class Socket {
    private server: NodeServer;

    private io: Server;

    private rooms: Room[] = [];

    public constructor(server: NodeServer) {
        this.server = server;

        this.io = new Server(server, {cors: {origin: "*"}});

    }
    private initializeSocket = () => {
        this.io.on('connection', async (socket) => {
            // await this.handleAuth(socket);

            socket.on('createRoom',() => {this.createRoom(socket)});
            socket.on('joinRoom',(roomID: string) => {this.joinRoom(roomID)});
        });
    }

    private handleAuth = async (socket: socketIO) =>  {
        const token = socket.request.headers.authorization;
        if(!token) {socket.disconnect(true);return;}
        const isValid = await AuthManager.getInstance().getAuth()?.validateSession(token);
        if(!isValid) {socket.disconnect(true);}
    }
    public emitTestMessage(socket: socketIO, message: string) {
        socket.emit('test',message);
    }
    public createRoom = (socket: socketIO) => {
        const isCreated = this.rooms.find(e => e.getID() === socket.id);
        if(isCreated) {console.log(`Room already created ${socket.id}`);return;}

        
        const newRoom = new Room(this.io,socket.id);
        socket.join(newRoom.getID());
        this.io.to(newRoom.getID()).emit('createdRoom',newRoom.getRoomInfo());
        console.log(newRoom.getID());
        newRoom.join('test');
        this.rooms.push(newRoom);
    }

    public joinRoom = (roomID: string) => {
        const room = this.rooms.find(e => e.getID() === roomID);
        if(!room) {console.log('No room finded');return;};

        room.join('juan');
        console.log(room.getRoomInfo());
    }

    public static createSocket = (server: NodeServer) => {
        const socketInstance = new Socket(server);
        return socketInstance.initializeSocket();
    }

}