import { sendEvent, stageTable } from "./Socket.js";

class Stage {
  stage = 1;
  stageChange = true;
  time = 0;
  isClear = false;
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.stageChange = true;
    this.time += deltaTime * 0.001;
    // 플레이 시간이 설정된 스테이지 데이터 변경 시간이 되면 서버에 메세지 전송
    if (Math.floor(this.time) === stageTable.data[this.stage - 1].duration && this.stageChange) {
      if (this.stage === 5) {
        return;
      }
      // 스테이지 이동 핸들러 실행 부분
      sendEvent(11, { currentStage: stageTable.data[this.stage - 1].id, targetStage: stageTable.data[this.stage].id });
      this.stageChange = false;
      this.stage += 1;
      this.time = 0;
    }
  }

  gameClear() {
    if (this.stage === 5 && this.time >= stageTable.data[4].duration) {
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
