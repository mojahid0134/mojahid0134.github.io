/* ==========================================================
   NoorFeed Shared Bottom Navigation
   এই ফাইলটা সব page (index, quran, tasbih, names, view, rewards)
   এ same থাকবে, তাই bottom nav সবজায়গায় pinned/consistent দেখাবে।
   ========================================================== */
(function () {
  const APP_MODE = new URLSearchParams(window.location.search).get('app') === '1';
  function withApp(url) { return url + (APP_MODE ? (url.includes('?') ? '&' : '?') + 'app=1' : ''); }

  const style = document.createElement('style');
  style.textContent = `
    .nf-bottom-nav {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 500;
      background: #fff; display: flex; justify-content: space-around; align-items: center;
      padding: 8px 4px calc(8px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
    }
    .nf-nav-item {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      border: none; background: none; padding: 6px 10px; border-radius: 14px;
      color: #888; font-size: 11px; font-weight: 700; min-width: 60px;
    }
    .nf-nav-item svg { width: 22px; height: 22px; }
    .nf-nav-item.active { color: #6D28D9; background: #f1eefc; }
    .nf-nav-item.active.rewards-active { color: #fff; background: #6D28D9; }
    .nf-nav-spacer { height: 68px; }
  `;
  document.head.appendChild(style);

  const ICONS = {
    home: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    favourite: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.5z"/>`,
    history: `<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>`,
    rewards: `<path d="M20 12v9H4v-9"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`
  };

  function buildNav(active) {
    const nav = document.createElement('div');
    nav.className = 'nf-bottom-nav';
    nav.id = 'nfBottomNav';
    [
      { key: 'home', label: 'Home' },
      { key: 'favourite', label: 'Favourite' },
      { key: 'history', label: 'History' },
      { key: 'rewards', label: 'Rewards' }
    ].forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nf-nav-item' + (active === item.key ? ' active' : '') + (active === item.key && item.key === 'rewards' ? ' rewards-active' : '');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[item.key]}</svg><span>${item.label}</span>`;
      btn.addEventListener('click', () => handleNavClick(item.key));
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);
  }

  function handleNavClick(key) {
    const onIndex = /(^|\/)index\.html$/.test(window.location.pathname) || window.location.pathname.endsWith('/') || window.location.pathname === '';
    if (key === 'rewards') { window.location.href = withApp('rewards.html'); return; }
    if (onIndex && typeof window.nfSetFilter === 'function') {
      window.nfSetFilter(key);
      window.scrollTo(0, 0);
      return;
    }
    const target = key === 'home' ? 'index.html' : 'index.html?filter=' + key;
    window.location.href = withApp(target);
  }

  window.NFNav = { init: buildNav };
})();
