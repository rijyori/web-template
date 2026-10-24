// 라이트 / 다크 테마. 원본: web-template/core/theme.js
// <head>에서 CSS보다 먼저 일반 스크립트로 읽는다 (그래야 깜빡임이 없다):  <script src="theme.js"></script>
//
// - 고른 값(auto / light / dark)은 쿠키 'theme'에 둔다.
//   *.rijyori.com 에서는 Domain=rijyori.com 이라 모든 서브도메인이 같이 쓰고, 그 밖(*.pages.dev 등)에서는 그 사이트에만.
//   쿠키를 못 쓰거나 만료되면 localStorage('theme')로 대신한다. (사파리는 스크립트로 쓴 쿠키를 7일로 줄이므로 열 때마다 다시 써서 늘린다)
// - <html data-theme="light|dark">를 붙인다 (auto면 뗀다). 색은 테마 CSS(themes/*.css)가 이 속성과 시스템 설정으로 정한다.
// - meta[name=theme-color]를 지금 테마의 --bg로 맞춘다.
// - .theme 안의 button[data-theme="auto|light|dark"]를 누르면 바뀐다 (aria-pressed 표시). 언제 생긴 버튼이든 된다.
// - 바뀌면 document에 'themechange' 이벤트 (detail: { mode, dark }). canvas 색처럼 CSS 밖에서 쓰는 색은 이걸 듣고 갱신.
// - 다른 탭·서브도메인에서 바꾼 값은 이 페이지로 돌아올 때 따라간다.
// - globalThis.Theme = { mode, dark, set(mode) }
(() => {
  const KEY = 'theme';
  const SHARED = 'rijyori.com';
  const MODES = ['auto', 'light', 'dark'];
  const host = location.hostname;
  const cookieAttrs = '; Path=/; Max-Age=34560000; SameSite=Lax' +
    (host === SHARED || host.endsWith('.' + SHARED) ? '; Domain=' + SHARED : '') +
    (location.protocol === 'https:' ? '; Secure' : '');
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;

  const read = () => {
    const m = document.cookie.match(/(?:^|;\s*)theme=(auto|light|dark)\b/);
    if (m) return m[1];
    try { const v = localStorage.getItem(KEY); if (MODES.includes(v)) return v; } catch {}
    return 'auto';
  };
  const save = (mode) => {
    document.cookie = KEY + '=' + mode + cookieAttrs;
    try { localStorage.setItem(KEY, mode); } catch {}
  };

  let mode = read();
  const isDark = () => mode === 'dark' || (mode === 'auto' && mq.matches);

  // 화면 쪽 갱신 (버튼 표시, 주소창 색, 이벤트). CSS가 붙은 뒤에 의미가 있다
  function sync() {
    for (const b of document.querySelectorAll('.theme button[data-theme]')) b.setAttribute('aria-pressed', String(b.dataset.theme === mode));
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (bg && meta) meta.setAttribute('content', bg);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { mode, dark: isDark() } }));
  }
  function apply(m, store) {
    mode = MODES.includes(m) ? m : 'auto';
    if (mode === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    if (store) save(mode);
    if (document.readyState !== 'loading') sync();
  }

  apply(mode, true); // 다시 써서 쿠키 만료를 늘린다
  document.addEventListener('DOMContentLoaded', sync);
  addEventListener('load', sync); // 스타일시트가 늦게 붙은 경우
  mq.addEventListener('change', sync);
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('.theme button[data-theme]');
    if (b) apply(b.dataset.theme, true);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && read() !== mode) apply(read(), false);
  });

  globalThis.Theme = {
    get mode() { return mode; },
    get dark() { return isDark(); },
    set: (m) => apply(m, true),
  };
})();
