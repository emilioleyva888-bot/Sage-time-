function getWeekNumber(date = new Date()) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / 86400000);
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}
const sport = {
  Lundi: "Triceps / Épaules / Dos",
  Mardi: "Course",
  Mercredi: "Biceps / Bench / Dos",
  Jeudi: "Leg day"
};

const revision = {
  Lundi: "Math",
  Mardi: "Électricité",
  Mercredi: "Méga G",
  Jeudi: "Thermo / Électronique",
  Vendredi: "Computer Programming / Meca D"
};

const travailCols = ["Math", "Meca G", "Électronique", "Computer Science"];

let data = JSON.parse(localStorage.getItem("data")) || {
  week: getWeekNumber(),
  sport: {},
  revision: {},
  travail: { Math: 0, "Meca G": 0, "Électronique": 0, "Computer Science": 0 },
  screenTime: [],
  toilet: [],
  history: []
};
const currentWeek = getWeekNumber();

if (data.week !== currentWeek) {

  const sportTotal = Object.keys(sport).length;
  const sportDone = Object.values(data.sport).filter(v => v).length;

  const revTotal = Object.keys(revision).length;
  const revDone = Object.values(data.revision).filter(v => v).length;

  const travailTotal = Object.values(data.travail).reduce((a, b) => a + b, 0);

  data.history.push({
    week: data.week,
    sport: Math.round((sportDone / sportTotal) * 100) || 0,
    revision: Math.round((revDone / revTotal) * 100) || 0,
    travail: travailTotal
  });

  data = {
    week: currentWeek,
    sport: {},
    revision: {},
    travail: { Math: 0, "Meca G": 0, "Électronique": 0, "Computer Science": 0 },
    screenTime: [],
    toilet: [],
    history: data.history
  };

  save();
}
function save() {
  localStorage.setItem("data", JSON.stringify(data));
}


function renderSport() {
  let html = "<h2>🏋️ Sport</h2>";
  for (let day in sport) {
    html += `
      <div class="item">
        <label>
          <input type="checkbox" ${data.sport[day] ? "checked" : ""} 
          onchange="toggleSport('${day}')">
          ${day} — ${sport[day]}
        </label>
      </div>`;
  }
  document.getElementById("sport").innerHTML = html;
}

function toggleSport(day) {
  data.sport[day] = !data.sport[day];
  save(); render();
}


function renderRevision() {
  let html = "<h2>📚 Révisions</h2>";
  for (let day in revision) {
    html += `
      <div class="item">
        <label>
          <input type="checkbox" ${data.revision[day] ? "checked" : ""} 
          onchange="toggleRevision('${day}')">
          ${day} — ${revision[day]}
        </label>
      </div>`;
  }
  document.getElementById("revision").innerHTML = html;
}

function toggleRevision(day) {
  data.revision[day] = !data.revision[day];
  save(); render();
}


function renderTravail() {
  let html = "<h2>💼 Travail</h2>";
  travailCols.forEach(col => {
    html += `
      <div class="item">
        <span>${col}</span>
        <button onclick="addWork('${col}')">+2</button>
        <span class="counter">${data.travail[col]}</span>
      </div>`;
  });
  document.getElementById("travail").innerHTML = html;
}

function addWork(col) {
  data.travail[col] += 2;
  save(); render();
}

function renderSuivi() {
  document.getElementById("suivi").innerHTML = `
    <h2>📱 Suivi quotidien</h2>
    <button onclick="addScreen()">Ajouter temps d’écran</button>
    <button onclick="addToilet()">🚽 +1</button>
    <p>Temps d’écran (heures): ${data.screenTime.join(", ")}</p>
    <p>Toilettes: ${data.toilet.length}</p>
  `;
}

function addScreen() {
  const t = prompt("Temps d’écran (heures) ?");
  if (t) data.screenTime.push(t);
  save(); render();
}

function addToilet() {
  data.toilet.push(Date.now());
  save(); render();
}


function renderProgression() {
  const sportTotal = Object.keys(sport).length;
  const sportDone = Object.values(data.sport).filter(v => v).length;
  const sportPercent = Math.round((sportDone / sportTotal) * 100) || 0;

  const revTotal = Object.keys(revision).length;
  const revDone = Object.values(data.revision).filter(v => v).length;
  const revPercent = Math.round((revDone / revTotal) * 100) || 0;

  const travailTotal = Object.values(data.travail).reduce((a, b) => a + b, 0);

  document.getElementById("progression").innerHTML = `
    <h2>📈 Progression</h2>

    <div class="progress-item">
      🏋️ Sport — ${sportPercent}%
      <div class="progress-bar">
        <div class="progress-fill" style="width:${sportPercent}%"></div>
      </div>
    </div>

    <div class="progress-item">
      📚 Révisions — ${revPercent}%
      <div class="progress-bar">
        <div class="progress-fill" style="width:${revPercent}%"></div>
      </div>
    </div>

    <div class="progress-item">
      💼 Travail — ${travailTotal} points
    </div>
  `;
}

function render() {
  renderSport();
  renderRevision();
  renderTravail();
  renderSuivi();
  renderProgression();
}

render();

function renderHistory() {
  if (!data.history || !data.history.length) return;

  const prog = document.getElementById("progression");
  if (!prog) return;

  let html = "<h2>📚 Historique</h2>";

  data.history.slice(-5).reverse().forEach(h => {
    html += `
      <div class="item">
        <span>Semaine ${h.week}</span>
        <span>🏋️ ${h.sport}% | 📚 ${h.revision}% | 💼 ${h.travail}</span>
      </div>
    `;
  });

  prog.insertAdjacentHTML("beforeend", html);
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
