import * as pdfjsLib from "./vendor/pdf.min.mjs";

const STORE_KEYS = {
  notes: "linguanote.notes.v1",
  annotations: "linguanote.annotations.v1",
  translations: "linguanote.translations.v1",
  projects: "linguanote.projects.v1",
  activeProject: "linguanote.activeProject.v1",
};

const MIN_ZOOM = 0.45;
const MAX_ZOOM = 2.6;
const ZOOM_STEP = 0.12;
const DB_NAME = "linguanote-db";
const DB_VERSION = 1;

const fallbackDictionary = new Map(
  Object.entries({
    a: "一个；一",
    about: "关于；大约",
    after: "在...之后",
    all: "全部；所有",
    also: "也；同样",
    an: "一个；一",
    and: "和；并且",
    are: "是",
    as: "作为；因为；当...时",
    at: "在",
    be: "是；成为",
    because: "因为",
    been: "已经是",
    but: "但是",
    by: "通过；由",
    can: "能够；可以",
    could: "能够；可能",
    do: "做",
    for: "为了；对于",
    from: "来自；从",
    has: "有；已经",
    have: "有；已经",
    he: "他",
    her: "她的",
    his: "他的",
    how: "怎样；如何",
    i: "我",
    if: "如果",
    in: "在...里面",
    into: "进入",
    is: "是",
    it: "它",
    its: "它的",
    may: "可能；可以",
    more: "更多",
    most: "最多；大多数",
    not: "不",
    of: "...的",
    on: "在...上",
    one: "一；一个",
    or: "或者",
    other: "其他的",
    our: "我们的",
    research: "研究",
    should: "应该",
    so: "所以；如此",
    some: "一些",
    study: "学习；研究",
    than: "比",
    that: "那个；那",
    the: "这个；那个",
    their: "他们的",
    there: "那里；存在",
    these: "这些",
    they: "他们",
    this: "这个",
    to: "到；向；为了",
    use: "使用",
    was: "是",
    we: "我们",
    were: "是",
    when: "当...时",
    which: "哪一个；那个",
    who: "谁",
    will: "将要",
    with: "和；带有",
    would: "将会；会",
    you: "你；你们",
    your: "你的；你们的",
  }),
);

const cet6Dictionary = new Map(
  Object.entries({
    academic: {
      contextMeaning: "学术的；高等教育的",
      commonMeaning: "六级常见于 academic research / academic performance，指学术研究或学业表现。",
    },
    acquire: {
      contextMeaning: "获得；习得",
      commonMeaning: "六级常见于 acquire knowledge / acquire skills，强调通过学习或实践获得。",
    },
    adapt: {
      contextMeaning: "适应；改编",
      commonMeaning: "六级常考 adapt to，表示适应新环境、变化或要求。",
    },
    affect: {
      contextMeaning: "影响",
      commonMeaning: "六级阅读中常表示对结果、行为、健康或社会现象产生影响。",
    },
    approach: {
      contextMeaning: "方法；途径；接近",
      commonMeaning: "六级常见义是“方法、途径”，如 an effective approach to solving a problem。",
    },
    assume: {
      contextMeaning: "假定；承担",
      commonMeaning: "六级常见于 assume that，表示基于信息作出假设；也可指承担责任。",
    },
    available: {
      contextMeaning: "可获得的；可用的",
      commonMeaning: "六级高频，常用于 resources / information / services are available。",
    },
    benefit: {
      contextMeaning: "益处；使受益",
      commonMeaning: "六级常用于讨论政策、教育、科技、健康带来的好处。",
    },
    concept: {
      contextMeaning: "概念；观念",
      commonMeaning: "六级阅读中常指抽象概念、理论概念或社会观念。",
    },
    concern: {
      contextMeaning: "担忧；涉及；关心",
      commonMeaning: "六级常见义是“担忧、关注点”，也常表示 be concerned with 涉及。",
    },
    consequence: {
      contextMeaning: "结果；后果",
      commonMeaning: "六级常用于 negative consequences，强调行为或趋势带来的后果。",
    },
    consume: {
      contextMeaning: "消耗；消费",
      commonMeaning: "六级常见于 consume energy / consume products，表示消耗资源或消费商品。",
    },
    contribute: {
      contextMeaning: "促成；贡献",
      commonMeaning: "六级常考 contribute to，表示导致、促成某种结果。",
    },
    decline: {
      contextMeaning: "下降；衰退；拒绝",
      commonMeaning: "六级常见于 a decline in，指数量、质量、能力或趋势下降。",
    },
    enhance: {
      contextMeaning: "提高；增强",
      commonMeaning: "六级常用于 enhance efficiency / ability / understanding。",
    },
    establish: {
      contextMeaning: "建立；确立；证实",
      commonMeaning: "六级常见于 establish a link / system / reputation。",
    },
    estimate: {
      contextMeaning: "估计；估算",
      commonMeaning: "六级阅读中常用于数据、比例、成本或影响的估算。",
    },
    evidence: {
      contextMeaning: "证据；依据",
      commonMeaning: "六级阅读常用来支撑观点、研究发现或结论。",
    },
    factor: {
      contextMeaning: "因素",
      commonMeaning: "六级高频，常用于 social / economic / environmental factors。",
    },
    identify: {
      contextMeaning: "识别；确认",
      commonMeaning: "六级常见于 identify causes / problems / patterns。",
    },
    impact: {
      contextMeaning: "影响；冲击",
      commonMeaning: "六级常用于 describe the impact of technology / policy / environment。",
    },
    indicate: {
      contextMeaning: "表明；显示",
      commonMeaning: "六级阅读高频，用于研究数据或现象说明某个结论。",
    },
    involve: {
      contextMeaning: "涉及；包含；需要",
      commonMeaning: "六级常见于 involve costs / risks / efforts / participants。",
    },
    issue: {
      contextMeaning: "问题；议题",
      commonMeaning: "六级中常指社会、教育、环境、科技等讨论议题。",
    },
    maintain: {
      contextMeaning: "维持；保持；主张",
      commonMeaning: "六级常见于 maintain balance / health / standards，也可表示坚持认为。",
    },
    significant: {
      contextMeaning: "重要的；显著的",
      commonMeaning: "六级高频，用于 significant change / difference / impact。",
    },
    study: {
      contextMeaning: "研究；学习",
      commonMeaning: "六级阅读中常指“研究、调查”，如 a recent study shows，而不只是学习。",
    },
  }),
);

