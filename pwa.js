(function () {
  "use strict";

  const engine = window.__BRAND__ && window.__BRAND__.pwaEngine;
  const connection = document.querySelector("[data-pwa-connection]");
  const message = document.querySelector("[data-pwa-message]");
  const actionButton = document.querySelector("[data-pwa-action]");
  if (!engine || !connection || !message || !actionButton) return;

  const supportsServiceWorker = "serviceWorker" in navigator;
  const standaloneQuery = window.matchMedia("(display-mode: standalone)");
  const state = {
    online: navigator.onLine,
    supported: supportsServiceWorker,
    cacheReady: false,
    installed: standaloneQuery.matches || window.navigator.standalone === true,
    installAvailable: false,
    updateAvailable: false
  };
  let installPrompt = null;
  let waitingWorker = null;
  let refreshing = false;

  function render() {
    const view = engine.viewModel(state);
    connection.textContent = view.connectionText;
    connection.dataset.state = view.connectionState;
    message.textContent = view.message;
    actionButton.hidden = !view.action;
    actionButton.dataset.pwaAction = view.action || "";
    actionButton.textContent = view.actionLabel;
  }

  function offerUpdate(worker) {
    waitingWorker = worker;
    state.updateAvailable = Boolean(worker);
    render();
  }

  window.addEventListener("online", function () {
    state.online = true;
    render();
  });

  window.addEventListener("offline", function () {
    state.online = false;
    render();
  });

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    installPrompt = event;
    state.installAvailable = true;
    render();
  });

  window.addEventListener("appinstalled", function () {
    installPrompt = null;
    state.installAvailable = false;
    state.installed = true;
    render();
  });

  function handleStandaloneChange(event) {
    state.installed = event.matches;
    render();
  }

  if (standaloneQuery.addEventListener) standaloneQuery.addEventListener("change", handleStandaloneChange);
  else if (standaloneQuery.addListener) standaloneQuery.addListener(handleStandaloneChange);

  actionButton.addEventListener("click", function () {
    if (actionButton.dataset.pwaAction === "update" && waitingWorker) {
      refreshing = true;
      actionButton.disabled = true;
      actionButton.textContent = "Actualizando…";
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      return;
    }

    if (actionButton.dataset.pwaAction !== "install" || !installPrompt) return;
    const prompt = installPrompt;
    installPrompt = null;
    state.installAvailable = false;
    prompt.prompt();
    prompt.userChoice.then(function (choice) {
      render();
      if (choice.outcome !== "accepted") message.textContent = "Puedes instalar Chispora más adelante desde el menú del navegador.";
    });
  });

  render();
  if (!supportsServiceWorker) return;

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (!refreshing) return;
    window.location.reload();
  });

  navigator.serviceWorker.register("./sw.js").then(function (registration) {
    if (registration.waiting) offerUpdate(registration.waiting);

    registration.addEventListener("updatefound", function () {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", function () {
        if (worker.state !== "installed") return;
        if (navigator.serviceWorker.controller) offerUpdate(worker);
        else {
          state.cacheReady = true;
          render();
        }
      });
    });

    navigator.serviceWorker.ready.then(function () {
      state.cacheReady = true;
      render();
    });
  }).catch(function (error) {
    state.supported = false;
    render();
    console.warn("[pwa] No se pudo preparar el uso sin conexión:", error);
  });
})();
