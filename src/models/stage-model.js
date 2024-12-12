/* 사용자별 스테이지 정보 관리 */
// { UUID : [ 스테이지 정보 ]} 형태의 객체
const stages = {};
/* 신규 사용자의 스테이지 초기화 */
export const createStage = (uuid) => {
  stages[uuid] = []; // 빈 배열 투입!
};
/* 특정 사용자의 스테이지 정보 조회 */
export const getStage = (uuid) => {
  return stages[uuid]; // UUID를 통해 사용자 식별
};
/* 사용자 스테이지 정보 업데이트 */
export const setStage = (uuid, stageId, timestamp) => {
  // UUID로 사용자 식별해 어느 단계인지 알려주는 id와 그 단계에 진입한 timestamp 투입!
  return stages[uuid].push({ id: stageId, timestamp });
};
// ?? createStage랑 정확히 동일한 역할을 하는데, 둘이 별개일 이유가 있을까??
export const clearStage = (uuid) => {
  stages[uuid] = [];
};
