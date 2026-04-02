(function(){
  /* ═══ ACTIVE NAV LINK ═══ */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.side-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const target = href.split('/').pop();
    if(target === path){
      a.classList.add('active');
      const group = a.closest('details.nav-group');
      if(group) group.setAttribute('open','');
    }
  });
  if(path !== 'index.html'){
    document.querySelectorAll('details.nav-group').forEach(group => {
      if(!group.querySelector('a.active')) group.removeAttribute('open');
    });
  }

  /* ═══ NAV TOGGLE ═══ */
  const nav = document.querySelector('.page-nav, .sidebar');
  if(nav){
    const btn = document.createElement('button');
    btn.className = 'nav-toggle'; btn.type = 'button';
    btn.setAttribute('aria-label','Toggle navigation');
    btn.textContent = '☰';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('nav-collapsed');
      try { localStorage.setItem('chem-nav', document.body.classList.contains('nav-collapsed') ? '1' : '0'); } catch(e){}
    });
    document.body.appendChild(btn);
    try { if(localStorage.getItem('chem-nav') === '1') document.body.classList.add('nav-collapsed'); } catch(e){}
  }

  /* ═══ STATE ═══ */
  const root = document.documentElement;
  let theme = 'editorial', dark = false, focus = false;
  try { theme = localStorage.getItem('chem-theme') || 'editorial'; } catch(e){}
  try { dark = localStorage.getItem('chem-dark') === '1'; } catch(e){}
  try { focus = localStorage.getItem('chem-focus') === '1'; } catch(e){}
  if(!['classic','editorial','study'].includes(theme)) theme = 'editorial';

  function applyState(){
    root.setAttribute('data-theme', theme);
    if(dark) root.setAttribute('data-dark','true'); else root.removeAttribute('data-dark');
    if(focus) root.setAttribute('data-focus','true'); else root.removeAttribute('data-focus');
    try {
      localStorage.setItem('chem-theme', theme);
      localStorage.setItem('chem-dark', dark ? '1' : '0');
      localStorage.setItem('chem-focus', focus ? '1' : '0');
    } catch(e){}
    // Update button states
    document.querySelectorAll('.s-theme').forEach(b => b.setAttribute('aria-pressed', b.dataset.theme === theme ? 'true' : 'false'));
    const darkBtn = document.querySelector('.s-dark');
    if(darkBtn){
      darkBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      darkBtn.querySelector('.s-icon').textContent = dark ? '☀️' : '🌙';
      darkBtn.querySelector('.s-text').textContent = dark ? 'Light' : 'Dark';
    }
    const focusBtn = document.querySelector('.s-focus');
    if(focusBtn) focusBtn.setAttribute('aria-pressed', focus ? 'true' : 'false');
  }

  /* ═══ COMPACT SETTINGS DROPDOWN ═══ */
  // Gear button
  const trigger = document.createElement('button');
  trigger.className = 'settings-trigger'; trigger.type = 'button';
  trigger.setAttribute('aria-label','Settings');
  trigger.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

  // Dropdown panel
  const panel = document.createElement('div');
  panel.className = 'settings-panel';
  panel.innerHTML = `
    <div class="settings-section">
      <div class="settings-label">Style</div>
      <div class="settings-row">
        <button class="s-btn s-theme" data-theme="classic" type="button">Classic</button>
        <button class="s-btn s-theme" data-theme="editorial" type="button">Editorial</button>
        <button class="s-btn s-theme" data-theme="study" type="button">Study</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Mode</div>
      <div class="settings-row">
        <button class="s-toggle s-dark" type="button" aria-pressed="false">
          <span class="s-text">Dark</span><span class="s-icon">🌙</span>
        </button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">Reading</div>
      <div class="settings-row">
        <button class="s-toggle s-focus" type="button" aria-pressed="false">
          <span>Focus</span><span class="s-icon">📖</span>
        </button>
      </div>
    </div>
  `;

  // Click-outside overlay
  const overlay = document.createElement('div');
  overlay.className = 'settings-overlay';

  let panelOpen = false;
  function togglePanel(){
    panelOpen = !panelOpen;
    panel.classList.toggle('open', panelOpen);
    overlay.classList.toggle('open', panelOpen);
  }
  trigger.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(); });
  overlay.addEventListener('click', () => { if(panelOpen) togglePanel(); });

  document.body.appendChild(overlay);
  document.body.appendChild(trigger);
  document.body.appendChild(panel);

  // Theme buttons
  panel.querySelectorAll('.s-theme').forEach(btn => {
    btn.addEventListener('click', () => { theme = btn.dataset.theme; applyState(); });
  });
  // Dark toggle
  panel.querySelector('.s-dark').addEventListener('click', () => { dark = !dark; applyState(); });
  // Focus toggle
  panel.querySelector('.s-focus').addEventListener('click', () => { focus = !focus; applyState(); });

  applyState();

  /* ═══ READING PROGRESS BAR ═══ */
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);
  function updateProgress(){
    const st = window.scrollY || document.documentElement.scrollTop;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if(dh > 0) progressBar.style.width = Math.min((st/dh)*100,100)+'%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  /* ═══ SCROLL-REVEAL ═══ */
  const revealTargets = '.panel,.note-card,.practice-card,.diagram-box,.defn,.note,.exam-tip,.result,.callout,.rxn-box,.lc-box,.cover,.status-table,.struct-table,.sum-table,.summary-table,.info-table';
  document.querySelectorAll(revealTargets).forEach(el => el.classList.add('reveal'));
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); }});
    }, {threshold:.08, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  /* ═══ BACK TO TOP ═══ */
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top'; topBtn.type = 'button';
  topBtn.setAttribute('aria-label','Back to top');
  topBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  topBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  document.body.appendChild(topBtn);
  function updateTopBtn(){ topBtn.classList.toggle('visible', window.scrollY > 400); }
  window.addEventListener('scroll', updateTopBtn, {passive:true});
  updateTopBtn();

  /* ═══ MOBILE: AUTO-SCROLL TO CONTENT ═══ */
  function isMobile(){ return window.innerWidth <= 900; }
  if(nav && isMobile()){
    const ca = document.querySelector('.content,.page-content');
    if(ca) setTimeout(() => {
      if(nav.getBoundingClientRect().height > 100 && !document.body.classList.contains('nav-collapsed'))
        ca.scrollIntoView({behavior:'smooth',block:'start'});
    }, 150);
  }
  if(nav){
    nav.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', () => {
        if(!isMobile()) return;
        const t = (link.getAttribute('href')||'').split('/').pop();
        if(t !== path) try { sessionStorage.setItem('chem-scroll','1'); } catch(e){}
      });
    });
    try {
      if(sessionStorage.getItem('chem-scroll') === '1' && isMobile()){
        sessionStorage.removeItem('chem-scroll');
        const ca = document.querySelector('.content,.page-content');
        if(ca) setTimeout(() => ca.scrollIntoView({behavior:'smooth',block:'start'}), 250);
      }
    } catch(e){}
  }

  /* ═══ WRAP TABLES FOR SCROLL ON MOBILE ═══ */
  document.querySelectorAll('.status-table,.struct-table,.sum-table,.summary-table,.info-table').forEach(table => {
    if(table.parentElement && table.parentElement.classList.contains('struct-table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'overflow-x:auto;-webkit-overflow-scrolling:touch;margin:18px 0';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
    table.style.margin = '0';
  });

})();
