import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { getHigh } from "../models/high-score-model.js";
import { createItems } from "../models/item-model.js";
import { createStage, getStage, setStage } from "../models/stage-model.js";
import { getUser, removeUser } from "../models/user-model.js";
import handlerMappings from "./handle-mapping.js";

/* 연결 중단 사용자 처리 */
export const handleDisconnect = (socket, uuid) => {
  // [1] 접속 중 사용자 목록에서 해당 사용자 제거
  removeUser(socket.id);
  // [2] 제거된 사용자와 접속 중인 잔여 사용자 목록 출력
  console.log(`User disconnected : ${socket.id}`);
  console.log(`Current users : `, getUser());
};

/* 신규 연결 사용자 처리 */
export const handleConnection = (socket, uuid) => {
  // [1] 연결된 사용자의 스테이지와 아이템 정보 생성, 전달할 데이터 테이블 get
  const assets = getGameAssets();
  createStage(uuid);
  createItems(uuid);
  // [2] 연결된 사용자의 UUID와 SocketID, 접속 중인 전체 사용자 목록 출력
  console.log(`New User connected : ${uuid} with socket ID ${socket.id}`);
  console.log(`Current users : `, getUser());
  // [3] 연결된 사용자에게 부여된 UUID 알려주고, 데이터 테이블 전달
  socket.emit("connection", { uuid, assets });
};

/* 이벤트 처리 */
// 클라이언트에게 받은 이벤트를 처리하고, 적절한 응답을 특정 클라나 모든 클라에게 전송
export const handleEvent = (io, socket, data) => {
  // [1] 클라이언트 버전 체크, 서버에서 지원하는 버전 목록에 있는지
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit("response", { status: "fail", message: "Client version mismatch" });
    return;
  }
  // [2] 핸들러 체크, 핸들러 ID에 맞는 핸들러 함수가 존재하는지
  // 손님이 특정 요청을 했을 때, 그 전담 직원을 찾아주는 느낌
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit("response", { status: "fail", message: "Handler not found" });
    return;
  }
  // [3] 핸들러 실행 및 응답
  // 전담 직원이 처리 결과를 손님에게 알려주는 느낌
  const response = handler(data.userId, data.payload);
  // [3-1] 클라이언트에 이벤트 처리 결과 응답
  // 응답에 broadcast 속성이 있다면, 모든 클라이언트에게 응답을 전달
  if (!response.broadcast) {
    socket.emit("response", { ...response, handlerId: data.handlerId });
  } else {
    io.emit("response", { ...response, handlerId: data.handlerId });
    return;
  }
};
