class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  tomRunImages = [];
  tomJumpImages = [];

  //점프 상태값
  jumpPressed = false;
  jumpInProgress = false;
  falling = false;

  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

  isStar = false; // 별 상태 확인

  // 생성자
  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 250 * scaleRatio;
    this.y = this.canvas.height - 15 - this.height - 1.5 * scaleRatio;
    // 기본 위치 상수화
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/tom_standing.png";
    this.image = this.standingStillImage;

    // 달리기
    const tomJumpImage = new Image();
    tomJumpImage.src = "images/tom_jump.png";

    const tomStarJumpImage = new Image();
    tomStarJumpImage.src = "images/tom_star_jump.png";

    this.tomJumpImages.push(tomJumpImage);
    this.tomJumpImages.push(tomStarJumpImage);

    const tomRunImage1 = new Image();
    tomRunImage1.src = "images/tom_run1.png";

    const tomRunImage2 = new Image();
    tomRunImage2.src = "images/tom_run2.png";

    const tomStarRunImage1 = new Image();
    tomStarRunImage1.src = "images/tom_star_run1.png";

    const tomStarRunImage2 = new Image();
    tomStarRunImage2.src = "images/tom_star_run2.png";

    this.tomRunImages.push(tomRunImage1);
    this.tomRunImages.push(tomRunImage2);
    this.tomRunImages.push(tomStarRunImage1);
    this.tomRunImages.push(tomStarRunImage2);

    // 키보드 설정
    // 등록된 이벤트가 있는 경우 삭제하고 다시 등록
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, deltaTime) {
    if (!this.isStar) {
      this.run(gameSpeed, deltaTime);
    } else {
      this.starRun(gameSpeed, deltaTime);
    }

    if (this.jumpInProgress) {
      if (!this.isStar) {
        this.image = this.tomJumpImages[0];
      } else {
        this.image = this.tomJumpImages[1];
      }
    }

    this.jump(deltaTime);
  }

  jump(deltaTime) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    // 점프가 진행중이고 떨어지는중이 아닐때
    if (this.jumpInProgress && !this.falling) {
      // 현재 인스턴스의 위치가 점프의 최소, 최대값의 사이일때
      if (this.y > this.canvas.height - this.minJumpHeight || (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)) {
        // 아무튼 위의 내용은 버튼을 눌렀을때 올라가는 조건
        this.y -= this.JUMP_SPEED * deltaTime * this.scaleRatio;
      } else {
        this.falling = true;
      }
      // 떨어질 때
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * deltaTime * this.scaleRatio;

        // 혹시 위치가 어긋 났을때 원래 위치로
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gameSpeed, deltaTime) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.tomRunImages[0]) {
        this.image = this.tomRunImages[1];
      } else {
        this.image = this.tomRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= deltaTime * gameSpeed;
  }

  starRun(gameSpeed, deltaTime) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.tomRunImages[0]) {
        this.image = this.tomRunImages[3];
      } else if (this.image === this.tomRunImages[3]) {
        this.image = this.tomRunImages[1];
      } else if (this.image === this.tomRunImages[1]) {
        this.image = this.tomRunImages[2];
      } else {
        this.image = this.tomRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= deltaTime * gameSpeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export default Player;
