import { json } from "stream/consumers";
import { MongoObject } from "./../interfaces";
import { WebSocketServer, WebSocket } from "ws";

export const SocketServer = (MongoObject: MongoObject) => {
  const server = new WebSocketServer({
    port: process.env.WebSocketPORT ? +process.env.WebSocketPORT : 3000,
    host: process.env.WebSocketHOST ? process.env.WebSocketHOST : "0.0.0.0",
    verifyClient: (info, callback) => {
      // ! run authorization logic; need to finish !!
      const sessionid = info.req.headers.authorization;
      const approved = false;
      if (approved) {
        // ! approve connection
        callback(true);
      } else {
        // ! reject connection
        callback(false, 401, "Unauthorized");
      }
    },
  });

  server.on("connection", (socket) => {
    socket.send(
      JSON.stringify({
        message: "Hello World!",
      })
    );
    console.log("WebSocketConnection is open");

    socket.on("message", (message) => {
      socket.send(JSON.stringify({ messageReceived: true }));
    });
    socket.on("close", () => {
      console.log("WebSocketConnection is closed");
    });
  });
};
