import { Cookies } from "../util/Cookies";



export class User {
    public static getCurrentUser = async (token?: string): Promise<App.User | null> => {
        let authToken = token;
        if(!token){
            authToken = Cookies.getCookie('auth');
            if(!authToken) return null;
        }

        const resp = await fetch('http://127.0.0.1:3000/user/currentUser', {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": authToken ?? ""
            }
        });

        const data = await resp.json() as Api.StandardResp;
        
        if(data.status === 0){
            return null;
        }

        return data.result as App.User;
    }
}