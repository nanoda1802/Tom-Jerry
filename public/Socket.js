import { CLIENT_VERSION } from "./Constants.js";
import { io } from "socket.io-client"; // 클라이언트용 socket.io

/* 소켓 연결 초기화 */
const socket = io("http://localhost:3000", {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

/* 클라이언트의 고유 ID 저장할 변수 생성 */
let userId = null;

/* 서버에서 "connection" 메세지를 받았을 때 실행할 로직 */
socket.on("connection", (data) => {
  console.log("connection: ", data); // [1] 서버에서 받은 데이터 출력
  userId = data.uuid; // [2] 서버가 만들어준 uuid를 유저 ID에 저장
});

/* 서버에서 "response" 메세지를 받았을 때 실행할 로직 */
socket.on("response", (data) => {
  console.log("response : ", data);
});

/* 클라이언트에서 서버로 이벤트 보내기 위한 함수 */
// [1-1] 이벤트에 맞는 담당 핸들러 식별 위해 handlerId 매개변수 받고
// [1-2] 이벤트에 대한 정보 알려주기 위해 payload 매개변수 받음
const sendEvent = (handlerId, payload) => {
  // [2] 서버에게 "event" 메세지를 보냄, helper.js 파일의 handleEvent 함수가 이를 받아 처리
  socket.emit("event", {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
