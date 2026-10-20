const STORAGE_KEY = "smurfit-entorno-businesses";
const SESSION_KEY = "smurfit-entorno-session";

const demoBusinesses = [
  { id: "demo-1", name: "Tienda La Esperanza", owner: "María R.", category: "Comercio", neighborhood: "Siloé", people: 3, damage: "Afectación parcial", need: 2800000, status: "Pendiente de verificación", date: "2026-08-12", demo: true },
  { id: "demo-2", name: "Panadería El Obrero", owner: "Carlos M.", category: "Alimentos", neighborhood: "El Calvario", people: 5, damage: "Daño en inventario", need: 1450000, status: "En revisión", date: "2026-08-13", demo: true },
  { id: "demo-3", name: "Taller La 25", owner: "Jorge A.", category: "Servicios", neighborhood: "Sucre", people: 2, damage: "Afectación parcial", need: 3900000, status: "Pendiente de verificación", date: "2026-08-14", demo: true },
  { id: "demo-4", name: "Miscelánea San Judas", owner: "Luz P.", category: "Comercio", neighborhood: "Aguablanca", people: 4, damage: "Daño en inventario", need: 950000, status: "Verificado", date: "2026-08-16", demo: true },
  { id: "demo-5", name: "Modistería Puntada", owner: "Gloria C.", category: "Manufactura", neighborhood: "San Antonio", people: 2, damage: "Afectación parcial", need: 2100000, status: "En revisión", date: "2026-08-17", demo: true },
];

const users = [
  { username: "admin", password: "smurfit2026", name: "Laura Gómez", role: "Administrador", initials: "LG" },
  { username: "analista", password: "smurfit2026", name: "Andrés Muñoz", role: "Analista", initials: "AM" },
  { username: "consulta", password: "smurfit2026", name: "Valentina Ruiz", role: "Lector", initials: "VR" },
];

const iconPaths = {
  overview: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
  business: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>',
  sources: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  reports: '<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"/><path d="m9 12 2 2 4-4"/>',
};

