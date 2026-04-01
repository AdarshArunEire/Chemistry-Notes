
(function(){
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

  // nav toggle
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

  // theme toggle
  const themes = [
    {id:'classic', label:'Classic'},
    {id:'editorial', label:'Editorial'},
    {id:'study', label:'Study'}
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
  document.body.appendChild(switcher);
  setTheme(current);
})();
