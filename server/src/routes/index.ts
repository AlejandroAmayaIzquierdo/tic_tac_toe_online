import express from "express";
import userRoute from "./user.js";
import gameRoute from "./game.js";


const Routes = express.Router();

Routes.use('/user',userRoute);
Routes.use('/game',gameRoute);

export default Routes;