//connect to mongodb

import mongoose from "mongoose";
import app from "./server.js";
import endpoints from "express-list-endpoints"
let {MONGO_URI, PORT} = process.env

mongoose.connect(MONGO_URI!).then(() => console.log("🌚 The server has successfully connected to mongodb."))
  .then(() => {
    app.listen(PORT, () => {
      console.log("🌚 Server has started on port " + PORT + "!" + " \n🌝 The server has these endpoints: \n");
      console.table(endpoints(app));
    });
  })
  .catch((e) => {
    console.log("❌ CONNECTION FAILED! Error: ", e);
  });