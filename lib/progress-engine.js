(function () {
  "use strict";

  const SKILLS = [
    { id: "memory", name: "Memoria visual", icon: "◇" },
    { id: "operation", name: "Cálculo mental", icon: "＋" },
    { id: "word", name: "Lectura y vocabulario", icon: "Aa" },
    { id: "sequence", name: "Lógica y atención", icon: "◌" },
    { id: "maze", name: "Orientación espacial", icon: "⌁" },
    { id: "reading", name: "Comprensión lectora", icon: "≡" },
    { id: "fraction", name: "Fracciones visuales", icon: "½" },
    { id: "robot", name: "Pensamiento computacional", icon: "⌘" },
    { id: "clock", name: "Tiempo y duración", icon: "◷" },
    { id: "science", name: "Investigación científica", icon: "⚗" }
  ];
  const LEVEL_IDS = ["explorador", "aventurero", "maestro"];

  function completedLevels(progress, skillId) {
    const completed = progress && progress[skillId] && progress[skillId].completedByDifficulty;
    if (!completed || typeof completed !== "object") return 0;
    return LEVEL_IDS.filter((levelId) => completed[levelId] === true).length;
  }

  function stageFor(levels) {
    if (levels >= 3) return { id: "complete", label: "Tres niveles recorridos" };
    if (levels === 2) return { id: "advanced", label: "Camino avanzado" };
    if (levels === 1) return { id: "started", label: "Primer recorrido" };
    return { id: "ready", label: "Lista para explorar" };
  }

  function overallMessage(totalLevels, maximumLevels) {
    if (totalLevels >= maximumLevels) return "Recorriste todo el mapa disponible.";
    if (totalLevels >= 12) return "Has explorado muchas rutas diferentes.";
    if (totalLevels >= 6) return "Tu constelación de habilidades está creciendo.";
    if (totalLevels >= 1) return "Tu mapa empezó a brillar.";
    return "Tu mapa está listo para la primera misión.";
  }

  function summarize(state) {
    const progress = state && state.progress && typeof state.progress === "object" ? state.progress : {};
    const skills = SKILLS.map((skill) => {
      const levels = completedLevels(progress, skill.id);
      const stage = stageFor(levels);
      return { id: skill.id, name: skill.name, icon: skill.icon, levels: levels, maximumLevels: 3, stage: stage.id, label: stage.label };
    });
    const totalLevels = skills.reduce((total, skill) => total + skill.levels, 0);
    const maximumLevels = skills.length * 3;
    return {
      skills: skills,
      totalLevels: totalLevels,
      maximumLevels: maximumLevels,
      percentage: Math.round((totalLevels / maximumLevels) * 100),
      completedGames: Number(progress.completedGames || 0),
      message: overallMessage(totalLevels, maximumLevels)
    };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.progressEngine = { skills: SKILLS, summarize: summarize };
})();
