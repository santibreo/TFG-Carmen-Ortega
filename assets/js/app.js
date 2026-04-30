/**
 * app.js — Motor principal de EduSite
 * No es necesario editar este archivo para añadir contenido.
 */


// ─── Lucide icons loader ──────────────────────────────────────────────────────
async function loadIcon(name) {
  // Construye el SVG del icono desde la CDN de Lucide
  const url = `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    return await res.text();
  } catch {
    // Fallback: circle genérico
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/></svg>`;
  }
}


// ─── YouTube embed URL ────────────────────────────────────────────────────────
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    // YouTube watch
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    // YouTube short youtu.be
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return `https://player.vimeo.com/video/${id}`;
    }
    return url; // devuelve tal cual si no reconoce el formato
  } catch {
    return url;
  }
}


// ─── State ────────────────────────────────────────────────────────────────────
let currentTopic = null;
let currentSection = 0;
let currentContent = "videos"; // "videos" | "text" | "quiz"
let currentVideo = 0;
let quizState = {}; // { answered: Set, score: number }


// ─── Render sidebar ───────────────────────────────────────────────────────────
async function renderSidebar() {
  const nav = document.getElementById("topic-nav");
  const nav_quiz = document.getElementById("quiz-nav");
  nav.innerHTML = "";
  nav_quiz.innerHTML = "";
  const chevron_down_svg = await loadIcon("chevron-down");
  const chevron_right_svg = await loadIcon("chevron-right");

  for (const topic of TOPICS) {
    // Topics sidebar
    const btn = document.createElement("button");
    btn.className = "topic-btn";
    btn.dataset.id = topic.id;

    const iconSvg = await loadIcon(topic.icon);
    btn.innerHTML = `
      <span class="topic-icon">${iconSvg}</span>
      <span class="topic-label">${topic.title}</span>
    `;
    btn.addEventListener("click", () => selectTopic(topic.id));
    nav.appendChild(btn);

    // ── Quiz sidebar ────────────────────────────────────────────────────────
    // Sólo añadir el tema si alguna de sus secciones tiene quiz
    const hasQuiz = topic.sections && topic.sections.some(s => s.quiz && s.quiz.length > 0);
    if (!hasQuiz) continue;

    // Wrapper colapsable por tema
    const group = document.createElement("div");
    group.className = "quiz-group";

    const topicBtn = document.createElement("button");
    topicBtn.className = "topic-btn quiz-topic-btn";
    topicBtn.dataset.id = `quiz-topic-${topic.id}`;
    topicBtn.innerHTML = `
      <span class="topic-icon">${iconSvg}</span>
      <span class="topic-label">${topic.title}</span>
      <span class="quiz-chevron">${chevron_right_svg}</span>
    `;

    const sectionList = document.createElement("div");
    sectionList.className = "quiz-section-list collapsed";

    topic.sections.forEach((section, idx) => {
      if (!section.quiz || section.quiz.length === 0) return;
      const sbtn = document.createElement("button");
      sbtn.className = "topic-btn quiz-section-btn";
      sbtn.dataset.topicId = topic.id;
      sbtn.dataset.sectionIdx = idx;
      sbtn.innerHTML = `
        <span class="topic-label quiz-section-label">${section.title}</span>
      `;
      sbtn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectQuiz(topic.id, idx);
      });
      sectionList.appendChild(sbtn);
    });

    // Toggle colapso al pulsar el botón de tema
    topicBtn.addEventListener("click", () => {
      const isOpen = !sectionList.classList.contains("collapsed");
      sectionList.classList.toggle("collapsed", isOpen);
      topicBtn.querySelector(".quiz-chevron").innerHTML = isOpen ? chevron_right_svg : chevron_down_svg;
    });
    group.appendChild(topicBtn);
    group.appendChild(sectionList);
    nav_quiz.appendChild(group);
  }
}


// ─── Select quiz (sidebar shortcut) ──────────────────────────────────────────
function selectQuiz(topicId, sectionIdx) {
  currentTopic   = TOPICS.find(t => t.id === topicId);
  currentSection = sectionIdx;
  currentContent = "quiz";
  currentVideo   = 0;
  quizState      = { answered: new Set(), score: 0 };

  // Marcar activo en sidebar de cuestionarios
  document.querySelectorAll(".quiz-section-btn").forEach(btn => {
    const active =
      btn.dataset.topicId === topicId &&
      parseInt(btn.dataset.sectionIdx) === sectionIdx;
    btn.classList.toggle("active", active);
  });

  // Marcar tema activo del sidebar de temas
  document.querySelectorAll(".topic-btn[data-id]").forEach(btn => {
    const active = btn.dataset.topicId === topicId;
    btn.classList.toggle("active", active);
  });

  renderMain();

  if (window.innerWidth < 768) {
    document.getElementById("sidebar").classList.remove("open");
  }
}


