# Tom-Jerry

### 프로젝트 소개

> 불쌍한 톰이 오늘도 제리에게 쫓기고 있습니다!!
> 톰이 무사히 집으로 돌아갈 수 있도록 도와주세요!!

플레이어는 톰이 되어 쫓아오는 제리를 피해 도망가야 합니다!
도망치며 발견한 코인들을 통해 점수를 모아보세요!
하지만 톰의 앞길엔 이를 방해하는 작은 제리들이 등장합니다...
우연히 강력한 아이템을 얻는다면 이로운 효과를 얻을 수 있을지도 모릅니다!

---

### 조작 및 설명

1. 방향키를 통해 톰을 상하좌우로 움직일 수 있습니다. 장애물을 피하며 최대한 많은 코인을 모아보세요!
2. 작은 제리들 중엔 튀어오르는 녀석들도 있습니다!! 갑작스레 충돌하지 않도록 주의하세요!
3. 코인을 먹으며 점수를 모아보세요! 코인의 점수는 스테이지에 비례해 증가합니다!
4. 럭키아이템인 별을 활용해보세요! 일정 시간 동안 장애물 충돌을 무시합니다!
5. 작은 제리들과 충돌할 시 게임 오버 입니다!!

---

### 디렉토리 구성

디렉토리는 크게 `assets`, `public`, `src`로 구성됩니다.

- **assets**
  - 게임에 필요한 재료 데이터들을 json 객체 형태로 보관하는 디렉토리
  - redis 연동 시 사라질 수 이씀
- **public**
  - 클라이언트 환경에서 필요한 html, css, script 파일 및 이미지 파일 등을 보관하는 디렉토리
- **src**
  - 서버 환경에서 필요한 앱, 핸들러, 시작파일, 모델 등을 보관하는 디렉토리

---

### 기능 설명

내용 추가 예정

---

### 기능 구현 리스트

- **점수**
  - [ ] 시간 비례 증가 X, 코인 획득 증가 O
- **스테이지**
  - [ ] 1단계 시작, 최대 5단계, 5단계 종료 시 게임 클리어
  - [ ] 시간 경과에 따른 스테이지 승급
  - [ ] 화면 상단 중앙에 현재 스테이지 텍스트 표시 `Stage N`
  - [ ] 스테이지 승급 시 화면에 스테이지 클리어 메세지 출력
  - [ ] 스테이지 승급 관련 서버 검증 프로세스
  - [ ] (추가 예정)
- **플레이어**
  - [x] 기본 위치 조정 `241213`
  - [ ] (추가 예정)
- **장애물**
  - [x] 기본 위치 조정 `241213`
  - [ ] 유형 개편 -> 점프 제리, 그냥 제리
  - [ ] (추가 예정)
- **보스**
  - [x] `Boss` 클래스 모듈 생성 `241213`
  - [x] index.js에 관련 설정 추가 `241213`
  - [ ] (추가 예정)
- **아이템**
  - [ ] 점수 획득 위한 코인 `Coin` 구현, 스테이지에 비례해 획득 점수 UP
  - [ ] 럭키 아이템 별 `Star` 구현, 점수 대량 획득 + 일정 프레임 동안 장애물 충돌 무시
  - [ ] 아이템 획득 관련 서버 검증 프로세스
  - [ ] (추가 예정)
