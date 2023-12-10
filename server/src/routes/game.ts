import express from "express";
import { Db } from "../database/dbConnection.js";
import { AuthManager } from "../database/AuthManager.js";
import { ResultSetHeader } from "mysql2";
import crypto from "crypto";


const gameRoute = express.Router();

gameRoute.post('/searchGame', async (req,res) => {
    //TODO make it right
    try {
        const auth = req.headers.authorization;
        if(!auth)
            throw new Error('unauthorized User');
    
        const db = Db.getInstance();
    
        const {user} = await AuthManager.getInstance().getAuth()?.validateSession(auth) as Lucia.Session;
        const isUserOnActiveRoom = await db.query(`SELECT * FROM rooms WHERE isEnded=0 AND players LIKE '%${user.userId}%'`) as Api.Room[];

        if(isUserOnActiveRoom.length > 0){
            const players = isUserOnActiveRoom[0].players.split(',');
            const response: Api.Response = {
                status: 1,
                result: {
                    roomId: isUserOnActiveRoom[0].id,
                    currentUsers: players
                }
            };
            return res.status(202).send(response);
        }

        //Search for room.
        const activeRooms = await db.query(`SELECT * FROM rooms WHERE isActive=0 AND isEnded=0`) as Api.Room[];
        console.log("Searching for room");
        if (activeRooms.length > 0) {
            //TODO add like search algoritm to play with similar users level

            
            const players = activeRooms[0].players.split(',');
            if(!players.find(e => e === user.userId)){
                players.push(user.userId);
                await Db.getInstance().query(`UPDATE rooms SET players="${players.join(',')}",isActive=1 WHERE id='${activeRooms[0].id}'`);
            }
            const response: Api.Response = {
                status: 1,
                result: {
                    roomId: activeRooms[0].id,
                    currentUsers: players
                }
            };
            return res.status(202).send(response);
        }

        console.log('Creating room');

        //Create room.
        const hash = crypto.createHash('sha256');

        hash.update(user.userId + (new Date()).getTime());
            
        const roomId = hash.digest('base64url');
            
        await db.query(`INSERT INTO rooms (id,players,maxUsers,isActive,isEnded) VALUES ("${roomId}","${user.userId}",2,0,0);`) as ResultSetHeader;
        const response: Api.Response = {
            status: 1,
            result: {
                roomId: roomId,
                currentUsers: [user.userId]
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        const response: Api.Response = {
            status: 0,
            error: error
        }
        return res.status(500).send(response);

    }

});

export default gameRoute;