const contextMeaningRules = {
  address: [
    { pattern: /\b(problem|issue|concern|challenge|need|question)\b/i, meaning: "处理；解决" },
    { pattern: /\b(email|letter|mail|envelope|street|home)\b/i, meaning: "地址；写地址" },
    { pattern: /\b(speech|audience|conference|meeting)\b/i, meaning: "演讲；致辞" },
  ],
  approach: [
    { pattern: /\b(method|way|strategy|solution|problem|issue)\b/i, meaning: "方法；途径" },
    { pattern: /\b(near|come|coming|toward|distance)\b/i, meaning: "接近；靠近" },
  ],
  assume: [
    { pattern: /\b(that|suppose|believe|likely|probably)\b/i, meaning: "假定；认为" },
    { pattern: /\b(responsibility|role|position|duty|office)\b/i, meaning: "承担；担任" },
  ],
  charge: [
    { pattern: /\b(fee|cost|price|pay|payment|money)\b/i, meaning: "收费；费用" },
    { pattern: /\b(accuse|crime|court|guilty)\b/i, meaning: "指控；控告" },
    { pattern: /\b(battery|phone|electric|power)\b/i, meaning: "充电；电量" },
  ],
  decline: [
    { pattern: /\b(rate|number|population|sales|level|quality|decrease|fall)\b/i, meaning: "下降；减少；衰退" },
    { pattern: /\b(invitation|offer|request)\b/i, meaning: "谢绝；拒绝" },
  ],
  issue: [
    { pattern: /\b(problem|concern|debate|social|environmental|public)\b/i, meaning: "问题；议题" },
    { pattern: /\b(issue|publish|release|statement|report)\b/i, meaning: "发布；发行" },
  ],
  maintain: [
    { pattern: /\b(balance|health|relationship|standard|level|system)\b/i, meaning: "维持；保持" },
    { pattern: /\b(argue|claim|insist|believe|that)\b/i, meaning: "坚持认为；主张" },
  ],
  observe: [
    { pattern: /\b(phenomenon|behavior|change|effect|data|experiment)\b/i, meaning: "观察；观测" },
    { pattern: /\b(rule|law|custom|tradition)\b/i, meaning: "遵守" },
  ],
  present: [
    { pattern: /\b(problem|challenge|opportunity|risk|evidence)\b/i, meaning: "呈现；带来" },
    { pattern: /\b(report|paper|findings|speech)\b/i, meaning: "展示；陈述" },
    { pattern: /\b(now|current|today)\b/i, meaning: "目前的；现在的" },
  ],
  raise: [
    { pattern: /\b(question|issue|concern|awareness)\b/i, meaning: "提出；引起" },
    { pattern: /\b(child|children|family)\b/i, meaning: "抚养；养育" },
    { pattern: /\b(price|level|standard|salary)\b/i, meaning: "提高；增加" },
  ],
  study: [
    { pattern: /\b(recent|new|research|survey|data|shows?|finds?|suggests?|indicates?|participants?)\b/i, meaning: "研究；调查" },
    { pattern: /\b(english|exam|course|school|college|student|learn|class)\b/i, meaning: "学习；攻读" },
  ],
};

const state = {
  mode: "word",
  zoom: 1,
  docKey: "",
  docTitle: "",
  activeProjectId: localStorage.getItem(STORE_KEYS.activeProject) || "",
  projects: readJson(STORE_KEYS.projects, []),
  recognizedPages: [],
  current: null,
  currentRange: null,
  voices: [],
  selectionTimer: 0,
  dockTimer: 0,
  longPressTimer: 0,
  longPressPoint: null,
  suppressNextClick: false,
  lastSelectionText: "",
  notes: readJson(STORE_KEYS.notes, []),
  annotations: readJson(STORE_KEYS.annotations, {}),
  translations: readJson(STORE_KEYS.translations, {}),
  activeStroke: null,
  annotationHistory: [],
};

const els = {
  fileInput: document.querySelector("#fileInput"),
  pdfInput: document.querySelector("#pdfInput"),
  docxInput: document.querySelector("#docxInput"),
  textInput: document.querySelector("#textInput"),
  manualText: document.querySelector("#manualText"),
  loadManualText: document.querySelector("#loadManualText"),
  projectList: document.querySelector("#projectList"),
  projectCount: document.querySelector("#projectCount"),
  reader: document.querySelector("#reader"),
  docTitle: document.querySelector("#docTitle"),
  docMeta: document.querySelector("#docMeta"),
  floatingDock: document.querySelector(".floating-mode-dock"),
  modeButtons: document.querySelectorAll("[data-mode]"),
  penColor: document.querySelector("#penColor"),
  penSize: document.querySelector("#penSize"),
  dockPenColor: document.querySelector("#dockPenColor"),
  dockPenSize: document.querySelector("#dockPenSize"),
  targetLang: document.querySelector("#targetLang"),
  autoSpeak: document.querySelector("#autoSpeak"),
  voiceSelect: document.querySelector("#voiceSelect"),
  speechRate: document.querySelector("#speechRate"),
  zoomOut: document.querySelector("#zoomOut"),
  zoomReset: document.querySelector("#zoomReset"),
  zoomIn: document.querySelector("#zoomIn"),
  zoomFit: document.querySelector("#zoomFit"),
  jumpRecognized: document.querySelector("#jumpRecognized"),
  undoAnnotation: document.querySelector("#undoAnnotation"),
  dockUndoAnnotation: document.querySelector("#dockUndoAnnotation"),
  zoomValue: document.querySelector("#zoomValue"),
  lookupText: document.querySelector("#lookupText"),
  translationText: document.querySelector("#translationText"),
  phoneticText: document.querySelector("#phoneticText"),
  contextSentenceText: document.querySelector("#contextSentenceText"),
  contextMeaningText: document.querySelector("#contextMeaningText"),
  commonMeaningText: document.querySelector("#commonMeaningText"),
  speakButton: document.querySelector("#speakButton"),
  addNote: document.querySelector("#addNote"),
  copyTranslation: document.querySelector("#copyTranslation"),
  notesList: document.querySelector("#notesList"),
  noteCount: document.querySelector("#noteCount"),
  noteTemplate: document.querySelector("#noteTemplate"),
  clearAnnotations: document.querySelector("#clearAnnotations"),
  exportNotes: document.querySelector("#exportNotes"),
};

pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdf.worker.min.mjs";

initApp();

async function initApp() {
  registerServiceWorker();
  requestPersistentStorage();
  renderProjectList();
  renderNotes();
  populateVoices();
  wireEvents();
  applyZoom();
  if (state.activeProjectId && state.projects.some((project) => project.id === state.activeProjectId)) {
    await openProject(state.activeProjectId, { silent: true });
  }
}

async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return;
  try {
    await navigator.storage.persist();
  } catch (error) {
    console.warn("Persistent storage request failed", error);
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  });
}

function wireEvents() {
  els.fileInput.addEventListener("change", handleUniversalImport);
  els.pdfInput.addEventListener("change", handlePdfImport);
  els.docxInput.addEventListener("change", handleDocxImport);
  els.textInput.addEventListener("change", handleTextFileImport);
  els.loadManualText.addEventListener("click", async () => {
    const text = els.manualText.value.trim();
    if (!text) {
      showToast("请先粘贴英文文本。");
      return;
    }
    const project = await createProject("粘贴文本", "text", { text });
    activateProject(project);
    renderTextDocument(text, project.name, project.id);
  });

  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  els.floatingDock.addEventListener("pointerdown", handleDockPointerDown, true);
  els.floatingDock.addEventListener("pointerenter", expandDock);
  els.floatingDock.addEventListener("pointerleave", scheduleDockCollapse);
  els.floatingDock.addEventListener("focusin", expandDock);
  els.floatingDock.addEventListener("focusout", scheduleDockCollapse);
  els.floatingDock.addEventListener("input", scheduleDockCollapse);
  els.floatingDock.addEventListener("click", scheduleDockCollapse);
  scheduleDockCollapse();
  syncPenControls(els.penColor, els.dockPenColor);
  syncPenControls(els.dockPenColor, els.penColor);
  syncPenControls(els.penSize, els.dockPenSize);
  syncPenControls(els.dockPenSize, els.penSize);

  document.addEventListener("selectionchange", handleSelectionChange);
  els.reader.addEventListener("pointerdown", handleLongPressStart);
  els.reader.addEventListener("pointermove", handleLongPressMove);
  els.reader.addEventListener("pointerup", cancelLongPress);
  els.reader.addEventListener("pointercancel", cancelLongPress);
  els.reader.addEventListener("pointerleave", cancelLongPress);
  els.reader.addEventListener("click", handleReaderClick);
  els.speakButton.addEventListener("click", () => speak(state.current?.source));
  els.addNote.addEventListener("click", addCurrentNote);
  els.copyTranslation.addEventListener("click", copyCurrentTranslation);
  els.clearAnnotations.addEventListener("click", clearCurrentAnnotations);
  els.exportNotes.addEventListener("click", exportNotes);

  els.zoomOut.addEventListener("click", () => setZoom(state.zoom - ZOOM_STEP));
  els.zoomIn.addEventListener("click", () => setZoom(state.zoom + ZOOM_STEP));
  els.zoomReset.addEventListener("click", () => setZoom(1));
  els.zoomFit.addEventListener("click", fitToWidth);
  els.jumpRecognized.addEventListener("click", scrollToRecognizedText);
  els.undoAnnotation.addEventListener("click", undoAnnotation);
  els.dockUndoAnnotation.addEventListener("click", undoAnnotation);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
  }
}

