// Все тексты открытки собраны здесь, чтобы их было легко менять в одном месте.
const CONFIG = {
  title: 'Сумая, прости меня 🙈',
  subtitle: 'Эти обезьянки пришли извиниться за меня',
  eyebrow: 'Срочное обезьянье послание',
  sign: 'ПРОСТИ',
  scroll: 'Читать письмо',
  counter: 'Обезьянок, которые извиняются:',
  letterEyebrow: 'От всего сердца (и банановой души)',
  letterTitle: 'Письмо для тебя 💌',
  letter: [
    'Сумая, мне очень жаль, что так вышло. Не хотелось тебя расстраивать.',
    'Я всё понял: иногда мои поступки бывают глупее обезьянки, увидевшей банан.',
    'Ты мне очень важна, и наша дружба для меня правда много значит.',
    'Я постараюсь лучше думать о своих словах и поступках и сделать выводы.',
    'Мне не нужно волшебство, чтобы всё исправить — только шанс и немного терпения.',
    'Обезьянки уже репетируют извинение. Одна всё ещё держит банан не той стороной 🍌'
  ],
  signature: 'Твой друг 💛',
  reasonsEyebrow: 'Шесть очень серьёзных аргументов',
  reasonsTitle: 'Причины простить меня',
  reasonsHint: 'Нажимай на карточки — там секреты 🙊',
  reasons: [
    { front: '🍌', hint: 'Банановое предложение', back: 'Я куплю тебе банан. Самый ровный и без единого пятнышка!' },
    { front: '🎤', hint: 'Подготовка на высоте', back: 'Обезьянки уже выучили речь. Правда, пока только «у-у-а-а».' },
    { front: '🤞', hint: 'Клянусь мизинцем', back: 'Я больше не буду. Обещание скреплено мизинцем и бананом!' },
    { front: '🐵', hint: 'Экспертная комиссия', back: 'Пять обезьянок посовещались и единогласно попросили дать шанс.' },
    { front: '🧹', hint: 'Уборка последствий', back: 'Готово исправлять ошибки — без фокусов и побега на пальму.' },
    { front: '💛', hint: 'Самая главная причина', back: 'Ты мне дорога. Я хочу беречь нашу дружбу и твоё хорошее настроение.' }
  ],
  questionEyebrow: 'Самый важный вопрос дня',
  questionTitle: 'Простишь меня?',
  questionNote: 'Обезьянки затаили дыхание. Даже та, что ест банан.',
  yes: 'Да 💛',
  no: 'Нет 🙈',
  noMessages: ['Ты уверена?', 'Подумай ещё', 'Обезьянка плачет 🥺', 'Ну пожалуйста', 'Банан уже очищен 🍌'],
  finaleEyebrow: 'Ура, план сработал!',
  finaleTitle: 'Ура! Спасибо, Сумая 💛',
  promise: 'Обещаю внимательнее относиться к твоим чувствам, чаще дарить улыбки и не поручать обезьянкам важные сообщения.',
  replay: 'Ещё раз! 🎉',
  bananaRain: 'Банановый дождь 🍌',
  monkeyNotes: ['Ой!', 'Бананчик?', 'Это не я, это он!', 'У-у-упс!', 'Я просто мимо шёл!'],
  offended: 'Ладно, я всё понял… Прости меня 🙈'
};