// ─── Select topic ─────────────────────────────────────────────────────────────
function selectTopic(topicId) {
  currentTopic = TOPICS.find(t => t.id === topicId);
  currentSection = 0;
  currentContent = "videos";
  currentVideo = 0;
  quizState = { answered: new Set(), score: 0 };

  // Update sidebar active state
  document.querySelectorAll(".topic-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === topicId);
  });

  renderMain();

  // Close sidebar on mobile
  if (window.innerWidth < 768) {
    document.getElementById("sidebar").classList.remove("open");
  }
}

// ─── Render main panel ────────────────────────────────────────────────────────
function renderMain() {
  const main = document.getElementById("main-content");

  if (!currentTopic) {
    main.innerHTML = `
      <div class="welcome">
        <img src="./assets/img/bienvenido.png"/>
        <h2>Selecciona un tema en el panel lateral para comenzar</h2>
      </div>`;
    return;
  }

  const sections = currentTopic.sections;

  if (currentTopic && !sections) {
    main.innerHTML = `
      <div class="welcome">
        <img src="./assets/img/bienvenido.png"/>
        <h2>Vaya, parece que "${currentTopic.title}" está aún vacío...</h2>
      </div>`;
    return;
  }

  main.innerHTML = `
    <div class="topic-header">
      <h1 class="topic-title">${currentTopic.title}</h1>
    </div>

    <div class="sections-tabs" role="tablist">
      ${sections.map((s, i) => `
        <button
          class="section-tab ${i === currentSection ? "active" : ""}"
          role="tab"
          aria-selected="${i === currentSection}"
          data-section="${i}">
          ${s.title}
        </button>
      `).join("")}
    </div>

    <div class="content-area" id="content-area">
      ${renderContentArea(sections[currentSection])}
    </div>
  `;

  // Events: section tabs
  main.querySelectorAll(".section-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      currentSection = parseInt(tab.dataset.section);
      currentContent = "videos";
      currentVideo = 0;
      quizState = { answered: new Set(), score: 0 };
      renderMain();
    });
  });

  attachContentEvents();
}

// ─── Render content area ──────────────────────────────────────────────────────
function renderContentArea(section) {
  return `
    <div class="content-nav">
      <button class="content-tab ${currentContent === "videos" ? "active" : ""}" data-content="videos">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        Vídeo
      </button>
      <button class="content-tab ${currentContent === "text" ? "active" : ""}" data-content="text">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        Infografía
      </button>
      <button class="content-tab ${currentContent === "quiz" ? "active" : ""}" data-content="quiz">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Cuestionario
      </button>
      <button class="content-tab ${currentContent === "printables" ? "active" : ""}" data-content="pritables">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="lucide
          lucide-printer-icon lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1
          2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1
          0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
        Imprimibles
      </button>
    </div>

    <div class="content-panel" id="content-panel">
      ${currentContent === "videos" ? renderVideos(section) : ""}
      ${currentContent === "text"   ? renderText(section)   : ""}
      ${currentContent === "quiz"   ? renderQuiz(section)   : ""}
    </div>
  `;
}

// ─── Videos ───────────────────────────────────────────────────────────────────
function renderVideos(section) {
  if (!section.videos || section.videos.length === 0) {
    return `<div class="empty-state">No hay vídeos en este apartado.</div>`;
  }

  const video = section.videos[currentVideo];
  const embedUrl = toEmbedUrl(video.url);

  return `
    <div class="video-player">
      <div class="video-wrapper">
        <iframe
          src="${embedUrl}"
          title="${video.title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <div class="video-info">
        <h3 class="video-title">${video.title}</h3>
        <p class="video-desc">${video.description}</p>
      </div>
    </div>

    ${section.videos.length > 1 ? `
      <div class="video-list">
        <p class="video-list-label">Más vídeos en este apartado:</p>
        ${section.videos.map((v, i) => `
          <button class="video-item ${i === currentVideo ? "active" : ""}" data-video="${i}">
            <span class="video-item-num">${i + 1}</span>
            <span class="video-item-title">${v.title}</span>
          </button>
        `).join("")}
      </div>
    ` : ""}
  `;
}

