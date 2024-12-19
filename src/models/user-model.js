/* 사용자 목록 저장하는 배열 */
const users = [];

/* 새로운 사용자 목록에 추가 */
export const addUser = (user) => {
  users.push(user); // user는 { uuid: ???, socketId: ??? } 형태
};

/* 사용자 목록에서 제거 */
export const removeUser = (socketId) => {
  // [1] socketId를 통해 목록에서 사용자의 인덱스 찾음
  const index = users.findIndex((user) => user.socketId === socketId);
  // [2] 조회된 사용자를 목록에서 제거
  // findIndex 메서드가 조회를 실패하면 -1 반환함
  if (index !== -1) {
    return users.splice(index, 1)[0]; // 반환 형태가 [{ uuid: ???, socketId: ??? }]기 때문에 [0]으로 객체만 꺼냄
  }
};

/* 접속 중인 모든 사용자 조회 */
export const getUser = () => {
  return users;
};
