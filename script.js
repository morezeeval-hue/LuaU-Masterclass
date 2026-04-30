const translations = {
  de: {
    "nav.learn":"Lernen","nav.syntax":"Syntax","nav.roblox":"Roblox","nav.systems":"Systeme","nav.projects":"Projekte","nav.trainer":"Trainer",
    "hero.eyebrow":"Von null zu produktionsfähigem Roblox-Code","hero.title":"Lerne Luau, indem du echte Systeme baust.","hero.text":"Diese Website erklärt nicht nur, was du lernen musst. Sie bringt es dir bei: kurze Theorie, lauffähiger Code, typische Fehler, Übungen und Projekte.","hero.start":"Jetzt anfangen","hero.projects":"Projektpfad ansehen",
    "learn.title":"So lernst du mit dieser Seite","learn.p1":"Jedes Kapitel folgt derselben Methode: Begriff verstehen, Code lesen, Code verändern, Fehler erkennen, Mini-Aufgabe lösen.","learn.setup.title":"Studio-Setup","learn.setup.text":"Öffne Roblox Studio, erstelle eine Baseplate, aktiviere Output und Explorer. Erstelle Scripts in ServerScriptService, LocalScripts in StarterPlayerScripts oder GUI-Objekten, ModuleScripts in ReplicatedStorage oder ServerScriptService.",
    "syntax.title":"Luau wirklich lernen","syntax.subtitle":"Nicht auswendig lernen. Verstehen, warum Code so gebaut wird."
  },
  en: {
    "nav.learn":"Learn","nav.syntax":"Syntax","nav.roblox":"Roblox","nav.systems":"Systems","nav.projects":"Projects","nav.trainer":"Trainer",
    "hero.eyebrow":"From zero to production-ready Roblox code","hero.title":"Learn Luau by building real systems.","hero.text":"This site does not only list what to learn. It teaches it: short theory, runnable code, common mistakes, exercises, and projects.","hero.start":"Start learning","hero.projects":"View project path",
    "learn.title":"How to use this site","learn.p1":"Every chapter follows the same method: understand the concept, read code, change code, identify mistakes, solve a mini task.","learn.setup.title":"Studio setup","learn.setup.text":"Open Roblox Studio, create a Baseplate, enable Output and Explorer. Put Scripts in ServerScriptService, LocalScripts in StarterPlayerScripts or GUI objects, and ModuleScripts in ReplicatedStorage or ServerScriptService.",
    "syntax.title":"Actually learn Luau","syntax.subtitle":"Do not memorize commands. Understand why code is built this way."
  }
};

const quiz = [
  {q:"Warum sollte ein Kauf im Shop serverseitig geprüft werden?", a:["Weil der Client manipulierbar ist.","Weil LocalScripts langsamer sind.","Weil RemoteEvents nur auf dem Server existieren."], c:0},
  {q:"Wofür eignet sich ein ModuleScript am besten?", a:["Wiederverwendbare Funktionen und Systeme.","Nur für UI-Buttons.","Zum Speichern von DataStore-Daten direkt im Objekt."], c:0},
  {q:"Was bedeutet --!strict?", a:["Strengere statische Typprüfung für dieses Script.","Das Script läuft schneller als alle anderen.","Roblox sperrt RemoteEvents automatisch."], c:0},
  {q:"Welche Struktur passt für ein Inventory?", a:["Dictionary itemId → amount.","Ein einziger String mit allen Items.","Ein Bool pro Spieler ohne Itemnamen."], c:0},
  {q:"Was sollte ein Client bei einem Shopkauf senden?", a:["Nur den gewünschten itemId-Wert.","Den neuen Coin-Wert.","Eine komplette Kopie des Profils."], c:0}
];
let quizIndex = 0;

function setLanguage(lang){
  document.documentElement.lang = lang;
  localStorage.setItem("language", lang);
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(translations[lang]?.[key]) el.textContent = translations[lang][key];
  });
  document.querySelectorAll("[data-lang]").forEach(btn=>btn.classList.toggle("active", btn.dataset.lang===lang));
  document.querySelectorAll(".copy-code").forEach(btn=>btn.textContent = lang === "en" ? "Copy code" : "Code kopieren");
}

document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>setLanguage(btn.dataset.lang)));
setLanguage(localStorage.getItem("language") || "de");

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const progress = document.getElementById("progress");
window.addEventListener("scroll",()=>{
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${Math.max(0, scrollY / max * 100)}%`;
});

const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add("visible"); });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

function escapeHtml(str){return str.replace(/[&<>]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));}
function highlightLuau(code){
  let html = escapeHtml(code);
  const patterns = [
    [/--.*$/gm, "comment"],
    [/("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`)/g, "string"],
    [/\b(\d+(?:\.\d+)?)\b/g, "number"],
    [/\b(local|function|end|if|then|elseif|else|for|in|do|while|repeat|until|return|type|export|typeof|not|and|or|true|false|nil)\b/g, "keyword"],
    [/\b(number|string|boolean|table|Player|Instance|BasePart|Humanoid|Model|Vector3|CFrame|RBXScriptConnection)\b/g, "type"],
    [/\b(game|workspace|Players|RunService|ReplicatedStorage|ServerScriptService|DataStoreService|CollectionService|TweenService|MarketplaceService|RemoteEvent|RemoteFunction|ModuleScript|UserInputService|ContextActionService)\b/g, "roblox"],
    [/\b(print|warn|task|pcall|math|table|string|os|script|require|Connect|FireServer|OnServerEvent|GetService|GetPlayers|FindFirstChild|FindFirstChildOfClass|WaitForChild|TakeDamage)\b/g, "func"]
  ];
  // keep comments/strings reasonably safe by applying broad highlighting once; sufficient for static learning blocks.
  for (const [regex, cls] of patterns) html = html.replace(regex, `<span class="token ${cls}">$1</span>`);
  return html;
}

document.querySelectorAll("pre code").forEach(code=>{
  code.dataset.raw = code.textContent;
  code.innerHTML = highlightLuau(code.textContent);
  const btn = document.createElement("button");
  btn.className = "copy-code";
  btn.textContent = (localStorage.getItem("language") === "en") ? "Copy code" : "Code kopieren";
  btn.addEventListener("click", async()=>{
    await navigator.clipboard.writeText(code.dataset.raw);
    const old = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(()=>btn.textContent = old, 900);
  });
  code.closest("pre").appendChild(btn);
});

function renderQuiz(){
  const item = quiz[quizIndex % quiz.length];
  document.getElementById("quizQuestion").textContent = item.q;
  const box = document.getElementById("quizAnswers");
  const result = document.getElementById("quizResult");
  result.textContent = "";
  box.innerHTML = "";
  item.a.forEach((answer, index)=>{
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = answer;
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".answer").forEach(b=>b.disabled=true);
      btn.classList.add(index === item.c ? "correct" : "wrong");
      if(index !== item.c) box.children[item.c].classList.add("correct");
      result.textContent = index === item.c ? "Richtig. Genau dieses Prinzip brauchst du in echten Projekten." : "Nicht ganz. Lies das passende Kapitel erneut und achte auf Server/Client-Verantwortung.";
    });
    box.appendChild(btn);
  });
}
document.getElementById("nextQuestion").addEventListener("click",()=>{quizIndex++;renderQuiz();});
renderQuiz();
