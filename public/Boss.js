class Boss {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];

  // 생성자
  constructor(ctx, width, height, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio - 70;
    this.y = this.canvas.height + 18 - this.height - 1.5 * scaleRatio;
    // 기본 위치 상수화
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/jerry_pause.png";
    this.image = this.standingStillImage;

    // 달리기
    const dinoRunImage1 = new Image();
    dinoRunImage1.src = "images/jerry_chase1.png";

    const dinoRunImage2 = new Image();
    dinoRunImage2.src = "images/jerry_chase2.png";

    this.dinoRunImages.push(dinoRunImage1);
    this.dinoRunImages.push(dinoRunImage2);
  }

  update(gameSpeed, deltaTime) {
    this.run(gameSpeed, deltaTime);
  }

  run(gameSpeed, deltaTime) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.dinoRunImages[0]) {
        this.image = this.dinoRunImages[1];
      } else {
        this.image = this.dinoRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= deltaTime * gameSpeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export default Boss;
