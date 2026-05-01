// HERO INIT
function initHeroLayout() {
  const card = document.querySelector('.pg-card');
  const rank = document.querySelector('.pg-rank-xp__rank');
  const xp = document.querySelector('.pg-rank-xp__xp');

  if (!card || !rank || !xp) return;

  document.querySelector('.pg-hero-center').appendChild(card);
  document.querySelector('.pg-hero-left').appendChild(rank);
  document.querySelector('.pg-hero-right').appendChild(xp);
}

document.addEventListener('DOMContentLoaded', initHeroLayout);
