import { getGameAssets } from "../init/assets.js";
import { clearItems, getItems, setItems } from "../models/item-model.js";
import { clearStage, getStage, setStage } from "../models/stage-model.js";
import { getHigh, setHigh } from "../models/high-score-model.js";

/* 게임 시작!! */
// 사용자의 상태 초기화 및 첫 스테이지 설정
export const gameStart = (uuid, payload) => {
  // [1] 재료 데이터에서 스테이지 데이터 정보 가져옴
  const { stages } = getGameAssets();
  // [2] 사용자의 기존 스테이지와 아이템 상태 초기화
  clearStage(uuid);
  clearItems(uuid);
  const currentHigh = getHigh().high;
  // [3] 새 게임의 첫 스테이지 설정
  setStage(uuid, stages.data[0].id, payload.timestamp);
  // [4] 클라이언트에게 성공 응답 및 하이스코어 반환
  return { status: "success", message: "게임이 시작됐수!!!", currentHigh };
};

/* 게임 종료!! */
// 사용자의 총 획득 점수 계산 후, 서버 기록과비교해 획득 점수가 유효한 지 검증
export const gameEnd = (uuid, payload) => {
  // [1] 페이로드에서 게임종료 timestamp와 획득 점수, 클리어 여부 가져옴
  const { timestamp: myEndTime, score: myScore, clear } = payload;
  // [2] 스테이지 정보 저장 객체에서 UUID로 현재 사용자의 스테이지와 아이템 정보 가져옴
  const myStages = getStage(uuid);
  const myItems = getItems(uuid);
  // [2-1] 스테이지 정보가 빈 배열이면, 즉 게임 진행 사항이 없는 사용자면 실패 응답
  if (!myStages.length) {
    return { status: "fail", message: "진행 정보가 없는 유저에요!!" };
  }
  // [3] 총점 계산 위한 변수 설정 및 데이터 테이블 참조
  let totalScore = 0;
  const itemTable = getGameAssets().items.data;
  const stageTable = getGameAssets().stages.data;
  // [4] 이론상 획득 가능한 최대 점수를 초과하진 않는지
  // 이론상 모든 아이템을 먹었을 점수 계산 -> 프레임 차이로 정확히는 안될 거 같은데 몇개 나오는지 체크해보자
  // 코인은 대강 스테이지 별로 9~10개 * 스테이지 정도 나오는 듯? 그럼 10*10 + 20*20 + 30*30 + 40*40 + 50*50점이니까 그럼 총 5500점
  // 별은... 얼추 14개 나오는 거 같으니 15개로 치자 그럼 총 2250점 그럼 이론상 최대 획득 가능 점수는 "7750점"이네
  const maxScore = 8000;
  // [5] 서버에서 계산한 총점과 일치하는지
  // items의 id 값들로 아이템 테이블 점수 참고해서 총점 계산
  // 페이로드의 score와 비교해 검증
  myItems.forEach((myItem) => {
    totalScore += itemTable[myItem.id - 1].score;
  });
  if (totalScore < myScore || myScore > maxScore) {
    return { status: "fail", message: "점수가 이렇게 높을리가 없어요?" };
  }
  // [6] 클리어일 시 플레이 시간이 총 시간과 비교해서 적절한지
  // 스테이지 테이블에서 스테이지 유지시간들 더해서 총 시간 구함 <- 이거 75초임
  // stages의 첫 timestamp와 페이로드의 timestamp의 차를 구한 후 총 시간과 비교해 검증
  const playTime = myEndTime - myStages[0].timestamp;
  const totalDuration = stageTable.reduce((total, each) => {
    return total + each.duration;
  }, 0);
  if (clear && playTime < totalDuration * 1000) {
    return { status: "fail", message: "이렇게 빨리 깰 리가 없어요?" };
  }
  // [7] 하이스코어 갱신을 여기서 해줘야?
  const highScore = getHigh().high;
  if (myScore > highScore) {
    setHigh(uuid, myScore);
    return { status: "success", broadcast: `${myScore} 점으로 최고기록이 갱신됐어요!!`, message: "게임이 종료됐수!!", myScore };
  }
  // [8] 점수 검증 성공 응답
  return { status: "success", message: "게임이 종료됐수!!", myScore };
};
