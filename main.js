(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const STORAGE_KEY = brand.storageKey || "chispora.mvp.v1";
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const escHTML = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const avatarEmoji = {
    zorro: "🦊",
    gato: "🐱",
    robot: "🤖",
    luna: "🌙"
  };

  const difficultyDetails = {
    explorador: ["12 cartas", "6 parejas", "Vista previa de 3 segundos"],
    aventurero: ["16 cartas", "8 parejas", "Vista previa de 2 segundos"],
    maestro: ["20 cartas", "10 parejas", "Sin vista previa automática"]
  };

  let selectedAvatar = "zorro";
  let appState = loadState();

  function safe(fn, name) {
    try {
      fn();
    } catch (error) {
      console.warn("[" + name + "] failed:", error);
    }
  }

  function loadState() {
    const fallback = {
      profile: Object.assign({}, brand.defaultProfile || { nickname: "", avatarId: "zorro" }),
      settings: Object.assign({}, brand.defaultSettings || { sessionMinutes: 20, soundEnabled: true, preferredDifficulty: "auto" }),
      progress: { completedGames: 0 }
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return {
        profile: Object.assign({}, fallback.profile, parsed.profile || {}),
        settings: Object.assign({}, fallback.settings, parsed.settings || {}),
        progress: Object.assign({}, fallback.progress, parsed.progress || {})
      };
    } catch (error) {
      console.warn("[storage] No se pudo leer el progreso local:", error);
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      return true;
    } catch (error) {
      console.warn("[storage] No se pudo guardar el progreso local:", error);
      return false;
    }
  }

  function validScreenId(screenId) {
    const screen = screenId ? document.getElementById(screenId) : null;
    return Boolean(screen && screen.matches("[data-screen]"));
  }

  function currentScreenFromHash() {
    const screenId = window.location.hash.replace(/^#/, "");
    return validScreenId(screenId) ? screenId : "bienvenida";
  }

  function setScreen(screenId, moveFocus) {
    const targetId = validScreenId(screenId) ? screenId : "bienvenida";
    const target = document.getElementById(targetId);

    $$('[data-screen]').forEach((screen) => {
      screen.hidden = screen !== target;
      screen.setAttribute("aria-hidden", String(screen !== target));
    });

    if (window.gsap) {
      window.gsap.fromTo(target, { opacity: 0, y: reduced ? 0 : 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "opacity,transform" });
    }

    if (moveFocus) {
      const heading = $("h1, h2", target);
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function navigateTo(screenId) {
    if (!validScreenId(screenId)) return;
    if (window.location.hash === "#" + screenId) {
      setScreen(screenId, true);
      return;
    }
    window.location.hash = screenId;
  }

  function updateProfileViews() {
    const nickname = (appState.profile.nickname || "").trim();
    const avatarId = appState.profile.avatarId || "zorro";
    const profileChip = $("[data-profile-chip]");
    const nicknameInput = $("#nickname");

    if (profileChip) profileChip.hidden = !nickname;
    $$('[data-profile-name]').forEach((element) => { element.textContent = nickname || "Explorador"; });
    $$('[data-greeting-name]').forEach((element) => { element.textContent = nickname || "explorador"; });
    $$('[data-profile-avatar]').forEach((element) => { element.textContent = avatarEmoji[avatarId] || avatarEmoji.zorro; });
    if (nicknameInput) nicknameInput.value = nickname;

    selectedAvatar = avatarId;
    $$('[data-avatar]').forEach((button) => {
      const selected = button.dataset.avatar === selectedAvatar;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function initNavigation() {
    if (document.documentElement.classList.contains("js-enabled")) return;
    document.documentElement.classList.add("js-enabled");

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-go]");
      if (!trigger) return;
      event.preventDefault();
      navigateTo(trigger.dataset.go);
    });

    window.addEventListener("hashchange", () => setScreen(currentScreenFromHash(), true));
    setScreen(currentScreenFromHash(), false);
  }

  function initProfile() {
    const form = $("[data-profile-form]");
    const error = $("[data-nickname-error]");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";

    updateProfileViews();

    $("[data-avatar-grid]", form).addEventListener("click", (event) => {
      const button = event.target.closest("[data-avatar]");
      if (!button) return;
      selectedAvatar = button.dataset.avatar;
      $$('[data-avatar]', form).forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nickname = String(new FormData(form).get("nickname") || "").trim();
      const validNickname = /^[\p{L}\p{N} _-]{2,12}$/u.test(nickname);

      if (!validNickname) {
        error.textContent = "Escribe un apodo de 2 a 12 caracteres, sin símbolos especiales.";
        $("#nickname").focus();
        return;
      }

      error.textContent = "";
      appState.profile = { nickname: nickname, avatarId: selectedAvatar };
      saveState();
      updateProfileViews();
      navigateTo("misiones");
    });
  }

  function initDifficulty() {
    const select = $("[data-difficulty]");
    const summary = $("[data-difficulty-summary]");
    if (!select || !summary || select.dataset.bound) return;
    select.dataset.bound = "1";

    function renderDifficulty() {
      const details = difficultyDetails[select.value] || difficultyDetails.explorador;
      const elements = $$('strong, span', summary);
      elements.forEach((element, index) => { element.textContent = details[index] || ""; });
    }

    select.addEventListener("change", renderDifficulty);
    renderDifficulty();
  }

  function initMemoryDemo() {
    const board = $("[data-memory-board]");
    const message = $("[data-game-message]");
    if (!board || board.dataset.bound) return;
    board.dataset.bound = "1";

    board.addEventListener("click", (event) => {
      const card = event.target.closest(".memory-card");
      if (!card || card.classList.contains("is-found")) return;
      card.classList.toggle("is-open");
      const opened = card.classList.contains("is-open");
      card.setAttribute("aria-label", opened ? "Carta descubierta: " + card.dataset.symbol : "Carta oculta");
      if (message) message.textContent = opened ? "Has descubierto una figura. Recuerda su posición." : "La carta volvió a ocultarse.";
    });
  }

  function initDialogs() {
    const pauseDialog = $("[data-pause-dialog]");
    const exitDialog = $("[data-exit-dialog]");
    if (!pauseDialog || !exitDialog || pauseDialog.dataset.bound) return;
    pauseDialog.dataset.bound = "1";

    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "pause-game") pauseDialog.showModal();
      if (action.dataset.action === "request-exit") exitDialog.showModal();
    });

    $("[data-confirm-exit]", exitDialog).addEventListener("click", () => {
      exitDialog.close("exit");
      navigateTo("misiones");
    });
  }

  function initAdultGate() {
    const button = $("[data-adult-gate]");
    const status = $("[data-adult-gate-status]");
    if (!button || button.dataset.bound) return;
    button.dataset.bound = "1";
    let timer = 0;

    function startHold() {
      if (timer) return;
      button.classList.add("is-holding");
      status.textContent = "Mantén un momento más…";
      timer = window.setTimeout(() => {
        timer = 0;
        button.classList.remove("is-holding");
        status.textContent = "Acceso completado.";
        navigateTo("panel-familiar");
      }, 1100);
    }

    function cancelHold() {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = 0;
      button.classList.remove("is-holding");
      status.textContent = "Mantén el botón aproximadamente un segundo.";
    }

    button.addEventListener("pointerdown", startHold);
    button.addEventListener("pointerup", cancelHold);
    button.addEventListener("pointercancel", cancelHold);
    button.addEventListener("pointerleave", cancelHold);
    button.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        event.preventDefault();
        startHold();
      }
    });
    button.addEventListener("keyup", (event) => {
      if (event.key === " " || event.key === "Enter") cancelHold();
    });
  }

  function initSettings() {
    const form = $("[data-settings-form]");
    const status = $("[data-settings-status]");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";

    form.elements.sessionMinutes.value = String(appState.settings.sessionMinutes);
    form.elements.soundEnabled.value = String(appState.settings.soundEnabled);
    form.elements.preferredDifficulty.value = appState.settings.preferredDifficulty;
    $$('[data-completed-games]').forEach((element) => { element.textContent = String(appState.progress.completedGames || 0); });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      appState.settings = {
        sessionMinutes: Number(formData.get("sessionMinutes")) || 20,
        soundEnabled: formData.get("soundEnabled") === "true",
        preferredDifficulty: String(formData.get("preferredDifficulty") || "auto")
      };
      const saved = saveState();
      status.textContent = saved ? "Configuración guardada en este navegador." : "No se pudo guardar. Revisa la configuración del navegador.";
    });
  }

  function initMagneticButtons() {
    if (!fineHover) return;
    $$('.button-primary').forEach((button) => {
      if (button.dataset.magneticBound) return;
      button.dataset.magneticBound = "1";
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
        button.style.transform = "translate(" + x + "px," + y + "px)";
      });
      button.addEventListener("mouseout", (event) => {
        if (button.contains(event.relatedTarget)) return;
        button.style.transform = "";
      });
    });
  }

  function boot() {
    safe(initNavigation, "initNavigation");
    safe(initProfile, "initProfile");
    safe(initDifficulty, "initDifficulty");
    safe(initMemoryDemo, "initMemoryDemo");
    safe(initDialogs, "initDialogs");
    safe(initAdultGate, "initAdultGate");
    safe(initSettings, "initSettings");
    safe(initMagneticButtons, "initMagneticButtons");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