async function handleUniversalImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    await handlePdfImport(event);
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    await handleDocxImport(event);
  } else if (file.type === "text/plain" || name.endsWith(".txt")) {
    await handleTextFileImport(event);
  } else {
    event.target.value = "";
    showToast("暂不支持此格式，请选择 PDF、DOCX 或 TXT 文件。");
  }
}

function syncPenControls(source, target) {
  source.addEventListener("input", () => {
    target.value = source.value;
  });
}

function handleDockPointerDown(event) {
  if (!els.floatingDock.classList.contains("collapsed")) return;
  event.preventDefault();
  event.stopPropagation();
  expandDock();
}

function expandDock() {
  window.clearTimeout(state.dockTimer);
  els.floatingDock.classList.remove("collapsed");
}

function scheduleDockCollapse() {
  window.clearTimeout(state.dockTimer);
  state.dockTimer = window.setTimeout(() => {
    if (els.floatingDock.matches(":hover") || els.floatingDock.contains(document.activeElement)) {
      scheduleDockCollapse();
      return;
    }
    els.floatingDock.classList.add("collapsed");
  }, 2600);
}

async function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("files")) db.createObjectStore("files", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbRequest(mode, callback) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("files", mode);
    const store = transaction.objectStore("files");
    const request = callback(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

function saveProjects() {
  writeJson(STORE_KEYS.projects, state.projects);
}

async function createProject(name, type, data) {
  const project = {
    id: `project:${Date.now()}:${Math.random().toString(16).slice(2)}`,
    name,
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dbRequest("readwrite", (store) =>
    store.put({
      id: project.id,
      type,
      name,
      text: data.text || "",
      buffer: data.buffer || null,
    }),
  );

  state.projects = [project, ...state.projects.filter((item) => item.id !== project.id)];
  saveProjects();
  activateProject(project);
  return project;
}

function activateProject(project) {
  state.activeProjectId = project.id;
  state.docKey = project.id;
  state.docTitle = project.name;
  localStorage.setItem(STORE_KEYS.activeProject, project.id);
  renderProjectList();
  renderNotes();
}

async function openProject(projectId, options = {}) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return;

  try {
    const file = await dbRequest("readonly", (store) => store.get(project.id));
    if (!file) throw new Error("Project file missing");

    activateProject(project);
    if (project.type === "pdf") {
      await renderPdfBuffer(file.buffer, project.name);
    } else if (project.type === "docx") {
      const text = await extractDocxText(file.buffer);
      renderTextDocument(text, project.name, project.id);
      setDocumentMeta(project.name, `${text.length.toLocaleString()} 个字符 Word`);
    } else {
      renderTextDocument(file.text || "", project.name, project.id);
    }
    if (!options.silent) showToast("项目已打开。");
  } catch (error) {
    console.error(error);
    showToast("项目打开失败，请重新导入文件。");
  }
}

async function deleteProject(projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return;
  if (!confirm(`删除项目“${project.name}”？该项目的笔记和标注也会删除。`)) return;

  await dbRequest("readwrite", (store) => store.delete(projectId));
  state.projects = state.projects.filter((item) => item.id !== projectId);
  state.notes = state.notes.filter((note) => note.projectId !== projectId);
  delete state.annotations[projectId];
  saveProjects();
  writeJson(STORE_KEYS.notes, state.notes);
  writeJson(STORE_KEYS.annotations, state.annotations);

  if (state.activeProjectId === projectId) {
    state.activeProjectId = "";
    state.docKey = "";
    localStorage.removeItem(STORE_KEYS.activeProject);
    clearReader();
    setDocumentMeta("未导入文档", "导入英文 PDF、Word 或文本开始阅读");
  }
  renderProjectList();
  renderNotes();
}

function renderProjectList() {
  if (!els.projectList) return;
  els.projectList.innerHTML = "";
  els.projectCount.textContent = String(state.projects.length);

  if (!state.projects.length) {
    const empty = document.createElement("p");
    empty.className = "project-empty";
    empty.textContent = "暂无项目。导入文件后会自动创建。";
    els.projectList.append(empty);
    return;
  }

  for (const project of state.projects) {
    const item = document.createElement("article");
    item.className = "project-item";
    item.classList.toggle("active", project.id === state.activeProjectId);

    const openButton = document.createElement("button");
    openButton.className = "project-open";
    openButton.type = "button";
    openButton.innerHTML = `<strong>${escapeHtml(project.name)}</strong><span>${project.type.toUpperCase()} · ${new Date(project.updatedAt).toLocaleDateString()}</span>`;
    openButton.addEventListener("click", () => openProject(project.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "project-delete";
    deleteButton.type = "button";
    deleteButton.title = "删除项目";
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteProject(project.id));

    item.append(openButton, deleteButton);
    els.projectList.append(item);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function handlePdfImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  setDocumentMeta(file.name, "正在解析 PDF...");
  try {
    const buffer = await readFileAsArrayBuffer(file);
    if (!hasPdfSignature(buffer)) {
      throw new Error("PDF_SIGNATURE_MISSING");
    }

    await validatePdfBuffer(buffer);
    const project = await createProject(file.name, "pdf", { buffer });
    await renderPdfBuffer(buffer, project.name);
    showToast("PDF 已载入。");
  } catch (error) {
    console.error(error);
    const message = getPdfImportErrorMessage(error);
    setDocumentMeta("PDF 载入失败", message);
    showToast(message);
  } finally {
    event.target.value = "";
  }
}

function readFileAsArrayBuffer(file) {
  if (typeof file.arrayBuffer === "function") return file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("FILE_READ_FAILED"));
    reader.readAsArrayBuffer(file);
  });
}

function hasPdfSignature(buffer) {
  const bytes = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 1024));
  const signature = [0x25, 0x50, 0x44, 0x46, 0x2d];

  for (let start = 0; start <= bytes.length - signature.length; start += 1) {
    if (signature.every((value, offset) => bytes[start + offset] === value)) return true;
  }
  return false;
}

async function validatePdfBuffer(buffer) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer.slice(0)),
    isOffscreenCanvasSupported: false,
    isImageDecoderSupported: false,
  });
  const pdf = await loadingTask.promise;
  await pdf.destroy();
}

function getPdfImportErrorMessage(error) {
  const name = error?.name || "";
  const message = String(error?.message || error || "");

  if (message === "PDF_SIGNATURE_MISSING") {
    return "所选文件没有 PDF 文件标识，请确认它不是改了扩展名的其他文件。";
  }
  if (name === "PasswordException" || /password/i.test(message)) {
    return "这个 PDF 有密码保护，请先移除密码后再导入。";
  }
  if (name === "InvalidPDFException" || /invalid pdf|corrupted/i.test(message)) {
    return "PDF 内容不完整或已损坏，请尝试重新下载该文件。";
  }
  if (/quota|storage|indexeddb|database/i.test(`${name} ${message}`)) {
    return "PDF 可以读取，但浏览器存储空间不足。请删除旧项目后重试。";
  }
  return "浏览器未能解析这个 PDF。请刷新页面后重试，文件本身不一定无效。";
}

