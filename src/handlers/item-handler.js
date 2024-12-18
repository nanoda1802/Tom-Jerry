import { getGameAssets } from "../init/assets.js";
import { getCoins, getItems, getStars, setItems } from "../models/item-model.js";

export const itemHandler = (userId, payload) => {
  // 페이로드 : itemId, stage, score, timestamp
  // [1] 아이템 에셋과, 서버의 아이템 획득 정보를 가져옴
  const { items } = getGameAssets();
  const myItems = getItems(userId);
  // [2] 획득 스테이지가 적합한지 검증
  if (payload.stage < items.data[payload.itemId - 1].stage) {
    return { status: "fail", message: "지금 스테이지에서 획득할 수 없는 아이템이에요!!" };
  }
  // [3] 획득 점수가 적합한지 검증
  if (payload.score !== items.data[payload.itemId - 1].score) {
    return { status: "fail", message: "획득 점수가 이상해요!!" };
  }
  // [4] 획득 주기가 적합한지 검증 (두번째 획득부터 검사!!)
  if (myItems[0] && payload.itemId !== 6) {
    const myCoins = getCoins(userId); // 코인 검증 위한 정보 가져옴
    if (myCoins[0] && payload.timestamp - myCoins[myCoins.length - 1].timestamp < items.data[payload.itemId - 1].interval) {
      return { status: "fail", message: "코인을 너무 자주 먹는데요?!" };
    }
  } else if (myItems[0] && payload.itemId === 6) {
    const myStars = getStars(userId); // 별 검증 위한 정보 가져옴
    if (myStars[0] && payload.timestamp - myStars[myStars.length - 1].timestamp < items.data[payload.itemId - 1].interval) {
      return { status: "fail", message: "별을 너무 자주 먹는데요?!" };
    }
  }
  // [5] 모든 검증 통과하면 서버에 기록 후 성공 응답
  setItems(userId, payload.itemId, Date.now());
  return { status: "success", message: "올바른 획득입니다!!" };
};
