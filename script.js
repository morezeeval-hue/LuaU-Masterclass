const root = document.documentElement;
const body = document.body;
const menuButton = document.querySelector('.menu-button');
const progress = document.querySelector('.reading-progress');
let currentLang = localStorage.getItem('luau-masterclass-lang') || 'de';

menuButton?.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#site-nav a').forEach(link => link.addEventListener('click', () => {
  body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const copyText = { de: 'Code kopieren', en: 'Copy code' };
const copiedText = { de: 'Kopiert', en: 'Copied' };
document.querySelectorAll('pre').forEach(pre => {
  const button = document.createElement('button');
  button.className = 'copy-code';
  button.type = 'button';
  button.textContent = copyText[currentLang] || copyText.de;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector('code')?.innerText || '');
      button.textContent = copiedText[currentLang] || copiedText.de;
      setTimeout(() => button.textContent = copyText[currentLang] || copyText.de, 1100);
    } catch {
      button.textContent = 'Error';
    }
  });
  pre.appendChild(button);
});

const translations = {
  de: {
    title: 'Luau Masterclass — Roblox Studio komplett lernen',
    navProjects: 'Projekte', navQuality: 'Qualität',
    eyebrow: 'Von null zu produktionsreifem Roblox-Code',
    heroTitle: 'Luau lernen, Roblox Studio verstehen, echte Systeme bauen.',
    heroLead: 'Diese Website ist keine Kopie der Creator Documentation. Sie ist ein eigener, strukturierter Kurs, der die Luau-relevanten Roblox-Themen erklärt: Sprache, Studio, Engine-API, Client/Server, Sicherheit, Daten, UI, Performance und Projektarchitektur.',
    start: 'Lernpfad starten', projects: 'Projekte ansehen',
    roadmap: 'Roadmap: vom Anfänger zum Projekt-Lead', luau: 'Luau-Kernwissen', roblox: 'Roblox Studio und Engine-Konzepte', api: 'API-Atlas: was du kennen musst', secure: 'Sicheres RemoteEvent-Pattern', projectLib: 'Projektbibliothek', quality: 'Qualität, Tools und Release', trainer: 'Mini-Trainer',
    trainerLead: 'Beantworte die Frage und prüfe dein Verständnis.',
    q: 'Warum darf der Client nicht direkt Coins vergeben?',
    a1: 'Weil LocalScripts langsam sind.', a2: 'Weil der Client manipuliert werden kann und der Server Werte validieren muss.', a3: 'Weil RemoteEvents nur im Studio funktionieren.',
    correct: 'Richtig. Der Server muss die Quelle der Wahrheit bleiben.', wrong: 'Nicht korrekt. Überlege, welche Teile ein Exploiter auf dem Client verändern kann.',
    footer: 'Luau Masterclass. Eigene Lernstruktur, keine Kopie der offiziellen Roblox-Dokumentation.'
  },
  en: {
    title: 'Luau Masterclass — Learn Roblox Studio end to end',
    navProjects: 'Projects', navQuality: 'Quality',
    eyebrow: 'From zero to production-ready Roblox code',
    heroTitle: 'Learn Luau, understand Roblox Studio, build real systems.',
    heroLead: 'This website is not a copy of the Creator Documentation. It is an original, structured course covering the Roblox topics that matter for Luau: language fundamentals, Studio, the engine API, client/server, security, data, UI, performance, and project architecture.',
    start: 'Start the roadmap', projects: 'View projects',
    roadmap: 'Roadmap: from beginner to project lead', luau: 'Core Luau knowledge', roblox: 'Roblox Studio and engine concepts', api: 'API atlas: what you need to know', secure: 'Secure RemoteEvent pattern', projectLib: 'Project library', quality: 'Quality, tools, and release', trainer: 'Mini trainer',
    trainerLead: 'Answer the question and check your understanding.',
    q: 'Why should the client never grant coins directly?',
    a1: 'Because LocalScripts are slow.', a2: 'Because the client can be manipulated and the server must validate values.', a3: 'Because RemoteEvents only work in Studio.',
    correct: 'Correct. The server must remain the source of truth.', wrong: 'Not correct. Think about which client-side parts an exploiter can change.',
    footer: 'Luau Masterclass. Original learning structure, not a copy of the official Roblox documentation.'
  }
};

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function setLang(lang) {
  currentLang = translations[lang] ? lang : 'de';
  localStorage.setItem('luau-masterclass-lang', currentLang);
  root.lang = currentLang;
  const t = translations[currentLang];
  document.title = t.title;
  document.querySelectorAll('.lang-toggle button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));
  setText('.eyebrow', t.eyebrow); setText('.hero h1', t.heroTitle); setText('.lead', t.heroLead);
  setText('.actions .primary', t.start); setText('.actions .button:not(.primary)', t.projects);
  setText('#roadmap h2', t.roadmap); setText('#luau h2', t.luau); setText('#roblox h2', t.roblox); setText('#api h2', t.api);
  const darkTitles = document.querySelectorAll('.dark h2'); if (darkTitles[1]) darkTitles[1].textContent = t.secure;
  setText('#projects h2', t.projectLib); setText('#quality h2', t.quality);
  const nav = document.querySelectorAll('#site-nav a'); if (nav[4]) nav[4].textContent = t.navProjects; if (nav[5]) nav[5].textContent = t.navQuality;
  const trainerSection = document.querySelector('.quiz')?.closest('section');
  if (trainerSection) { trainerSection.querySelector('h2').textContent = t.trainer; trainerSection.querySelector('p').textContent = t.trainerLead; }
  setText('#question', t.q);
  const quizButtons = document.querySelectorAll('.quiz button');
  if (quizButtons[0]) quizButtons[0].textContent = t.a1;
  if (quizButtons[1]) quizButtons[1].textContent = t.a2;
  if (quizButtons[2]) quizButtons[2].textContent = t.a3;
  setText('footer p', t.footer);
  document.querySelectorAll('.copy-code').forEach(btn => btn.textContent = copyText[currentLang]);
  setText('#result', '');
}

document.querySelectorAll('.lang-toggle button').forEach(button => button.addEventListener('click', () => setLang(button.dataset.lang)));
setLang(currentLang);

document.querySelectorAll('.quiz button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.quiz button').forEach(b => b.classList.remove('selected'));
    button.classList.add('selected');
    const result = document.getElementById('result');
    if (button.dataset.answer === 'right') {
      result.textContent = translations[currentLang].correct;
      result.style.color = '#0a7f32';
    } else {
      result.textContent = translations[currentLang].wrong;
      result.style.color = '#b00020';
    }
  });
});
