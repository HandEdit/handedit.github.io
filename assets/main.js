const leaderboard = {
  "hand-only": [
    ["GPT-Image-2", "API", 0.480, 99.78, 0.951, 0.778, 0.850, 0.702, 0.661],
    ["Nano-Banana-2", "API", 0.500, 103.92, 0.923, 0.744, 0.790, 0.615, 0.690],
    ["GPT-Image-1.5", "API", 0.610, 123.16, 0.953, 0.728, 0.914, 0.432, 0.763],
    ["Seedream-4.5", "API", 0.536, 117.96, 0.929, 0.721, 0.756, 0.606, 0.567],
    ["Flux-2-Pro", "API", 0.682, 108.43, 0.937, 0.721, 0.757, 0.372, 0.670],
    ["Hunyuan-Image-3.0", "Local", 0.666, 113.50, 0.931, 0.714, 0.849, 0.385, 0.660],
    ["Nano-Banana", "API", 0.712, 118.02, 0.921, 0.691, 0.751, 0.325, 0.429],
    ["Qwen-Image-Edit-2511", "Local", 0.736, 142.14, 0.952, 0.668, 0.616, 0.302, 0.469],
    ["Flux-Kontext-Max", "API", 0.719, 136.11, 0.950, 0.658, 0.744, 0.270, 0.359],
    ["OmniGen2", "Local", 0.751, 127.42, 0.902, 0.676, 0.526, 0.262, 0.468],
    ["FireRed-Image-Edit-1.1", "Local", 0.727, 144.16, 0.950, 0.628, 0.888, 0.289, 0.288]
  ],
  "hand-arm": [
    ["GPT-Image-2", "API", 0.512, 146.01, 0.981, 0.777, 0.562, 0.593, 0.785],
    ["GPT-Image-1.5", "API", 0.590, 152.29, 0.983, 0.742, 0.605, 0.420, 0.854],
    ["Nano-Banana-2", "API", 0.513, 158.08, 0.967, 0.725, 0.502, 0.632, 0.671],
    ["Flux-2-Pro", "API", 0.553, 157.05, 0.958, 0.741, 0.515, 0.540, 0.702],
    ["Hunyuan-Image-3.0", "Local", 0.668, 161.27, 0.976, 0.742, 0.518, 0.336, 0.811],
    ["Qwen-Image-Edit-2511", "Local", 0.598, 165.68, 0.980, 0.741, 0.467, 0.488, 0.703],
    ["Seedream-4.5", "API", 0.622, 167.11, 0.963, 0.700, 0.501, 0.423, 0.528],
    ["Nano-Banana", "API", 0.699, 164.00, 0.977, 0.704, 0.470, 0.275, 0.806],
    ["FireRed-Image-Edit-1.1", "Local", 0.702, 189.97, 0.981, 0.705, 0.509, 0.270, 0.397],
    ["OmniGen2", "Local", 0.740, 178.50, 0.910, 0.705, 0.416, 0.237, 0.377],
    ["Flux-Kontext-Max", "API", 0.726, 199.39, 0.981, 0.677, 0.469, 0.246, 0.348]
  ]
};

const metricSpecs = [
  { idx: 2, direction: "min", digits: 3 },
  { idx: 3, direction: "min", digits: 2 },
  { idx: 4, direction: "max", digits: 3 },
  { idx: 5, direction: "max", digits: 3 },
  { idx: 6, direction: "max", digits: 3 },
  { idx: 7, direction: "max", digits: 3 },
  { idx: 8, direction: "max", digits: 3 }
];

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

const transferTasks = {
  cut: {
    title: "Apple cutting",
    description: "Tool use and bimanual contact across three dexterous hand embodiments.",
    aspect: 1.7647,
    rows: [["human", "Human", "human"], ["ability", "Ability", "robot"], ["shadow", "Shadow", "robot"], ["svh", "SVH", "robot"]]
  },
  pour: {
    title: "Pouring and weighing",
    description: "A synchronized progression from reach and grasp to controlled pouring.",
    aspect: 1.7647,
    rows: [["human", "Human", "human"], ["ability", "Ability", "robot"], ["allegro", "Allegro", "robot"], ["shadow", "Shadow", "robot"]]
  },
  place: {
    title: "Lift and place",
    description: "Grasp, lift, transport, and placement under distinct hand morphologies.",
    aspect: 1.7647,
    rows: [["human", "Human", "human"], ["allegro", "Allegro", "robot"], ["inspire", "Inspire", "robot"], ["sharpa", "Sharpa", "robot"]]
  },
  mixer: {
    title: "Mixer manipulation",
    description: "Late-stage synchronized frames with both standalone and full hand-arm targets.",
    aspect: 1.3989,
    rows: [["human", "Human", "human"], ["ability", "Ability", "robot"], ["dexhand021_jaka", "DexHand021 + Jaka", "robot"], ["rh56dfx_ur5", "RH56DFX + UR5", "robot"]]
  },
  box: {
    title: "Articulated box",
    description: "Approach, contact, opening, and manipulation of an articulated object.",
    aspect: 1.3989,
    rows: [["human", "Human", "human"], ["dexhand021_jaka", "DexHand021 + Jaka", "robot"], ["rh56dfx_ur5", "RH56DFX + UR5", "robot"], ["sharpa_iiwa7", "Sharpa + iiwa7", "robot"]]
  }
};

function renderTransferGrid(taskKey) {
  const task = transferTasks[taskKey];
  const grid = document.querySelector("#transfer-grid");
  const title = document.querySelector("#transfer-title");
  const description = document.querySelector("#transfer-description");
  const header = ["<span class=\"transfer-corner\" aria-hidden=\"true\"></span>"];

  for (let frame = 1; frame <= 8; frame += 1) {
    header.push(`<span class="transfer-frame-number">${frame}</span>`);
  }

  const rows = task.rows.flatMap(([key, label, kind]) => {
    const cells = [`<strong class="transfer-row-label ${kind}">${label}</strong>`];
    for (let frame = 1; frame <= 8; frame += 1) {
      const frameName = String(frame).padStart(2, "0");
      const src = `assets/transfer/${taskKey}/${key}/${frameName}.webp`;
      const alt = `${task.title}: ${label}, synchronized frame ${frame}`;
      cells.push(`<button class="transfer-frame-button" type="button" data-lightbox="${src}" aria-label="Open ${alt}">
        <img src="${src}" width="540" height="${task.aspect > 1.6 ? 306 : 386}" alt="${alt}" decoding="async">
      </button>`);
    }
    return cells;
  });

  grid.style.setProperty("--frame-aspect", String(task.aspect));
  grid.innerHTML = [...header, ...rows].join("");
  title.textContent = task.title;
  description.textContent = task.description;
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

renderLeaderboard("hand-only");
const leaderboardPanel = document.querySelector(".table-frame");
leaderboardPanel.id = "leaderboard-panel";
initializeTabGroup({
  selector: ".leaderboard-tab",
  panel: "#leaderboard-panel",
  dataAttribute: "track",
  onSelect: renderLeaderboard
});

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
