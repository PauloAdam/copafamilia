// Copa 2026 — Service Worker para Push Notifications
// Versão: 1.0

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  if (!e.data) return;

  let data;
  try { data = e.data.json(); }
  catch { data = { title: '⚽ GOL!', body: e.data.text(), tag: 'gol' }; }

  const options = {
    body: data.body || '',
    icon: 'icon.svg',
    badge: 'icon.svg',
    tag: data.tag || 'copa2026',
    renotify: true,
    vibrate: [100, 50, 100, 50, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'abrir', title: '⚽ Ver jogo' },
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title || '⚽ GOL!', options)
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Se já tem aba aberta, foca nela
      for (const client of list) {
        if (client.url.includes('copafamilia') || client.url.includes('pauloadam.github.io')) {
          return client.focus();
        }
      }
      // Senão abre nova aba
      return clients.openWindow('https://pauloadam.github.io/copafamilia/');
    })
  );
});
