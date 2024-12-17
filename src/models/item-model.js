/* 사용자별 아이템 정보 관리 */
// { UUID : [ 아이템 정보 ]} 형태의 객체
const items = {};
/* 신규 사용자의 아이템 초기화 */
export const createItems = (uuid) => {
  items[uuid] = []; // 빈 배열 투입!
};
/* 특정 사용자의 아이템 정보 조회 */
export const getItems = (uuid) => {
  return items[uuid]; // UUID를 통해 사용자 식별
};
export const getStars = (uuid) => {
  return items[uuid].filter((e) => e.id === 6);
};
export const getCoins = (uuid) => {
  return items[uuid].filter((e) => e.id !== 6);
};

/* 사용자 아이템 정보 업데이트 */
export const setItems = (uuid, itemId, timestamp) => {
  // UUID로 사용자 식별해 어느 아이템인지 알려주는 id와 그 아이템을 획득한 timestamp 투입!
  return items[uuid].push({ id: itemId, timestamp });
};
// ?? createItems랑 정확히 동일한 역할을 하는데, 둘이 별개일 이유가 있을까??
export const clearItems = (uuid) => {
  items[uuid] = [];
};