const icon = (name, size = 18) =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || ""}</svg>`;

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount || 0);

const readBusinesses = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoBusinesses;
  } catch (error) {
    console.error("No fue posible leer los registros guardados.", error);
    return demoBusinesses;
  }
};

let businesses = readBusinesses();
let currentUser = null;
let activePage = "overview";
let activeFilter = "Todos";
let searchTerm = "";

function persistBusinesses(nextBusinesses = businesses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBusinesses));
    businesses = nextBusinesses;
    return true;
  } catch (error) {
    console.error("No fue posible guardar los registros.", error);
    showToast("No se pudieron guardar los cambios en este navegador.", "error");
    return false;
  }
}

function showToast(message, type = "success") {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.innerHTML = `${icon(type === "error" ? "close" : "check", 17)}<span>${escapeHtml(message)}</span>`;
  toast.className = `toast is-visible ${type}`;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function renderLogin() {
  document.querySelector("#app").innerHTML = `
    <main class="login-screen">
      <section class="login-brand">
        <div class="brand-lockup"><span class="brand-mark">sw</span><span>smurfit<span class="brand-light">westrock</span></span></div>
        <div class="login-message">
          <span class="eyebrow">LECTURA DE ENTORNO · CALI</span>
          <h1>La recuperación<br>empieza por <em>visibilizar.</em></h1>
          <p>Una herramienta para reconocer y acompañar a los negocios informales afectados por el sismo del 10 de agosto.</p>
          <div class="login-stat"><span class="stat-signal"></span> Información comunitaria · Cali, Colombia</div>
        </div>
        <div class="login-footer">Compromiso con las comunidades y el desarrollo local.</div>
      </section>
      <section class="login-panel">
        <form class="login-card" id="login-form">
          <div class="mobile-brand brand-lockup"><span class="brand-mark">sw</span><span>smurfit<span class="brand-light">westrock</span></span></div>
          <span class="eyebrow">PORTAL DE ACCESO</span>
          <h2>Bienvenido</h2>
          <p class="muted">Ingresa con tu cuenta de demostración.</p>
          <label class="field-label" for="username">Usuario</label>
          <div class="input-wrap"><span class="input-icon">${icon("people", 17)}</span><input id="username" name="username" autocomplete="username" placeholder="Tu nombre de usuario" required></div>
          <label class="field-label" for="password">Contraseña</label>
          <div class="input-wrap"><span class="input-icon">${icon("shield", 17)}</span><input id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••••••" required></div>
          <p class="login-error" id="login-error" role="alert"></p>
          <button class="button button-primary login-submit" type="submit">Ingresar <span>${icon("arrow", 16)}</span></button>
          <div class="demo-access"><strong>Accesos de prueba</strong><span>admin · analista · consulta</span><small>Contraseña para todos: <code>smurfit2026</code></small></div>
          <p class="security-note">${icon("shield", 14)} Prototipo de demostración. No ingreses información personal sensible.</p>
        </form>
      </section>
    </main>`;

  document.querySelector("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const user = users.find((item) => item.username === form.get("username").toLowerCase().trim() && item.password === form.get("password"));
    if (!user) {
      document.querySelector("#login-error").textContent = "Usuario o contraseña incorrectos.";
      return;
    }
    currentUser = user;
    sessionStorage.setItem(SESSION_KEY, user.username);
    renderApp();
  });
}

function renderApp() {
  const pages = [
    { id: "overview", title: "Resumen", icon: "overview" },
    { id: "businesses", title: "Negocios", icon: "business" },
    { id: "sources", title: "Fuentes oficiales", icon: "sources" },
    { id: "reports", title: "Indicadores", icon: "reports" },
  ];
  const canManage = currentUser.role !== "Lector";
  const nav = pages.map((page) => `
    <button class="nav-link ${activePage === page.id ? "active" : ""}" data-page="${page.id}">
      ${icon(page.icon, 18)}<span>${page.title}</span>${page.id === "businesses" ? `<span class="nav-count">${businesses.length}</span>` : ""}
    </button>`).join("");

  document.querySelector("#app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <a class="brand-lockup sidebar-brand" href="#" aria-label="Smurfit Westrock, inicio"><span class="brand-mark">sw</span><span>smurfit<span class="brand-light">westrock</span></span></a>
        <div class="workspace-label">PLATAFORMA DE IMPACTO</div>
        <div class="sidebar-context"><span class="context-dot"></span><span><strong>Valle del Cauca</strong><small>Cali · Lectura de entorno</small></span></div>
        <div class="nav-caption">ESPACIO DE TRABAJO</div>
        <nav class="main-nav" aria-label="Navegación principal">${nav}</nav>
        <div class="sidebar-bottom">
          <div class="source-mini"><div class="source-mini-icon">${icon("sources", 17)}</div><div><strong>Datos con contexto</strong><span>Fuentes públicas oficiales</span></div><span class="source-pulse"></span></div>
          <div class="user-card"><span class="avatar">${currentUser.initials}</span><span class="user-info"><strong>${currentUser.name}</strong><small>${currentUser.role}</small></span><button class="icon-button logout-button" aria-label="Cerrar sesión" title="Cerrar sesión">${icon("logout", 17)}</button></div>
        </div>
      </aside>
      <main class="main-area">
        <header class="topbar">
          <button class="icon-button menu-button" id="menu-toggle" aria-label="Abrir menú">${icon("menu", 20)}</button>
          <div class="breadcrumb">Entorno social <span>/</span> <strong>${pages.find((page) => page.id === activePage).title}</strong></div>
          <div class="topbar-right"><span class="topbar-date">${new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date())}</span><span class="topbar-divider"></span><span class="topbar-user">${currentUser.initials}</span></div>
        </header>
        <section class="page-content" id="page-content"></section>
        <footer class="page-footer"><span>SMURFIT WESTROCK <i>·</i> LECTURA DE ENTORNO</span><span>Los registros de muestra son demostrativos, no cifras oficiales.</span></footer>
      </main>
      <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
    </div>
    <div id="modal-root"></div><div id="toast" class="toast" role="status" aria-live="polite"></div>`;

  document.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => {
    activePage = button.dataset.page;
    renderApp();
  }));
  document.querySelector(".logout-button").addEventListener("click", logout);
  document.querySelector("#menu-toggle").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("is-open"));
  document.querySelector("#sidebar-backdrop").addEventListener("click", () => document.querySelector("#sidebar").classList.remove("is-open"));

  if (activePage === "overview") renderOverview(canManage);
  if (activePage === "businesses") renderBusinesses(canManage);
  if (activePage === "sources") renderSources();
  if (activePage === "reports") renderReports();
}

