
const http = require("http");

const PORT = process.env.PORT || 3000;

const html = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0b1020">
<title>CloudFlow — Deployment Dashboard</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --bg: #0b1020;
  --panel: #11182b;
  --panel2: #151e34;
  --border: #252f47;
  --text: #eef2ff;
  --muted: #8995b1;
  --purple: #8b7cff;
  --blue: #5ba7ff;
  --green: #45d6a0;
  --orange: #ffb86b;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  color: var(--text);
  background:
    radial-gradient(ellipse at 75% -10%, #25204f 0%, transparent 36%),
    var(--bg);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}
button { font: inherit; cursor: pointer; }
.app { display: flex; min-height: 100vh; }
.sidebar {
  width: 240px; flex-shrink: 0; padding: 28px 17px;
  border-right: 1px solid var(--border);
  background: rgba(12,17,32,.92);
  display: flex; flex-direction: column;
}
.brand { display:flex; align-items:center; gap:11px; padding: 0 10px 34px; }
.brand-icon {
  width:37px; height:37px; border-radius:12px;
  display:grid; place-items:center; font-size:21px;
  background:linear-gradient(135deg,#9c83ff,#5b8cff);
  box-shadow:0 5px 24px #8271ff35;
}
.brand-name { font:700 20px 'Space Grotesk',sans-serif; letter-spacing:-.7px; }
.brand-name span { color:#a99bff; }
.nav-label { color:#66728e; font-size:10px; font-weight:700; letter-spacing:1.5px; padding: 0 12px; margin:10px 0 12px; }
.nav { display:flex; flex-direction:column; gap:6px; }
.nav button {
  border:1px solid transparent; background:transparent; color:#94a0ba;
  text-align:left; border-radius:10px; padding:12px; display:flex;
  align-items:center; gap:12px; transition:.2s;
}
.nav button:hover, .nav button.active {
  color:#fff; background:#1b2340; border-color:#303b60;
}
.nav-icon { width:19px; text-align:center; font-size:17px; }
.nav button.active .nav-icon { color:#a99bff; }
.sidebar-bottom { margin-top:auto; }
.help-card { background:linear-gradient(140deg,#1c2444,#171b32); border:1px solid #30375b; border-radius:13px; padding:15px; }
.help-card strong { display:block; margin:8px 0 6px; }
.help-card p { color:var(--muted); line-height:1.6; font-size:12px; margin:0 0 12px; }
.help-card button { background:#a093ff; color:#11152a; border:0; padding:9px 12px; border-radius:8px; font-weight:700; width:100%; }
.profile { display:flex; align-items:center; gap:10px; padding:20px 6px 0; }
.avatar { width:35px; height:35px; border-radius:50%; display:grid; place-items:center; background:linear-gradient(135deg,#f4b38a,#8e79ed); color:#15152a; font-weight:700; }
.profile small { color:var(--muted); display:block; margin-top:3px; }
main { min-width:0; flex:1; padding:30px 38px 40px; max-width:1700px; }
.topbar { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:34px; }
.breadcrumb { color:var(--muted); font-size:12px; margin-bottom:8px; }
.breadcrumb span { color:#a99bff; }
h1,h2,h3,p { margin-top:0; }
h1 { font:600 clamp(24px,3vw,32px) 'Space Grotesk',sans-serif; letter-spacing:-1px; margin-bottom:9px; }
.subtitle { color:var(--muted); line-height:1.6; margin:0; }
.top-actions { display:flex; align-items:center; gap:12px; }
.icon-button { background:var(--panel); color:#b4bfd8; border:1px solid var(--border); width:41px; height:41px; border-radius:11px; font-size:17px; position:relative; }
.dot { width:7px; height:7px; background:#ff818b; border-radius:50%; position:absolute; right:9px; top:8px; }
.primary {
  background:linear-gradient(120deg,#a89aff,#8275f8); border:0;
  border-radius:10px; padding:12px 17px; color:#11152a; font-weight:700;
  box-shadow:0 5px 22px #8b7cff20; transition:transform .2s;
}
.primary:hover { transform:translateY(-2px); }
.section-title { font:600 17px 'Space Grotesk',sans-serif; margin-bottom:5px; }
.section-desc { color:var(--muted); font-size:12px; margin:0; }
.section-head { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:17px; }
.link-button { color:#b1a5ff; border:0; background:transparent; font-weight:600; }
.metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:15px; margin-bottom:31px; }
.card { background:linear-gradient(145deg,#141c30,#101728); border:1px solid var(--border); border-radius:15px; }
.metric { padding:19px; min-width:0; position:relative; overflow:hidden; }
.metric-top { display:flex; justify-content:space-between; align-items:center; gap:8px; color:var(--muted); font-size:12px; }
.metric-icon { width:36px; height:36px; border-radius:10px; display:grid; place-items:center; font-size:17px; }
.purple { color:#b3a7ff; background:#8b7cff19; }
.blue { color:#83c1ff; background:#5ba7ff18; }
.green { color:#6fe5b5; background:#45d6a019; }
.orange { color:#ffc68c; background:#ffb86b19; }
.metric-value { font:600 29px 'Space Grotesk',sans-serif; margin:16px 0 9px; letter-spacing:-1px; }
.metric-foot { color:var(--muted); font-size:11px; }
.positive { color:var(--green); }
.layout { display:grid; grid-template-columns:minmax(0,1.65fr) minmax(270px,1fr); gap:17px; margin-bottom:27px; }
.panel { padding:22px; min-width:0; }
.pipeline { display:flex; align-items:stretch; gap:8px; margin-top:25px; }
.stage { flex:1; min-width:0; border:1px solid #303955; background:#171f34; border-radius:12px; text-align:center; padding:15px 5px; }
.stage .stage-icon { font-size:22px; margin-bottom:11px; }
.stage strong { font-size:11px; display:block; }
.stage small { font-size:10px; color:var(--muted); display:block; margin-top:7px; }
.stage.done { border-color:#276f62; background:#142b30; }
.stage.done .stage-icon { color:var(--green); }
.stage-arrow { align-self:center; color:#687493; font-size:16px; }
.pipeline-note { display:flex; align-items:center; gap:8px; margin-top:20px; padding:12px; border-radius:9px; background:#142b2a; color:#8fe5c2; font-size:11px; }
.pulse { width:7px; height:7px; border-radius:50%; background:var(--green); box-shadow:0 0 12px #45d6a077; }
.chart-legend { display:flex; align-items:center; gap:7px; color:var(--muted); font-size:11px; }
.legend-dot { width:7px; height:7px; border-radius:50%; background:var(--purple); }
.chart { display:flex; align-items:flex-end; gap:12px; height:145px; margin-top:22px; padding:0 4px; border-bottom:1px solid #29334b; background:repeating-linear-gradient(to bottom,transparent 0,transparent 35px,#263048 36px); }
.bar-group { flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:8px; min-width:0; }
.bar { width:min(29px,75%); min-height:5px; border-radius:5px 5px 2px 2px; background:linear-gradient(to top,#6859d9,#a99bff); transition:height .4s; }
.bar-group small { color:#8290ac; font-size:10px; margin-bottom:-20px; transform:translateY(23px); }
.chart-foot { display:flex; justify-content:space-between; color:var(--muted); font-size:11px; margin-top:28px; }
.health-list { display:flex; flex-direction:column; gap:17px; margin-top:23px; }
.health-item { display:flex; align-items:center; gap:11px; }
.health-symbol { width:37px; height:37px; border:1px solid #2d3850; background:#1b253a; border-radius:10px; display:grid; place-items:center; font-size:16px; }
.health-copy { flex:1; min-width:0; }
.health-copy strong { display:block; font-size:12px; }
.health-copy small { display:block; color:var(--muted); font-size:11px; margin-top:4px; }
.status { color:#75e4b6; background:#17352f; padding:5px 8px; border-radius:6px; font-size:10px; }
.activity { overflow:hidden; }
.activity-head,.activity-row { display:grid; grid-template-columns:minmax(0,1.4fr) minmax(80px,.8fr) minmax(90px,1fr) minmax(75px,.8fr); gap:12px; align-items:center; }
.activity-head { padding:13px 20px; border-bottom:1px solid var(--border); color:#7683a0; text-transform:uppercase; letter-spacing:.7px; font-size:10px; }
.activity-row { padding:17px 20px; border-bottom:1px solid #222b40; font-size:12px; }
.activity-row:last-child { border-bottom:0; }
.commit { display:flex; align-items:center; gap:10px; min-width:0; }
.commit-icon { width:31px; height:31px; border-radius:9px; display:grid; place-items:center; background:#252344; color:#b6aaff; flex-shrink:0; }
.commit strong { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.commit small { display:block; color:var(--muted); margin-top:4px; }
.tag { color:#b2a4ff; background:#282344; border-radius:6px; padding:5px 7px; display:inline-block; font-size:10px; }
.time { color:var(--muted); }
.footer { color:#63708c; text-align:center; padding-top:25px; font-size:11px; }
.toast { position:fixed; right:24px; bottom:24px; background:#1a2c30; border:1px solid #32675d; color:#b5f4db; border-radius:12px; padding:15px 19px; box-shadow:0 10px 40px #0005; z-index:5; max-width:calc(100vw - 32px); opacity:0; transform:translateY(12px); pointer-events:none; transition:.25s; }
.toast.show { opacity:1; transform:translateY(0); }
@media(max-width:1150px) {
  main { padding:25px 22px; }
  .sidebar { width:205px; }
  .metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .layout { grid-template-columns:minmax(0,1fr); }
}
@media(max-width:700px) {
  .sidebar { width:64px; padding:22px 8px; }
  .brand { justify-content:center; padding:0 0 28px; }
  .brand-name,.nav-label,.nav-text,.help-card,.profile-info { display:none; }
  .nav button { justify-content:center; padding:12px 0; }
  .profile { justify-content:center; padding:18px 0 0; }
  main { padding:22px 14px; }
  .topbar { align-items:flex-start; }
  .top-actions { gap:7px; }
  .top-actions .primary { padding:10px; font-size:11px; }
  .icon-button { width:36px; height:36px; }
  .metrics { gap:9px; }
  .metric { padding:13px; }
  .metric-value { font-size:23px; }
  .metric-top { font-size:10px; }
  .metric-icon { width:30px; height:30px; }
  .panel { padding:15px; }
  .pipeline { gap:4px; }
  .stage { padding:12px 2px; }
  .stage strong { font-size:9px; }
  .stage small { font-size:8px; }
  .stage .stage-icon { font-size:18px; }
  .activity-head,.activity-row { grid-template-columns:minmax(0,1.4fr) minmax(55px,.7fr) minmax(70px,.8fr); gap:7px; padding-left:10px; padding-right:10px; }
  .activity-head > :nth-child(3),.activity-row > :nth-child(3) { display:none; }
  .commit { gap:6px; }
  .commit-icon { display:none; }
  .commit strong { font-size:10px; }
  .time { font-size:10px; }
}
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">✳</div>
      <div class="brand-name">cloud<span>flow</span></div>
    </div>
    <div class="nav-label">WORKSPACE</div>
    <nav class="nav" aria-label="Main navigation">
      <button class="active" data-section="Overview"><span class="nav-icon">◫</span><span class="nav-text">Overview</span></button>
      <button data-section="Deployments"><span class="nav-icon">⇧</span><span class="nav-text">Deployments</span></button>
      <button data-section="Pipelines"><span class="nav-icon">⌘</span><span class="nav-text">Pipelines</span></button>
      <button data-section="Infrastructure"><span class="nav-icon">▦</span><span class="nav-text">Infrastructure</span></button>
      <button data-section="Monitoring"><span class="nav-icon">⌁</span><span class="nav-text">Monitoring</span></button>
    </nav>
    <div class="nav-label" style="margin-top:32px">CONFIGURATION</div>
    <nav class="nav">
      <button data-section="Settings"><span class="nav-icon">⚙</span><span class="nav-text">Settings</span></button>
    </nav>
    <div class="sidebar-bottom">
      <div class="help-card">
        <span style="font-size:21px">✦</span>
        <strong>Ship with confidence</strong>
        <p>Your deployment workflow, all in one place.</p>
        <button id="docsButton">Explore workflow ↗</button>
      </div>
      <div class="profile">
        <div class="avatar">JD</div>
        <div class="profile-info"><strong>Junaid Developer</strong><small>Project workspace</small></div>
      </div>
    </div>
  </aside>

  <main>
    <header class="topbar">
      <div>
        <div class="breadcrumb">Workspace / <span id="breadcrumbName">Overview</span></div>
        <h1 id="pageTitle">Deployment no overview</h1>
        <p class="subtitle" id="pageSubtitle">Your release workflow at a glance. Build, ship, and scale.</p>
      </div>
      <div class="top-actions">
        <button class="icon-button" id="notificationButton" aria-label="Notifications">♧<span class="dot"></span></button>
        <button class="primary" id="deployButton">↗ &nbsp; Deploy project</button>
      </div>
    </header>

    <section class="metrics" aria-label="Project metrics">
      <article class="card metric">
        <div class="metric-top"><span>Total deployments</span><span class="metric-icon purple">⇧</span></div>
        <div class="metric-value" id="deploymentCount">128</div>
        <div class="metric-foot"><span class="positive">↗ 12.8%</span> &nbsp;vs. last month</div>
      </article>
      <article class="card metric">
        <div class="metric-top"><span>Build success rate</span><span class="metric-icon green">✓</span></div>
        <div class="metric-value">98.4<span style="font-size:18px">%</span></div>
        <div class="metric-foot"><span class="positive">↗ 2.4%</span> &nbsp;vs. last month</div>
      </article>
      <article class="card metric">
        <div class="metric-top"><span>Service uptime</span><span class="metric-icon blue">⌁</span></div>
        <div class="metric-value">99.95<span style="font-size:18px">%</span></div>
        <div class="metric-foot">Last 30 days · illustrative</div>
      </article>
      <article class="card metric">
        <div class="metric-top"><span>Avg. build time</span><span class="metric-icon orange">◷</span></div>
        <div class="metric-value">2m 34s</div>
        <div class="metric-foot"><span class="positive">↓ 18s</span> &nbsp;faster than before</div>
      </article>
    </section>

    <div class="section-head">
      <div><h2 class="section-title">Release pipeline</h2><p class="section-desc">From your first commit to a running deployment.</p></div>
      <button class="link-button" id="pipelineDetails">Pipeline details ↗</button>
    </div>

    <section class="layout">
      <article class="card panel">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div><h3 class="section-title">Production workflow</h3><p class="section-desc">Main branch · Last build #128</p></div>
          <span class="status" id="pipelineStatus">● Healthy</span>
        </div>
        <div class="pipeline" id="pipeline">
          <div class="stage done"><div class="stage-icon">✓</div><strong>GitHub</strong><small>Source</small></div>
          <div class="stage-arrow">→</div>
          <div class="stage done"><div class="stage-icon">✓</div><strong>Jenkins</strong><small>Build & test</small></div>
          <div class="stage-arrow">→</div>
          <div class="stage done"><div class="stage-icon">✓</div><strong>Docker</strong><small>Image</small></div>
          <div class="stage-arrow">→</div>
          <div class="stage done"><div class="stage-icon">✓</div><strong>Kubernetes</strong><small>Deploy</small></div>
        </div>
        <div class="pipeline-note" id="pipelineNote"><span class="pulse"></span><span>All stages ready · Demo status, not live cluster telemetry</span></div>
      </article>

      <article class="card panel">
        <div class="section-head" style="margin-bottom:0">
          <div><h3 class="section-title">Build activity</h3><p class="section-desc">Successful builds · demo data</p></div>
          <div class="chart-legend"><span class="legend-dot"></span>Builds</div>
        </div>
        <div class="chart" aria-label="Illustrative build activity chart">
          <div class="bar-group"><div class="bar" style="height:40%"></div><small>Mon</small></div>
          <div class="bar-group"><div class="bar" style="height:63%"></div><small>Tue</small></div>
          <div class="bar-group"><div class="bar" style="height:49%"></div><small>Wed</small></div>
          <div class="bar-group"><div class="bar" style="height:82%"></div><small>Thu</small></div>
          <div class="bar-group"><div class="bar" style="height:59%"></div><small>Fri</small></div>
          <div class="bar-group"><div class="bar" style="height:95%"></div><small>Sat</small></div>
          <div class="bar-group"><div class="bar" style="height:73%"></div><small>Sun</small></div>
        </div>
        <div class="chart-foot"><span>Weekly activity</span><span>Illustrative values</span></div>
      </article>
    </section>

    <section class="layout">
      <article class="card panel">
        <div class="section-head">
          <div><h3 class="section-title">Recent deployments</h3><p class="section-desc">A sample of your release history.</p></div>
          <button class="link-button" id="viewAll">View all →</button>
        </div>
        <div class="activity">
          <div class="activity-head"><span>Deployment</span><span>Branch</span><span>Environment</span><span>Status</span></div>
          <div class="activity-row"><div class="commit"><div class="commit-icon">↗</div><div><strong>Release v1.2.8</strong><small>Build #128 · a82f9c1</small></div></div><span class="tag">main</span><span>Production</span><span class="status">Success</span></div>
          <div class="activity-row"><div class="commit"><div class="commit-icon">↗</div><div><strong>Release v1.2.7</strong><small>Build #127 · 39bd210</small></div></div><span class="tag">main</span><span>Production</span><span class="status">Success</span></div>
          <div class="activity-row"><div class="commit"><div class="commit-icon">↗</div><div><strong>Feature update</strong><small>Build #126 · e71ac43</small></div></div><span class="tag">develop</span><span>Staging</span><span class="status">Success</span></div>
          <div class="activity-row"><div class="commit"><div class="commit-icon">↗</div><div><strong>Release v1.2.6</strong><small>Build #125 · 1c4be92</small></div></div><span class="tag">main</span><span>Production</span><span class="status">Success</span></div>
        </div>
      </article>

      <article class="card panel">
        <div><h3 class="section-title">Infrastructure health</h3><p class="section-desc">Example service states · not live monitoring</p></div>
        <div class="health-list">
          <div class="health-item"><div class="health-symbol">◈</div><div class="health-copy"><strong>Jenkins CI server</strong><small>Build automation</small></div><span class="status">Online</span></div>
          <div class="health-item"><div class="health-symbol">⬡</div><div class="health-copy"><strong>Docker registry</strong><small>Image repository</small></div><span class="status">Online</span></div>
          <div class="health-item"><div class="health-symbol">⛶</div><div class="health-copy"><strong>Kubernetes cluster</strong><small>Container orchestration</small></div><span class="status">Healthy</span></div>
          <div class="health-item"><div class="health-symbol">◎</div><div class="health-copy"><strong>Application service</strong><small>HTTP · Port 3000</small></div><span class="status">Ready</span></div>
        </div>
      </article>
    </section>

    <footer class="footer">CloudFlow · DevOps deployment showcase · Metrics and history are illustrative demo data</footer>
  </main>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>
(function () {
  var toastTimer;
  function notify(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3200);
  }

  var titles = {
    Overview: ['Deployment overview', 'Your release workflow at a glance. Build, ship, and scale.'],
    Deployments: ['Deployments', 'Explore release history and deployment versions.'],
    Pipelines: ['CI/CD pipelines', 'Follow your code from commit to deployment.'],
    Infrastructure: ['Infrastructure', 'Review the services in your deployment workflow.'],
    Monitoring: ['Service monitoring', 'Explore sample service health and uptime indicators.'],
    Settings: ['Workspace settings', 'Manage your project workspace and workflow preferences.']
  };

  document.querySelectorAll('[data-section]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-section]').forEach(function (item) {
        item.classList.remove('active');
      });
      button.classList.add('active');
      var name = button.getAttribute('data-section');
      document.getElementById('breadcrumbName').textContent = name;
      document.getElementById('pageTitle').textContent = titles[name][0];
      document.getElementById('pageSubtitle').textContent = titles[name][1];
      notify(name + ' section selected. This is a frontend demo.');
    });
  });

  document.getElementById('deployButton').addEventListener('click', function () {
    notify('Demo only: trigger your actual deployment from Jenkins Build Now.');
  });
  document.getElementById('docsButton').addEventListener('click', function () {
    notify('Pipeline: GitHub → Jenkins → Docker Hub → Kubernetes.');
  });
  document.getElementById('pipelineDetails').addEventListener('click', function () {
    notify('Pipeline stages are illustrated. Connect Jenkins to display real build results.');
  });
  document.getElementById('viewAll').addEventListener('click', function () {
    notify('The deployment history shown here is sample data.');
  });
  document.getElementById('notificationButton').addEventListener('click', function () {
    notify('You are all caught up. No live notifications are configured.');
  });
}());
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(204);
        return res.end();
    }

    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache"
    });

    res.end(html);
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("CloudFlow is running on port " + PORT);
});
