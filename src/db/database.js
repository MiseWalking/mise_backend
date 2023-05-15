import Mongoose from "mongoose";
import { config } from "../../config.js";

export const connectDB = async () => {
  return Mongoose.connect(config.dbHost);
};

export function useVirtualId(schema) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtuals: true });
  schema.set("toOject", { virtuals: true });
}
