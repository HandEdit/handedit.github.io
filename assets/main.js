const leaderboard = {
  "hand-only": [
    ["GPT-Image-2","API",0.480,99.78,0.951,0.778,0.850,0.702,0.661],
    ["Nano-Banana-2","API",0.500,103.92,0.923,0.744,0.790,0.615,0.690],
    ["GPT-Image-1.5","API",0.610,123.16,0.953,0.728,0.914,0.432,0.763],
    ["Seedream-4.5","API",0.536,117.96,0.929,0.721,0.756,0.606,0.567],
    ["Flux-2-Pro","API",0.682,108.43,0.937,0.721,0.757,0.372,0.670],
    ["Hunyuan-Image-3.0","Local",0.666,113.50,0.931,0.714,0.849,0.385,0.660],
    ["Nano-Banana","API",0.712,118.02,0.921,0.691,0.751,0.325,0.429],
    ["Qwen-Image-Edit-2511","Local",0.736,142.14,0.952,0.668,0.616,0.302,0.469],
    ["Flux-Kontext-Max","API",0.719,136.11,0.950,0.658,0.744,0.270,0.359],
    ["OmniGen2","Local",0.751,127.42,0.902,0.676,0.526,0.262,0.468],
    ["FireRed-Image-Edit-1.1","Local",0.727,144.16,0.950,0.628,0.888,0.289,0.288]
  ],
  "hand-arm": [
    ["GPT-Image-2","API",0.512,146.01,0.981,0.777,0.562,0.593,0.785],
    ["GPT-Image-1.5","API",0.590,152.29,0.983,0.742,0.605,0.420,0.854],
    ["Nano-Banana-2","API",0.513,158.08,0.967,0.725,0.502,0.632,0.671],
    ["Flux-2-Pro","API",0.553,157.05,0.958,0.741,0.515,0.540,0.702],
    ["Hunyuan-Image-3.0","Local",0.668,161.27,0.976,0.742,0.518,0.336,0.811],
    ["Qwen-Image-Edit-2511","Local",0.598,165.68,0.980,0.741,0.467,0.488,0.703],
    ["Seedream-4.5","API",0.622,167.11,0.963,0.700,0.501,0.423,0.528],
    ["Nano-Banana","API",0.699,164.00,0.977,0.704,0.470,0.275,0.806],
    ["FireRed-Image-Edit-1.1","Local",0.702,189.97,0.981,0.705,0.509,0.270,0.397],
    ["OmniGen2","Local",0.740,178.50,0.910,0.705,0.416,0.237,0.377],
    ["Flux-Kontext-Max","API",0.726,199.39,0.981,0.677,0.469,0.246,0.348]
  ]
};

const metricSpecs = [
  {idx:2, direction:"min", digits:3}, {idx:3, direction:"min", digits:2},
  {idx:4, direction:"max", digits:3}, {idx:5, direction:"max", digits:3},
  {idx:6, direction:"max", digits:3}, {idx:7, direction:"max", digits:3},
  {idx:8, direction:"max", digits:3}
];

function rankValues(rows, spec){
  const vals=[...new Set(rows.map(r=>r[spec.idx]))].sort((a,b)=>spec.direction==="min"?a-b:b-a);
  return {best:vals[0],second:vals[1]};
}
function renderLeaderboard(track){
  const rows=leaderboard[track];
  const ranks=metricSpecs.map(s=>rankValues(rows,s));
  const body=document.querySelector("#leaderboard-table tbody");
  body.innerHTML=rows.map(row=>{
    const metrics=metricSpecs.map((spec,i)=>{
      const value=row[spec.idx];
      const cls=value===ranks[i].best?"best":value===ranks[i].second?"second":"";
      return `<td class="${cls}">${Number(value).toFixed(spec.digits)}</td>`;
    }).join("");
    const access=row[1].toLowerCase()==="api"?"api":"local";
    return `<tr><td>${row[0]}</td><td><span class="access-badge ${access}">${row[1]}</span></td>${metrics}</tr>`;
  }).join("");
}
renderLeaderboard("hand-only");

document.querySelectorAll(".leaderboard-tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".leaderboard-tab").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-selected","false")});
  btn.classList.add("active");btn.setAttribute("aria-selected","true");renderLeaderboard(btn.dataset.track);
}));

