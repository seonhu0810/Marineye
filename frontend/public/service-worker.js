const addResourcesToCache = async (resources) => {
  // 오프라인 데이터 저장을 위해 Cache Storage 활용
  const cache = await caches.open("my-cache");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      // 캐시하려는 모든 리소스를 나열..
      "/index.html",
      "/assets/index.css",
      "/icons/icons/android-icon-48x48.png",
      "/icons/android-icon-72x72.png",
      "/icons/android-icon-96x96.png",
      "/icons/android-icon-144x144.png",
      "/icons/android-icon-192x192.png",
      "/backgroung.jpg",
      "/boatt.png",
      "/service-worker.js",
      "/DoHyeon-Regular.ttf",
      "/robots.txt",
      "/sw.js",
      "/manifest.json",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    // 캐시 우선 전략 (그 외 다른 전략에 대해서는 후술)
    // -> 캐시된 응답에서 먼저 검색하고, 찾지 못한 경우 네트워크에서 로드
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

const deleteOldCaches = async () => {
  const cacheKeepList = ["my-cache3"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(
    cachesToDelete.map(async (cache) => await caches.delete(cache))
  );
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
