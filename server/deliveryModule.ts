import { WebSocket } from "ws";

interface PropsDeliverySocket {
  socket: WebSocket;
  authorization?: string;
}

export const DeliveryModule = {
  AcceptDelivery: async ({ socket, authorization }: PropsDeliverySocket) => {
    console.log("this is acception :" + authorization);
  },
  RejectDelivery: async ({ socket, authorization }: PropsDeliverySocket) => {
    console.log("this is rejection :" + authorization);
  },
};