// ─── Text ─────────────────────────────────────────────────────────────────────
function renderText(section) {
  return `<div class="text-content">${section.text || "<p>No hay apuntes en este apartado.</p>"}</div>`;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
function renderQuiz(section) {
  if (!section.quiz || section.quiz.length === 0) {
    return `<div class="empty-state">No hay cuestionario en este apartado.</div>`;
  }

  const answered = quizState.answered || new Set();
  const score = quizState.score || 0;
  const total = section.quiz.length;
  const finished = answered.size === total;

  return `
    <div class="quiz-container">
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width: ${(answered.size / total) * 100}%"></div>
      </div>
      <p class="quiz-counter">${answered.size} de ${total} respondidas</p>

      ${section.quiz.map((q, qi) => {
        const isAnswered = answered.has(qi);
        return `
          <div class="quiz-question ${isAnswered ? "answered" : ""}" id="q-${qi}">
            <div class="quiz-body">
              <p class="question-text"><span class="question-num">${qi + 1}</span>${q.question}</p>
              <img width="${q.img_width ? q.img_width : "120px"}" src="${q.img_url}"/>
            </div>
            <div class="options">
              ${q.options.map((opt, oi) => {
                let cls = "option-btn";
                if (isAnswered) {
                  if (oi === q.answer) cls += " correct";
                  else if (quizState[`selected_${qi}`] === oi) cls += " wrong";
                }
                return `
                  <button class="option-btn ${isAnswered && oi === q.answer ? "correct" : ""} ${isAnswered && quizState[`selected_${qi}`] === oi && oi !== q.answer ? "wrong" : ""}"
                    data-q="${qi}" data-o="${oi}" ${isAnswered ? "disabled" : ""}>
                    <span class="option-letter">${["A","B","C","D", "E", "F", "G"][oi]}</span>
                    ${opt}
                  </button>`;
              }).join("")}
            </div>
          </div>`;
      }).join("")}

      ${finished ? `
        <div class="quiz-result">
          <div class="result-score">${score}/${total}</div>
          <p class="result-msg">${score === total ? "¡Perfecto! 🎉" : score >= total/2 ? "¡Bien hecho! 👏" : "Sigue practicando 💪"}</p>
          <button class="retry-btn" id="retry-quiz">Reintentar</button>
        </div>
      ` : ""}
    </div>
  `;
}

// ─── Attach content events ────────────────────────────────────────────────────
function attachContentEvents() {
  // Content tab switcher
  document.querySelectorAll(".content-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      currentContent = tab.dataset.content;
      document.getElementById("content-area").innerHTML =
        renderContentArea(currentTopic.sections[currentSection]);
      attachContentEvents();
    });
  });

  // Video list items
  document.querySelectorAll(".video-item").forEach(item => {
    item.addEventListener("click", () => {
      currentVideo = parseInt(item.dataset.video);
      document.getElementById("content-area").innerHTML =
        renderContentArea(currentTopic.sections[currentSection]);
      attachContentEvents();
    });
  });

  // Quiz option buttons
  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qi = parseInt(btn.dataset.q);
      const oi = parseInt(btn.dataset.o);
      const section = currentTopic.sections[currentSection];
      const q = section.quiz[qi];

      if (quizState.answered.has(qi)) return;

      quizState.answered.add(qi);
      quizState[`selected_${qi}`] = oi;
      if (oi === q.answer) quizState.score = (quizState.score || 0) + 1;

      document.getElementById("content-area").innerHTML =
        renderContentArea(section);
      attachContentEvents();

      // Scroll to answered question
      const el = document.getElementById(`q-${qi}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  // Retry quiz
  const retryBtn = document.getElementById("retry-quiz");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      quizState = { answered: new Set(), score: 0 };
      document.getElementById("content-area").innerHTML =
        renderContentArea(currentTopic.sections[currentSection]);
      attachContentEvents();
    });
  }
}

// ─── Mobile sidebar toggle ────────────────────────────────────────────────────
function initMobileToggle() {
  const toggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  toggle?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("visible");
  });
  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // Set site title
  document.title = SITE_TITLE;
  const titleEl = document.getElementById("site-title");
  if (titleEl) titleEl.textContent = SITE_TITLE;
  const subtitleEl = document.getElementById("site-subtitle");
  if (subtitleEl) subtitleEl.textContent = SITE_SUBTITLE;

  // Render
  await renderSidebar();
  renderMain();
  initMobileToggle();
});
