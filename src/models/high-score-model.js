/* 서버 highScore 관리 */
const highScore = { uuid: "", high: 0 };

export const getHigh = () => {
  return highScore.high;
};

export const setHigh = (userId, score) => {
  highScore.uuid = userId;
  highScore.high = score;
  return highScore;
};
