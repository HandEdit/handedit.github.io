const leaderboard = { "hand-only": [], "hand-arm": [] };

const metricSpecs = [
  { idx: 2, direction: "min", digits: 3 },
  { idx: 3, direction: "min", digits: 2 },
  { idx: 4, direction: "max", digits: 3 },
  { idx: 5, direction: "max", digits: 3 },
  { idx: 6, direction: "max", digits: 3 },
  { idx: 7, direction: "max", digits: 3 },
  { idx: 8, direction: "max", digits: 3 }
];

function normalizeLeaderboardRows(rows) {
  return rows.map((row) => [
    row.model,
    row.access,
    row.lpips_roi,
    row.fid_roi,
    row.removal,
    row.struct,
    row.id,
    row.interaction,
    row.vlm
  ]);
}

async function loadLeaderboard() {
  const body = document.querySelector("#leaderboard-table tbody");
  try {
    const response = await fetch("data/leaderboard.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    leaderboard["hand-only"] = normalizeLeaderboardRows(data["hand-only"]);
    leaderboard["hand-arm"] = normalizeLeaderboardRows(data["hand-arm"]);

    const activeTrack = document.querySelector(".leaderboard-tab.active")?.dataset.track || "hand-only";
    renderLeaderboard(activeTrack);
  } catch (error) {
    console.error("Unable to load leaderboard data:", error);
    body.innerHTML = '<tr><td colspan="9">Leaderboard data could not be loaded.</td></tr>';
  }
}

function rankValues(rows, spec) {
  const values = [...new Set(rows.map((row) => row[spec.idx]))]
    .sort((a, b) => spec.direction === "min" ? a - b : b - a);
  return { best: values[0], second: values[1] };
}

function renderLeaderboard(track) {
  const body = document.querySelector("#leaderboard-table tbody");
  const rows = leaderboard[track];
  const ranks = metricSpecs.map((spec) => rankValues(rows, spec));
  body.innerHTML = rows.map((row) => {
    const metrics = metricSpecs.map((spec, index) => {
      const value = row[spec.idx];
      const rankClass = value === ranks[index].best ? "best" : value === ranks[index].second ? "second" : "";
      return `<td class="${rankClass}">${Number(value).toFixed(spec.digits)}</td>`;
    }).join("");
    const access = row[1].toLowerCase() === "api" ? "api" : "local";
    return `<tr><td>${row[0]}</td><td><span class="access-badge ${access}">${row[1]}</span></td>${metrics}</tr>`;
  }).join("");
}

const embodimentData = {
  "hand-only": [
    ["Ability", "ability"], ["Allegro", "allegro"], ["DexHand021", "dexhand021"],
    ["Leap", "leap"], ["OrcaHand", "orcahand"], ["Revo2", "revo2"],
    ["RH56DFX", "RH56DFX"], ["RH5DG2", "RH5DG2"], ["RoHand", "rohand"],
    ["Schunk SVH", "schunk_svh"], ["Shadow Hand", "shadow"], ["Sharpa", "sharpa"], ["Wuji", "wuji"]
  ],
  "hand-arm": [
    ["Jaka Zu7 + DexHand021", "jaka_zu7_dexhand021"], ["KUKA + Sharpa", "kuka_sharpa"],
    ["Panda + Allegro", "panda_allegro"], ["Panda + Orca", "panda_orca"],
    ["RM65 + BrainCo", "rm_65_BrainCo"], ["RM75 + RoHand", "rm_75_rohand"],
    ["UR5 + RH56DFX", "ur5_RH56DFX"], ["UR5 + RH5DG2", "ur5_RH5DG2"],
    ["UR5 + Schunk Hand", "ur5_schunk_hand"], ["UR5 + Shadow Hand", "ur5_shadow_hand"],
    ["UR5 + Wuji", "ur5_wuji"], ["xArm + Ability", "xarm_ability"], ["xArm + Leap", "xarm_leap"]
  ]
};

function renderEmbodiments(group) {
  const grid = document.querySelector("#embodiment-grid");
  grid.innerHTML = embodimentData[group].map(([name, file]) => {
    const src = `assets/renders/${group}/${file}.webp`;
    return `<article class="embodiment-card">
      <button type="button" data-lightbox="${src}" aria-label="Open canonical render of ${name}">
        <img src="${src}" alt="Canonical render of ${name}" loading="lazy" decoding="async">
      </button>
      <strong title="${name}">${name}</strong>
    </article>`;
  }).join("");
}

const transferAssetRevision = "20260726-2";

const transferTasks = {
  cut: {
    title: "Apple cutting",
    aspect: 1.7647,
    frames: 8,
    rows: [["human", "Human", "human"], ["ability", "Ability", "robot"], ["shadow", "Shadow", "robot"], ["svh", "SVH", "robot"]]
  },
  pour: {
    title: "Pouring and weighing",
    aspect: 1.7647,
    frames: 8,
    rows: [["human", "Human", "human"], ["ability", "Ability", "robot"], ["allegro", "Allegro", "robot"], ["shadow", "Shadow", "robot"]]
  },
  place: {
    title: "Lift and place",
    aspect: 1.7647,
    frames: 8,
    rows: [["human", "Human", "human"], ["allegro", "Allegro", "robot"], ["rh56dfx", "RH56DFX", "robot"], ["sharpa", "Sharpa", "robot"]]
  },
  mixer: {
    title: "Mixer manipulation",
    aspect: 1.3989,
    frames: 8,
    rows: [["human", "Human", "human"], ["ability", "Ability", "robot"], ["dexhand021_jaka", "DexHand021", "robot"], ["rh56dfx_ur5", "RH56DFX", "robot"]]
  },
  laptop: {
    title: "Laptop manipulation",
    aspect: 1.3989,
    frames: 8,
    rows: [["human", "Human", "human"], ["allegro", "Allegro", "robot"], ["dexhand021", "DexHand021", "robot"], ["ability", "Ability", "robot"]]
  },
  tongs: {
    title: "Wooden tongs transfer",
    aspect: 1.7647,
    frames: 8,
    rows: [["human", "Human", "human"], ["rh56dfx", "RH56DFX", "robot"], ["rh5dg2", "RH5DG2", "robot"], ["shadow", "Shadow", "robot"]]
  },
  chair: {
    title: "Pink chair repositioning",
    aspect: 1.7778,
    frames: 8,
    frameSource: [2, 3, 5, 6, 7, 8, 9, 10],
    rows: [["human", "Human", "human"], ["revo2", "Revo2", "robot"], ["rh56dfx", "RH56DFX", "robot"], ["svh", "SVH", "robot"]]
  },
  rearrange: {
    title: "Multi-object rearrangement",
    aspect: 1.7778,
    frames: 8,
    rows: [["human", "Human", "human"], ["rohand", "RoHand", "robot"], ["shadow", "Shadow", "robot"], ["svh", "SVH", "robot"]]
  }
};

function renderTransferGrid(taskKey) {
  const task = transferTasks[taskKey];
  const grid = document.querySelector("#transfer-grid");
  const title = document.querySelector("#transfer-title");
  const header = ["<span class=\"transfer-corner\" aria-hidden=\"true\"></span>"];
  const imageHeight = Math.round(540 / task.aspect);
  const sourceFrames = Array.isArray(task.frameSource) && task.frameSource.length === task.frames
    ? task.frameSource
    : Array.from({ length: task.frames }, (_, i) => i + 1);

  for (let frame = 1; frame <= task.frames; frame += 1) {
    header.push(`<span class="transfer-frame-number">${frame}</span>`);
  }

  const rows = task.rows.flatMap(([key, label, kind]) => {
    const cells = [`<strong class="transfer-row-label ${kind}">${label}</strong>`];
    for (let frame = 1; frame <= task.frames; frame += 1) {
      const frameName = String(sourceFrames[frame - 1]).padStart(2, "0");
      const src = `assets/transfer/${taskKey}/${key}/${frameName}.webp?v=${transferAssetRevision}`;
      const alt = `${task.title}: ${label}, synchronized frame ${frame}`;
      cells.push(`<button class="transfer-frame-button" type="button" data-lightbox="${src}" aria-label="Open ${alt}">
        <img src="${src}" width="540" height="${imageHeight}" alt="${alt}" decoding="async">
      </button>`);
    }
    return cells;
  });

  grid.style.setProperty("--frame-aspect", String(task.aspect));
  grid.style.setProperty("--frame-count", String(task.frames));
  grid.style.setProperty("--grid-min-width", `${1190 + Math.max(0, task.frames - 8) * 133}px`);
  grid.style.setProperty("--grid-min-width-mobile", `${1135 + Math.max(0, task.frames - 8) * 126}px`);
  grid.innerHTML = [...header, ...rows].join("");
  title.textContent = task.title;
}

function initializeTabGroup({ selector, panel, dataAttribute, onSelect }) {
  const buttons = [...document.querySelectorAll(selector)];
  const panelElement = document.querySelector(panel);
  if (!buttons.length || !panelElement) return;

  panelElement.setAttribute("role", "tabpanel");
  const activate = (button, focus = false) => {
    buttons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.setAttribute("tabindex", selected ? "0" : "-1");
    });
    panelElement.setAttribute("aria-labelledby", button.id);
    onSelect(button.dataset[dataAttribute]);
    if (focus) button.focus();
  };

  buttons.forEach((button, index) => {
    button.setAttribute("role", "tab");
    if (!button.id) button.id = `${dataAttribute}-tab-${index + 1}`;
    button.setAttribute("aria-controls", panelElement.id);
    button.addEventListener("click", () => activate(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      activate(buttons[nextIndex], true);
    });
  });

  activate(buttons.find((button) => button.classList.contains("active")) || buttons[0]);
}

