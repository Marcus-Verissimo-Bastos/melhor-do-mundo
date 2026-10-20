const STORAGE_KEY = 'rei-da-quadra';

const padrao = [
  { id: 1, nome: 'LeBron James', time: 'Los Angeles Lakers · EUA', votos: 0 },
  { id: 2, nome: 'Stephen Curry', time: 'Golden State Warriors · EUA', votos: 0 },
  { id: 3, nome: 'Nikola Jokić', time: 'Denver Nuggets · Sérvia', votos: 0 },
  { id: 4, nome: 'Luka Dončić', time: 'Los Angeles Lakers · Eslovênia', votos: 0 },
];

let jogadores = JSON.parse(localStorage.getItem(STORAGE_KEY)) || padrao;

const lista = document.getElementById('lista');
const form = document.getElementById('formAdd');

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jogadores));
}

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function render() {
  const ordenados = [...jogadores].sort((a, b) => b.votos - a.votos);
  const total = jogadores.reduce((soma, j) => soma + j.votos, 0);

  document.getElementById('totalVotos').textContent = total;
  document.getElementById('totalJogadores').textContent = jogadores.length;
  document.getElementById('lider').textContent =
    total > 0 && ordenados[0] ? ordenados[0].nome : '—';

  if (ordenados.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum jogador na quadra. Adicione o primeiro!</div>';
    return;
  }

  lista.innerHTML = ordenados.map((j, i) => {
    const pct = total ? Math.round((j.votos / total) * 100) : 0;
    const lider = i === 0 && total > 0;
    return `
      <article class="card ${lider ? 'first' : ''}">
        <button class="del" data-del="${j.id}" title="Remover">✕</button>
        <div class="rank">${i + 1}º</div>
        <div class="avatar">${escapar(iniciais(j.nome))}</div>
        <div class="info">
          <h3>${escapar(j.nome)}</h3>
          <p>${escapar(j.time || 'Sem time')} · ${pct}%</p>
          <div class="bar"><div style="width:${pct}%"></div></div>
        </div>
        <div class="vote-box">
          <div class="votos">${j.votos}<small>votos</small></div>
          <button class="btn" data-vote="${j.id}">Votar</button>
        </div>
      </article>`;
  }).join('');
}

lista.addEventListener('click', (e) => {
  const voteId = e.target.dataset.vote;
  const delId = e.target.dataset.del;

  if (voteId) {
    const j = jogadores.find(x => x.id == voteId);
    if (j) j.votos++;
  }
  if (delId) {
    jogadores = jogadores.filter(x => x.id != delId);
  }
  if (voteId || delId) {
    salvar();
    render();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('inputNome').value.trim();
  const time = document.getElementById('inputTime').value.trim();
  if (!nome) return;

  jogadores.push({ id: Date.now(), nome, time, votos: 0 });
  form.reset();
  salvar();
  render();
});

document.getElementById('btnZerar').addEventListener('click', () => {
  if (!confirm('Zerar todos os votos?')) return;
  jogadores.forEach(j => (j.votos = 0));
  salvar();
  render();
});

render();
