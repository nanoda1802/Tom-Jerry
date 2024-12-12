import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage-model.js";

/* 사용자의 스테이지 이동 처리 */
export const moveStageHandler = (userId, payload) => {
  // [1] 사용자의 현재 기준 스테이지 정보 조회
  let currentStages = getStage(userId);
  // [1-1] 스테이지 정보가 빈 배열이면, 즉 게임 진행 사항이 없는 사용자면 실패 응답
  if (!currentStages.length) {
    return { status: "fail", message: "No stage found for user" };
  }
  // [2] 사용자가 지난 스테이지 목록 오름차순으로 정렬
  currentStages.sort((a, b) => a.id - b.id);
  // [3] 지난 스테이지 중 최근, 즉 배열의 마지막 스테이지의 ID 값 가져옴
  const currentStageId = currentStages[currentStages.length - 1].id;
  // [4] 서버에 저장된 최근 스테이지 ID와, 클라이언트가 보낸 현재 스테이지 ID가 동일한지 비교
  if (currentStageId !== payload.currentStage) {
    // 다르다면 유효하지 않은 요청이므로 실패 응답
    return { status: "fail", message: "Current stage mismatch" };
  }
  // [5] 서버가 스테이지 이동 핸들러를 요청 받은 시간 담은 변수 생성
  const serverTime = Date.now();
  // [6] 서버에 저장된 스테이지 변경 시간과 요청 받은 시간 비교해 경과 시간 담은 변수 생성
  // ms 단위기 때문에 초단위로 비교하기 위한 나누기 1000
  const elapsedTime = (serverTime - currentStageId.timestamp) / 1000;
  // [7] 임의로 설정한 경과 시간 제한 범위에서 벗어날 시 실패 응답
  if (elapsedTime < 10 || elapsedTime > 10.5) {
    return { status: "fail", message: "Invalid elapsed time" };
  }
  // [8] 재료 데이터에서 스테이지 정보 가져옴
  const { stages } = getGameAssets();
  // [9] 클라이언트가 목표한 다음 스테이지 정보의 ID가 서버 재료 데이터에 없으면 실패 응답
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: "fail", message: "Targe stage not found" };
  }
  // [10] 모든 검증 통과 시 사용자의 스테이지를 다음으로 이동시키고, 이동 시간 기록
  setStage(userId, payload.targetStage, serverTime);
  // [11] 스테이지 이동 성공 응답 반환
  return { status: "success" };
};
