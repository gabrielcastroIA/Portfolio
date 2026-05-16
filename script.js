/* ═══════════════════════════════════════════════════════
   PORTFOLIO · GABRIEL — script.js
   Seções: cursor · parallax · partículas · tilt 3D ·
           magnetic · scroll reveal · nav ativa · tema
═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────
   1. CURSOR CUSTOMIZADO
   Dois elementos: ponto (segue o mouse
   direto) e anel (segue com atraso via lerp).
───────────────────────────────────── */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// posição atual do mouse
let mouseX = 0, mouseY = 0;
// posição interpolada do anel (começa no mesmo lugar)
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // o ponto segue instantaneamente
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';

  // o anel faz lerp — aproxima 12% a cada frame (suavidade)
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// expande o cursor ao passar em elementos clicáveis
document.querySelectorAll('a, button, .skill-card, .project-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


/* ─────────────────────────────────────
   2. PARALLAX MULTICAMADA (mouse move)
   Cada camada tem data-speed no HTML.
   Quanto maior o speed, mais a camada
   se move — simula profundidade 3D.
───────────────────────────────────── */
const hero = document.getElementById('hero');
const heroLayers = hero.querySelectorAll('[data-speed]');

// posição normalizada do mouse (-1 a 1)
let targetX = 0, targetY = 0;
// valor atual interpolado
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', e => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateParallax() {
  // lerp suave — aproxima 6% a cada frame
  currentX += (targetX - currentX) * 0.06;
  currentY += (targetY - currentY) * 0.06;

  heroLayers.forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0.05;
    const x = currentX * speed * 120; // amplitude horizontal
    const y = currentY * speed * 80;  // amplitude vertical
    layer.style.transform = `translate(${x}px, ${y}px)`;
  });

  requestAnimationFrame(animateParallax);
}
animateParallax();

// parallax adicional no scroll — o grid afunda enquanto você desce
const heroGrid = hero.querySelector('.hero-grid');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroGrid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
}, { passive: true });


/* ─────────────────────────────────────
   3. PARTÍCULAS FLUTUANTES
   Cria <div class="particle"> dinamicamente,
   define tamanho e duração aleatórios,
   e remove após a animação terminar.
───────────────────────────────────── */
const particleContainer = document.getElementById('particles');

