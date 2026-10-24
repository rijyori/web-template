// 모달·토스트 (core/base.css의 .modal / .toast). ES module:  import { toast, modal } from './ui.js';
// 필요한 요소는 처음 부를 때 body 끝에 만든다.
let toastTimer;

export function toast(msg, ms = 1600) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

// actions: [{ label, run?, secondary? }] — 누르면 창을 닫고 run()
export function modal(title, text, actions) {
  let m = document.querySelector('.modal');
  if (!m) {
    m = document.createElement('div');
    m.className = 'modal';
    m.hidden = true;
    m.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true"><h2></h2><p></p><div class="modal-actions"></div></div>';
    document.body.appendChild(m);
  }
  m.querySelector('h2').textContent = title;
  m.querySelector('p').textContent = text;
  const box = m.querySelector('.modal-actions');
  box.innerHTML = '';
  for (const a of actions) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = a.label;
    if (a.secondary) b.className = 'secondary';
    b.addEventListener('click', () => { m.hidden = true; a.run?.(); });
    box.appendChild(b);
  }
  m.hidden = false;
}
