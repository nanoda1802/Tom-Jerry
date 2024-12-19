import { addUser } from "../models/user-model.js";
import { v4 as uuidV4 } from "uuid";
import { handleConnection, handleDisconnect, handleEvent } from "./helper.js";
import { getHigh } from "../models/high-score-model.js";

/* 사용자 연결 관리 */
const registerHandler = (io) => {
  // "connection" : 신규 사용자 접속 시 클라이언트가 보내는 메세지
  // 매개변수 socket : 사용자 식별 전화선같은 것
  io.on("connection", (socket) => {
    // [1] 서버에서 사용자에게 고유 이름표 UUID 부여
    const userUUID = socket.handshake.query.userId === "null" ? uuidV4() : socket.handshake.query.userId;
    // [2] 서버의 접속자 목록에 이 사용자 등록 (userUUID와 socket.id로 식별)
    addUser({ uuid: userUUID, socketId: socket.id });
    // [3] 사용자 접속 관련 초기 설정 (스테이지 만들고, UUID 알려줌)
    handleConnection(socket, userUUID);
    // [4] 접속 유저가 최고 기록 보유자면 인사 보냄
    const bestGamer = getHigh().uuid;
    if (userUUID === bestGamer) {
      socket.emit("response", { message: "안녕하세요? 서버 최강의 유저!!" });
    }
    /* 접속 중 이벤트 처리 */
    // 클라이언트에게 "event"란 메세지를 받았을 때 서버가 처리할 로직
    socket.on("event", (data) => handleEvent(io, socket, data));
    /* 사용자 연결 중단 처리 */
    // 클라이언트에게 "disconnect"란 메세지를 받았을 때 서버가 처리할 로직
    socket.on("disconnect", () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
