import Player from "./Player.js";
import Boss from "./Boss.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import Stage from "./Stage.js";
import Score from "./Score.js";
import ItemController from "./ItemController.js";
import { sendEvent } from "./Socket.js";
import "./Socket.js";

const canvas = document.getElementById("game"); // 게임 화면 담당할 HTML 요소 셀렉
const ctx = canvas.getContext("2d"); // 그리기 작업 해줄 2D 렌더링 컨텍스트 가져옴
// [1] 게임 전반 설정
const GAME_SPEED_START = 1; // 게임 시작 시 기본 속도
const GAME_SPEED_INCREMENT = 0.00001; // 진행 시 속도 증가량
const GAME_WIDTH = 800; // 화면 너비
const GAME_HEIGHT = 300; // 화면 높이

// [2] 플레이어 설정
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1.5; // 캐릭터 너비
const PLAYER_HEIGHT = 94 / 1.5; // 캐릭터 높이
const MAX_JUMP_HEIGHT = GAME_HEIGHT; // 최대 점프 높이 (= 화면 높이)
const MIN_JUMP_HEIGHT = 150; // 최소 점프 높이

// [3] 오브젝트 설정
// [3-1] 바닥
const GROUND_WIDTH = 2400; // 바닥 너비
const GROUND_HEIGHT = GAME_HEIGHT; // 바닥 높이
const GROUND_SPEED = 0.5; // 바닥 기본 속도
// [3-2] 선인장, 세 종류 각각의 너비 & 높이 & 이미지파일
const CACTI_CONFIG = [
  { width: 90 / 1.5, height: 90 / 1.5, image: "images/jerry_standing.png" },
  { width: 90 / 1.5, height: 90 / 1.5, image: "images/jerry_jump.png" },
];
// [3-3] 아이템, 네 종류 각각의너비 & 높이 & 아이디 & 이미지파일
const ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: "images/items/coin1.png" },
  { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: "images/items/coin2.png" },
  { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: "images/items/coin3.png" },
  { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: "images/items/coin4.png" },
  { width: 50 / 1.5, height: 50 / 1.5, id: 5, image: "images/items/coin5.png" },
  { width: 50 / 1.5, height: 50 / 1.5, id: 6, image: "images/items/star.png" },
];
// [3-4] 보스
const BOSS_WIDTH = 280; // 보스 너비
const BOSS_HEIGHT = 210; // 보스 높이

// [4] 게임 요소 초기화
let player = null;
let boss = null;
let ground = null;
let cactiController = null;
let itemController = null;
let stage = null;
let score = null;
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

// [함수] 게임 요소들 생성
function createSprites() {
  // (1) 플레이어 설정 화면비율에 맞게 조정
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
  // (2) 바닥 및 보스 설정 화면비율에 맞게 조정
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
  const bossWidthInGame = BOSS_WIDTH * scaleRatio;
  const bossHeightInGame = BOSS_HEIGHT * scaleRatio;
  // (3) 조정된 설정 바탕으로 게임 요소들 인스턴스 생성
  // (3-1) 플레이어 인스턴스
  player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);
  // (3-2) 지면 및 보스 인스턴스
  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);
  boss = new Boss(ctx, bossWidthInGame, bossHeightInGame, scaleRatio);
  // (3-3) 선인장 인스턴스
  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });
  // (3-4) 선인장 조작 인스턴스
  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);
  // (3-5) 아이템 인스턴스
  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
    };
  });
  // (3-6) 아이템 조작 인스턴스
  itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED);
  // (3-7) 점수 및 스테이지 인스턴스
  score = new Score(ctx, scaleRatio);
  stage = new Stage(ctx, scaleRatio);
}
// [함수] 게임 화면 비율 조정
function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}
// [함수] 게임 화면 크기 설정 및 요소들 생성
function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

// [5] 조정된 화면과 요소들 그리기 시작
setScreen();
window.addEventListener("resize", setScreen);
// [5-a] 화면 방향 감지해 다시 그림 (세로모드 or 가로모드)
if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

