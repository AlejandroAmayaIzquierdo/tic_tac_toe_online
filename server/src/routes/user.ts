import express from "express";
import { AuthManager } from "../database/AuthManager.js";
import { logInController, signupController } from "../controllers/userController.js";
import { getUser } from "../services/userServices.js";

const userRoute = express.Router();


userRoute.post("/signup", async (req, res) => {
	try {
		const session = await signupController(req,res);
		const response: Api.Response = {
				status: 1,
				result: session
		}
		return res.status(202).send(response);
	} catch (e) {
		const error = e as Api.Error;
		return res.status(error.code).send({status : 0 , error: error.message});
	}

});

userRoute.post('/login', async (req,res) => {
	try {
		const session = await logInController(req,res);
		const response: Api.Response = {
			status: 1,
			result: session
		}
		return res.status(202).send(response);
	} catch (e) {
		const error = e as Api.Error;
		return res.status(error.code).send({status : 0 , error: error.message});
	}
});

userRoute.post('logOut', async (req,res) => {
	//TODO that's it make it
});

userRoute.get('/currentUser', async (req,res) => {
try {
	const auth = req.headers.authorization;
	if(!auth)
		return res.status(500).send({status : 0 , error: "Internal Server Error"});
	const session = await AuthManager.getInstance().getAuth()?.validateSession(auth) as Lucia.Session;
	if(!session)
		return res.status(500).send({status : 0 , error: "Unauthorized User"});
	return res.status(200).send({status : 1 , result: session.user});
} catch (err) {
	return res.status(500).send({status : 0 , error: err});
}
});

export default userRoute;