renderTransferGrid("cut");
initializeTabGroup({
  selector: ".transfer-tab",
  panel: "#transfer-panel",
  dataAttribute: "transferTask",
  onSelect: renderTransferGrid
});

renderEmbodiments("hand-only");
initializeTabGroup({
  selector: ".embodiment-tab",
  panel: "#embodiment-grid",
  dataAttribute: "embodiment",
  onSelect: renderEmbodiments
});

const leaderboardPanel = document.querySelector(".table-frame");
leaderboardPanel.id = "leaderboard-panel";
initializeTabGroup({
  selector: ".leaderboard-tab",
  panel: "#leaderboard-panel",
  dataAttribute: "track",
  onSelect: renderLeaderboard
});
loadLeaderboard();

// Teaser video: keep the supplied poster and play treatment while retaining native controls.
const teaserPlayer = document.querySelector("#teaser-player");
const teaserVideo = document.querySelector("#teaser-video");
const teaserPlay = document.querySelector("#teaser-play");
if (teaserPlayer && teaserVideo && teaserPlay) {
  const setPlayingState = (isPlaying) => {
    teaserPlayer.classList.toggle("is-playing", isPlaying);
    teaserPlay.setAttribute("aria-label", isPlaying
      ? "Pause the HandEdit project teaser"
      : "Play the HandEdit project teaser");
  };

  teaserPlay.addEventListener("click", async () => {
    if (!teaserVideo.paused) {
      teaserVideo.pause();
      return;
    }

    try {
      await teaserVideo.play();
    } catch (error) {
      setPlayingState(false);
      console.warn("The teaser video could not start.", error);
    }
  });

  teaserVideo.addEventListener("play", () => setPlayingState(true));
  teaserVideo.addEventListener("pause", () => setPlayingState(false));
  teaserVideo.addEventListener("ended", () => setPlayingState(false));
  teaserVideo.addEventListener("error", () => {
    teaserPlayer.classList.add("is-unavailable");
  });
}