function pageHeading(eyebrow, title, description, action = "") {
  return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}

function getMetrics() {
  return {
    total: businesses.length,
    people: businesses.reduce((sum, item) => sum + Number(item.people || 0), 0),
    needs: businesses.reduce((sum, item) => sum + Number(item.need || 0), 0),
    verified: businesses.filter((item) => item.status === "Verificado").length,
  };
}

function renderOverview(canManage) {
  const metrics = getMetrics();
  const action = canManage ? `<button class="button button-primary" id="new-business">${icon("plus", 17)} Registrar negocio</button>` : "";
  document.querySelector("#page-content").innerHTML = `
    ${pageHeading("TERREMOTO DEL 10 DE AGOSTO · CALI, COLOMBIA", "Entender para acompañar.", "Una lectura cercana de los negocios informales y sus necesidades de recuperación.", action)}
    <div class="demo-notice">${icon("shield", 16)} <span><strong>Datos de muestra.</strong> Los registros y cifras de este prototipo son ilustrativos. Sustitúyelos por información validada antes de tomar decisiones.</span></div>
    <div class="metric-grid">
      <article class="metric-card"><div class="metric-top"><span>Negocios registrados</span><span class="metric-icon mint">${icon("business", 18)}</span></div><div class="metric-value">${metrics.total}<small>negocios</small></div><div class="metric-foot"><span class="metric-dot mint-dot"></span>Reportes comunitarios en el sistema</div></article>
      <article class="metric-card"><div class="metric-top"><span>Personas vinculadas</span><span class="metric-icon blue">${icon("people", 18)}</span></div><div class="metric-value">${metrics.people}<small>personas</small></div><div class="metric-foot">Empleo familiar reportado</div></article>
      <article class="metric-card"><div class="metric-top"><span>Necesidad estimada</span><span class="metric-icon amber">${icon("reports", 18)}</span></div><div class="metric-value currency-value">${formatCurrency(metrics.needs)}</div><div class="metric-foot">COP · estimación reportada, no aprobada</div></article>
      <article class="metric-card"><div class="metric-top"><span>Verificados</span><span class="metric-icon green">${icon("check", 18)}</span></div><div class="metric-value">${metrics.verified}<small>de ${metrics.total}</small></div><div class="metric-foot">Requiere validación en terreno</div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel neighborhood-panel"><div class="panel-heading"><div><span class="eyebrow">PRESENCIA LOCAL</span><h2>Negocios por zona</h2></div><span class="panel-tag">${businesses.length} reportes</span></div>
        <div class="zone-list">${neighborhoodStats().slice(0, 5).map(([name, count]) => `<div class="zone-row"><span class="zone-name"><i class="zone-marker"></i>${escapeHtml(name)}</span><div class="zone-bar-track"><div class="zone-bar" style="width:${Math.max(9, (count / Math.max(metrics.total, 1)) * 100)}%"></div></div><strong>${count}</strong></div>`).join("") || '<p class="empty-state">Aún no hay reportes registrados.</p>'}</div>
        <div class="zone-note">${icon("shield", 14)} La zona corresponde al barrio reportado por el negocio.</div>
      </section>
      <section class="panel activity-panel"><div class="panel-heading"><div><span class="eyebrow">SEGUIMIENTO</span><h2>Estado de reportes</h2></div>${icon("reports", 19)}</div>
        ${statusSummary()}
        <div class="activity-callout"><span class="callout-icon">${icon("sources", 17)}</span><span><strong>Complementa con fuentes públicas</strong><small>Consulta información oficial en Datos Abiertos Colombia.</small></span><button class="text-button" data-page="sources" aria-label="Ir a fuentes oficiales">${icon("arrow", 17)}</button></div>
      </section>
    </div>
    ${renderRecentTable(canManage)}`;
  if (canManage) document.querySelector("#new-business").addEventListener("click", () => openBusinessModal());
  document.querySelectorAll('[data-page="sources"]').forEach((button) => button.addEventListener("click", () => { activePage = "sources"; renderApp(); }));
  bindBusinessActions();
}

