// 한국어 / 영어. 원본: web-template/core/i18n.js — 각 사이트의 i18n.js는 이 파일의 사본.
// 폰·브라우저 언어가 한국어(ko)면 한국어, 아니면 영어. 일반 스크립트로 body 맨 끝에서 (모듈보다 먼저) 읽는다.
//   HTML 고정 글자: data-en="영어" (textContent), data-en-html (innerHTML), data-en-aria (aria-label),
//                  head의 <title>/<meta>/<link rel=manifest>에도 data-en (글자·content·href를 바꿈)
//   검색 엔진이 영어로 먼저 읽게 head를 영어로 쓴 곳: data-ko="한국어" (title 글자·meta content를 한국어로) + <html lang="en">
//   코드 문구: globalThis.L10N.t('한국어', 'English')
(() => {
  const ko = /^ko\b/i.test(navigator.language || 'ko');
  const t = (k, e) => (ko ? k : e);
  globalThis.L10N = { ko, t };
  if (ko) {
    document.documentElement.lang = 'ko';
    for (const el of document.querySelectorAll('[data-ko]')) {
      if (el.tagName === 'META') el.content = el.dataset.ko;
      else el.textContent = el.dataset.ko;
    }
    return;
  }
  document.documentElement.lang = 'en';
  for (const el of document.querySelectorAll('[data-en]')) {
    if (el.tagName === 'META') el.content = el.dataset.en;
    else if (el.tagName === 'LINK') el.href = el.dataset.en;
    else el.textContent = el.dataset.en;
  }
  for (const el of document.querySelectorAll('[data-en-html]')) el.innerHTML = el.dataset.enHtml;
  for (const el of document.querySelectorAll('[data-en-aria]')) el.setAttribute('aria-label', el.dataset.enAria);
})();
