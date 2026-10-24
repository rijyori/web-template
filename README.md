# web-template

rijyori가 만드는 웹사이트의 공용 바탕. 빌드 없는 바닐라 HTML / CSS / JS.

- **라이트 / 다크** 토글 (자동·라이트·다크). 고른 값은 `*.rijyori.com` 전체가 공유하고, 그 밖의 주소(`*.pages.dev` 등)에서는 사이트마다 따로 기억한다.
- **한국어 / 영어** 자동 전환. 브라우저 언어가 ko면 한국어, 아니면 영어.
- **컬러 테마**를 골라 끼운다 (`themes/*.css`). 기능 파일은 테마와 상관없이 공용.
- 기본 부품: 테마 토글, 둥근 버튼, 메뉴 버튼, 모달, 토스트.

예시: `example/index.html` (아무 정적 서버로 이 폴더를 열고 `/example/`).

## 구성

```
core/
  theme.js    라이트/다크. <head>에서 CSS보다 먼저 일반 스크립트로
  i18n.js     한/영. body 끝에서 (모듈보다 먼저) 일반 스크립트로
  base.css    바탕(배경·글자·폰트) + 부품. 색은 전부 테마 변수만 쓴다
  ui.js       toast(), modal() — ES module
themes/
  sumikko.css 스밋코구라시 파스텔 (따뜻한 베이지·복숭아·민트·하늘·라벤더)
example/
  index.html  전부 붙인 예시
```

## 쓰는 법

`core/`의 파일과 고른 테마 하나를 사이트에 **복사**한다 (사이트가 이 폴더 없이도 혼자 배포·오프라인 동작하게). 원본은 이 저장소이고, 고칠 때는 여기를 고친 뒤 다시 복사한다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#faf5ec">          <!-- theme.js가 지금 테마의 --bg로 바꾼다 -->
  <script src="theme.js"></script>                     <!-- CSS보다 먼저 -->
  <title data-en="English title">한국어 제목</title>
  <link rel="stylesheet" href="sumikko.css">           <!-- 컬러 테마 하나 -->
  <link rel="stylesheet" href="base.css">
</head>
<body>
  <div class="theme corner" role="group" aria-label="화면 테마" data-en-aria="Theme">
    <button type="button" data-theme="auto" data-en="Auto">자동</button>
    <button type="button" data-theme="light" data-en="Light">라이트</button>
    <button type="button" data-theme="dark" data-en="Dark">다크</button>
  </div>
  ...
  <script src="i18n.js"></script>                      <!-- body 끝, 모듈보다 먼저 -->
  <script type="module" src="app.js"></script>
