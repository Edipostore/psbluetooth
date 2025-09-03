let escadas = [];

fetch('beacons.json')
  .then(response => response.json())
  .then(data => {
    escadas = data;
    listarEscadas();
  })
  .catch(err => {
    console.error("Erro ao carregar beacons:", err);
    escadas = [
      { id: 'escada1', x: 550, y: 1200, nome: 'Escada Técnica A', descricao: 'Corredor Central', uuid: 'B9407733-F564-4B8D-88F5-C4E382A9956C-100-1' },
      { id: 'escada2', x: 800, y: 1050, nome: 'Escada Técnica B', descricao: 'Próximo ao MALL', uuid: 'B9407733-F564-4B8D-88F5-C4E382A9956C-100-2' },
      { id: 'escada3', x: 1050, y: 900, nome: 'Escada Técnica C', descricao: 'Praça de Eventos', uuid: 'B9407733-F564-4B8D-88F5-C4E382A9956C-100-3' },
      { id: 'escada4', x: 1200, y: 750, nome: 'Escada Técnica D', descricao: 'Área de Alimentação', uuid: 'B9407733-F564-4B8D-88F5-C4E382A9956C-100-4' },
      { id: 'escada5', x: 1400, y: 800, nome: 'Escada Técnica E', descricao: 'Entrada Leste', uuid: 'B9407733-F564-4B8D-88F5-C4E382A9956C-100-5' },
      { id: 'escada6', x: 650, y: 900, nome: 'Escada Técnica F', descricao: 'Cinema', uuid: 'B9407733-F564-4B8D-88F5-C4E382A9956C-100-6' }
    ];
    listarEscadas();
  });

function listarEscadas() {
  const escadasList = document.getElementById('escadasList');
  escadasList.innerHTML = '';
  escadas.forEach(escada => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${escada.nome}</strong> — ${escada.descricao} <span style="font-size:0.9em; color:#00bfff;">(ID: ${escada.id})</span>`;
    escadasList.appendChild(div);
  });
}

function mostrarMarcador(x, y, tipo = 'user') {
  const marker = document.createElement('div');
  marker.className = `area-marker ${tipo}-marker`;
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  document.querySelector('.map-container').appendChild(marker);

  setTimeout(() => {
    if (marker.parentNode) marker.remove();
  }, 3000);
}

function calcularDistancia(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function encontrarEscadaMaisProxima(userX, userY) {
  let menorDistancia = Infinity;
  let escadaMaisProxima = null;

  escadas.forEach(escada => {
    const distancia = calcularDistancia(userX, userY, escada.x, escada.y);
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      escadaMaisProxima = escada;
    }
  });

  const info = document.getElementById('info');
  info.innerHTML = `
    <strong>🎯 Escada mais próxima:</strong> ${escadaMaisProxima.nome}<br>
    <strong>📍 Localização:</strong> ${escadaMaisProxima.descricao}<br>
    <strong>📏 Distância:</strong> ${menorDistancia.toFixed(1)}px<br>
    <strong>📡 Sinal Bluetooth:</strong> ${-40 - menorDistancia * 0.5} dBm (estimado)
  `;
}

document.getElementById('mapOverlay').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  mostrarMarcador(x, y, 'user');
  encontrarEscadaMaisProxima(x, y);
});

document.getElementById('bluetoothBtn').addEventListener('click', () => {
  const info = document.getElementById('info');
  const detectadas = [];
  const centerX = Math.random() * 1800 + 100;
  const centerY = Math.random() * 1400 + 100;

  escadas.forEach(escada => {
    const dist = calcularDistancia(centerX, centerY, escada.x, escada.y);
    if (dist < 150) {
      detectadas.push(escada);
      mostrarMarcador(escada.x, escada.y, 'bluetooth');
    }
  });

  if (detectadas.length > 0) {
    const lista = detectadas.map(e => `${e.nome} (${e.descricao})`).join(', ');
    info.innerHTML = `
      <strong>✅ Bluetooth: ${detectadas.length} escada(s) detectada(s)</strong><br>
      <strong>📡 Dispositivos:</strong> ${lista}<br>
      <strong>📍 Você está dentro do raio de alcance.</strong>
    `;
  } else {
    info.innerHTML = `<strong>❌ Bluetooth: Nenhuma escada detectada. Fora de alcance.</strong>`;
  }
});

document.getElementById('showAllBtn').addEventListener('click', () => {
  const container = document.querySelector('.map-container');
  container.querySelectorAll('.area-marker').forEach(m => m.remove());

  escadas.forEach(escada => {
    const marker = document.createElement('div');
    marker.className = 'area-marker';
    marker.style.left = `${escada.x}px`;
    marker.style.top = `${escada.y}px`;
    marker.title = escada.nome;
    container.appendChild(marker);
  });
});