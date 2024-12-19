import { CLIENT_VERSION } from "./Constants.js";

/* 소켓 연결 초기화 */
const socket = io("http://3.37.128.71:3001", {
  query: {
    clientVersion: CLIENT_VERSION,
    userId: localStorage.getItem("myUUID"),
  },
});

/* 클라이언트 필요 정보 저장할 변수 생성 */
let userId = null;
let stageTable = null;
let itemTable = null;

/* 서버에서 "connection" 메세지를 받았을 때  */
socket.on("connection", (data) => {
  // [1] 서버에서 받은 데이터 출력
  console.log("connection: ", data);
  // [2] 서버에서 받은 정보들 변수에 할당
  userId = data.uuid;
  stageTable = data.assets.stages;
  itemTable = data.assets.items;
  // [3] localStorage의 uuid 최신화
  localStorage.setItem("myUUID", userId);
});

/* 서버에서 "response" 메세지를 받았을 때 */
socket.on("response", (data) => {
  console.log("response : ", data);
});

/* 클라이언트에서 서버로 이벤트 보내기 위한 함수 */
// [1-1] 이벤트에 맞는 담당 핸들러 식별 위해 handlerId 매개변수 받고
// [1-2] 이벤트에 대한 정보 알려주기 위해 payload 매개변수 받음
const sendEvent = (handlerId, payload) => {
  return new Promise((resolve, reject) => {
    socket.emit("event", {
      userId,
      clientVersion: CLIENT_VERSION,
      handlerId,
      payload,
    });
    // [2] 해당 메세지에 대한 응답 바로 받는 일회성 소켓
    socket.once("response", (data) => {
      if (data.handlerId === handlerId) {
        resolve(data);
      } else {
        reject(new Error("응답이 요상해요?!"));
      }
    });
  });
};

export { sendEvent, stageTable, itemTable };
