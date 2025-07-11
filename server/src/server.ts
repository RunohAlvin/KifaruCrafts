const express = require("express");
import type { Response, Request } from "express";
import { config } from "dotenv";

config()

//variables
const PORT = process.env.PORT || 5000;

//create app
const app = express();

//use meddilesraw
app.use(express.json())

//run db connectio
import { dbConnect } from "./db/dbconnect";
dbConnect();


//products
//app.use("/products", productRouter)
// users
//ppapp.use("/users", userRouter)
//routes
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Hello from server app" });
});
//start server
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

