import { sendEvent } from "./Socket.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001;
    // 점수가 10점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) === 10 && this.stageChange) {
      this.stageChange = false;
      // 스테이지 이동 핸들러 실행 부분
      sendEvent(11, { currentStage: 1000, targetStage: 1001 });
    }
  }

  // 어떤 아이템을 먹었을지 판단하려면 itemId로 구분
  getItem(itemId) {
    // itemId에 따라 조건문 분기 나누기
    this.score += 0; // 몇 점 줄 건지는 여기서 결정
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
