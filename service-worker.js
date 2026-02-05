self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("orga-v1").then(cache =>
      cache.addAll([
        "/", "/index.html", "/style.css", "/app.js"
      ])
    )
  );
});
