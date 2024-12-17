import { getGameAssets } from "../init/assets.js";
import { clearItems, setItems } from "../models/item-model.js";
import { clearStage, getStage, setStage } from "../models/stage-model.js";

/* 게임 시작!! */
// 사용자의 스테이지 상태 초기화 및 첫 스테이지 설정
export const gameStart = (uuid, payload) => {
  // [1] 재료 데이터에서 스테이지 데이터 정보 가져옴
  const { stages } = getGameAssets();
  // [2] 사용자의 기존 스테이지 상태 초기화
  clearStage(uuid);
  clearItems(uuid);
  // [3] 새 게임의 첫 스테이지 설정
  // ?? 이거 조정하면 이어하기도 가능하겠는데....??
  setStage(uuid, stages.data[0].id, payload.timestamp);
  // [4] 게임 시작 후 현재 사용자의 스테이지 상태 출력
  // 첫 스테이지 정보만 있는 게 맞는지, 초기화 잘 됐는지 확인 위함
  console.log(`Stage : `, getStage(uuid));
  // [5] 클라이언트에게 성공 응답 반환
  return { status: "success", message: "게임이 시작됐수!!!" };
};

/* 게임 종료!! */
// 사용자의 스테이지 진행 시간 계산 후, 게임 점수와 비교해 획득 점수가 유효한 지 검증
export const gameEnd = (uuid, payload) => {
  // [1] 페이로드에서 게임종료 timestamp와 획득 score 가져옴
  const { timestamp: gameEndTime, score } = payload;
  // [2] 스테이지 정보 저장 객체에서 UUID로 현재 사용자의 스테이지 정보 가져옴
  const stages = getStage(uuid);
  // [2-1] 스테이지 정보가 빈 배열이면, 즉 게임 진행 사항이 없는 사용자면 실패 응답
  if (!stages.length) {
    return { status: "fail", message: "No stages found for user" };
  }
  // [3] 총점 계산 위한 변수 설정
  let totalScore = 0;
  // [4] 매 스테이지 단계 유지 시간 계산해 총점에 더하기
  stages.forEach((stage, index) => {
    // [4-1] 스테이지 종료 시간 위한 변수 설정
    let stageEndTime;
    // [4-1 a] (플레이어가 도달한?) 마지막 스테이지인 경우
    if (index === stages.length - 1) {
      // 클라이언트에서 보내준 게임 종료 시간 할당
      stageEndTime = gameEndTime;
      // [4-1 b] (플레이어가 도달한?) 마지막 스테이지가 아닌 경우
    } else {
      // 다음 스테이지 시작 시간 할당
      stageEndTime = stages[index + 1].timestamp;
    }
    // [4-2] 스테이지 종료시간과 스테이지 시작시간 격차 계산
    // ms 단위니까 나누기 1000
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    // [4-3] 계산한 격차 총점에 누적
    totalScore += stageDuration;
  });
  // [5] 클라이언트에서 보낸 획득 점수와 서버에서 계산한 총점 비교
  // 임의롤 설정한 오차 범위 5를 초과하면 실패 응답
  if (Math.abs(score - totalScore) > 5) {
    return { status: "fail", message: "Score verification failed" };
  }
  // [6] 점수 검증 성공 응답
  return { status: "success", message: "Game Ended", score };
};
