/* ==========================================================================
   OceanShield AI - Community Feed & Gamification Engine
   ========================================================================== */

const COMMUNITY_FEED_DATA = [
  {
    id: "POST-101",
    author: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    badge: "Coastal Guardian",
    content: "Cleared floating debris washed ashore at Marina Beach near Lighthouse loop. Keep our coastlines safe and clean! 🌊🧹",
    timestamp: "1 Hour ago",
    likes: 42,
    comments: 8
  },
  {
    id: "POST-102",
    author: "Meera Patel",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    badge: "First Responder",
    content: "Conducted high-wave safety awareness session with local fisherman association in RK Beach. Always wear life jackets!",
    timestamp: "3 Hours ago",
    likes: 89,
    comments: 14
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderCommunityFeed();
  renderLeaderboard();
});

function renderCommunityFeed() {
  const container = document.getElementById('community-feed-container');
  if (!container) return;

  container.innerHTML = COMMUNITY_FEED_DATA.map(p => `
    <div class="glass-card" style="padding: 1.25rem; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${p.avatar}" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--cyan-primary);">
          <div>
            <h4 style="font-size: 0.95rem; margin: 0;">${p.author}</h4>
            <span class="badge badge-info" style="font-size: 0.65rem;">${p.badge}</span>
          </div>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-dim);">${p.timestamp}</span>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.85rem;">${p.content}</p>
      <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 0.6rem;">
        <button onclick="likePost('${p.id}', this)" style="background: none; border: none; color: var(--text-muted); cursor: pointer;"><i class="fa-solid fa-heart"></i> ${p.likes} Likes</button>
        <span><i class="fa-solid fa-comment"></i> ${p.comments} Comments</span>
        <button onclick="showToast('Post shared to social feeds!', 'info')" style="background: none; border: none; color: var(--text-muted); cursor: pointer;"><i class="fa-solid fa-share"></i> Share</button>
      </div>
    </div>
  `).join('');
}

function renderLeaderboard() {
  const container = document.getElementById('volunteer-leaderboard');
  if (!container) return;

  const users = Storage.getUsers();

  container.innerHTML = users.map((u, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: rgba(0, 242, 254, 0.04); border-radius: var(--radius-sm); margin-bottom: 0.5rem; border: 1px solid var(--border-color);">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-weight: 800; font-size: 1.1rem; color: ${idx === 0 ? 'var(--gold-accent)' : 'var(--cyan-primary)'}; width: 24px;">#${idx + 1}</span>
        <img src="${u.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
        <div>
          <h4 style="font-size: 0.85rem; margin: 0;">${u.name}</h4>
          <span style="font-size: 0.7rem; color: var(--text-dim);">${u.district || 'India'}</span>
        </div>
      </div>
      <div style="text-align: right;">
        <strong style="color: var(--cyan-primary); font-size: 0.95rem;">${u.points || 350} pts</strong>
        <div style="font-size: 0.65rem; color: var(--text-muted);">${u.badge || 'Coastal Defender'}</div>
      </div>
    </div>
  `).join('');
}

function likePost(id, btnEl) {
  btnEl.style.color = 'var(--color-critical)';
  showToast('Liked Community Volunteer Post!', 'success');
}