(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const monkeyField = $('#monkey-field');
  const bananaField = $('#banana-field');
  const monkeyEmojis = ['🐵', '🙈', '🙉', '🙊', '🐒', '🍌'];
  const monkeyNodes = [];
  let bananaCount = 0;
  let yesScale = 1;
  let noCount = 0;
  let heroClicks = 0;
  let lastNoAttempt = 0;
  let typewriterStarted = false;

  function setText(selector, text) { $(selector).textContent = text; }

  function fillPageCopy() {
    document.title = CONFIG.title;
    setText('#hero-title', CONFIG.title);
    setText('#hero-subtitle', CONFIG.subtitle);
    setText('#hero-eyebrow', CONFIG.eyebrow);
    setText('#monkey-sign', CONFIG.sign);
    setText('#scroll-link', CONFIG.scroll);
    setText('#counter-label', CONFIG.counter);
    setText('#letter-eyebrow', CONFIG.letterEyebrow);
    setText('#letter-title', CONFIG.letterTitle);
    setText('#signature', CONFIG.signature);
    setText('#reasons-eyebrow', CONFIG.reasonsEyebrow);
    setText('#reasons-title', CONFIG.reasonsTitle);
    setText('#reasons-hint', CONFIG.reasonsHint);
    setText('#question-eyebrow', CONFIG.questionEyebrow);
    setText('#question-title', CONFIG.questionTitle);
    setText('#question-note', CONFIG.questionNote);
    setText('#yes-button', CONFIG.yes);
    setText('#no-button', CONFIG.no);
    setText('#finale-eyebrow', CONFIG.finaleEyebrow);
    setText('#finale-title', CONFIG.finaleTitle);
    setText('#finale-promise', CONFIG.promise);
    setText('#replay-button', CONFIG.replay);
    setText('#banana-rain-button', CONFIG.bananaRain);
    const grid = $('#reason-grid');
    CONFIG.reasons.forEach((reason, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'reason-card';
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('aria-label', `${reason.hint}. Нажми, чтобы открыть причину.`);
      card.innerHTML = `<span class="reason-inner"><span class="reason-face reason-front"><span>${reason.front}</span><span>${reason.hint}</span></span><span class="reason-face reason-back"></span></span>`;
      card.querySelector('.reason-back').textContent = reason.back;
      card.addEventListener('click', () => {
        const flipped = card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', String(flipped));
        card.setAttribute('aria-label', flipped ? reason.back : `${reason.hint}. Нажми, чтобы открыть причину.`);
      });
      card.dataset.index = String(index);
      grid.append(card);
    });
  }

  // Письмо печатается абзацами; при reduced motion показываем его сразу.
  function typeLetter() {
    if (typewriterStarted) return;
    typewriterStarted = true;
    const copy = $('#letter-copy');
    if (reducedMotion) {
      CONFIG.letter.forEach((text) => { const p = document.createElement('p'); p.textContent = text; copy.append(p); });
      return;
    }
    let paragraphIndex = 0;
    let characterIndex = 0;
    let current;
    const tick = () => {
      if (paragraphIndex >= CONFIG.letter.length) return;
      if (!current) { current = document.createElement('p'); copy.append(current); }
      const fullText = CONFIG.letter[paragraphIndex];
      current.textContent = fullText.slice(0, characterIndex + 1);
      characterIndex += 1;
      if (characterIndex >= fullText.length) { paragraphIndex += 1; characterIndex = 0; current = null; }
      window.setTimeout(tick, 21);
    };
    tick();
  }

  // Небольшое фиксированное число обезьянок, чтобы не перегружать телефон.
  function createMonkeys() {
    for (let i = 0; i < 28; i += 1) {
      const monkey = document.createElement('button');
      monkey.type = 'button';
      monkey.className = 'floating-monkey';
      monkey.setAttribute('aria-label', 'Нажми на обезьянку');
      monkey.style.left = `${Math.random() * 96}%`;
      monkey.style.top = `${Math.random() * 94}%`;
      monkey.style.setProperty('--size', `${1.2 + Math.random() * 1.3}rem`);
      monkey.style.setProperty('--opacity', `${0.3 + Math.random() * 0.42}`);
      monkey.style.setProperty('--duration', `${9 + Math.random() * 12}s`);
      monkey.style.setProperty('--delay', `${-Math.random() * 12}s`);
      monkey.textContent = monkeyEmojis[Math.floor(Math.random() * monkeyEmojis.length)];
      const bubble = document.createElement('span');
      bubble.className = 'monkey-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      monkey.append(bubble);
      monkey.addEventListener('click', () => teaseMonkey(monkey, bubble));
      monkeyField.append(monkey);
      monkeyNodes.push(monkey);
    }
  }

  function teaseMonkey(monkey, bubble) {
    monkey.classList.remove('is-jumping');
    void monkey.offsetWidth;
    monkey.classList.add('is-jumping');
    bubble.textContent = CONFIG.monkeyNotes[Math.floor(Math.random() * CONFIG.monkeyNotes.length)];
    bubble.classList.add('show');
    window.setTimeout(() => bubble.classList.remove('show'), 1250);
    dropBananas(1);
  }

  function dropBananas(amount = 18) {
    const room = 42 - bananaCount;
    const count = Math.max(0, Math.min(amount, room));
    for (let i = 0; i < count; i += 1) {
      const banana = document.createElement('span');
      banana.className = 'falling-banana';
      banana.textContent = '🍌';
      banana.style.left = `${Math.random() * 100}%`;
      banana.style.setProperty('--size', `${1.1 + Math.random() * 1.4}rem`);
      banana.style.setProperty('--duration', `${2.2 + Math.random() * 2.4}s`);
      banana.style.animationDelay = `${Math.random() * 0.7}s`;
      bananaField.append(banana);
      bananaCount += 1;
      banana.addEventListener('animationend', () => { banana.remove(); bananaCount -= 1; }, { once: true });
    }
  }

  let pointerFrame = 0;
  window.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      const px = event.clientX;
      const py = event.clientY;
      monkeyNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - px;
        const dy = rect.top + rect.height / 2 - py;
        const distance = Math.hypot(dx, dy);
        const force = distance < 115 ? (115 - distance) / 115 : 0;
        node.style.setProperty('--repel-x', `${force ? (dx / (distance || 1)) * force * 24 : 0}px`);
        node.style.setProperty('--repel-y', `${force ? (dy / (distance || 1)) * force * 24 : 0}px`);
      });
      pointerFrame = 0;
    });
  }, { passive: true });

  $('#hero-monkey').addEventListener('click', () => {
    heroClicks += 1;
    const monkey = $('#hero-monkey');
    const speech = $('#hero-speech');
    if (heroClicks >= 5) {
      monkey.classList.add('is-offended');
      speech.textContent = CONFIG.offended;
      speech.classList.add('visible');
      $('#announcement').textContent = CONFIG.offended;
      window.setTimeout(() => monkey.classList.remove('is-offended'), 1300);
      window.setTimeout(() => speech.classList.remove('visible'), 2600);
      heroClicks = 0;
      return;
    }
    speech.textContent = CONFIG.monkeyNotes[(heroClicks - 1) % CONFIG.monkeyNotes.length];
    speech.classList.add('visible');
    window.setTimeout(() => speech.classList.remove('visible'), 1100);
    monkey.classList.remove('is-offended');
    dropBananas(1);
  });

  function dodgeNo() {
    const now = Date.now();
    if (now - lastNoAttempt < 420 || noCount >= 5) return;
    lastNoAttempt = now;
    noCount += 1;
    yesScale = Math.min(1.7, yesScale + 0.12);
    $('#yes-button').style.transform = `scale(${yesScale})`;
    const noButton = $('#no-button');
    noButton.textContent = CONFIG.noMessages[Math.min(noCount - 1, CONFIG.noMessages.length - 1)];
    if (noCount >= 5) {
      noButton.classList.add('vanishing');
      noButton.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => { noButton.hidden = true; }, 250);
    } else {
      const arena = $('#answer-arena').getBoundingClientRect();
      const button = noButton.getBoundingClientRect();
      const maxX = Math.max(18, Math.min(100, (arena.width - button.width) / 2 - 8));
      const dx = (Math.random() * 2 - 1) * maxX;
      const dy = (Math.random() * 2 - 1) * 20;
      noButton.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }

  const noButton = $('#no-button');
  noButton.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') dodgeNo(); });
  noButton.addEventListener('pointerdown', (event) => { if (event.pointerType !== 'mouse') dodgeNo(); });
  noButton.addEventListener('click', dodgeNo);

  function celebrate() {
    if (typeof window.confetti === 'function' && !reducedMotion) {
      window.confetti({ particleCount: 150, spread: 95, origin: { y: 0.62 }, colors: ['#ff6f91', '#ffd86e', '#ff9a64', '#fff4bd'] });
      window.setTimeout(() => window.confetti({ particleCount: 90, spread: 120, origin: { y: 0.55 }, shapes: ['circle', 'square'] }), 350);
    }
    dropBananas(24);
  }

  function sayYes() {
    $('#question').hidden = true;
    $('#finale').hidden = false;
    $('#finale').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    celebrate();
  }

  $('#yes-button').addEventListener('click', sayYes);
  $('#banana-rain-button').addEventListener('click', () => dropBananas(28));
  $('#replay-button').addEventListener('click', () => {
    $('#finale').hidden = true;
    $('#question').hidden = false;
    noCount = 0;
    yesScale = 1;
    const yes = $('#yes-button');
    yes.style.transform = '';
    noButton.hidden = false;
    noButton.classList.remove('vanishing');
    noButton.removeAttribute('aria-hidden');
    noButton.style.transform = '';
    noButton.textContent = CONFIG.no;
    $('#question').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    celebrate();
  });

  const sections = ['hero', 'letter', 'reasons', 'question'];
  const seen = new Set();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target.id)) {
          seen.add(entry.target.id);
          $('#monkey-count').textContent = String(5 + seen.size * 3);
          if (entry.target.id === 'letter') typeLetter();
        }
      });
    }, { threshold: 0.18 });
    sections.forEach((id) => observer.observe(document.getElementById(id)));
  } else {
    typeLetter();
  }

  fillPageCopy();
  createMonkeys();
})();