async function renderPdfBuffer(buffer, title) {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer.slice(0)),
    isOffscreenCanvasSupported: false,
    isImageDecoderSupported: false,
  }).promise;
  state.docTitle = title;
  state.recognizedPages = [];
  resetDocumentView();

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const pageText = await renderPdfPage(pdf, pageNumber);
    if (pageText) state.recognizedPages.push({ pageNumber, text: pageText });
    setDocumentMeta(title, `${pageNumber}/${pdf.numPages} 页已载入`);
  }

  if (state.recognizedPages.length) {
    renderRecognizedTextDocument(state.recognizedPages, pdf.numPages + 1);
  }

  const recognizedCount = state.recognizedPages.reduce((sum, page) => sum + page.text.length, 0);
  setDocumentMeta(title, `${pdf.numPages} 页 PDF，已识别 ${recognizedCount.toLocaleString()} 个字符`);
  fitToWidth(false);
}

async function renderPdfPage(pdf, pageNumber) {
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const availableWidth = Math.max(560, els.reader.clientWidth - 72);
  const renderScale = Math.min(1.55, Math.max(0.9, availableWidth / baseViewport.width));
  const viewport = page.getViewport({ scale: renderScale });
  const width = Math.floor(viewport.width);
  const height = Math.floor(viewport.height);

  const pageEl = document.createElement("article");
  pageEl.className = "page pdf-page";
  pageEl.dataset.page = String(pageNumber);
  pageEl.dataset.baseWidth = String(width);
  pageEl.dataset.baseHeight = String(height);
  pageEl.style.width = `${width}px`;
  pageEl.style.height = `${height}px`;

  const canvas = document.createElement("canvas");
  canvas.className = "pdf-canvas";
  canvas.width = width;
  canvas.height = height;
  pageEl.append(canvas);

  const textLayer = document.createElement("div");
  textLayer.className = "textLayer";
  pageEl.append(textLayer);

  const annotationCanvas = createAnnotationCanvas(pageNumber, width, height);
  pageEl.append(annotationCanvas);
  appendPage(pageEl, width, height);

  await page.render({
    canvasContext: canvas.getContext("2d"),
    viewport,
  }).promise;

  const textContent = await page.getTextContent();
  const pageText = extractPdfPageText(textContent);
  pageEl.dataset.fullText = pageText;

  const textLayerRenderer = new pdfjsLib.TextLayer({
    textContentSource: textContent,
    container: textLayer,
    viewport,
  });
  await textLayerRenderer.render();

  restoreAnnotation(annotationCanvas);
  return pageText;
}

function extractPdfPageText(textContent) {
  const parts = [];
  for (const item of textContent.items || []) {
    const text = item.str?.trim();
    if (text) parts.push(text);
    if (item.hasEOL) parts.push("\n");
  }
  return normalizePdfText(parts.join(" "));
}

function normalizePdfText(text) {
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/-\s+/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([.!?])\s+/g, "$1 ")
    .trim();
}

function renderRecognizedTextDocument(pages, pageNumber) {
  const pageEl = document.createElement("article");
  pageEl.className = "page text-page recognized-page";
  pageEl.dataset.page = String(pageNumber);
  els.jumpRecognized.classList.remove("is-hidden");

  const doc = document.createElement("div");
  doc.className = "text-doc recognized-doc";

  const banner = document.createElement("div");
  banner.className = "recognized-banner";
  banner.innerHTML = "<strong>识别文本</strong><span>这里是自动提取出的整篇英文，适合选择词组和句子翻译。</span>";
  doc.append(banner);

  for (const page of pages) {
    const label = document.createElement("div");
    label.className = "recognized-page-label";
    label.textContent = `Page ${page.pageNumber}`;
    doc.append(label);

    for (const paragraph of splitIntoParagraphs(page.text)) {
      const p = document.createElement("p");
      p.textContent = paragraph;
      doc.append(p);
    }
  }

  pageEl.append(doc);
  appendPage(pageEl, 900, 1);

  requestAnimationFrame(() => {
    const height = Math.ceil(pageEl.getBoundingClientRect().height);
    pageEl.dataset.baseHeight = String(height);
    pageEl.style.height = `${height}px`;
    pageEl.parentElement.dataset.baseHeight = String(height);
    const canvas = createAnnotationCanvas(pageNumber, 900, height);
    pageEl.append(canvas);
    restoreAnnotation(canvas);
    applyZoom();
  });
}

function scrollToRecognizedText() {
  const page = document.querySelector(".recognized-page")?.parentElement;
  if (!page) return;
  els.reader.scrollTo({
    left: Math.max(0, page.offsetLeft - 16),
    top: Math.max(0, page.offsetTop - 16),
    behavior: "smooth",
  });
}

function splitIntoParagraphs(text) {
  const blocks = text
    .split(/\n{1,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  return blocks.length ? blocks : [text.trim()].filter(Boolean);
}

async function handleDocxImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  setDocumentMeta(file.name, "正在解析 Word...");
  try {
    const buffer = await file.arrayBuffer();
    const text = await extractDocxText(buffer);
    if (!text.trim()) throw new Error("No readable text in DOCX");
    const project = await createProject(file.name, "docx", { buffer });
    renderTextDocument(text, project.name, project.id);
    setDocumentMeta(project.name, `${text.length.toLocaleString()} 个字符 Word`);
    showToast("Word 已载入。");
  } catch (error) {
    console.error(error);
    setDocumentMeta("载入失败", "仅支持 .docx 格式，请确认文件未加密。");
    showToast("Word 解析失败。");
  } finally {
    event.target.value = "";
  }
}

async function extractDocxText(file) {
  if (!window.JSZip) {
    throw new Error("JSZip is unavailable");
  }
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const zip = await window.JSZip.loadAsync(buffer);
  const documentXml = await zip.file("word/document.xml")?.async("text");
  if (!documentXml) throw new Error("word/document.xml missing");

  const xml = new DOMParser().parseFromString(documentXml, "application/xml");
  const paragraphs = [...xml.getElementsByTagName("*")]
    .filter((node) => node.localName === "p")
    .map(readDocxParagraph)
    .map((text) => text.replace(/\s+\n/g, "\n").trim())
    .filter(Boolean);

  return paragraphs.join("\n\n");
}

function readDocxParagraph(paragraph) {
  let output = "";
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        output += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.localName === "t") output += child.textContent;
        else if (child.localName === "tab") output += "\t";
        else if (child.localName === "br" || child.localName === "cr") output += "\n";
        else walk(child);
      }
    }
  };
  walk(paragraph);
  return output;
}

async function handleTextFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const project = await createProject(file.name, "text", { text });
    renderTextDocument(text, project.name, project.id);
  } catch (error) {
    console.error(error);
    showToast("文本读取失败。");
  } finally {
    event.target.value = "";
  }
}

function renderTextDocument(text, title, key = `manual:${Date.now()}`) {
  state.docKey = key;
  state.docTitle = title;
  resetDocumentView();

  const pageEl = document.createElement("article");
  pageEl.className = "page text-page";
  pageEl.dataset.page = "1";

  const doc = document.createElement("div");
  doc.className = "text-doc";
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs.length ? paragraphs : [text.trim()]) {
    const p = document.createElement("p");
    p.textContent = paragraph;
    doc.append(p);
  }

  pageEl.append(doc);
  appendPage(pageEl, 900, 1);

  requestAnimationFrame(() => {
    const height = Math.ceil(pageEl.getBoundingClientRect().height);
    pageEl.dataset.baseHeight = String(height);
    pageEl.style.height = `${height}px`;
    pageEl.parentElement.dataset.baseHeight = String(height);
    const canvas = createAnnotationCanvas(1, 900, height);
    pageEl.append(canvas);
    restoreAnnotation(canvas);
    applyZoom();
  });

  setDocumentMeta(title, `${text.length.toLocaleString()} 个字符`);
  showToast("文本已载入。");
}

