/* ============================================================
   js/main.js  —  Lógica completa del portafolio
   Incluye: cursor, navbar, foto, estudios, carrusel,
            formulario y mensajes guardados
   ============================================================ */

/* ══════════════════════════════
   CURSOR — se activa solo cuando el mouse entra a la página
   para evitar que quede pegado en una esquina al cargar
   ══════════════════════════════ */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let cursorActive = false;

document.addEventListener('mousemove', e => {
  // Activar el cursor personalizado la primera vez que el mouse se mueve
  if (!cursorActive) {
    cursorActive = true;
    document.body.classList.add('cursor-ready');
  }
  cursorDot.style.left  = e.clientX + 'px';
  cursorDot.style.top   = e.clientY + 'px';
  // El anillo sigue con ligero delay (efecto de arrastre)
  setTimeout(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top  = e.clientY + 'px';
  }, 85);
});

// Cursor hover en links y botones
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, label, [role=button], .stack-btn, .stack-dot, .soc-btn')) {
    cursorDot.classList.add('cursor-hover');
    cursorRing.classList.add('cursor-hover');
  }
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('a, button, label, [role=button], .stack-btn, .stack-dot, .soc-btn')) {
    cursorDot.classList.remove('cursor-hover');
    cursorRing.classList.remove('cursor-hover');
  }
});

// Ocultar cursores al salir de la ventana
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});

/* ══════════════════════════════
   NAVBAR — enlace activo + cerrar móvil
   ══════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-link-custom');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

navLinks.forEach(a => {
  a.addEventListener('click', () => {
    const col = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
    if (col) col.hide();
  });
});

/* ══════════════════════════════
   FADE-UP al hacer scroll
   ══════════════════════════════ */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* ══════════════════════════════
   ESTUDIOS — datos y tarjetas móvil
   Solo se muestra la tabla fija, sin botón de agregar
   ══════════════════════════════ */
const studyData = [
  { lvl: 'Técnico', cls: 'lvl-tec', inst: 'SENA',                 course: 'Técnico en Sistemas',    years: '2021–2022',    loc: 'Colombia'    },
  { lvl: 'Carrera', cls: 'lvl-car', inst: 'Universidad del Cauca', course: 'Ingeniería en Sistemas',  years: '2022–Presente', loc: 'Popayán, CO' },
  { lvl: 'Curso',   cls: 'lvl-cur', inst: 'Udemy',                 course: 'Diseño Web Completo',     years: '2023',         loc: 'En línea'    }
];

function renderStudyCards() {
  const wrap = document.getElementById('studyCards');
  wrap.innerHTML = '';
  studyData.forEach(d => {
    wrap.innerHTML += `
      <div class="study-card">
        <div class="study-card-top">
          <span class="lvl-badge ${d.cls}">${d.lvl}</span>
          <span class="study-card-years">${d.years}</span>
        </div>
        <div class="study-card-inst">${d.inst}</div>
        <div class="study-card-course">${d.course}</div>
        <div class="study-card-loc">
          <i class="bi bi-geo-alt" style="font-size:.68rem"></i> ${d.loc}
        </div>
      </div>`;
  });
}
renderStudyCards();

/* ══════════════════════════════
   CARRUSEL STACK / 3D DEPTH
   ══════════════════════════════ */
const cards      = Array.from(document.querySelectorAll('.stack-card'));
const totalCards = cards.length;
let   stackIdx   = 0;

function stackGoTo(n) {
  stackIdx = (n + totalCards) % totalCards;
  const prev = (stackIdx - 1 + totalCards) % totalCards;
  const next = (stackIdx + 1) % totalCards;

  cards.forEach((c, i) => {
    c.classList.remove('is-active', 'is-prev', 'is-next');
    if (i === stackIdx)  c.classList.add('is-active');
    else if (i === prev) c.classList.add('is-prev');
    else if (i === next) c.classList.add('is-next');
  });

  // Barra progreso
  document.getElementById('stackPBar').style.width =
    ((stackIdx + 1) / totalCards * 100) + '%';
  // Contador
  document.getElementById('stackCounter').textContent =
    (stackIdx + 1) + ' / ' + totalCards;
  // Dots
  document.querySelectorAll('.stack-dot').forEach((d, i) =>
    d.classList.toggle('active', i === stackIdx)
  );
}

function stackMove(dir) { stackGoTo(stackIdx + dir); }

// Construir dots
(function buildDots() {
  const wrap = document.getElementById('stackDots');
  wrap.innerHTML = '';
  for (let i = 0; i < totalCards; i++) {
    const btn = document.createElement('button');
    btn.className = 'stack-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Pasatiempo ' + (i + 1));
    btn.onclick = (idx => () => stackGoTo(idx))(i);
    wrap.appendChild(btn);
  }
})();

