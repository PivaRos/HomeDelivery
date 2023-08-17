import { json } from "stream/consumers";
import { MongoObject, WSMessage, WSMessageType } from "./../interfaces";
import { WebSocketServer, WebSocket } from "ws";
import { DeliveryModule } from "../deliveryModule";

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
    socket.on("message", async (message) => {
      //validate input
      const ParsedMessage = JSON.parse(message.toString()) as WSMessage;
      switch (ParsedMessage.type) {
        case WSMessageType.ACCEPT_DELIVERY:
          DeliveryModule.AcceptDelivery({
            socket,
            authorization: req.headers.authorization,
          });
          break;
        case WSMessageType.REJECT_DELIVERY:
          DeliveryModule.RejectDelivery({
            socket,
            authorization: req.headers.authorization,
          });
          break;
        default:
          break;
      }
    });
    socket.on("close", async () => {
      const update = await MongoObject.collections.Accounts.findOneAndUpdate(
        { sessionid: req.headers.authorization },
        { $set: { socket: undefined } }
      );
    });
  });
};