function appendPage(pageEl, width, height) {
  pageEl.dataset.baseWidth = String(width);
  pageEl.dataset.baseHeight = String(height);

  const wrap = document.createElement("div");
  wrap.className = "page-wrap";
  wrap.dataset.baseWidth = String(width);
  wrap.dataset.baseHeight = String(height);
  wrap.append(pageEl);
  els.reader.append(wrap);
  applyZoom();
}

function resetDocumentView() {
  clearReader();
  setZoom(1, false);
}

function setMode(mode) {
  state.mode = mode;
  els.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  els.reader.classList.toggle("pen-mode", mode === "pen");
  els.reader.classList.toggle("highlight-mode", mode === "highlight");
  els.reader.classList.toggle("eraser-mode", mode === "eraser");
}

function isDrawingMode() {
  return state.mode === "pen" || state.mode === "highlight" || state.mode === "eraser";
}

function handleSelectionChange() {
  clearTimeout(state.selectionTimer);
  state.selectionTimer = window.setTimeout(() => {
    if (isDrawingMode()) return;

    const selected = getReaderSelectionText();
    const context = getSelectionContextText(selected);
    const selectionKey = `${selected}\n${context}`;
    if (!selected || selectionKey === state.lastSelectionText) return;

    state.lastSelectionText = selectionKey;
    state.currentRange = cloneCurrentSelectionRange();
    translatePickedText(selected, false, context);
  }, 420);
}

function handleLongPressStart(event) {
  if (isDrawingMode()) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (event.target.closest?.("button, input, textarea, select, .floating-mode-dock")) return;

  cancelLongPress();
  state.longPressPoint = {
    x: event.clientX,
    y: event.clientY,
    target: event.target,
    pointerId: event.pointerId,
  };

  state.longPressTimer = window.setTimeout(async () => {
    const point = state.longPressPoint;
    if (!point) return;

    state.suppressNextClick = true;
    const sentence = getSentenceForLongPress(point.x, point.y, point.target);
    if (!sentence) return;

    highlightSentenceIfPossible(point.target, sentence);
    await translatePickedText(sentence, els.autoSpeak.checked, sentence);
    showToast("已选中整句。");
  }, 560);
}

function handleLongPressMove(event) {
  if (!state.longPressPoint || event.pointerId !== state.longPressPoint.pointerId) return;
  const dx = event.clientX - state.longPressPoint.x;
  const dy = event.clientY - state.longPressPoint.y;
  if (Math.hypot(dx, dy) > 12) cancelLongPress();
}

function cancelLongPress() {
  window.clearTimeout(state.longPressTimer);
  state.longPressTimer = 0;
  state.longPressPoint = null;
}

function getSentenceForLongPress(clientX, clientY, target) {
  const word = getClickedText(clientX, clientY, "word", target);
  const clickedSentence = getClickedText(clientX, clientY, "sentence", target);
  if (!word) return clickedSentence;

  const pageText = target?.closest?.(".pdf-page")?.dataset.fullText || "";
  if (pageText) return sentenceContainingWord(pageText, word) || clickedSentence;

  const text = eventTargetText(target);
  if (!text) return clickedSentence;
  return sentenceContainingWord(text, word) || clickedSentence;
}

function highlightSentenceIfPossible(target, sentence) {
  const paragraph = target?.closest?.(".text-doc p");
  const textNode = paragraph?.firstChild;
  if (!paragraph || !textNode || textNode.nodeType !== Node.TEXT_NODE) return;

  const haystack = textNode.textContent || "";
  const index = haystack.indexOf(sentence);
  if (index < 0) return;

  const range = document.createRange();
  range.setStart(textNode, index);
  range.setEnd(textNode, index + sentence.length);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function getReaderSelectionText() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return "";

  const range = selection.getRangeAt(0);
  const owner =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
  if (!owner || !els.reader.contains(owner)) return "";

  return normalizeSelection(selection.toString());
}

function cloneCurrentSelectionRange() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const owner =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
  if (!owner || !els.reader.contains(owner)) return null;
  return range.cloneRange();
}

function createRangeForPoint(clientX, clientY, mode) {
  const pointRange = rangeFromPoint(clientX, clientY);
  if (!pointRange || pointRange.startContainer.nodeType !== Node.TEXT_NODE) return null;

  const text = pointRange.startContainer.textContent || "";
  const offset = pointRange.startOffset;
  const bounds = mode === "sentence" ? sentenceBoundsAt(text, offset) : wordBoundsAt(text, offset);
  if (!bounds) return null;

  const range = document.createRange();
  range.setStart(pointRange.startContainer, bounds.start);
  range.setEnd(pointRange.startContainer, bounds.end);
  return range;
}

function getSelectionContextText(selectedText) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return selectedText;

  const range = selection.getRangeAt(0);
  const owner =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
  if (!owner || !els.reader.contains(owner)) return selectedText;

  const selectedWord = isSingleWord(selectedText) ? selectedText : "";
  if (selectedWord && range.startContainer.nodeType === Node.TEXT_NODE) {
    const sentence = sentenceAt(range.startContainer.textContent || "", range.startOffset);
    if (sentence) return sentence;
  }

  const pageText = owner.closest?.(".pdf-page")?.dataset.fullText || "";
  if (pageText && selectedWord) return sentenceContainingWord(pageText, selectedWord) || selectedText;

  const container = owner.closest?.(".text-doc p, .textLayer span");
  const containerText = container?.textContent || "";
  if (selectedWord && containerText) return sentenceContainingWord(containerText, selectedWord) || selectedText;
  if (containerText && containerText.includes(selectedText)) return sentenceContainingPhrase(containerText, selectedText);
  return selectedText;
}

async function handleReaderClick(event) {
  if (isDrawingMode()) return;
  if (state.suppressNextClick) {
    state.suppressNextClick = false;
    return;
  }

  const explicitSelection = getReaderSelectionText();
  if (explicitSelection) {
    state.currentRange = cloneCurrentSelectionRange();
    await translatePickedText(explicitSelection, false, getSelectionContextText(explicitSelection));
    return;
  }

  const picked = getClickedText(event.clientX, event.clientY, state.mode, event.target);
  if (!picked) return;
  state.currentRange = createRangeForPoint(event.clientX, event.clientY, state.mode);
  const context = isSingleWord(picked)
    ? getSentenceForLongPress(event.clientX, event.clientY, event.target)
    : picked;
  await translatePickedText(picked, true, context);
}

async function translatePickedText(source, shouldSpeak, contextText = "") {
  const text = normalizeSelection(source);
  if (!text) return;
  const contextSentence = normalizeSelection(contextText || text);

  state.current = {
    source: text,
    translation: "",
    phonetic: "",
    contextSentence,
    contextMeaning: "",
    commonMeaning: "",
    docTitle: state.docTitle || "未命名文档",
    createdAt: new Date().toISOString(),
  };
  els.lookupText.textContent = text;
  els.translationText.textContent = "正在翻译...";
  els.phoneticText.textContent = isSingleWord(text) ? "正在查询..." : "词组/句子无单词音标";
  els.contextSentenceText.textContent = contextSentence || "-";
  els.contextMeaningText.textContent = "正在分析...";
  els.commonMeaningText.textContent = isSingleWord(text) ? "正在查询..." : "以当前位置含义为准";
  els.addNote.disabled = true;
  els.copyTranslation.disabled = true;

  if (shouldSpeak && els.autoSpeak.checked) speak(text);

  const translation = await translateText(text);
  if (!state.current || state.current.source !== text) return;

  state.current.translation = translation;
  const lexical = await lookupLexicalInfo(text, translation, contextSentence);
  if (!state.current || state.current.source !== text) return;

  state.current.phonetic = lexical.phonetic;
  state.current.contextSentence = lexical.contextSentence || contextSentence;
  state.current.contextMeaning = lexical.contextMeaning;
  state.current.commonMeaning = lexical.commonMeaning;
  els.translationText.textContent = translation;
  els.phoneticText.textContent = lexical.phonetic || "-";
  els.contextSentenceText.textContent = lexical.contextSentence || contextSentence || "-";
  els.contextMeaningText.textContent = lexical.contextMeaning || translation;
  els.commonMeaningText.textContent = lexical.commonMeaning || "-";
  els.addNote.disabled = false;
  els.copyTranslation.disabled = false;
}