function neighborhoodStats() {
  const counts = new Map();
  businesses.forEach((business) => counts.set(business.neighborhood, (counts.get(business.neighborhood) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function statusSummary() {
  const statuses = ["Verificado", "En revisión", "Pendiente de verificación"];
  const colors = ["verified", "review", "pending"];
  const total = Math.max(businesses.length, 1);
  return `<div class="status-summary">${statuses.map((status, index) => {
    const count = businesses.filter((business) => business.status === status).length;
    return `<div class="status-row"><span class="status-label"><i class="status-dot ${colors[index]}"></i>${status}</span><span class="status-progress"><i class="${colors[index]}" style="width:${(count / total) * 100}%"></i></span><strong>${count}</strong></div>`;
  }).join("")}</div>`;
}

function renderRecentTable(canManage) {
  const recent = [...businesses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return `<section class="panel recent-panel"><div class="panel-heading"><div><span class="eyebrow">ACTIVIDAD RECIENTE</span><h2>Negocios reportados</h2></div><button class="text-button" data-view-businesses>Ver todos ${icon("arrow", 15)}</button></div>${businessTable(recent, canManage, false)}</section>`;
}

function businessTable(items, canManage, showSearch = true) {
  if (!items.length) return '<div class="empty-state table-empty">No hay negocios que coincidan con tu búsqueda.</div>';
  return `<div class="table-scroll"><table class="business-table"><thead><tr><th>NEGOCIO</th><th>ACTIVIDAD</th><th>ZONA</th><th>AFECTACIÓN</th><th>ESTADO</th><th>NECESIDAD</th>${canManage ? "<th></th>" : ""}</tr></thead><tbody>${items.map((item) => {
    const initial = escapeHtml(item.name.trim().charAt(0).toUpperCase());
    const statusClass = item.status === "Verificado" ? "verified" : item.status === "En revisión" ? "review" : "pending";
    return `<tr><td><div class="business-name"><span class="business-avatar">${initial}</span><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.owner)}${item.demo ? ' <span class="demo-chip">MUESTRA</span>' : ""}</small></span></div></td><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.neighborhood)}</td><td>${escapeHtml(item.damage)}</td><td><span class="status-pill ${statusClass}"><i></i>${escapeHtml(item.status)}</span></td><td class="need-cell">${formatCurrency(item.need)}</td>${canManage ? `<td><div class="row-actions"><button class="icon-button edit-business" data-id="${escapeHtml(item.id)}" aria-label="Editar ${escapeHtml(item.name)}" title="Editar">${icon("edit", 15)}</button>${currentUser.role === "Administrador" ? `<button class="icon-button delete-business" data-id="${escapeHtml(item.id)}" aria-label="Eliminar ${escapeHtml(item.name)}" title="Eliminar">${icon("trash", 15)}</button>` : ""}</div></td>` : ""}</tr>`;
  }).join("")}</tbody></table></div>`;
}

function renderBusinesses(canManage) {
  const action = canManage ? `<button class="button button-primary" id="new-business">${icon("plus", 17)} Registrar negocio</button>` : "";
  document.querySelector("#page-content").innerHTML = `
    ${pageHeading("DIRECTORIO COMUNITARIO", "Negocios reportados", "Registro, actualización y lectura de negocios afectados.", action)}
    <div class="demo-notice">${icon("shield", 16)} <span>Los datos de muestra están identificados como <strong>MUESTRA</strong>. Los reportes no representan cifras verificadas del evento.</span></div>
    <section class="panel directory-panel">
      <div class="directory-tools"><div class="filter-tabs">${["Todos", "Verificado", "En revisión", "Pendiente de verificación"].map((filter) => `<button class="filter-tab ${activeFilter === filter ? "selected" : ""}" data-filter="${filter}">${filter}${filter === "Todos" ? `<span>${businesses.length}</span>` : ""}</button>`).join("")}</div>
        <label class="search-box">${icon("search", 17)}<input id="business-search" type="search" placeholder="Buscar negocio o zona" value="${escapeHtml(searchTerm)}" aria-label="Buscar negocios"></label>
      </div>
      <div id="business-table-region">${businessTable(filteredBusinesses(), canManage)}</div>
      <div class="directory-foot"><span>Mostrando <strong>${filteredBusinesses().length}</strong> de <strong>${businesses.length}</strong> negocios</span><button class="button button-quiet" id="export-csv">${icon("download", 15)} Exportar CSV</button></div>
    </section>
    <p class="permission-note">${icon("shield", 14)} ${currentUser.role === "Lector" ? "Tu perfil permite consultar y exportar información." : `Acceso: ${currentUser.role}. ${currentUser.role === "Administrador" ? "Puedes registrar, actualizar y eliminar reportes." : "Puedes registrar y actualizar reportes."}`}</p>`;
  if (canManage) document.querySelector("#new-business").addEventListener("click", () => openBusinessModal());
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.filter; renderBusinesses(canManage); }));
  document.querySelector("#business-search").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    updateBusinessTable(canManage);
  });
  document.querySelector("#export-csv").addEventListener("click", exportCsv);
  bindBusinessActions();
}

