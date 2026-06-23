# 웹개발프로그래밍 팀 프로젝트 개발 일지

## 개발일자

- 2026년 6월 16일 ~ 2026년 6월 18일
- 총 개발 시간: 발표 시간을 제외한 9시간

## 내 역할

이번 프로젝트에서 나는 프론트엔드 화면 구성과 인증 흐름 정리, 서버 API 연동을 중심으로 개발을 맡았다. 특히 로그인/회원가입 화면, 라우팅 구조, 후보자 등록 및 투표 화면 연결, 후보 조회 API와 투표 API 연동, 투표 완료 상태 유지 기능을 담당했다.

구체적으로 구현한 기능은 다음과 같다.

- React Router 기반 페이지 라우팅 구성
- 로그인 화면과 회원가입 화면 구현
- 학생 로그인 API 연동 구조 작성
- 회원가입 API 연동 구조 작성
- DAuth 인증 방식 제거 및 일반 로그인 방식으로 변경
- 관리자/학생 역할 기반 화면 접근 제어 정리
- 후보자 등록, 투표, 집계 화면을 라우트에 연결
- GitHub Pages 배포를 위한 Vite base 경로 및 SPA fallback 설정
- 로컬 개발 중 CORS 문제를 줄이기 위한 Vite API proxy 설정
- 서버 후보자 조회 API 연동
- 투표 제출 API 연동
- 새로고침 후 중복 투표를 막기 위한 사용자별 투표 완료 상태 저장
- 투표 완료 모달 구현

## 개발 타임라인

| 시간 | 작업 내용 | 커밋 근거 |
| --- | --- | --- |
| 1시간차 | 프로젝트 기본 구조를 생성하고 React + Vite 개발 환경을 준비했다. `package.json`, Vite 설정, 기본 `src` 구조를 확인하며 작업 시작점을 만들었다. | `c21fd69 first commit` |
| 2시간차 | 선거 시스템의 핵심 화면 구조를 설계했다. 로그인 화면, 후보자 등록 화면, 투표 화면, 집계 화면을 컴포넌트 단위로 나누고 기본 라우팅을 구성했다. | `ec78833 commit 1` |
| 3시간차 | 후보자 목록, 후보 카드, 투표 행, 반별 투표율 표시 등 재사용 가능한 UI 컴포넌트를 분리했다. 화면별 코드가 너무 길어지지 않도록 컴포넌트 경계를 나누었다. | `ec78833 commit 1` |
| 4시간차 | 투표 상태와 후보자 데이터를 로컬 상태로 관리하도록 구현했다. 후보 추가, 수정, 삭제, 투표 제출, 반별 투표율 갱신, CSV 다운로드 기능을 연결했다. | `ec78833 commit 1` |
| 5시간차 | GitHub Pages 배포를 위해 Vite base 경로를 `/electionProject/`로 설정하고, 새로고침 시 404가 나는 문제를 줄이기 위해 `404.html` fallback 생성 스크립트를 추가했다. | `3666e2f`, `d74fa75` |
| 6시간차 | 인증 방식 변경 요구사항을 반영했다. 초기에는 DAuth callback 화면과 PKCE 관련 유틸을 만들었지만, 이후 DAuth를 사용하지 않기로 하면서 일반 로그인 방식으로 되돌렸다. Swagger에 맞춰 `/api/auth/login` 요청 body를 `username`, `password` 형태로 정리했고, 관리자 회원가입/로그인을 제거해 학생 로그인만 남겼다. 또한 `/signup` 라우트와 회원가입 화면을 추가해 로그인 화면과 서로 전환할 수 있게 만들었다. | `34bf5b2`, `0d57706`, `a55c8cf`, `918f66b` |
| 7시간차 | Swagger의 후보자 API 명세를 확인하고 `/api/candidates` 응답을 프론트 화면 데이터 구조에 맞게 변환했다. 기존 로컬 샘플 후보가 아니라 서버 후보 목록을 투표 화면에서 사용하도록 `src/api/election.js`를 추가하고 `App.jsx`에서 후보 목록을 불러오게 연결했다. | `f473ee7` |
| 8시간차 | `/api/votes` 투표 API를 연결했다. 서버가 요구하는 `candidateId`를 숫자로 변환해 전송하고, 서버 후보가 아닌 로컬 후보를 잘못 제출하면 안내 메시지를 보여주도록 방어 코드를 넣었다. 후보 등록도 `/api/candidates` POST 요청과 연결해 서버 스키마인 `name`, `district`, `pledge`, `introduction`에 맞춰 전송했다. | `f473ee7` |
| 9시간차 | 투표 후 새로고침하면 다시 투표할 수 있는 문제를 수정했다. 백엔드에 투표 여부 조회 API가 아직 없어서 프론트에서는 사용자별 `localStorage` 키에 투표 완료 상태를 저장하고 앱 시작 시 복원하도록 했다. 투표 성공 후에는 완료 모달을 띄워 사용자가 제출 완료를 명확히 확인할 수 있게 만들었다. 마지막으로 `npm run lint`, `npm run build`로 검증했다. | `f473ee7` |

## 주요 커밋 히스토리

```txt
002d314 docs: update development log
f473ee7 feat: connect vote APIs and persist vote status
918f66b remove env.example
a55c8cf feat: add student auth pages
0d57706 chore: configure API environment proxy
7d656d6 Remove env example file
d74fa75 Add GitHub Pages SPA fallback
3666e2f Configure GitHub Pages deployment
34bf5b2 Deploy build
ec78833 commit 1
c21fd69 first commit
```