function getClickedText(clientX, clientY, mode, target) {
  const range = rangeFromPoint(clientX, clientY);
  if (!range) {
    const targetText = eventTargetText(document.elementFromPoint(clientX, clientY));
    return normalizePickedText(targetText, mode);
  }

  const node = range.startContainer;
  const offset = range.startOffset;
  const text = node.nodeType === Node.TEXT_NODE ? node.textContent || "" : eventTargetText(node);
  if (!text.trim()) return null;

  if (mode === "sentence") {
    const word = wordAt(text, offset);
    const pageText = target?.closest?.(".pdf-page")?.dataset.fullText || "";
    if (word && pageText) {
      return sentenceContainingWord(pageText, word) || sentenceAt(text, offset);
    }
    return sentenceAt(text, offset) || normalizePickedText(text, mode);
  }
  return wordAt(text, offset) || normalizePickedText(text, mode);
}

function rangeFromPoint(x, y) {
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    if (!position) return null;
    const range = document.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);
    return range;
  }
  if (document.caretRangeFromPoint) {
    return document.caretRangeFromPoint(x, y);
  }
  return null;
}

function eventTargetText(target) {
  if (!target) return "";
  const container = target.closest?.(".textLayer span, .text-doc p");
  return container?.textContent || "";
}

function normalizeSelection(text) {
  return text.replace(/\s+/g, " ").trim();
}