function filteredBusinesses() {
  return businesses.filter((business) => {
    const matchesFilter = activeFilter === "Todos" || business.status === activeFilter;
    const search = searchTerm.toLowerCase();
    const matchesSearch = !search || [business.name, business.owner, business.neighborhood, business.category].some((value) => value.toLowerCase().includes(search));
    return matchesFilter && matchesSearch;
  });
}

function updateBusinessTable(canManage) {
  const region = document.querySelector("#business-table-region");
  region.innerHTML = businessTable(filteredBusinesses(), canManage);
  document.querySelector(".directory-foot strong").textContent = filteredBusinesses().length;
  bindBusinessActions();
}

function bindBusinessActions() {
  document.querySelectorAll(".edit-business").forEach((button) => button.addEventListener("click", () => {
    const item = businesses.find((business) => business.id === button.dataset.id);
    if (item) openBusinessModal(item);
  }));
  document.querySelectorAll(".delete-business").forEach((button) => button.addEventListener("click", () => {
    const item = businesses.find((business) => business.id === button.dataset.id);
    if (!item || !window.confirm(`¿Eliminar el reporte de "${item.name}"? Esta acción no se puede deshacer.`)) return;
    const nextBusinesses = businesses.filter((business) => business.id !== item.id);
    if (!persistBusinesses(nextBusinesses)) return;
    showToast("Reporte eliminado.");
    renderApp();
  }));
  document.querySelectorAll("[data-view-businesses]").forEach((button) => button.addEventListener("click", () => { activePage = "businesses"; renderApp(); }));
}

