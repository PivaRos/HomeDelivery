import { json } from "stream/consumers";
import { MongoObject } from "./../interfaces";
import { WebSocketServer, WebSocket } from "ws";

export const SocketServer = (MongoObject: MongoObject) => {
  const server = new WebSocketServer({
    port: process.env.WebSocketPORT ? +process.env.WebSocketPORT : 3000,
    host: process.env.WebSocketHOST ? process.env.WebSocketHOST : "0.0.0.0",
    verifyClient: async (info, callback) => {
      const sessionid = info.req.headers.authorization;
      const Account = await MongoObject.collections.Accounts.findOne({
        sessionid: sessionid,
      });
      if (Account) {
        // * approve connection
        callback(true);
      } else {
        // ! reject connection
        callback(false, 401, "Unauthorized");
      }
    },
  });

  server.on("connection", (socket, req) => {
    MongoObject.collections.Accounts.findOneAndUpdate(
      { sessionid: req.headers.authorization },
      { $set: { socket } }
    );
    socket.on("message", (message) => {});
    socket.on("close", async () => {
      const update = await MongoObject.collections.Accounts.findOneAndUpdate(
        { sessionid: req.headers.authorization },
        { $set: { socket: undefined } }
      );
    });
  });
};
