import { sendEvent, itemTable, highScore } from "./Socket.js";

class Score {
  score = 0;
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  async getItem(itemId, stage, timestamp) {
    const points = itemTable.data[itemId - 1].score; // 데이터 테이블 획득 점수 참조
    await sendEvent(21, { itemId, stage, score: points, timestamp }).then((data) => {
      if (data.handlerId === 21 && data.status === "success") {
        this.score += points;
      } else {
        console.log("점수 검증에 실패했수!!");
      }
    });
  }

  reset() {
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  draw() {
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = `${highScore}`.padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