</body>
</html>
```

### 라이트 / 다크 (`core/theme.js`)

- 값은 쿠키 `theme` (`auto` / `light` / `dark`). `*.rijyori.com`에서는 `Domain=rijyori.com`이라 서브도메인끼리 공유한다.
  그 밖의 주소에서는 그 사이트에만 저장된다 (`pages.dev`는 서로 다른 사이트끼리 쿠키를 공유할 수 없다).
  쿠키가 없으면 `localStorage.theme`을 쓴다. 사파리는 스크립트로 쓴 쿠키를 7일로 줄이므로 페이지를 열 때마다 다시 써서 늘린다.
- `<html data-theme="light|dark">`를 붙인다 (`auto`면 없음). 테마 CSS가 이 속성과 시스템 설정을 보고 색을 정한다.
- `.theme` 안의 `button[data-theme]`를 누르면 바뀐다. 버튼이 나중에 생겨도 된다 (문서 전체에서 클릭을 받는다).
- 바뀌면 `document`에 `themechange` 이벤트 (`detail: { mode, dark }`). canvas처럼 CSS 밖에서 쓰는 색은 이걸 듣고 다시 읽는다:
  ```js
  document.addEventListener('themechange', () => { lineColor = getComputedStyle(document.documentElement).getPropertyValue('--grid').trim(); });
  ```
- `Theme.mode`, `Theme.dark`, `Theme.set('dark')`.
- 다른 탭·서브도메인에서 바꾸고 돌아오면 따라간다.
- iOS 홈 화면 앱은 사파리와 저장소가 따로라 공유되지 않는다 (iOS 제약).

### 한국어 / 영어 (`core/i18n.js`)

- 기본 글자는 한국어로 쓰고 영어는 속성에 둔다.
  - `data-en="..."`: 글자 (`textContent`). head의 `<title>`, `<meta content>`, `<link href>`(예: 영어 매니페스트)에도 쓴다.
  - `data-en-html="..."`: `innerHTML` (줄바꿈 `<br>` 등).
  - `data-en-aria="..."`: `aria-label`.
- 자식 요소(아이콘 등)가 있는 요소는 글자만 `<span data-en>`으로 감싼다 (`textContent`가 자식을 지우므로).
- 코드 문구: `const t = globalThis.L10N?.t ?? ((k) => k);` 후 `t('한국어', 'English')`. `L10N.ko`는 한국어 여부.
- 새 문구를 넣으면 영어도 같이 넣는다.

### 부품 (`core/base.css`, `core/ui.js`)

| 클래스 | 모양 |
|---|---|
| `.theme` (+ `.corner`: 오른쪽 위 고정) | 알약 모양 3단 토글 |
| `.round-btn` | 54px 원, panel 배경, 아래 그림자 3px. 아이콘 하나 |
| `.menu-btn` (+ `.t1`~`.t4`: 배경색) | radius 18 큰 선택지, 누르면 3px 내려감 |
| `.modal > .modal-box` | radius 22, 위로 떠오름. `modal(제목, 본문, [{label, run, secondary}])` |
| `.toast` | 아래쪽 짧은 알림. `toast(글)` |

## 디자인 원칙

- 폰 먼저. 좌우 여백 16px, 가로 스크롤 없음. 노치는 `env(safe-area-inset-*)`.
- 색은 테마 변수만 쓴다. 하드코딩한 색은 테마를 바꿀 때 남는다.
- 탭 하이라이트·확대 막기(앱 같은 페이지): `touch-action: manipulation; user-select: none; -webkit-touch-callout: none; overscroll-behavior: none`,
  viewport에 `user-scalable=no`.
- 엄지가 닿는 아래쪽에는 핵심 입력만 두고 보조 버튼(테마·되돌리기 등)은 위로.

## 테마 추가하기

`themes/<이름>.css`를 만들고 아래 변수를 **라이트와 다크 모두** 정의한다. `sumikko.css`를 복사해 값만 바꾸면 된다.
다크는 두 군데에 쓴다: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...} }`와 `:root[data-theme="dark"] {...}`.

| 변수 | 쓰임 |
|---|---|
| `--font` | 글꼴 (라이트에만 두어도 됨) |
| `--bg` | 페이지 배경. 주소창 색(theme-color)도 이것 |
| `--panel`, `--panel2` | 카드·버튼 바탕, 한 단계 진한 바탕 |
| `--line` | 테두리 |
| `--fg`, `--dim` | 글자, 흐린 글자 |
| `--accent`, `--warn` | 강조, 경고 |
| `--hover`, `--shadow` | 눌림·호버 바탕, 그림자 |
| `--t1` ~ `--t4` | 메뉴·강조용 파스텔 4색 (t1은 토글 선택 표시) |
| `--grid`, `--user` | 판·격자 선, 사용자 입력 글자 (게임용) |

`color-scheme`도 라이트 `light`, 다크 `dark`로 둔다 (스크롤바·폼 요소 색).

## 쓰는 곳

- pwa-games (https://pwa-games.rijyori.com) — `tools/sync-common.mjs`가 `theme.js`, `i18n.js`를 이 저장소에서 복사한다. 팔레트는 게임별 변수와 함께 각 style.css에 들어 있다.
- rijyori.com 홈페이지 (`homepage/`)
- oishi (oishi-ikebukuro.pages.dev) — 같은 팔레트, 자체 테마 코드
