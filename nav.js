/* ==========================================================
   NoorFeed Shared Bottom Navigation + Rewards Panel
   এই ফাইলটা সব page (index, quran, tasbih, names, view) এ same
   থাকবে, তাই bottom nav সবজায়গায় pinned/consistent দেখাবে।

   Rewards কোনো modal/dark-overlay না — এটা ঠিক Home/Favourite/
   History-এর মতোই একটা full-content panel, যেটা current page-এর
   উপর বসে (dark background ছাড়া), আর Bottom Nav সবসময় স্বাভাবিক
   ভাবে উপরে visible/clickable থাকে। অন্য কোনো Tab (Home/Favourite/
   History)-এ click করলেই এটা সরে গিয়ে আগের content ফিরে আসবে।
   ========================================================== */
(function () {
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

    /* ===== Rewards Panel — dark overlay নেই, Home/Favourite/History-এর মতো একটা normal tab ===== */
    .nf-rewards-panel {
      display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 68px; z-index: 400;
      background: #f4f5f7; overflow-y: auto; -webkit-overflow-scrolling: touch;
    }
    .nf-rewards-panel.open { display: block; }
    .nf-rewards-header {
      background: linear-gradient(135deg,#2a1650,#4a2a6d); color: #fff;
      padding: 18px 20px 22px;
    }
    .nf-rewards-header h3 { font-size: 19px; font-weight: 800; }
    .nf-rewards-header p { font-size: 12.5px; color: #efe6ff; margin-top: 4px; }
    .nf-rewards-body { padding: 20px; text-align: center; color: #888; font-size: 14px; line-height: 1.7; }
    .nf-rewards-body b { color: #4a2a6d; }
  `;
  document.head.appendChild(style);

  const ICONS = {
    home: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    favourite: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.5z"/>`,
    history: `<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>`,
    rewards: `<path d="M20 12v9H4v-9"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`
  };

  let rewardsPanel = null;
  let rewardsNavBtn = null;

  function buildRewardsPanel() {
    const panel = document.createElement('div');
    panel.className = 'nf-rewards-panel';
    panel.id = 'nfRewardsPanel';
    panel.innerHTML = `
      <div class="nf-rewards-header">
        <h3>🎁 Rewards</h3>
        <p>Watch Ads, Earn Rewards, Support NoorFeed</p>
      </div>
      <div class="nf-rewards-body">
        <b>Rewards Panel — পরের ধাপে বসবে।</b><br><br>
        এখানে Progress, Watch Ad, Reward Claim, Donation, Rate/Share App, How It Works, আর Reward History — সবকিছু আসবে।
      </div>
    `;
    document.body.appendChild(panel);
    rewardsPanel = panel;
  }

  function openRewards() {
    if (rewardsPanel) rewardsPanel.classList.add('open');
    if (rewardsNavBtn) rewardsNavBtn.classList.add('active', 'rewards-active');
  }
  function closeRewards() {
    if (rewardsPanel) rewardsPanel.classList.remove('open');
    if (rewardsNavBtn) rewardsNavBtn.classList.remove('active', 'rewards-active');
  }

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
      btn.className = 'nf-nav-item' + (active === item.key ? ' active' : '');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[item.key]}</svg><span>${item.label}</span>`;
      btn.addEventListener('click', () => handleNavClick(item.key));
      if (item.key === 'rewards') rewardsNavBtn = btn;
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);
    buildRewardsPanel();
  }

  function handleNavClick(key) {
    if (key === 'rewards') { openRewards(); return; }
    // অন্য যেকোনো Tab-এ গেলে Rewards panel বন্ধ হয়ে যাবে
    closeRewards();
    if (typeof window.nfSetFilter === 'function') {
      window.nfSetFilter(key);
      window.scrollTo(0, 0);
      return;
    }
    const APP_MODE = new URLSearchParams(window.location.search).get('app') === '1';
    const target = key === 'home' ? 'index.html' : 'index.html?filter=' + key;
    window.location.href = target + (APP_MODE ? (target.includes('?') ? '&' : '?') + 'app=1' : '');
  }

  window.NFNav = { init: buildNav, openRewards: openRewards, closeRewards: closeRewards };
})();
