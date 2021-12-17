import mongoose from "mongoose";

export interface IPlugin {
  /**
   * 插件id  唯一 同时作为cli的name
   */
  id: string;
  /**
   * 插件名称
   */
  name: string;
  /**
   * 代码
   */
  sourceCode: string;
}

export const Plugin = mongoose.model<IPlugin>(
  "Plugin",
  new mongoose.Schema({
    id: {
      type: String,
      unique: true,
    },
    name: String,
    sourceCode: String,
  })
);
