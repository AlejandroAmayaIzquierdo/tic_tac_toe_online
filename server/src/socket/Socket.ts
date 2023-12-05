import { Server as NodeServer } from 'node:http';
import { Server,Socket as socketIO } from "socket.io";
import { AuthManager } from '../database/AuthManager.js';
import { Room } from './Room.js';
import { Session } from 'lucia';


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
            console.log("An user has connected");
            await this.handleAuth(socket);


            //TODO make it as rest api
            // socket.on('createRoom',() => {this.createRoom(socket)});


            socket.on('joinedRoom',(roomID: string) => {this.joinRoom(roomID)});

            //TODO only make it events from the game. createRoom could be made as rest api.
        });
    }

    private handleAuth = async (socket: socketIO) =>  {
        const token = socket.request.headers.authorization;
        if(!token) { this.disconnectUser(socket); return;}


        const isValid = await AuthManager.getInstance().getAuth()?.validateSession(token);
        console.log(isValid);
        if(!isValid)
            this.disconnectUser(socket);
    }

    private disconnectUser = (socket: socketIO) => {
        console.log("Unauthorize user!");
        socket.emit('error', {status: 0, message: "Unauthorize user!"});
        socket.disconnect(true);
    }
    public emitTestMessage(socket: socketIO, message: string) {
        socket.emit('test',message);
    }
    public createRoom = async (socket: socketIO) => {
        //TODO change it do api rest. // Like POST /game/searchRoom
        try {
            console.log("test");
            const isCreated = this.rooms.find(e => e.getID() === socket.id);
            if(isCreated) {console.log(`Room already created ${socket.id}`);return;}
    
            
            const newRoom = new Room(this.io,socket.id);
            socket.join(newRoom.getID());
            this.io.to(newRoom.getID()).emit('createdRoom',newRoom.getRoomInfo());
            console.log(newRoom.getID());
            const auth = socket.request.headers.authorization;
            if(!auth) {this.disconnectUser(socket); return;}
            const session: Session = await AuthManager.getInstance().getAuth()?.validateSession(auth);
            if(!session) {this.disconnectUser(socket); return;}
            const user = session.user;
            newRoom.join(user);
            this.rooms.push(newRoom);
            
        } catch (error) {
            console.log(error);
        }
    }

    public joinRoom = (roomID: string) => {

        //TODO check if user is allow to enter on the room. ej. check users limit of the room, etc.
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