function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');

  const size = Math.random() * 4 + 2;          // 2px a 6px
  const duration = 6 + Math.random() * 10;          // 6s a 16s
  const delay = Math.random() * 4;               // atraso até 4s

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    bottom: -10px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
  `;

  particleContainer.appendChild(p);

  // remove o elemento depois que a animação acabar
  setTimeout(() => p.remove(), (duration + delay) * 1000);
}

// cria um lote inicial espalhado no tempo
for (let i = 0; i < 20; i++) setTimeout(createParticle, i * 400);

// continua criando partículas em loop
setInterval(createParticle, 800);


/* ─────────────────────────────────────
   4. TILT 3D NOS CARDS
   Calcula quanto o mouse está deslocado
   do centro do card e aplica rotateX/Y
   em perspectiva. Os filhos .tilt-inner
   e .tilt-icon ficam "flutuando" na frente.
───────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    // posição do mouse relativa ao centro do card (-0.5 a 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = -y * 16; // eixo X (cima/baixo)
    const rotY = x * 16; // eixo Y (esquerda/direita)

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;

    // eleva os filhos para reforçar a profundidade
    const inner = card.querySelector('.tilt-inner');
    const icon = card.querySelector('.tilt-icon');
    if (inner) inner.style.transform = 'translateZ(30px)';
    if (icon) icon.style.transform = 'translateZ(50px)';
  });

  card.addEventListener('mouseleave', () => {
    // volta à posição neutra
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';

    const inner = card.querySelector('.tilt-inner');
    const icon = card.querySelector('.tilt-icon');
    if (inner) inner.style.transform = 'translateZ(20px)';
    if (icon) icon.style.transform = 'translateZ(35px)';
  });
});


/* ─────────────────────────────────────
   5. BOTÕES MAGNÉTICOS
   O botão se desvia levemente em direção
   ao cursor — efeito de atração suave.
───────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {

  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});


/* ─────────────────────────────────────
   6. SCROLL REVEAL
   Usa IntersectionObserver para adicionar
   a classe .visible quando o elemento
   entra na viewport — o CSS faz o fade + slide.
───────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');

    // se houver barra de skill dentro do elemento, anima ela também
    const bar = entry.target.querySelector('.skill-fill');
    if (bar) setTimeout(() => bar.classList.add('animated'), 300);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// observer separado especificamente para as barras de skill
// (caso o card não tenha classe .reveal mas a barra precise animar)
document.querySelectorAll('.skill-card').forEach(card => {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) setTimeout(() => fill.classList.add('animated'), 300);
    });
  }, { threshold: 0.3 });

  skillObserver.observe(card);
});


/* ─────────────────────────────────────
   7. NAV ATIVA POR SEÇÃO
   Detecta qual seção está visível no scroll
   e marca o link correspondente como .active.
───────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });


/* ─────────────────────────────────────
   8. ALTERNAR TEMA CLARO / ESCURO
───────────────────────────────────── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  html.setAttribute('data-theme', isDark ? 'light' : 'dark');

  // troca o ícone lua ↔ sol
  document.getElementById('icon-sun').style.display = isDark ? 'block' : 'none';
  document.getElementById('icon-moon').style.display = isDark ? 'none' : 'block';
}

// garante que a lua aparece por padrão (tema dark)
document.getElementById('icon-moon').style.display = 'block';


/* ─────────────────────────────────────
   9. FUNÇÕES ORIGINAIS DO GABRIEL
───────────────────────────────────── */

// Botão "Diga Olá" na seção de contato
function alterarTexto() {
  const el = document.getElementById('mensagem');
  el.textContent = '👋 Bem-vindo ao meu portfólio! Este projeto foi criado com HTML, CSS e JavaScript.';
  el.style.opacity = '1';

  // some após 4 segundos
  setTimeout(() => { el.style.opacity = '0'; }, 4000);
}

// Clique nos cards de tecnologia
function mostrarTecnologia(tecnologia) {
  const el = document.getElementById('tecnologiaSelecionada');
  el.innerHTML = `<span>▸</span> ${tecnologia} selecionado`;
  el.style.opacity = '1';
}

/*=============================================== aprendizados.html ===============================================*/

const aprendizados = [
  {
    tema: 'aws',
    pergunta: 'o que é aws e para que serve?',
    resposta: 'AWS é uma plataforma de computação em nuvem da Amazon que oferece serviços como hospedagem, banco de dados, armazenamento, servidores e escalabilidade.',
    entendimento: 'Entendi que a AWS permite criar aplicações escaláveis sem precisar manter infraestrutura física própria.',
  },

  {
    tema: 'docker',
    pergunta: 'o que é docker?',
    resposta: 'Docker é uma plataforma que permite criar e executar aplicações em containers isolados, garantindo que funcionem da mesma forma em qualquer ambiente.',
    entendimento: 'Entendi que o Docker empacota a aplicação com todas as dependências para evitar problemas de compatibilidade.',
  },

  {
    tema: 'kubernetes',
    pergunta: 'para que serve o kubernetes?',
    resposta: 'Kubernetes é uma ferramenta de orquestração de containers que automatiza deploy, escalabilidade e gerenciamento de aplicações.',
    entendimento: 'Entendi que o Kubernetes organiza vários containers Docker e ajuda a manter aplicações funcionando de forma escalável.',
  },

  {
    tema: 'java',
    pergunta: 'por que java é tão usado no backend?',
    resposta: 'Java é muito usado no backend por ser uma linguagem robusta, segura, orientada a objetos e altamente utilizada em sistemas corporativos.',
    entendimento: 'Entendi que Java é muito forte em aplicações grandes e sistemas empresariais por causa da sua estabilidade.',
  },

  {
    tema: 'python',
    pergunta: 'por que python é tão popular?',
    resposta: 'Python é uma linguagem simples e versátil, usada em automação, desenvolvimento web, inteligência artificial e análise de dados.',
    entendimento: 'Entendi que Python se tornou popular por possuir sintaxe fácil e permitir criar muitas soluções rapidamente.',
  },

  {
    tema: 'nodejs',
    pergunta: 'o que é node.js?',
    resposta: 'Node.js é um ambiente que permite executar JavaScript no servidor, possibilitando criar APIs, aplicações backend e sistemas em tempo real.',
    entendimento: 'Entendi que o Node.js leva o JavaScript para o backend, permitindo usar a mesma linguagem no frontend e no servidor.',
  }
];

function renderizarAprendizados(lista) {
  const listaAprendizados = document.getElementById('lista-aprendizados');
  const contadorAprendizados = document.getElementById('contador-aprendizados');

  if (!listaAprendizados || !contadorAprendizados)
    return;

  listaAprendizados.innerHTML = '';

  for (let cont = 0; cont < lista.length; cont++) {
    listaAprendizados.innerHTML += `
    <article class="aprendizado">
    <span>${lista[cont].tema}</span>
    <h3>${lista[cont].pergunta}</h3>
    <p>${lista[cont].resposta}</p>
    <p><strong>Resposta:</strong> ${lista[cont].resposta}</p>
    <p><strong>O que entendi:</strong> ${lista[cont].entendimento}</p>
    </article>
    `
  };

  contadorAprendizados.textContent = 'Total de aprendizados: ' + lista.length;
}

renderizarAprendizados(aprendizados);