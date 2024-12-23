import { Server as SocketIO } from "socket.io";
import registerHandler from "../handlers/register-handler.js";

/* [1] Socket.IO 초기화 */
const initSocket = (server) => {
  /* [2] 서버에 SocketIO 연결 */
  const io = new SocketIO(); // 새 SocketIO 인스턴스 생성
  io.attach(server); // 서버에 io를 붙여 실시간 통신이 가능하게끔 만듦
  /* [3] register 핸들러 실행 */
  registerHandler(io);
};

export default initSocket;
