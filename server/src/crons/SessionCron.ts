import { ResultSetHeader } from 'mysql2';
import { Db } from '../database/dbConnection.js';


export class SessionCron implements App.CronTask {
    public handle = async () => {
        console.log('Deleting sessions expired...');
        const data = await Db.getInstance().query(`DELETE FROM user_session WHERE idle_expires < ${new Date().getTime()}`) as ResultSetHeader;
        console.log(`${data.affectedRows} rows affected`);
    }
}