// [함수] 게임오버 텍스트 화면에 그림
function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "red";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}
// [함수] 게임스타트 텍스트 화면에 그림
function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText("Tap Screen or Press Space To Start", x, y);
}
// [함수] 게임클리어 텍스트 화면에 그림
function showGameClear() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "blue";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME CLEAR!!", x, y);
}
// [함수] 게임 진행에 따라 증가하는 속도 반영
function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}
// [함수] 게임 재시작
function reset() {
  // (1) 변수 초기화
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
  score.reset();
  stage.reset();
  gameSpeed = GAME_SPEED_START;
  // (2) 서버에 게임 시작 요청
  // game-handler.js 파일의 gameStart 핸들러가 담당해 처리
  sendEvent(2, { timestamp: Date.now() }); // 매핑번호 : 2, 페이로드 : 시작시간
}
// [함수] 유저가 재시작을 희망하는지 확인 (키보드를 눌렀는지 체크하고, 게임을 리센)
function setupGameReset() {
  // (1) 재시작 이벤트리스너가 켜진 상태인지 확인 (중복 발동 방지 위함)
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;
    // (2) 게임오버 후 1초 대기 시간 갖고 재시작하도록 설정
    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true }); // { once: true }로도 중복 방지
    }, 1000);
  }
}
// [함수] 매 프레임별 그림을 위해 화면을 초기화 (흰색으로 화면 꽉 채움)
function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// [함수] 게임 루프
function gameLoop(currentTime) {
  // (0) 게임 첫 시작 시 previousTime을 함수 실행 시간으로 업데이트
  if (previousTime === null) {
    previousTime = currentTime;
    // js 내장 함수, 프레임 단위로 화면을 갱신
    // 다음 프레임 그리기 전에 콜백함수를 실행, 콜백함수는 현재 시간을 인자로 받음
    requestAnimationFrame(gameLoop);
    return; // 바로 다음 루프 ON
  }
  // (1) 프레임 간 시간 차 계산 (= deltaTime)
  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  const deltaTime = currentTime - previousTime;
  // (2) 다음 프레임 위해 현재 시간을 이전 시간으로 보냄
  previousTime = currentTime;
  // (3) 화면 초기화, 전부 흰색 네모로 덮음
  clearScreen();
  // (4 a) 게임이 진행 중이라면, 요소들 프레임 업데이트
  if (!gameover && !stage.isClear && !waitingToStart) {
    ground.update(gameSpeed, deltaTime); // 바닥
    boss.update(gameSpeed, deltaTime); // 보스
    cactiController.update(gameSpeed, deltaTime); // 선인장 조작
    itemController.update(gameSpeed, deltaTime); // 아이템 조작
    player.update(gameSpeed, deltaTime); // 플레이어
    updateGameSpeed(deltaTime); // 게임 속도 가속
    stage.update(deltaTime); // 스테이지 시간에 따라 증가
  }
  // (4 b) (수정 예정) 게임 진행 중 선인장과 충돌했다면 게임 오버
  if (!gameover && !stage.isClear && cactiController.collideWith(player)) {
    gameover = true;
    score.setHighScore();
    setupGameReset();
    // 서버에게 이벤트 처리 요청, gameEnd 핸들러가 담당
    sendEvent(3, { timestamp: Date.now(), score: score.score });
  }
  // (4 c) 게임 진행 중 아이템과 충돌했다면 점수 업
  const collideWithItem = itemController.collideWith(player); //
  // 충돌한 아이템의 ID 가져와 점수 차등 적용
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId);
  }
  // (4 d) 스테이지 5에서 50초 버텼을 시 게임 클리어
  if (!gameover && !stage.isClear && stage.stage === 5 && stage.time >= stage.stage * 1) {
    stage.gameClear();
    score.setHighScore();
    setupGameReset();
    // 서버에게 이벤트 처리 요청, gameEnd 핸들러가 담당
    sendEvent(3, { timestamp: Date.now(), score: score.score });
  }
  // (5) 요소들 화면에 그리기
  ground.draw();
  player.draw();
  cactiController.draw();
  itemController.draw();
  boss.draw();
  score.draw();
  stage.draw();

  // (6) 게임오버 시 게임오버 화면 띄우기
  if (gameover) {
    showGameOver();
  }
  // (7) 게임 시작 시 시작대기 화면 띄우기
  if (waitingToStart) {
    showStartGameText();
  }
  // (8) 게임 클리어 시 게임클리어 화면 띄우기
  if (stage.isClear) {
    showGameClear();
  }
  // (9) 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}
// [6] 프레임마다 게임 애니메이션 그려나감
// 재귀 루프를 돌긴 하지만 첫 한 번은 직접 실행시켜 줘야함
requestAnimationFrame(gameLoop);
window.addEventListener("keyup", reset, { once: true }); // 키 중복 입력 방지
