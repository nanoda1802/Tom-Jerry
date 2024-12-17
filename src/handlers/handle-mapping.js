import { gameEnd, gameStart } from "./game-handler.js";
import { itemHandler } from "./item-handler.js";
import { moveStageHandler } from "./stage-handler.js";

/* 요청에 맞는 핸들러 찾기 */
// { handlerId : handlerFunction} 형태의 객체 생성
const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  21: itemHandler,
};

export default handlerMappings;
