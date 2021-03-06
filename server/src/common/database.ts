import mongoose, { Mongoose } from "mongoose";

import { getConfig } from "./config";

const state = {
  conn: <Mongoose | null>null,
};


export async function initDatabase() {
  const config = getConfig();
  if (!config.database) {
    throw new Error("database 未配置");
  }
  

  state.conn = await mongoose.connect(config.database);
  mongoose.set("overwriteModels",true)


}

export function getConnection() {
  return state.conn!;
}



const mongo = require("mongoose")
const MoyuCounter = mongo.model("MoyuCounter", new mongo.Schema({
  room_wxid:String,
  wxid:String,
  day:String,
  count:Number
}))