function openBusinessModal(item = null) {
  const isEdit = Boolean(item);
  const modalRoot = document.querySelector("#modal-root");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-heading"><div><span class="eyebrow">${isEdit ? "ACTUALIZAR REPORTE" : "NUEVO REPORTE"}</span><h2 id="modal-title">${isEdit ? "Editar negocio" : "Registrar negocio"}</h2></div><button class="icon-button" id="close-modal" aria-label="Cerrar">${icon("close", 20)}</button></div>
      <p class="modal-description">Registra información voluntaria y evita incluir datos personales sensibles.</p>
      <form id="business-form">
        <div class="form-grid">
          <label class="form-field span-two">Nombre del negocio<input name="name" maxlength="80" required value="${escapeHtml(item?.name || "")}" placeholder="Ej. Tienda del barrio"></label>
          <label class="form-field">Persona de contacto<input name="owner" maxlength="50" value="${escapeHtml(item?.owner || "")}" placeholder="Iniciales recomendadas"></label>
          <label class="form-field">Actividad<select name="category" required>${["Comercio", "Alimentos", "Servicios", "Manufactura", "Agricultura", "Otro"].map((value) => `<option ${item?.category === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
          <label class="form-field">Barrio o zona<input name="neighborhood" maxlength="60" required value="${escapeHtml(item?.neighborhood || "")}" placeholder="Ej. San Antonio"></label>
          <label class="form-field">Personas vinculadas<input name="people" type="number" min="0" max="10000" step="1" required value="${escapeHtml(item?.people ?? 1)}"></label>
          <label class="form-field">Tipo de afectación<select name="damage" required>${["Afectación parcial", "Daño en inventario", "Interrupción de actividad", "Afectación total", "En evaluación"].map((value) => `<option ${item?.damage === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
          <label class="form-field">Necesidad estimada (COP)<input name="need" type="number" min="0" step="1000" required value="${escapeHtml(item?.need ?? 0)}" placeholder="0"></label>
          <label class="form-field">Estado del reporte<select name="status">${["Pendiente de verificación", "En revisión", "Verificado"].map((value) => `<option ${item?.status === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
        </div>
        <div class="form-disclaimer">${icon("shield", 15)} Esta app guarda los datos en este navegador; no los envía a un servidor.</div>
        <div class="modal-actions"><button type="button" class="button button-quiet" id="cancel-modal">Cancelar</button><button type="submit" class="button button-primary">${isEdit ? "Guardar cambios" : "Registrar negocio"}</button></div>
      </form>
    </section></div>`;

  const close = () => { modalRoot.innerHTML = ""; };
  document.querySelector("#close-modal").addEventListener("click", close);
  document.querySelector("#cancel-modal").addEventListener("click", close);
  document.querySelector("#modal-backdrop").addEventListener("click", (event) => { if (event.target.id === "modal-backdrop") close(); });
  document.querySelector("#business-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const updated = {
      ...item,
      id: item?.id || `biz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name.trim(),
      owner: data.owner.trim() || "Sin especificar",
      category: data.category,
      neighborhood: data.neighborhood.trim(),
      people: Number(data.people),
      damage: data.damage,
      need: Number(data.need),
      status: data.status,
      date: item?.date || new Date().toISOString().slice(0, 10),
      demo: false,
    };
    const nextBusinesses = item ? businesses.map((business) => business.id === item.id ? updated : business) : [updated, ...businesses];
    if (!persistBusinesses(nextBusinesses)) return;
    close();
    showToast(item ? "Reporte actualizado." : "Negocio registrado.");
    renderApp();
  });
  document.querySelector('[name="name"]').focus();
}

function exportCsv() {
  const rows = filteredBusinesses();
  const headers = ["Negocio", "Contacto", "Actividad", "Barrio", "Personas vinculadas", "Afectación", "Necesidad estimada COP", "Estado", "Fecha", "Tipo de dato"];
  const csv = [headers, ...rows.map((item) => [item.name, item.owner, item.category, item.neighborhood, item.people, item.damage, item.need, item.status, item.date, item.demo ? "Muestra" : "Reporte"])].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "negocios-reportados-cali.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderReports() {
  const metrics = getMetrics();
  const damages = Array.from(new Set(businesses.map((item) => item.damage)));
  const damageStats = damages.map((damage) => ({ damage, count: businesses.filter((item) => item.damage === damage).length }));
  document.querySelector("#page-content").innerHTML = `
    ${pageHeading("LECTURA CONSOLIDADA", "Indicadores de entorno", "Cálculos automáticos sobre los reportes guardados en este navegador.")}
    <div class="demo-notice">${icon("shield", 16)} <span><strong>Estimaciones, no estadísticas oficiales.</strong> Los indicadores cambian al registrar o actualizar negocios.</span></div>
    <div class="report-summary-grid">
      <article class="report-highlight"><div class="report-icon">${icon("business", 20)}</div><span>Negocios reportados</span><strong>${metrics.total}</strong><small>Registro acumulado</small></article>
      <article class="report-highlight"><div class="report-icon blue">${icon("people", 20)}</div><span>Personas vinculadas</span><strong>${metrics.people}</strong><small>Suma declarada por reportantes</small></article>
      <article class="report-highlight"><div class="report-icon amber">${icon("reports", 20)}</div><span>Necesidad económica estimada</span><strong class="report-money">${formatCurrency(metrics.needs)}</strong><small>Pesos colombianos · valor solicitado</small></article>
    </div>
    <div class="reports-grid">
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">POR CATEGORÍA</span><h2>Tipo de afectación</h2></div></div>
        ${damageStats.length ? `<div class="report-bars">${damageStats.map(({ damage, count }) => `<div class="report-bar-row"><div><span>${escapeHtml(damage)}</span><strong>${count}</strong></div><div class="report-bar-track"><i style="width:${Math.max(5, count / Math.max(metrics.total, 1) * 100)}%"></i></div></div>`).join("")}</div>` : '<p class="empty-state">Aún no hay información para calcular.</p>'}
      </section>
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">POR ZONA</span><h2>Distribución territorial</h2></div></div>
        <div class="zone-list report-zone-list">${neighborhoodStats().map(([name, count]) => `<div class="zone-row"><span class="zone-name"><i class="zone-marker"></i>${escapeHtml(name)}</span><div class="zone-bar-track"><div class="zone-bar" style="width:${Math.max(8, count / Math.max(metrics.total, 1) * 100)}%"></div></div><strong>${count}</strong></div>`).join("") || '<p class="empty-state">Aún no hay información para calcular.</p>'}</div>
      </section>
    </div>
    <div class="calculation-note">${icon("reports", 16)} <span><strong>Cómo se calcula:</strong> personas y necesidades son sumas de lo declarado en cada reporte; no son una medición del total de personas afectadas ni una asignación de ayuda.</span></div>`;
}

const officialSources = [
  { name: "Datos Abiertos Colombia", agency: "Gobierno de Colombia", description: "Catálogo de conjuntos de datos públicos para complementar el análisis territorial.", url: "https://www.datos.gov.co/", tone: "blue", label: "Portal de datos" },
  { name: "Alcaldía de Santiago de Cali", agency: "Gobierno Distrital", description: "Información institucional, planes y servicios públicos de Santiago de Cali.", url: "https://www.cali.gov.co/", tone: "green", label: "Sitio oficial" },
  { name: "Servicio Geológico Colombiano", agency: "Entidad científica nacional", description: "Información de sismicidad y actividad geológica en Colombia.", url: "https://www.sgc.gov.co/", tone: "amber", label: "Sitio oficial" },
  { name: "Unidad Nacional para la Gestión del Riesgo", agency: "Gobierno de Colombia", description: "Orientación institucional sobre gestión del riesgo y atención de emergencias.", url: "https://www.gestiondelriesgo.gov.co/", tone: "rose", label: "Sitio oficial" },
];

function renderSources() {
  document.querySelector("#page-content").innerHTML = `
    ${pageHeading("CONSULTA PÚBLICA", "Fuentes oficiales", "Conecta la lectura comunitaria con información pública de Colombia.")}
    <div class="source-intro"><div class="source-intro-mark">${icon("sources", 21)}</div><div><strong>Fuentes para dar contexto, no para verificar personas.</strong><p>Consulta información publicada por entidades oficiales. El catálogo muestra metadatos; verifica vigencia, cobertura y metodología antes de usar un conjunto de datos.</p></div></div>
    <section class="panel catalog-panel"><div class="panel-heading"><div><span class="eyebrow">DATOS ABIERTOS COLOMBIA</span><h2>Buscar en el catálogo oficial</h2></div><span class="official-badge"><i></i> API pública</span></div>
      <form class="catalog-search" id="catalog-search"><label class="search-box">${icon("search", 17)}<input id="catalog-query" placeholder="Ej. Cali, sismo, economía local" value="Cali negocios" required></label><button class="button button-primary" type="submit">Buscar conjuntos</button></form>
      <p class="catalog-hint">Consulta el catálogo de datos.gov.co. La búsqueda requiere conexión a internet.</p>
      <div id="catalog-results" class="catalog-results"><div class="catalog-placeholder">${icon("sources", 21)}<span>Busca conjuntos de datos para ver resultados publicados en el portal oficial.</span></div></div>
    </section>
    <div class="section-title"><span class="eyebrow">PORTALES INSTITUCIONALES</span><h2>Otras fuentes de consulta</h2></div>
    <div class="official-grid">${officialSources.map((source) => `<article class="official-card"><div class="official-card-top"><span class="official-icon ${source.tone}">${icon(source.tone === "amber" ? "reports" : source.tone === "green" ? "business" : "sources", 19)}</span><span class="source-link-tag">${source.label}</span></div><span class="official-agency">${source.agency}</span><h3>${source.name}</h3><p>${source.description}</p><a href="${source.url}" target="_blank" rel="noopener noreferrer">Visitar sitio oficial ${icon("arrow", 14)}</a></article>`).join("")}</div>
    <p class="permission-note">${icon("shield", 14)} Esta aplicación consulta metadatos públicos; no descarga ni certifica datos personales ni registros de afectados.</p>`;
  document.querySelector("#catalog-search").addEventListener("submit", searchOfficialCatalog);
}

async function searchOfficialCatalog(event) {
  event.preventDefault();
  const query = document.querySelector("#catalog-query").value.trim();
  const results = document.querySelector("#catalog-results");
  const submit = document.querySelector('#catalog-search button[type="submit"]');
  if (!query) return;
  submit.disabled = true;
  submit.innerHTML = `${icon("refresh", 16)} Buscando…`;
  results.innerHTML = '<div class="catalog-placeholder"><span class="loading-spinner"></span><span>Consultando el catálogo oficial de Datos Abiertos Colombia…</span></div>';
  try {
    const url = `https://api.us.socrata.com/api/catalog/v1?domains=www.datos.gov.co&q=${encodeURIComponent(query)}&limit=6`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`El portal respondió con estado ${response.status}.`);
    const data = await response.json();
    const datasets = (data.results || []).filter((result) => result.resource && result.resource.id);
    if (!datasets.length) {
      results.innerHTML = `<div class="catalog-placeholder">${icon("search", 21)}<span>No se encontraron conjuntos para “${escapeHtml(query)}”. Prueba con términos más generales.</span></div>`;
      return;
    }
    results.innerHTML = datasets.map((result) => {
      const resource = result.resource;
      const description = (resource.description || "Este conjunto no incluye una descripción en el catálogo.").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const link = `https://www.datos.gov.co/d/${encodeURIComponent(resource.id)}`;
      return `<article class="dataset-result"><div class="dataset-icon">${icon("sources", 17)}</div><div class="dataset-info"><h3>${escapeHtml(resource.name || "Conjunto de datos")}</h3><p>${escapeHtml(description.slice(0, 220))}${description.length > 220 ? "…" : ""}</p><span class="dataset-meta">ID ${escapeHtml(resource.id)} · Datos Abiertos Colombia</span></div><a class="dataset-open" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${escapeHtml(resource.name || "conjunto")}">${icon("arrow", 17)}</a></article>`;
    }).join("");
  } catch (error) {
    console.error("Falló la consulta al catálogo de Datos Abiertos Colombia.", error);
    results.innerHTML = `<div class="catalog-error"><strong>No fue posible consultar el catálogo ahora.</strong><span>${escapeHtml(error.message || "Verifica tu conexión a internet e inténtalo de nuevo.")}</span><button class="text-button" id="retry-catalog">Intentar de nuevo</button></div>`;
    document.querySelector("#retry-catalog").addEventListener("click", () => document.querySelector("#catalog-search").requestSubmit());
  } finally {
    if (document.querySelector('#catalog-search button[type="submit"]')) {
      submit.disabled = false;
      submit.innerHTML = "Buscar conjuntos";
    }
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  currentUser = null;
  activePage = "overview";
  renderLogin();
}

const existingSession = sessionStorage.getItem(SESSION_KEY);
currentUser = users.find((user) => user.username === existingSession) || null;
if (currentUser) renderApp();
else renderLogin();