function normalizePickedText(text, mode) {
  const cleaned = normalizeSelection(text);
  if (!cleaned) return null;
  if (mode === "word") return cleaned.match(/[A-Za-z][A-Za-z'-]*/)?.[0] || null;
  return cleaned;
}

function wordAt(text, offset) {
  const matches = [...text.matchAll(/[A-Za-z][A-Za-z'-]*/g)];
  const found = matches.find((match) => {
    const start = match.index || 0;
    return offset >= start && offset <= start + match[0].length;
  });
  return found?.[0] || null;
}

function wordBoundsAt(text, offset) {
  const matches = [...text.matchAll(/[A-Za-z][A-Za-z'-]*/g)];
  const found = matches.find((match) => {
    const start = match.index || 0;
    return offset >= start && offset <= start + match[0].length;
  });
  if (!found) return null;
  const start = found.index || 0;
  return { start, end: start + found[0].length };
}

function sentenceAt(text, offset) {
  const normalized = text.replace(/\s+/g, " ");
  const safeOffset = Math.min(offset, normalized.length);
  const left = Math.max(
    normalized.lastIndexOf(".", safeOffset - 1),
    normalized.lastIndexOf("?", safeOffset - 1),
    normalized.lastIndexOf("!", safeOffset - 1),
  );
  const rightCandidates = [".", "?", "!"]
    .map((mark) => normalized.indexOf(mark, safeOffset))
    .filter((index) => index !== -1);
  const right = rightCandidates.length ? Math.min(...rightCandidates) + 1 : normalized.length;
  return normalized.slice(left + 1, right).trim();
}

function sentenceBoundsAt(text, offset) {
  const left = Math.max(
    text.lastIndexOf(".", offset - 1),
    text.lastIndexOf("?", offset - 1),
    text.lastIndexOf("!", offset - 1),
  );
  const rightCandidates = [".", "?", "!"]
    .map((mark) => text.indexOf(mark, offset))
    .filter((index) => index !== -1);
  const rawEnd = rightCandidates.length ? Math.min(...rightCandidates) + 1 : text.length;
  let start = left + 1;
  let end = rawEnd;
  while (start < end && /\s/.test(text[start])) start += 1;
  while (end > start && /\s/.test(text[end - 1])) end -= 1;
  return start < end ? { start, end } : null;
}

function sentenceContainingWord(text, word) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const normalizedWord = word.toLowerCase();
  const sentence = sentences.find((item) =>
    item
      .toLowerCase()
      .split(/[^a-z'-]+/)
      .includes(normalizedWord),
  );
  return sentence?.trim() || "";
}

function sentenceContainingPhrase(text, phrase) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const normalizedPhrase = normalizeSelection(phrase).toLowerCase();
  const sentence = sentences.find((item) => normalizeSelection(item).toLowerCase().includes(normalizedPhrase));
  return sentence?.trim() || normalizeSelection(phrase);
}

async function translateText(text) {
  const key = `${els.targetLang.value}:${text.toLowerCase()}`;
  if (state.translations[key]) return state.translations[key];

  const lower = text.toLowerCase();
  if (/^[a-z][a-z'-]*$/i.test(text) && fallbackDictionary.has(lower)) {
    return cacheTranslation(key, fallbackDictionary.get(lower));
  }

  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      `&langpair=en|${encodeURIComponent(els.targetLang.value)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const translated = data?.responseData?.translatedText?.trim();
    if (translated) return cacheTranslation(key, translated);
  } catch (error) {
    console.warn("Translation failed", error);
  }

  return "暂时无法连接在线翻译服务。你仍然可以将原文加入笔记，并在导出的笔记中补充译文。";
}

function cacheTranslation(key, value) {
  state.translations[key] = value;
  writeJson(STORE_KEYS.translations, state.translations);
  return value;
}

async function lookupLexicalInfo(text, translation, contextText = "") {
  const contextSentence = normalizeSelection(contextText || text);
  if (!isSingleWord(text)) {
    return {
      phonetic: "",
      contextSentence,
      contextMeaning: translation,
      commonMeaning: "1. 结合主题句理解；2. 结合转折词和例证理解",
    };
  }

  const word = text.toLowerCase();
  const cet6 = cet6Dictionary.get(word);
  const localCommon = fallbackDictionary.get(word) || "";
  const remote = await fetchDictionaryInfo(word);
  const contextualMeaning = chooseContextualMeaning(word, contextSentence);

  return {
    phonetic: remote.phonetic || localPhonetic(word) || "",
    contextSentence,
    contextMeaning: contextualMeaning || cet6?.contextMeaning || translation,
    commonMeaning: buildOtherMeanings(
      contextualMeaning || cet6?.contextMeaning || translation,
      cet6,
      localCommon,
      remote.commonMeanings,
    ),
  };
}

function buildOtherMeanings(currentMeaning, cet6, localCommon, remoteMeanings = []) {
  const candidates = [];
  if (cet6?.contextMeaning) candidates.push(...splitMeaningItems(cet6.contextMeaning));
  if (localCommon) candidates.push(...splitMeaningItems(localCommon));
  candidates.push(...remoteMeanings);

  const currentTokens = splitMeaningItems(currentMeaning).map((item) => item.toLowerCase());
  const unique = [];
  for (const item of candidates) {
    const cleaned = normalizeMeaningItem(item);
    if (!cleaned) continue;
    if (currentTokens.includes(cleaned.toLowerCase())) continue;
    if (unique.some((existing) => existing.toLowerCase() === cleaned.toLowerCase())) continue;
    unique.push(cleaned);
    if (unique.length === 2) break;
  }

  return unique.length ? unique.map((item, index) => `${index + 1}. ${item}`).join("；") : "暂无其他高频含义";
}

function splitMeaningItems(value) {
  return String(value)
    .split(/[；;，,、/]/)
    .map(normalizeMeaningItem)
    .filter(Boolean);
}

function normalizeMeaningItem(value) {
  return String(value)
    .replace(/^\d+\.\s*/, "")
    .replace(/^to\s+/i, "")
    .trim();
}

function chooseContextualMeaning(word, contextText) {
  const rules = contextMeaningRules[word];
  if (!rules || !contextText) return "";
  const matched = rules.find((rule) => rule.pattern.test(contextText));
  return matched?.meaning || "";
}

async function fetchDictionaryInfo(word) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 1500);
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const entry = Array.isArray(data) ? data[0] : null;
    if (!entry) return {};

    const phonetic =
      entry.phonetic ||
      entry.phonetics?.find((item) => item.text)?.text ||
      "";
    const definitions = (entry.meanings || [])
      .flatMap((meaning) => meaning.definitions || [])
      .map((definition) => definition.definition)
      .filter(Boolean)
      .slice(0, 2);

    return {
      phonetic,
      commonMeanings: definitions,
    };
  } catch (error) {
    console.warn("Dictionary lookup failed", error);
    return {};
  } finally {
    window.clearTimeout(timer);
  }
}

function localPhonetic(word) {
  const phonetics = {
    a: "/ə/",
    about: "/əˈbaʊt/",
    after: "/ˈæftər/",
    all: "/ɔːl/",
    also: "/ˈɔːlsoʊ/",
    and: "/ənd/",
    are: "/ɑːr/",
    as: "/æz/",
    at: "/æt/",
    be: "/biː/",
    because: "/bɪˈkɔːz/",
    but: "/bʌt/",
    by: "/baɪ/",
    can: "/kæn/",
    do: "/duː/",
    for: "/fɔːr/",
    from: "/frʌm/",
    have: "/hæv/",
    in: "/ɪn/",
    is: "/ɪz/",
    it: "/ɪt/",
    of: "/əv/",
    on: "/ɑːn/",
    or: "/ɔːr/",
    research: "/rɪˈsɜːrtʃ/",
    should: "/ʃʊd/",
    study: "/ˈstʌdi/",
    that: "/ðæt/",
    the: "/ðə/",
    this: "/ðɪs/",
    to: "/tuː/",
    use: "/juːz/",
    was: "/wɑːz/",
    we: "/wiː/",
    when: "/wen/",
    which: "/wɪtʃ/",
    with: "/wɪð/",
    you: "/juː/",
  };
  return phonetics[word] || "";
}

function isSingleWord(text) {
  return /^[A-Za-z][A-Za-z'-]*$/.test(text.trim());
}

function populateVoices() {
  if (!("speechSynthesis" in window)) {
    els.voiceSelect.innerHTML = "<option>浏览器不支持发音</option>";
    return;
  }
  const voices = window.speechSynthesis.getVoices();
  state.voices = voices
    .filter((voice) => voice.lang.toLowerCase().startsWith("en-us"))
    .sort((a, b) => voiceScore(b) - voiceScore(a));

  const selected = els.voiceSelect.value;
  els.voiceSelect.innerHTML = "";

  if (!state.voices.length) {
    const option = new Option("系统默认美式语音", "");
    els.voiceSelect.append(option);
    return;
  }

  for (const voice of state.voices) {
    const option = new Option(`${voice.name} (${voice.lang})`, voice.name);
    els.voiceSelect.append(option);
  }

  const best = state.voices[0]?.name || "";
  els.voiceSelect.value = state.voices.some((voice) => voice.name === selected) ? selected : best;
}

function voiceScore(voice) {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (voice.localService) score += 1;
  if (name.includes("aria") || name.includes("jenny") || name.includes("guy")) score += 8;
  if (name.includes("samantha") || name.includes("alex")) score += 7;
  if (name.includes("google")) score += 6;
  if (name.includes("premium") || name.includes("natural")) score += 5;
  if (name.includes("us") || name.includes("united states")) score += 2;
  return score;
}

function speak(text) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice =
    state.voices.find((voice) => voice.name === els.voiceSelect.value) || state.voices[0];

  utterance.lang = "en-US";
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = Number(els.speechRate.value) || 0.9;
  utterance.pitch = 1.02;
  window.speechSynthesis.speak(utterance);
}

function setZoom(value, announce = true) {
  state.zoom = clamp(value, MIN_ZOOM, MAX_ZOOM);
  applyZoom();
  if (announce) showToast(`缩放 ${Math.round(state.zoom * 100)}%`);
}

function fitToWidth(announce = true) {
  const pages = [...document.querySelectorAll(".page-wrap")];
  if (!pages.length) return;

  const maxWidth = Math.max(...pages.map((page) => Number(page.dataset.baseWidth) || 1));
  const available = Math.max(260, els.reader.clientWidth - 52);
  setZoom(available / maxWidth, false);
  if (announce) showToast("已适合宽度。");
}

function applyZoom() {
  els.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  document.querySelectorAll(".page-wrap").forEach((wrap) => {
    const baseWidth = Number(wrap.dataset.baseWidth) || 1;
    const baseHeight = Number(wrap.dataset.baseHeight) || 1;
    wrap.style.width = `${baseWidth * state.zoom}px`;
    wrap.style.height = `${baseHeight * state.zoom}px`;
  });
  document.querySelectorAll(".page").forEach((page) => {
    page.style.transform = `scale(${state.zoom})`;
  });
}

function addCurrentNote() {
  if (!state.current) return;
  const exists = state.notes.some(
    (note) =>
      note.projectId === state.activeProjectId &&
      note.source.toLowerCase() === state.current.source.toLowerCase(),
  );
  if (exists) {
    showToast("笔记本中已有该条目。");
    return;
  }
  state.notes.unshift({
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    projectId: state.activeProjectId || state.docKey || "legacy",
    source: state.current.source,
    translation: state.current.translation,
    phonetic: state.current.phonetic,
    contextSentence: state.current.contextSentence,
    contextMeaning: state.current.contextMeaning,
    commonMeaning: state.current.commonMeaning,
    docTitle: state.current.docTitle,
    createdAt: new Date().toISOString(),
  });
  writeJson(STORE_KEYS.notes, state.notes);
  markCurrentSourceInDocument();
  renderNotes();
  showToast("已加入笔记本。");
}

function renderNotes() {
  els.notesList.innerHTML = "";
  const visibleNotes = currentProjectNotes();
  els.noteCount.textContent = String(visibleNotes.length);

  if (!visibleNotes.length) {
    const empty = document.createElement("p");
    empty.className = "note-translation";
    empty.textContent = state.activeProjectId
      ? "当前项目暂无笔记。点击单词或选中词组、句子后可加入这里。"
      : "先导入或打开一个项目，再添加笔记。";
    els.notesList.append(empty);
    return;
  }

  for (const note of visibleNotes) {
    const item = els.noteTemplate.content.firstElementChild.cloneNode(true);
    item.querySelector(".note-source").textContent = note.source;
    item.querySelector(".note-phonetic").textContent = note.phonetic || "";
    item.querySelector(".note-translation").textContent = note.contextMeaning || note.translation;
    item.querySelector(".note-context").textContent = note.contextSentence
      ? `上下文：${note.contextSentence}`
      : "";
    item.querySelector(".note-common").textContent = note.commonMeaning
      ? `其他常用：${note.commonMeaning}`
      : "";
    item.querySelector(".speak-note").addEventListener("click", () => speak(note.source));
    item.querySelector(".delete-note").addEventListener("click", () => deleteNote(note.id));
    els.notesList.append(item);
  }
}

function currentProjectNotes() {
  return state.notes.filter((note) => {
    if (!state.activeProjectId) return false;
    return (note.projectId || note.docTitle || "legacy") === state.activeProjectId;
  });
}

function markCurrentSourceInDocument() {
  const range = state.currentRange || cloneCurrentSelectionRange();
  if (!range) return;

  const rects = [...range.getClientRects()].filter((rect) => rect.width > 1 && rect.height > 1);
  if (!rects.length) return;

  const touchedCanvases = new Set();
  for (const rect of rects) {
    const canvas = findAnnotationCanvasForRect(rect);
    if (!canvas) continue;
    if (!touchedCanvases.has(canvas)) {
      rememberAnnotationState(canvas);
      touchedCanvases.add(canvas);
    }
    drawSkyHighlight(canvas, rect);
  }

  touchedCanvases.forEach((canvas) => saveAnnotation(canvas));
}

function findAnnotationCanvasForRect(rect) {
  const canvases = [...document.querySelectorAll(".annotation-canvas")];
  return canvases.find((canvas) => {
    const box = canvas.getBoundingClientRect();
    return rect.bottom >= box.top && rect.top <= box.bottom && rect.right >= box.left && rect.left <= box.right;
  });
}

function drawSkyHighlight(canvas, rect) {
  const box = canvas.getBoundingClientRect();
  const scaleX = canvas.width / box.width;
  const scaleY = canvas.height / box.height;
  const x = Math.max(0, (rect.left - box.left) * scaleX);
  const y = Math.max(0, (rect.top - box.top) * scaleY);
  const width = Math.min(canvas.width - x, rect.width * scaleX);
  const height = Math.min(canvas.height - y, rect.height * scaleY);
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(80, 200, 255, 0.38)";
  ctx.fillRect(x, y + height * 0.08, width, height * 0.84);
  ctx.restore();
}

function deleteNote(id) {
  state.notes = state.notes.filter((note) => note.id !== id);
  writeJson(STORE_KEYS.notes, state.notes);
  renderNotes();
}

async function copyCurrentTranslation() {
  if (!state.current?.translation) return;
  const lines = [
    state.current.source,
    state.current.phonetic ? `音标：${state.current.phonetic}` : "",
    state.current.contextSentence ? `上下文：${state.current.contextSentence}` : "",
    `当前位置含义：${state.current.contextMeaning || state.current.translation}`,
    state.current.commonMeaning ? `其他常用含义：${state.current.commonMeaning}` : "",
  ].filter(Boolean);
  await navigator.clipboard.writeText(lines.join("\n"));
  showToast("译文已复制。");
}

function exportNotes() {
  const visibleNotes = currentProjectNotes();
  if (!visibleNotes.length) {
    showToast("暂无可导出的笔记。");
    return;
  }
  const rows = [
    ["英文", "音标", "上下文句子", "当前位置含义", "其他常用含义", "来源文档", "创建时间"],
    ...visibleNotes.map((note) => [
      note.source,
      note.phonetic || "",
      note.contextSentence || "",
      note.contextMeaning || note.translation,
      note.commonMeaning || "",
      note.docTitle || "",
      new Date(note.createdAt).toLocaleString(),
    ]),
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "linguanote-notes.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function createAnnotationCanvas(pageNumber, width, height) {
  const canvas = document.createElement("canvas");
  canvas.className = "annotation-canvas";
  canvas.dataset.page = String(pageNumber);
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.addEventListener("pointerdown", startStroke);
  canvas.addEventListener("pointermove", continueStroke);
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointercancel", endStroke);
  canvas.addEventListener("pointerleave", endStroke);
  return canvas;
}

function startStroke(event) {
  if (!isDrawingMode()) return;
  event.preventDefault();
  event.currentTarget.setPointerCapture(event.pointerId);
  rememberAnnotationState(event.currentTarget);
  const point = canvasPoint(event.currentTarget, event);
  state.activeStroke = {
    canvas: event.currentTarget,
    last: point,
  };
}

function continueStroke(event) {
  if (!state.activeStroke || state.activeStroke.canvas !== event.currentTarget) return;
  event.preventDefault();
  const canvas = event.currentTarget;
  const ctx = canvas.getContext("2d");
  const point = canvasPoint(canvas, event);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Number(els.penSize.value);
  ctx.globalAlpha = 1;

  if (state.mode === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = Number(els.penSize.value) * 3;
  } else if (state.mode === "highlight") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = Math.max(14, Number(els.penSize.value) * 3.2);
    ctx.strokeStyle = els.penColor.value || "#ffd84d";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = els.penColor.value;
  }

  ctx.beginPath();
  ctx.moveTo(state.activeStroke.last.x, state.activeStroke.last.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  ctx.globalAlpha = 1;
  state.activeStroke.last = point;
}

function endStroke(event) {
  if (!state.activeStroke || state.activeStroke.canvas !== event.currentTarget) return;
  saveAnnotation(event.currentTarget);
  state.activeStroke = null;
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function saveAnnotation(canvas) {
  if (!state.docKey) return;
  const page = canvas.dataset.page || "1";
  state.annotations[state.docKey] ||= {};
  state.annotations[state.docKey][page] = canvas.toDataURL("image/png");
  writeJson(STORE_KEYS.annotations, state.annotations);
}

function rememberAnnotationState(canvas) {
  if (!state.docKey) return;
  state.annotationHistory.push({
    docKey: state.docKey,
    page: canvas.dataset.page || "1",
    dataUrl: canvas.toDataURL("image/png"),
  });
  if (state.annotationHistory.length > 80) state.annotationHistory.shift();
}

function undoAnnotation() {
  const entry = [...state.annotationHistory].reverse().find((item) => item.docKey === state.docKey);
  if (!entry) {
    showToast("没有可撤销的标注。");
    return;
  }

  const index = state.annotationHistory.lastIndexOf(entry);
  state.annotationHistory.splice(index, 1);

  const canvas = document.querySelector(`.annotation-canvas[data-page="${CSS.escape(entry.page)}"]`);
  if (!canvas) {
    showToast("当前页面暂时不可撤销。");
    return;
  }

  restoreCanvasFromDataUrl(canvas, entry.dataUrl, () => {
    saveAnnotation(canvas);
    showToast("已撤销上一步标注。");
  });
}

function restoreCanvasFromDataUrl(canvas, dataUrl, onDone) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    onDone?.();
  };
  img.src = dataUrl;
}

function restoreAnnotation(canvas) {
  if (!state.docKey) return;
  const page = canvas.dataset.page || "1";
  const dataUrl = state.annotations[state.docKey]?.[page];
  if (!dataUrl) return;
  restoreCanvasFromDataUrl(canvas, dataUrl);
}

function clearCurrentAnnotations() {
  if (!state.docKey || !state.annotations[state.docKey]) {
    showToast("当前文档没有标注。");
    return;
  }
  document.querySelectorAll(".annotation-canvas").forEach((canvas) => rememberAnnotationState(canvas));
  delete state.annotations[state.docKey];
  writeJson(STORE_KEYS.annotations, state.annotations);
  document.querySelectorAll(".annotation-canvas").forEach((canvas) => {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  });
  showToast("当前文档标注已清除。");
}

function clearReader() {
  els.reader.innerHTML = "";
  state.current = null;
  state.lastSelectionText = "";
  els.jumpRecognized.classList.add("is-hidden");
  window.getSelection()?.removeAllRanges();
  els.lookupText.textContent = "-";
  els.translationText.textContent = "点击或选中文档中的英文内容后显示翻译。";
  els.phoneticText.textContent = "-";
  els.contextSentenceText.textContent = "-";
  els.contextMeaningText.textContent = "-";
  els.commonMeaningText.textContent = "-";
  els.addNote.disabled = true;
  els.copyTranslation.disabled = true;
}

function setDocumentMeta(title, meta) {
  els.docTitle.textContent = title;
  els.docMeta.textContent = meta;
}

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2200);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