// Swipe táctil
let swipeStart = 0;
const carouselEl = document.getElementById('stackCarousel');
carouselEl.addEventListener('touchstart', e => { swipeStart = e.touches[0].clientX; }, { passive: true });
carouselEl.addEventListener('touchend',   e => {
  const diff = swipeStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 44) stackMove(diff > 0 ? 1 : -1);
});

// Inicializar
stackGoTo(0);

/* ══════════════════════════════
   FORMULARIO — validación en tiempo real + al enviar
   ══════════════════════════════ */
function mark(id, ok) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('bad',  !ok);
  el.classList.toggle('good',  ok);
}
function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function vName()  { const v = document.getElementById('fName').value.trim();  const ok = v.length >= 2; if(v) mark('fName',  ok); showErr('eN',  !ok && v.length > 0); return ok; }
function vEmail() { const v = document.getElementById('fEmail').value.trim(); const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); if(v) mark('fEmail', ok); showErr('eE', !ok && v.length > 0); return ok; }
function vPhone() { const v = document.getElementById('fPhone').value.trim(); const ok = v === '' || /^[\d\s+\-(). ]{7,16}$/.test(v); if(v) mark('fPhone', ok); showErr('eP', !ok && v.length > 0); return ok; }
function vMot()   { const v = document.getElementById('fMot').value;          const ok = v !== '';  mark('fMot',  ok); showErr('eM',  !ok); return ok; }
function vMsg()   { const v = document.getElementById('fMsg').value.trim();   const ok = v.length >= 10; if(v) mark('fMsg', ok); showErr('eMg', !ok && v.length > 0); return ok; }

document.getElementById('fName').addEventListener('input',  vName);
document.getElementById('fEmail').addEventListener('input', vEmail);
document.getElementById('fPhone').addEventListener('input', vPhone);
document.getElementById('fMot').addEventListener('change',  vMot);
document.getElementById('fMsg').addEventListener('input',   vMsg);

/* ══════════════════════════════
   MENSAJES GUARDADOS
   ══════════════════════════════ */
let savedMsgs = [];

function escHtml(s) {
  return (s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderSaved() {
  const box   = document.getElementById('savedBox');
  const empty = document.getElementById('savedEmpty');
  document.getElementById('savedCount').textContent = savedMsgs.length;
  box.querySelectorAll('.msg-item').forEach(el => el.remove());

  if (savedMsgs.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  savedMsgs.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'msg-item';
    el.innerHTML = `
      <div class="msg-top">
        <span class="msg-name">
          <i class="bi bi-person-circle me-1" style="color:var(--rose-300)"></i>${escHtml(m.nombre)}
        </span>
        <span class="msg-motivo">${escHtml(m.motivo)}</span>
        <span class="msg-date">${m.fecha}</span>
        <button class="btn-del-msg" onclick="deleteMsg(${i})" title="Eliminar">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
      <div class="msg-text">"${escHtml(m.mensaje)}"</div>
      <div class="msg-pref">
        <i class="bi bi-reply me-1"></i>Responder por: <strong>${escHtml(m.pref)}</strong>
        ${m.correo   ? ' &nbsp;·&nbsp; ' + escHtml(m.correo)   : ''}
        ${m.telefono ? ' &nbsp;·&nbsp; ' + escHtml(m.telefono) : ''}
      </div>`;
    box.appendChild(el);
  });
}

function deleteMsg(i) { savedMsgs.splice(i, 1); renderSaved(); }

function sendForm(e) {
  e.preventDefault();
  const okN = vName(), okE = vEmail(), okP = vPhone(), okM = vMot(), okMg = vMsg();
  if (!okN)  { showErr('eN',  true); mark('fName',  false); }
  if (!okE)  { showErr('eE',  true); mark('fEmail', false); }
  if (!okM)  { showErr('eM',  true); mark('fMot',   false); }
  if (!okMg) { showErr('eMg', true); mark('fMsg',   false); }
  const terms = document.getElementById('fTerms').checked;
  showErr('eT', !terms);
  if (!okN || !okE || !okP || !okM || !okMg || !terms) return;

  const pref = document.querySelector('input[name="pref"]:checked').value;
  savedMsgs.unshift({
    nombre:   document.getElementById('fName').value.trim(),
    correo:   document.getElementById('fEmail').value.trim(),
    telefono: document.getElementById('fPhone').value.trim(),
    motivo:   document.getElementById('fMot').value,
    mensaje:  document.getElementById('fMsg').value.trim(),
    pref:     pref === 'correo' ? 'Correo' : 'Teléfono',
    fecha:    new Date().toLocaleString('es-CO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
  });

  renderSaved();
  document.getElementById('contactForm').reset();
  document.querySelectorAll('.finput').forEach(el => el.classList.remove('bad','good'));

  // Flash en la caja de mensajes
  const box = document.getElementById('savedBox');
  box.style.borderColor = 'var(--rose-400)';
  setTimeout(() => { box.style.borderColor = ''; }, 1200);
}

renderSaved();
