/* ==========================================================
   NoorFeed Shared Bottom Navigation + Rewards Panel
   এই ফাইলটা সব page (index, quran, tasbih, names, view) এ same
   থাকবে, তাই bottom nav সবজায়গায় pinned/consistent দেখাবে।
   Rewards এখন আলাদা page না — একটা non-fullscreen sliding panel
   (bottom sheet), যা কারেন্ট page-এর উপর overlay হয়ে খোলে।
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

    /* ===== Rewards Panel (non-fullscreen sliding sheet, All-Sections modal-এর মতো) ===== */
    .nf-rewards-backdrop {
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 700;
      align-items: flex-end; justify-content: center;
    }
    .nf-rewards-backdrop.open { display: flex; }
    .nf-rewards-panel {
      background: #f4f5f7; width: 100%; max-width: 480px; border-radius: 20px 20px 0 0;
      max-height: 85vh; overflow-y: auto; -webkit-overflow-scrolling: touch;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .nf-rewards-header {
      position: sticky; top: 0; z-index: 2; background: linear-gradient(135deg,#2a1650,#4a2a6d);
      color: #fff; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center;
      border-radius: 20px 20px 0 0;
    }
    .nf-rewards-header h3 { font-size: 17px; font-weight: 800; }
    .nf-rewards-close {
      background: rgba(255,255,255,0.18); border: none; color: #fff;
      width: 30px; height: 30px; border-radius: 50%; font-size: 15px;
    }
    .nf-rewards-body { padding: 24px 20px; text-align: center; color: #888; font-size: 14px; line-height: 1.7; }
    .nf-rewards-body b { color: #4a2a6d; }
  `;
  document.head.appendChild(style);

  const ICONS = {
    home: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    favourite: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.5z"/>`,
    history: `<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>`,
    rewards: `<path d="M20 12v9H4v-9"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`
  };

  let rewardsBackdrop = null;
  let rewardsNavBtn = null;

  function buildRewardsPanel() {
    const backdrop = document.createElement('div');
    backdrop.className = 'nf-rewards-backdrop';
    backdrop.id = 'nfRewardsBackdrop';
    backdrop.innerHTML = `
      <div class="nf-rewards-panel">
        <div class="nf-rewards-header">
          <h3>🎁 Rewards</h3>
          <button class="nf-rewards-close" id="nfRewardsCloseBtn">✕</button>
        </div>
        <div class="nf-rewards-body">
          <b>Rewards Panel — পরের ধাপে বসবে।</b><br><br>
          এখানে Progress, Watch Ad, Reward Claim, Donation, Rate/Share App, How It Works, আর Reward History — সবকিছু আসবে।
        </div>
      </div>
    `;
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeRewards(); });
    document.body.appendChild(backdrop);
    document.getElementById('nfRewardsCloseBtn').addEventListener('click', closeRewards);
    rewardsBackdrop = backdrop;
  }

  function openRewards() {
    if (rewardsBackdrop) rewardsBackdrop.classList.add('open');
    if (rewardsNavBtn) rewardsNavBtn.classList.add('active', 'rewards-active');
  }
  function closeRewards() {
    if (rewardsBackdrop) rewardsBackdrop.classList.remove('open');
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
