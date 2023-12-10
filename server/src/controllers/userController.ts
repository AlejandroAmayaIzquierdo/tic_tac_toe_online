﻿import { Request, Response } from "express";
import { createSession, createUser, getUser } from "../services/userServices.js";


export const signupController =  async (req: Request, res: Response): Promise<Lucia.Session> => {
    try {
        const { userName, password } = req.body as unknown as Api.RegisterUserBody;
    
        if (typeof userName !== "string" || userName.length < 4 || userName.length > 31)
            throw { message: "Invalid username", code: 400 };
        if (typeof password !== "string" || password.length < 6 || password.length > 255)
            throw { message: "Invalid password", code: 400 };

        const user = await createUser('id',userName,password);
        const session = await createSession(user.userId);
        if(!session)
            throw { message: "Error while creating the session", code: 402 };
        return session;
    } catch (error) {
        throw { message: error, code: 500 };
    }

}

export const logInController = async (req: Request, res: Response) : Promise<Lucia.Session> => {
    try {
        const { userName, password } = req.body as Api.RegisterUserBody;

        const user = await getUser('id',userName,password);
        const session = await createSession(user.userId);

        if(!session)
            throw { message: "Error while LogIn the session", code: 402 };

        return session;
    } catch (error) {
        throw { message: error, code: 500 };
    }
}