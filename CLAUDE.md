# web-template — Claude 작업 안내

rijyori가 만드는 모든 웹사이트의 공용 바탕(라이트/다크, 한/영, 기본 부품, 컬러 테마). 공개 저장소 `rijyori/web-template`.
사용법·구성·변수 목록은 `README.md`에 있다. **작업 전에 README를 먼저 읽는다.**

## 이 저장소의 성격

- 빌드 없는 바닐라 HTML / CSS / JS. 의존성·패키지 없음.
- 원본은 여기 하나다. 사이트들은 파일을 **복사**해서 쓴다 (링크·서브모듈 아님).
  그래서 여기를 고쳐도 사이트에는 저절로 반영되지 않는다.

## 고칠 때

1. 여기 파일을 고친다. 동작이나 쓰는 법이 바뀌면 `README.md`도 같이 고친다.
2. `example/index.html`로 확인한다 (한국어·영어, 라이트·다크, 모달·토스트). 아무 정적 서버로 이 폴더를 열고 `/example/`.
   헤드리스 시험 도구는 `../pwa-games/tools/smoke.mjs` (`node ../pwa-games/tools/smoke.mjs . <시나리오.mjs> <출력폴더>`, `SMOKE_LANG=en-US`로 영어).
3. 커밋·푸시한다 (main 브랜치). 공개 저장소다.
4. README "쓰는 곳"의 사이트들에 다시 복사하고 각자 배포한다.
   - pwa-games: `tools/sync-common.mjs`가 빌드 때 자동으로 복사한다. 그 워크스페이스의 CLAUDE.md 배포 절차를 따른다 (sw.js 캐시 버전 올리기 등).
   - 홈페이지(`../homepage/dist/`): `theme.js`, `i18n.js`를 직접 복사한다.

## 규칙

- **공개 저장소이므로 개인정보를 넣지 않는다.** 커밋 작성자는 noreply 주소(`rijyori@users.noreply.github.com`)여야 한다. 개인 이메일·접속정보·내부 경로를 파일이나 커밋에 넣지 않는다.
- `core/`는 테마와 무관해야 한다. 색은 테마 변수(`--bg`, `--fg` 등)만 쓰고 하드코딩하지 않는다.
- 새 테마는 `themes/<이름>.css`에 README의 변수 표를 라이트·다크 모두 채운다.
- `theme.js`의 쿠키 이름(`theme`)·값(`auto`/`light`/`dark`)·도메인 규칙(`*.rijyori.com`만 `Domain=rijyori.com`)을 바꾸면 이미 저장된 선택과 다른 사이트의 공유가 깨진다. 바꿔야 하면 주인님께 먼저 여쭌다.
- 한글이 들어간 수정은 Edit 도구로 한다 (셸 heredoc → python은 한글이 깨질 수 있다).
