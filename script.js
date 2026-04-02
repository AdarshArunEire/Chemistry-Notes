(function(){
  /* ACTIVE NAV LINK */
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

  /* NAV TOGGLE */
  const nav = document.querySelector('.page-nav, .sidebar');
  if(nav){
    const btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label','Toggle left navigation');
    btn.textContent = '☰';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('nav-collapsed');
      try { localStorage.setItem('chem-nav-collapsed', document.body.classList.contains('nav-collapsed') ? '1' : '0'); } catch(e) {}
    });
    document.body.appendChild(btn);
    try {
      if(localStorage.getItem('chem-nav-collapsed') === '1') document.body.classList.add('nav-collapsed');
    } catch(e) {}
  }

  /* THEME TOGGLE — now with 4 themes + Focus mode */
  const themes = [
    {id:'classic', label:'Classic'},
    {id:'editorial', label:'Editorial'},
    {id:'study', label:'Study'},
    {id:'darklab', label:'Dark Lab'}
  ];
  const root = document.documentElement;
  let current = 'editorial';
  try { current = localStorage.getItem('chem-theme') || 'editorial'; } catch(e) {}
  if(!themes.some(t => t.id === current)) current = 'editorial';
  root.setAttribute('data-theme', current);

  const switcher = document.createElement('div');
  switcher.className = 'theme-switcher';
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = 'Style';
  switcher.appendChild(label);

  const setTheme = (id) => {
    root.setAttribute('data-theme', id);
    try { localStorage.setItem('chem-theme', id); } catch(e) {}
    switcher.querySelectorAll('.theme-btn').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.theme === id ? 'true' : 'false'));
  };

  themes.forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'theme-btn';
    btn.type = 'button';
    btn.dataset.theme = theme.id;
    btn.setAttribute('aria-pressed', theme.id === current ? 'true' : 'false');
    btn.textContent = theme.label;
    btn.addEventListener('click', () => setTheme(theme.id));
    switcher.appendChild(btn);
  });

  /* FOCUS MODE TOGGLE */
  let focusOn = false;
  try { focusOn = localStorage.getItem('chem-focus') === '1'; } catch(e) {}
  if(focusOn) root.setAttribute('data-mode', 'focus');

  const focusBtn = document.createElement('button');
  focusBtn.className = 'focus-btn';
  focusBtn.type = 'button';
  focusBtn.textContent = 'Focus';
  focusBtn.setAttribute('aria-pressed', focusOn ? 'true' : 'false');
  focusBtn.addEventListener('click', () => {
    focusOn = !focusOn;
    if(focusOn){
      root.setAttribute('data-mode', 'focus');
    } else {
      root.removeAttribute('data-mode');
    }
    focusBtn.setAttribute('aria-pressed', focusOn ? 'true' : 'false');
    try { localStorage.setItem('chem-focus', focusOn ? '1' : '0'); } catch(e) {}
  });
  switcher.appendChild(focusBtn);

  document.body.appendChild(switcher);
  setTheme(current);

  /* READING PROGRESS BAR */
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);

  function updateProgress(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if(docHeight > 0){
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      progressBar.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  /* SCROLL-REVEAL ANIMATIONS */
  const revealTargets = [
    '.panel', '.note-card', '.practice-card', '.diagram-box',
    '.defn', '.note', '.exam-tip', '.result', '.callout',
    '.rxn-box', '.lc-box', '.cover',
    '.status-table', '.struct-table', '.sum-table', '.summary-table', '.info-table'
  ].join(',');

  document.querySelectorAll(revealTargets).forEach(el => {
    el.classList.add('reveal');
  });

  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  /* BACK TO TOP BUTTON */
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.type = 'button';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(topBtn);

  function updateTopBtn(){
    if(window.scrollY > 400) topBtn.classList.add('visible');
    else topBtn.classList.remove('visible');
  }
  window.addEventListener('scroll', updateTopBtn, {passive:true});
  updateTopBtn();

  /* MOBILE: NAV LINK → AUTO-SCROLL TO CONTENT */
  function isMobile(){ return window.innerWidth <= 900; }

  if(nav && isMobile()){
    const contentArea = document.querySelector('.content, .page-content');
    if(contentArea){
      setTimeout(() => {
        const navRect = nav.getBoundingClientRect();
        if(navRect.height > 100 && !document.body.classList.contains('nav-collapsed')){
          contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }

  if(nav){
    nav.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', () => {
        if(!isMobile()) return;
        const href = link.getAttribute('href') || '';
        const target = href.split('/').pop();
        if(target !== path){
          try { sessionStorage.setItem('chem-scroll-to-content', '1'); } catch(ex){}
        }
      });
    });
    try {
      if(sessionStorage.getItem('chem-scroll-to-content') === '1' && isMobile()){
        sessionStorage.removeItem('chem-scroll-to-content');
        const contentArea = document.querySelector('.content, .page-content');
        if(contentArea){
          setTimeout(() => {
            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 250);
        }
      }
    } catch(ex){}
  }

})();
