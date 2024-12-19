import { getGameAssets } from "../init/assets.js";
import { getCoins, getItems, getStars, setItems } from "../models/item-model.js";

export const itemHandler = (userId, payload) => {
  // 페이로드 : itemId, stage, score, timestamp
  const { itemId, stage, score, timestamp: clientGetTime } = payload;
  // [1] 아이템 에셋과, 서버의 아이템 획득 정보를 가져옴
  const itemTable = getGameAssets().items.data;
  const serverItems = getItems(userId);
  // [2] 획득 스테이지가 적합한지 검증
  if (stage < itemTable[itemId - 1].stage) {
    return { status: "fail", message: "지금 스테이지에서 획득할 수 없는 아이템이에요!!" };
  }
  // [3] 획득 점수가 적합한지 검증
  if (score !== itemTable[itemId - 1].score) {
    return { status: "fail", message: "획득 점수가 이상해요!!" };
  }
  // [4] 획득 주기가 적합한지 검증 (두번째 획득부터 검사!!) (프레임 차이 고려해서 오차 0.3초 정도)
  const itemInterval = itemTable[itemId - 1].interval;
  const starId = 6;
  const serverCoins = getCoins(userId); // 코인 검증 위한 서버 기록 가져옴
  const serverStars = getStars(userId); // 별 검증 위한 서버 기록 가져옴
  // [4-1] 코인 획득 주기
  if (serverCoins.length > 0 && itemId !== starId) {
    const coinGap = clientGetTime - serverCoins[serverCoins.length - 1].timestamp;
    if (coinGap < itemInterval - 300) {
      return { status: "fail", message: "코인을 너무 자주 먹는데요?!" };
    }
    // [4-2] 스타 획득 주기
  } else if (serverStars.length > 0 && itemId === starId) {
    const starGap = clientGetTime - serverStars[serverStars.length - 1].timestamp;
    if (starGap < itemInterval - 300) {
      return { status: "fail", message: "별을 너무 자주 먹는데요?!" };
    }
  }
  // [5] 모든 검증 통과하면 서버에 기록 후 성공 응답
  setItems(userId, itemId, Date.now());
  return { status: "success", message: "올바른 획득입니다!!" };
};
