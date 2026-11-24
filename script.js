// Side mini-menu: lists the entries of whichever section is on screen,
// and highlights the current section (top bar) and entry (side menu).
// An entry appears in the menu if its HTML tag has data-nav="..." (and optionally data-sub="...").
const sections = [...document.querySelectorAll("section.cv")];
const side = document.getElementById("sidemenu");
const topLinks = [...document.querySelectorAll(".nav a[href^='#']")];
let current = null;

function showSection(sec) {
  if (sec === current) return;
  current = sec;
  topLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id));
  const entries = [...sec.querySelectorAll("[data-nav]")];
  if (!entries.length) { side.classList.remove("show"); return; }
  side.innerHTML = "";
  const h = document.createElement("h2");
  h.textContent = sec.dataset.label;
  const ol = document.createElement("ol");
  for (const e of entries) {
    const a = document.createElement("a");
    a.href = "#" + e.id;
    a.textContent = e.dataset.nav;
    if (e.dataset.sub) {
      const s = document.createElement("small");
      s.textContent = e.dataset.sub;
      a.append(s);
    }
    const li = document.createElement("li");
    li.append(a);
    ol.append(li);
  }
  side.append(h, ol);
  side.classList.add("show");
}

// Which section/entry has crossed a line ~30% down the screen?
function update() {
  const line = window.innerHeight * 0.3;
  const sec = sections.findLast(s => s.getBoundingClientRect().top <= line) || sections[0];
  showSection(sec);
  const entry = [...sec.querySelectorAll("[data-nav]")].findLast(e => e.getBoundingClientRect().top <= line);
  side.querySelectorAll("a").forEach(a =>
    a.classList.toggle("active", !!entry && a.getAttribute("href") === "#" + entry.id));
}
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();
