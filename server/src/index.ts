import Express,{Express as ExpressType} from "express";
import { Server as ServerIO } from "socket.io";
import cors from "cors";
import logger from "morgan";
import dotenv from 'dotenv';


import { createServer,Server as NodeServer } from 'node:http';

import { CronManager } from "./CronManager.js";
import { Db } from "./database/dbConnection.js";
import { AuthManager } from "./database/AuthManager.js";
import Routes from "./routes/index.js";
import { SocketHandler } from "./socket/Sockets.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;

export const {DB_HOST,DB_USER,DB_PASS,BD_DATABASE_NAME} = process.env;

export class Application {
    private app: ExpressType;
    private server: NodeServer;

    public static io: ServerIO;
    
    public constructor() {
        this.app = Express();
        this.server = createServer(this.app);
        Application.io = new ServerIO(this.server, {cors: {origin: "*"}});

        this.InitializeApp();
        this.InitializeRoutes();
    }

    private InitializeApp = () => {
        this.app.disable('x-powered-by');
        this.app.use(cors());
        this.app.use(logger('dev'));
        this.app.use(Express.json());
    }

    private InitializeRoutes = () => {
        this.app.use('/',Routes);
    }

    public handle = () => {
        Db.getInstance();
        CronManager.getInstance();
        AuthManager.getInstance();

        SocketHandler.handleConnections(Application.io);

        this.server.listen(PORT,() => {
            console.log(`Server listening to ${PORT} port 🚀`);
        })
    }
}

const app = new Application();

app.handle();