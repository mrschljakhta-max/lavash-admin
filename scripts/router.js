const ROUTES = {
  pending: "../pages/pending_v3.html",
  editor: "../pages/editor.html",
  upload: "../pages/upload.html",
  dicts: "../pages/dicts.html", 
  logs: "../pages/logs.html"
};

async function loadPage(page) {
  const url = ROUTES[page];
  if (!url) return;

  const res = await fetch(url);
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const body = doc.querySelector(".workspace-body");
  document.getElementById("app-content").innerHTML = body?.innerHTML || html;
}
