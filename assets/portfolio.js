'use strict';

function experienceMonths(now = new Date()) {
  return Math.max(0, (now.getFullYear() - 2025) * 12 + now.getMonth() - 5);
}
function formatExperience(months) {
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return [years ? `${years} ${years === 1 ? 'year' : 'years'}` : '',
    remainder ? `${remainder} ${remainder === 1 ? 'month' : 'months'}` : '']
    .filter(Boolean).join(' · ') || 'Less than a month';
}
function projectMonths(startValue, now = new Date()) {
  const [year, month] = startValue.split('-').map(Number);
  return Math.max(0, (now.getFullYear() - year) * 12 + now.getMonth() - (month - 1));
}
function refreshExperience() {
  document.querySelectorAll('[data-experience="mvc"]').forEach(el => {
    el.textContent = formatExperience(experienceMonths());
    el.title = 'Hands-on experience since June 2025';
  });
  document.querySelectorAll('[data-project-start]').forEach(el => {
    const months = projectMonths(el.dataset.projectStart);
    el.textContent = months === 0 ? 'Started this month' : formatExperience(months);
  });
  document.getElementById('year').textContent = new Date().getFullYear();
}
refreshExperience();
setInterval(refreshExperience, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshExperience(); });

const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
function closeMenu() {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', String(navLinks.classList.toggle('open')));
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', e => { if (!e.target.closest('nav')) closeMenu(); });
window.matchMedia('(min-width: 981px)').addEventListener('change', closeMenu);

const anchors = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('section[id]')];
let scrollPending = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.getElementById('progressBar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  let current = '';
  sections.forEach(section => { if (scrollY >= section.offsetTop - 180) current = section.id; });
  anchors.forEach(a => {
    const active = a.hash === `#${current}`;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll);
document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', updateScroll));
updateScroll();
