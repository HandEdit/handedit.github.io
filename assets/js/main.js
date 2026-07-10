const fallbackData = {"hand-only": [], "hand-arm": []};
let leaderboardData = fallbackData;

const metricSpecs = {
  lpips_roi: { direction: 'min', digits: 3 },
  fid_roi: { direction: 'min', digits: 2 },
  removal: { direction: 'max', digits: 3 },
  struct: { direction: 'max', digits: 3 },
  id: { direction: 'max', digits: 3 },
  interaction: { direction: 'max', digits: 3 },
  vlm: { direction: 'max', digits: 3 }
};

function rankClasses(rows, key) {
  const spec = metricSpecs[key];
  const values = [...new Set(rows.map(row => Number(row[key])).filter(Number.isFinite))]
    .sort((a, b) => spec.direction === 'min' ? a - b : b - a);
  return { best: values[0], second: values[1] };
}

function metricCell(value, spec, ranks) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '<td>—</td>';
  const cls = number === ranks.best ? 'metric-best' : number === ranks.second ? 'metric-second' : '';
  return `<td class="${cls}">${number.toFixed(spec.digits)}</td>`;
}

function renderLeaderboard(track) {
  const body = document.querySelector('#leaderboard-table tbody');
  const rows = leaderboardData[track] || [];
  const ranks = Object.fromEntries(Object.keys(metricSpecs).map(key => [key, rankClasses(rows, key)]));
  body.innerHTML = rows.map(item => `
    <tr>
      <td><strong>${item.model}</strong></td>
      <td><span class="badge ${item.access.toLowerCase() === 'api' ? 'api' : 'local'}">${item.access}</span></td>
      ${metricCell(item.lpips_roi, metricSpecs.lpips_roi, ranks.lpips_roi)}
      ${metricCell(item.fid_roi, metricSpecs.fid_roi, ranks.fid_roi)}
      ${metricCell(item.removal, metricSpecs.removal, ranks.removal)}
      ${metricCell(item.struct, metricSpecs.struct, ranks.struct)}
      ${metricCell(item.id, metricSpecs.id, ranks.id)}
      ${metricCell(item.interaction, metricSpecs.interaction, ranks.interaction)}
      ${metricCell(item.vlm, metricSpecs.vlm, ranks.vlm)}
    </tr>`).join('');
}

fetch('data/leaderboard.json')
  .then(response => response.ok ? response.json() : Promise.reject(new Error('No data file')))
  .then(data => { leaderboardData = data; renderLeaderboard('hand-only'); })
  .catch(() => renderLeaderboard('hand-only'));

document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    renderLeaderboard(button.dataset.track);
  });
});

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.demoFilter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.demo-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.demoScope !== filter;
    });
  });
});

// Autoplay demo videos only when a real media file is available and visible.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && video.readyState >= 2) video.play().catch(() => {});
    else video.pause();
  });
}, { threshold: 0.35 });
document.querySelectorAll('.demo-card video').forEach(video => observer.observe(video));

const copyButton = document.querySelector('#copy-citation');
copyButton?.addEventListener('click', async () => {
  const text = document.querySelector('#citation').textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copied';
    setTimeout(() => { copyButton.textContent = 'Copy'; }, 1600);
  } catch {
    copyButton.textContent = 'Select text';
  }
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(button => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightbox.showModal();
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

// Load a demo MP4 only when the file actually exists. This keeps poster-only previews clean
// and lets users activate real videos simply by adding the documented filenames.
document.querySelectorAll('video[data-video-src]').forEach(async video => {
  const src = video.dataset.videoSrc;
  try {
    const response = await fetch(src, { method: 'HEAD', cache: 'no-store' });
    if (!response.ok) return;
    video.src = src;
    video.load();
  } catch {
    // Poster remains visible when the optional demo file is absent.
  }
});