// Event-delegated image lightbox supports both static and dynamically rendered figures.
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
let lastLightboxTrigger = null;

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-lightbox]");
  if (!trigger) return;
  const sourceImage = trigger.querySelector("img");
  lastLightboxTrigger = trigger;
  lightboxImage.src = trigger.dataset.lightbox;
  lightboxImage.alt = sourceImage?.alt || trigger.getAttribute("aria-label") || "Expanded project figure";
  lightbox.showModal();
  document.body.classList.add("dialog-open");
});

function closeLightbox() {
  if (!lightbox.open) return;
  lightbox.close();
  document.body.classList.remove("dialog-open");
  lastLightboxTrigger?.focus();
}

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => document.body.classList.remove("dialog-open"));

// Copy BibTeX.
const copyButton = document.querySelector("#copy-citation");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector("#citation-text").textContent);
    copyButton.textContent = "Copied";
    window.setTimeout(() => { copyButton.textContent = "Copy"; }, 1400);
  } catch (_) {
    copyButton.textContent = "Select text";
  }
});

// Mobile navigation.
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#nav-links");

function closeNavigation() {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Toggle navigation");
}

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Toggle navigation");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeNavigation();
    navToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNavigation();
});

// Reflect the current section in the compact navigation.
const navTargets = [...nav.querySelectorAll("a[href^='#']")]
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter((item) => item.section);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navTargets.forEach(({ link, section }) => {
      if (section === visible.target) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-20% 0px -68% 0px", threshold: [0, 0.15, 0.4] });
  navTargets.forEach(({ section }) => navObserver.observe(section));
}
