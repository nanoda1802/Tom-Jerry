import exp from "constants";
import fs from "fs"; // node.js 기본 내장 모듈, File System
import path from "path"; // node.js 기본 내장 모듈, 파일 및 디렉토리 경로 다루는 함수들 제공
import { fileURLToPath } from "url"; // node.js 기본 내장 모듈, URL 파싱이나 조작, 변환 등의 작업 지원

/* 게임 재료 데이터들 저장하는 객체 */
let gameAssets = {};
/* 재료들 존재하는 폴더에 접근하기 위한 경로 설정 */
// fileURLToPath()은 파일URL을 운영체제에 맞는 파일 시스템 경로로 변환
// 파일 URL은 브라우저나 네트워크 환경에서 파일에 접근할 때 주로 사용(로컬 시스템에서도 사용), "file://" 프로토콜 사용해 파일을 참조 <예시 file://C:/Users/John/Documents/file.txt>
// 파일 System Path는 실제 파일 시스템 내에서 파일이나 디렉토리 가리키는 경로(연관개념으로 절대경로&상대경로) <예시 C:\Users\John\Documents\file.txt>
// import.meta.url은 현재 모듈이 실행되는 위치에 대한 URL 제공, ESM에서만 사용할 수 있는 메타 데이터
// ES 모듈(=ESM)은 자바스크립트의 모듈 시스템. ECMAScript 6에서 도입된 모듈화 방식
// ES6 모듈의 주요 특징은 <import&export>와 <.mjs> 확장자 또는 <"type":"module">의 모듈처리, 그리고 비동기 모듈 로딩의 세 가지가 있음
// 메타 데이터는 "데이터에 관한 데이터", 본문 데이터를 이해하고 활용하는 데 필요한 정보를 담음. 본문=페이로드, 메타=헤더 처럼 이해하면 될 듯!
// 데이터 환경에 따라 메타 데이터 내용물은 달라짐. 파일 시스템의 메타 데이터 같은 경우엔 파일명, 용량, 생성일자 및 수정일자, 권한, 확장자 등등이 있음
const __filename = fileURLToPath(import.meta.url); // 현재 작업 중인 모듈 파일의 위치 알려줌 (지금은 assets.js)
const __dirname = path.dirname(__filename); // __filename 통해 현 파일이 속한 폴더 알려줌
const basePath = path.join(__dirname, "../../assets"); // 재료들 있는 assets 폴더의 절대 경로 계산
/* 비동기적 파일 열람 */
const readFileAsync = (fileName) => {
  // [1] 비동기 작업 위한 프로미스 ON
  return new Promise((resolve, reject) => {
    // [2] 병렬 파일 읽기 시도, 성공 시 JSON 객체 형태의 데이터 반환
    // fs.readFile(읽을 파일의 경로, 인코딩 방식, 열람 완료 후 실행할 콜백함수)
    // [2-1] path.join(폴더의 경로,그 폴더에서 읽을 파일)
    // path.join은 여러 경로 조각을 결합해 하나의 유효 경로를 만듦
    // 경로 수동 결합 시 실수 예방해주고, 사용 운영 체제에 맞는 경로 형식으로 자동 처리해줌
    fs.readFile(path.join(basePath, fileName), "utf8", (err, data) => {
      // [2-2 a] 파일 열람 도중 문제 발생하면 콜백함수의 err 매개변수에 담겨서 reject
      // [2-2 b] 파일 열람 성공하면 콜백함수의 data 매개변수에 담겨서 JSON 객체로 변환된 후 resolve
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

/* 게임 재료 파일들 불러오기 */
export const loadGameAssets = async () => {
  try {
    // [1] 병렬적으로 파일 열람 후 각각 배열 구조분해할당
    const [stages, items] = await Promise.all([
      readFileAsync("stage.json"),
      readFileAsync("item.json"),
    ]);
    // [2] 재료 데이터 저장하는 객체에 불러온 JSON 객체들 저장
    gameAssets = { stages, items };
    // [3 a] 객체 통째로 반환
    return gameAssets;
  } catch (err) {
    // [3 b] 발생한 에러 관련 메세지 상위 스코프로 보냄
    throw new Error("!! Failed to load game assets !! " + err.message);
  }
};

/* 재료 데이터 조회 및 재사용 */
export const getGameAssets = () => {
  return gameAssets;
};
