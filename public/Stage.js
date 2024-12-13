import { sendEvent } from "./Socket.js";

class Stage {
  stage = 1;
  stageChange = true;
  time = 0;
  isClear = false;
  currentStageId = { 1: 1000, 2: 1001, 3: 1002, 4: 1003, 5: 1004 };
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.stageChange = true;
    this.time += deltaTime * 0.001;
    // 점수가 stage * 10점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.time) === this.stage * 5 && this.stageChange) {
      if (this.stage === 5) {
        return;
      }
      this.stageChange = false;
      this.stage += 1;
      this.time = 0;
      // 스테이지 이동 핸들러 실행 부분
      sendEvent(11, { currentStage: this.currentStageId[this.stage - 1], targetStage: this.currentStageId[this.stage] });
    }
  }

  gameClear() {
    if (this.stage === 5 && this.time >= this.stage * 5) {
      this.isClear = true;
    }
  }

  reset() {
    this.stage = 1;
    this.time = 0;
    this.isClear = false;
  }

  getStage() {
    return this.stage;
  }

  draw() {
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const stageX = 10 * this.scaleRatio;
    const timeX = stageX + 100 * this.scaleRatio;

    const stagePadded = this.stage.toString().padStart(2, 0);
    const timePadded = Math.floor(this.time).toString().padStart(2, 0);

    this.ctx.fillText(`Stage ${stagePadded}`, stageX, y);
    this.ctx.fillText(`Time ${timePadded}/${this.stage * 10}`, timeX, y);
  }
}

export default Stage;
