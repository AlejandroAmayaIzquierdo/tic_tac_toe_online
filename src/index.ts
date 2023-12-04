import Express,{Express as ExpressType} from "express";
import cors from "cors";
import logger from "morgan";
import dotenv from 'dotenv';


import { createServer,Server as NodeServer } from 'node:http';
import v1Routes from "./routes/v1/index.js";
import userRoute from "./routes/user/user.js";

import { CronManager } from "./CronManager.js";
import { Socket } from "./socket/Socket.js";
import { Db } from "./database/dbConnection.js";
import { AuthManager } from "./database/AuthManager.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;

export const {DB_HOST,DB_USER,DB_PASS,BD_DATABASE_NAME} = process.env;

class Application {
    private app: ExpressType;
    private server: NodeServer;

    public constructor() {
        this.app = Express();
        this.server = createServer(this.app);

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
        this.app.use('/v1',v1Routes);

        this.app.use('/user',userRoute);
    }

    public handle = () => {
        Db.getInstance();
        CronManager.getInstance();
        AuthManager.getInstance();

        Socket.createSocket(this.server);

        this.server.listen(PORT,() => {
            console.log(`Server listening to ${PORT} port 🚀`);
        })
    }
}

const app = new Application();

app.handle();