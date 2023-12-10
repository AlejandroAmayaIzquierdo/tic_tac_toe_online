import type { RequestEvent } from "@sveltejs/kit"
import { User } from "../services/user";

export const authenticateUser = async (event: RequestEvent) => {
    try {
        // get the cookies from the request
        const { cookies } = event

        // get the user token from the cookie
        const userToken = cookies.get("auth");

        // if the user token is not valid, return null
        // this is where you would check the user token against your database
        // to see if it is valid and return the user object
        const user = await User.getCurrentUser(userToken);
        if(user)
            return {user,userToken};

        return null
    } catch (error) {
        return null;
    }

}