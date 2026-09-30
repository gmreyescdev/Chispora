(function () {
  "use strict";

  function viewModel(input) {
    const state = input && typeof input === "object" ? input : {};
    const online = state.online !== false;
    const supported = state.supported === true;
    const cacheReady = state.cacheReady === true;
    const installed = state.installed === true;
    const updateAvailable = state.updateAvailable === true;
    const installAvailable = state.installAvailable === true;

    let connectionText = "Comprobando disponibilidad";
    let connectionState = "checking";
    if (!online) {
      connectionText = cacheReady ? "Sin conexión · puedes seguir jugando" : "Sin conexión";
      connectionState = "offline";
    } else if (cacheReady) {
      connectionText = "Lista para usar sin conexión";
      connectionState = "ready";
    } else if (supported) {
      connectionText = "Preparando uso sin conexión";
    } else {
      connectionText = "Uso sin conexión no disponible aquí";
      connectionState = "unavailable";
    }

    let message = "Abre Chispora una vez con conexión para preparar todos los juegos.";
    let action = null;
    let actionLabel = "";
    if (updateAvailable) {
      message = "Hay una versión nueva. Actualiza cuando no haya una partida en curso.";
      action = "update";
      actionLabel = "Actualizar Chispora";
    } else if (installed) {
      message = "Chispora está instalada en este equipo y se abre como una aplicación.";
    } else if (installAvailable) {
      message = "Puedes instalar Chispora. Es opcional y no crea una cuenta.";
      action = "install";
      actionLabel = "Instalar Chispora";
    } else if (cacheReady) {
      message = "Los diez juegos están preparados. La instalación depende del navegador.";
    } else if (!supported) {
      message = "Este navegador no permite preparar la aplicación para usarla sin conexión.";
    }

    return {
      connectionText: connectionText,
      connectionState: connectionState,
      message: message,
      action: action,
      actionLabel: actionLabel
    };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.pwaEngine = { viewModel: viewModel };
})();