const embodimentData={
  "hand-only":[
    ["Ability","ability"],["Allegro","allegro"],["DexHand021","dexhand021"],["Leap","leap"],["OrcaHand","orcahand"],["Revo2","revo2"],["RH56DFX","RH56DFX"],["RH5DG2","RH5DG2"],["RoHand","rohand"],["Schunk SVH","schunk_svh"],["Shadow Hand","shadow"],["Sharpa","sharpa"],["Wuji","wuji"]
  ],
  "hand-arm":[
    ["Jaka Zu7 + DexHand021","jaka_zu7_dexhand021"],["KUKA + Sharpa","kuka_sharpa"],["Panda + Allegro","panda_allegro"],["Panda + Orca","panda_orca"],["RM65 + BrainCo","rm_65_BrainCo"],["RM75 + RoHand","rm_75_rohand"],["UR5 + RH56DFX","ur5_RH56DFX"],["UR5 + RH5DG2","ur5_RH5DG2"],["UR5 + Schunk Hand","ur5_schunk_hand"],["UR5 + Shadow Hand","ur5_shadow_hand"],["UR5 + Wuji","ur5_wuji"],["xArm + Ability","xarm_ability"],["xArm + Leap","xarm_leap"]
  ]
};
function renderEmbodiments(group){
  const grid=document.querySelector("#embodiment-grid");
  grid.innerHTML=embodimentData[group].map(([name,file])=>{
    const src=`assets/renders/${group}/${file}.webp`;
    return `<article class="embodiment-card"><button type="button" data-lightbox="${src}" aria-label="Open ${name} render"><img src="${src}" alt="Canonical render of ${name}" loading="lazy"></button><strong title="${name}">${name}</strong></article>`;
  }).join("");
  bindLightboxTriggers(grid);
}
renderEmbodiments("hand-only");
document.querySelectorAll(".embodiment-tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".embodiment-tab").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-selected","false")});
  btn.classList.add("active");btn.setAttribute("aria-selected","true");renderEmbodiments(btn.dataset.embodiment);
}));

// Demo filtering.
document.querySelectorAll("[data-demo-filter]").forEach(btn=>btn.addEventListener("click",()=>{
  const filter=btn.dataset.demoFilter;
  document.querySelectorAll("[data-demo-filter]").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-selected","false")});
  btn.classList.add("active");btn.setAttribute("aria-selected","true");
  document.querySelectorAll(".demo-pair").forEach(card=>{
    card.hidden=filter!=="all"&&card.dataset.demoScope!==filter;
    if(card.hidden)card.querySelectorAll("video").forEach(video=>video.pause());
  });
}));

// Load the lightweight web demos; posters remain available on slow connections.
document.querySelectorAll("video[data-src]").forEach(video=>{
  video.addEventListener("error",()=>video.removeAttribute("src"),{once:true});
  video.src=video.dataset.src;
});

// Keep paired videos together and play only visible pairs.
const pairObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  entry.target.querySelectorAll("video").forEach(v=>{
    if(entry.isIntersecting&&v.src)v.play().catch(()=>{}); else v.pause();
  });
}),{threshold:.35});
document.querySelectorAll("[data-video-pair]").forEach(pair=>{
  pairObserver.observe(pair);
  pair.addEventListener("click",()=>{
    const videos=[...pair.querySelectorAll("video")].filter(v=>v.src);
    const shouldPlay=videos.some(v=>v.paused);
    videos.forEach(v=>shouldPlay?v.play().catch(()=>{}):v.pause());
  });
});

// Qualitative panel tabs.
const qualitative={
  "hand-arm":{src:"assets/figures/qualitative-hand-arm.webp",caption:"Representative human inputs and edited outputs across commercial API-based and open-source image editors."},
  "hand-only":{src:"assets/figures/qualitative-hand-only.webp",caption:"Alternative supplied qualitative comparison panel for detailed model-by-model inspection."}
};
document.querySelectorAll(".qualitative-tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".qualitative-tab").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-selected","false")});
  btn.classList.add("active");btn.setAttribute("aria-selected","true");
  const item=qualitative[btn.dataset.panel], img=document.querySelector("#qualitative-image"), cap=document.querySelector("#qualitative-caption");
  img.src=item.src;cap.textContent=item.caption;img.closest("button").dataset.lightbox=item.src;
}));

// Lightbox.
const lightbox=document.querySelector("#lightbox"), lightboxImage=lightbox.querySelector("img");
function bindLightboxTriggers(root=document){
  root.querySelectorAll("[data-lightbox]").forEach(button=>{
    if(button.dataset.bound)return;button.dataset.bound="true";
    button.addEventListener("click",()=>{lightboxImage.src=button.dataset.lightbox;lightbox.showModal();});
  });
}
bindLightboxTriggers();
lightbox.querySelector(".lightbox-close").addEventListener("click",()=>lightbox.close());
lightbox.addEventListener("click",e=>{if(e.target===lightbox)lightbox.close()});

// Copy BibTeX.
const copyButton=document.querySelector("#copy-citation");
copyButton.addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(document.querySelector("#citation-text").textContent);copyButton.textContent="Copied";setTimeout(()=>copyButton.textContent="Copy",1400)}
  catch(_){copyButton.textContent="Select text"}
});

// Mobile navigation.
const toggle=document.querySelector(".nav-toggle"), nav=document.querySelector("#nav-links");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));

// Reflect the current section in the compact navigation.
const navTargets=[...nav.querySelectorAll("a[href^='#']")]
  .map(link=>({link,section:document.querySelector(link.getAttribute("href"))}))
  .filter(item=>item.section);
const navObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  navTargets.forEach(({link,section})=>link.toggleAttribute("aria-current",section===visible.target));
},{rootMargin:"-20% 0px -68% 0px",threshold:[0,.15,.4]});
navTargets.forEach(({section})=>navObserver.observe(section));
