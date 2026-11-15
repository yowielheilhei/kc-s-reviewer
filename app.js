const app = document.querySelector('#app');
const footerCount = document.querySelector('#footer-count');
const STORAGE = {
  settings: 'species-guesser-settings',
  bestChoice: 'species-guesser-best-choice',
  bestIdentify: 'species-guesser-best-identify',
  incorrect: 'species-guesser-incorrect'
};

const defaultSettings = { mode: 'choice', category: 'all', length: '10', theme: 'light' };
const savedSettings = JSON.parse(localStorage.getItem(STORAGE.settings) || 'null');
const state = {
  screen: 'home',
  settings: { ...defaultSettings, ...(savedSettings || {}) },
  quiz: null,
  studyCategory: 'all'
};

footerCount.textContent = `${QUESTION_BANK_SIZE} source images · local progress saved`;
if (state.settings.theme === 'dark') document.body.classList.add('dark');

function saveSettings() {
  localStorage.setItem(STORAGE.settings, JSON.stringify(state.settings));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function filteredSpecies(category = state.settings.category) {
  return category === 'all' ? SPECIES : SPECIES.filter((item) => item.category === category);
}

function filteredBank(category = state.settings.category) {
  return category === 'all' ? QUESTION_BANK : QUESTION_BANK.filter((item) => item.category === category);
}

function formatCategory(category) {
  return CATEGORY_META[category]?.label || CATEGORY_META.all.label;
}

function normalizeAnswer(value) {
  return String(value || '').trim().toLocaleLowerCase('fi-FI').replace(/\s+/g, ' ');
}

function answerMatches(item, value) {
  const candidate = normalizeAnswer(value);
  return [item.name, ...(item.aliases || [])].some((answer) => normalizeAnswer(answer) === candidate);
}

function bestForMode(mode) {
  return Number(localStorage.getItem(mode === 'choice' ? STORAGE.bestChoice : STORAGE.bestIdentify) || 0);
}

function persistBest(mode, score) {
  const key = mode === 'choice' ? STORAGE.bestChoice : STORAGE.bestIdentify;
  const previous = Number(localStorage.getItem(key) || 0);
  if (score > previous) localStorage.setItem(key, String(score));
  return Math.max(previous, score);
}

function sourceNote(item) {
  return `Source: ${escapeHtml(item.sourceFile)}, page ${item.page}`;
}

function setScreen(screen) {
  state.screen = screen;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
  app.focus({ preventScroll: true });
}

function render() {
  if (state.screen === 'home') renderHome();
  if (state.screen === 'quiz') renderQuiz();
  if (state.screen === 'results') renderResults();
  if (state.screen === 'study') renderStudy();
  if (state.screen === 'review') renderReview();
}

function homeModeCard(mode, icon, title, description) {
  return `<button class="mode-card ${state.settings.mode === mode ? 'active' : ''}" data-mode="${mode}">
    <span class="mode-icon" aria-hidden="true">${icon}</span>
    <span><h3>${title}</h3><p>${description}</p></span>
  </button>`;
}

function supportedLengthOptions() {
  const count = filteredBank().length;
  return [10, 20, 30].map((length) => `<option value="${length}" ${Number(state.settings.length) === length ? 'selected' : ''} ${count < length ? 'disabled' : ''}>${length} questions${count < length ? ` · only ${count} available` : ''}</option>`).join('')
    + `<option value="all" ${state.settings.length === 'all' ? 'selected' : ''}>All available · ${count}</option>`;
}

function renderHome() {
  const count = filteredBank().length;
  const savedWrong = JSON.parse(localStorage.getItem(STORAGE.incorrect) || '{}')[state.settings.mode] || [];
  app.innerHTML = `<section class="hero">
    <div class="hero-copy"><div class="eyebrow">Finnish species study lab</div><h1>See it.<br><span class="gradient-text">Name it.</span></h1><p>Learn to identify species, one picture at a time. A calm, focused quiz built from your four study materials.</p></div>
    <div class="hero-art" aria-hidden="true"><div class="hero-art-inner"><span class="hero-leaf">❧</span><span class="hero-bird">⌁</span><span class="hero-caption">look closer · remember more</span></div></div>
  </section>
  <section class="panel home-panel" aria-labelledby="start-heading">
    <div class="section-heading"><div><div class="eyebrow">Choose your practice</div><h2 id="start-heading">How do you want to play?</h2><p>Switch modes any time. Your best score is kept separately.</p></div><button class="ghost-button" data-action="study">Study first ↗</button></div>
    <div class="mode-grid">${homeModeCard('choice', '✦', 'Multiple choice', 'Choose the correct Finnish name from four options.')}${homeModeCard('identify', '⌕', 'Identification', 'Type the Finnish name and test your recall.')}</div>
    <div class="settings-row">
      <div class="field"><label for="category">Question bank</label><select id="category"><option value="all" ${state.settings.category === 'all' ? 'selected' : ''}>All species · mixed</option>${Object.entries(CATEGORY_META).filter(([key]) => key !== 'all').map(([key, meta]) => `<option value="${key}" ${state.settings.category === key ? 'selected' : ''}>${meta.label}</option>`).join('')}</select></div>
      <div class="field"><label for="length">Quiz length</label><select id="length">${supportedLengthOptions()}</select></div>
    </div>
    <div class="start-row"><div class="bank-note"><strong>${count}</strong> source images ready in this bank · <strong>+10</strong> per correct answer${savedWrong.length ? `<br><button class="ghost-button" data-action="practice-saved" style="margin-top:8px;padding:7px 10px;font-size:11px">Practice ${savedWrong.length} saved miss${savedWrong.length === 1 ? '' : 'es'} ↗</button>` : ''}</div><button class="primary-button" data-action="start">Start quiz <span aria-hidden="true">→</span></button></div>
  </section>`;
}

function createQuiz() {
  const pool = shuffle(filteredBank());
  const length = state.settings.length === 'all' ? pool.length : Math.min(Number(state.settings.length), pool.length);
  state.quiz = { mode: state.settings.mode, category: state.settings.category, questions: pool.slice(0, length), index: 0, score: 0, correct: 0, incorrect: 0, skipped: 0, hints: 0, hintOpen: false, hintUsed: false, answered: false, missingImage: false, selectedChoice: null, typedAnswer: '', wrongItems: [] };
  setScreen('quiz');
}

function getDistractors(item) {
  const baseId = item.baseId || item.id;
  const sameCategory = filteredSpecies(item.category).filter((candidate) => candidate.id !== baseId);
  const broader = SPECIES.filter((candidate) => candidate.id !== baseId && candidate.category !== item.category);
  return shuffle([...sameCategory, ...broader]).slice(0, 3);
}

function currentItem() { return state.quiz.questions[state.quiz.index]; }

function renderQuiz() {
  const quiz = state.quiz;
  const item = currentItem();
  if (!item) return setScreen('results');
  const image = item.images[quiz.index % item.images.length];
  const progress = ((quiz.index) / quiz.questions.length) * 100;
  const options = quiz.mode === 'choice' ? shuffle([item, ...getDistractors(item)]) : [];
  if (!quiz.currentOptions || quiz.currentItemId !== item.id) { quiz.currentOptions = options; quiz.currentItemId = item.id; }
  const feedback = quiz.answered ? `<div class="feedback ${quiz.lastCorrect ? 'correct' : quiz.lastSkipped ? '' : 'incorrect'}" role="status"><div class="feedback-title">${quiz.lastSkipped ? 'Skipped — keep going.' : quiz.lastCorrect ? `Correct! +${quiz.lastPoints}` : 'Not quite.'}</div><div class="feedback-detail">${quiz.lastCorrect ? 'Nice recognition.' : `Correct answer: <strong>${escapeHtml(item.name)}</strong>`}${quiz.hintUsed && quiz.lastCorrect ? ' · Hint used' : ''}</div></div>` : '';
  const choices = quiz.mode === 'choice' ? `<div class="choice-grid" role="group" aria-label="Answer choices">${quiz.currentOptions.map((option, index) => `<button class="choice-button ${quiz.answered && option.id === item.id ? 'correct' : ''} ${quiz.answered && quiz.selectedChoice === option.id && option.id !== item.id ? 'incorrect' : ''} ${!quiz.answered && quiz.selectedChoice === option.id ? 'selected' : ''}" data-choice="${option.id}" ${quiz.answered ? 'disabled' : ''}><span class="choice-letter">${String.fromCharCode(65 + index)}</span> ${escapeHtml(option.name)}</button>`).join('')}</div>` : `<form class="answer-form" id="answer-form"><input id="answer-input" type="text" autocomplete="off" spellcheck="false" placeholder="Type the Finnish species name" value="${escapeHtml(quiz.typedAnswer)}" ${quiz.answered ? 'disabled' : ''} aria-label="Finnish species name"><button class="primary-button" type="submit" ${quiz.answered ? 'disabled' : ''}>Submit answer</button></form>`;
  app.innerHTML = `<section class="quiz-wrap">
    <div class="quiz-top"><div class="quiz-top-left"><button class="ghost-button" data-action="home">← Home</button><span class="quiz-label">${escapeHtml(CATEGORY_META[quiz.category]?.short || 'Mixed set')} · ${quiz.mode === 'choice' ? 'Multiple choice' : 'Identification'}</span></div><div class="score-chip">Score ${quiz.score}</div></div>
    <div class="question-meta"><span>Question ${quiz.index + 1} of ${quiz.questions.length}</span><span>${quiz.correct} correct</span></div><div class="progress-track" aria-label="Quiz progress"><div class="progress-value" style="width:${Math.max(progress, 4)}%"></div></div>
    <div class="panel quiz-card"><div class="quiz-image-shell"><img class="quiz-image" src="${image}" alt="Unidentified species photograph" data-image-item="${item.id}"><button class="hint-button" data-action="hint" aria-label="Show optional hint" title="Optional hint">💡</button>${quiz.hintOpen ? `<div class="hint-popover" role="dialog"><strong>Small clue</strong>${escapeHtml(item.hint)}<button class="ghost-button" data-action="dismiss-hint" style="margin-top:9px;padding:6px 9px;font-size:11px">Dismiss</button></div>` : ''}</div>
      <div class="quiz-content"><div class="eyebrow">What species is shown?</div><h1>${quiz.mode === 'choice' ? 'Choose the correct name.' : 'Identify this species.'}</h1>${choices}${feedback}<div class="quiz-actions"><button class="ghost-button" data-action="skip" ${quiz.answered ? 'disabled' : ''}>Skip</button><div class="right">${quiz.answered ? '<button class="primary-button" data-action="next">Next question →</button>' : '<button class="secondary-button" data-action="hint">Use hint</button>'}</div></div><div class="source-note">${sourceNote(item)}</div></div>
    </div>
  </section>`;
  const imageElement = app.querySelector('.quiz-image');
  if (imageElement) imageElement.addEventListener('error', () => { quiz.missingImage = true; imageElement.replaceWith(Object.assign(document.createElement('div'), { className: 'image-fallback', innerHTML: '<strong>Photo unavailable</strong><br>Skip this card without losing a point.' })); });
  const input = app.querySelector('#answer-input');
  if (input && !quiz.answered) { input.focus(); input.addEventListener('input', (event) => { quiz.typedAnswer = event.target.value; }); }
}

function submitAnswer(value = state.quiz.selectedChoice) {
  const quiz = state.quiz;
  if (!quiz || quiz.answered) return;
  const item = currentItem();
  const correct = quiz.mode === 'choice' ? value === item.id : answerMatches(item, value);
  quiz.answered = true;
  quiz.lastCorrect = correct;
  quiz.lastSkipped = false;
  quiz.lastPoints = correct ? (quiz.hintUsed ? 8 : 10) : 0;
  if (correct) { quiz.correct += 1; quiz.score += quiz.lastPoints; }
  else { quiz.incorrect += 1; quiz.wrongItems.push(item); }
  renderQuiz();
}

function skipQuestion() {
  const quiz = state.quiz;
  if (!quiz || quiz.answered) return;
  quiz.answered = true;
  quiz.lastSkipped = true;
  quiz.lastCorrect = false;
  quiz.lastPoints = 0;
  quiz.skipped += 1;
  renderQuiz();
}

function nextQuestion() {
  const quiz = state.quiz;
  if (!quiz?.answered) return;
  if (quiz.index >= quiz.questions.length - 1) return finishQuiz();
  quiz.index += 1;
  quiz.answered = false;
  quiz.hintOpen = false;
  quiz.hintUsed = false;
  quiz.selectedChoice = null;
  quiz.typedAnswer = '';
  quiz.missingImage = false;
  quiz.currentItemId = null;
  renderQuiz();
}

function finishQuiz() {
  const quiz = state.quiz;
  const best = persistBest(quiz.mode, quiz.score);
  const incorrect = JSON.parse(localStorage.getItem(STORAGE.incorrect) || '{}');
  incorrect[quiz.mode] = [...new Set([...(incorrect[quiz.mode] || []), ...quiz.wrongItems.map((item) => item.id)])];
  localStorage.setItem(STORAGE.incorrect, JSON.stringify(incorrect));
  quiz.best = best;
  setScreen('results');
}

function renderResults() {
  const quiz = state.quiz;
  const accuracy = quiz.questions.length ? Math.round((quiz.correct / quiz.questions.length) * 100) : 0;
  app.innerHTML = `<section class="results-wrap"><div class="panel results-card"><div class="results-badge">✦</div><div class="eyebrow">Session complete</div><h1>Nice work.</h1><p>${formatCategory(quiz.category)} · ${quiz.mode === 'choice' ? 'Multiple choice' : 'Identification'}</p><div class="stat-grid"><div class="stat"><strong>${quiz.score}</strong><span>score</span></div><div class="stat"><strong>${quiz.correct}</strong><span>correct</span></div><div class="stat"><strong>${quiz.incorrect}</strong><span>incorrect</span></div><div class="stat"><strong>${accuracy}%</strong><span>accuracy</span></div></div><div class="best-score">Best score for this mode: <strong>${quiz.best}</strong> · Hints used: <strong>${quiz.hints}</strong> · Skipped: <strong>${quiz.skipped}</strong></div><div class="button-row" style="justify-content:center"><button class="primary-button" data-action="again">Play again</button><button class="secondary-button" data-action="review">Review incorrect${quiz.wrongItems.length ? ` (${quiz.wrongItems.length})` : ''}</button><button class="ghost-button" data-action="home">Return home</button></div>${quiz.wrongItems.length ? `<div class="review-list">${quiz.wrongItems.map((item) => `<div class="review-item"><img src="${item.images[0]}" alt=""><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.scientific)}</p></div><button class="secondary-button" data-study-id="${item.id}">Study card</button></div>`).join('')}</div>` : ''}</div></section>`;
}

function renderStudy() {
  const items = filteredSpecies(state.studyCategory);
  app.innerHTML = `<section class="study-wrap"><div class="study-heading"><div><div class="eyebrow">Quiet review mode</div><h1>Study the set.</h1><p>Browse the source photographs with their Finnish names before you quiz yourself.</p></div><button class="ghost-button" data-action="home">← Back home</button></div><div class="study-filters"><button class="filter-chip ${state.studyCategory === 'all' ? 'active' : ''}" data-study-category="all">All · ${SPECIES.length}</button>${Object.entries(CATEGORY_META).filter(([key]) => key !== 'all').map(([key, meta]) => `<button class="filter-chip ${state.studyCategory === key ? 'active' : ''}" data-study-category="${key}">${meta.short} · ${filteredSpecies(key).length}</button>`).join('')}</div><div class="study-grid" style="margin-top:18px">${items.map((item) => `<article class="study-card"><img src="${item.images[0]}" alt="${escapeHtml(item.name)}"><div class="study-card-body"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.scientific)}</p><small>${escapeHtml(CATEGORY_META[item.category].short)} · PDF page ${item.page}</small></div></article>`).join('')}</div></section>`;
}

function renderReview() {
  const wrongItems = state.quiz?.wrongItems || [];
  app.innerHTML = `<section class="study-wrap"><div class="study-heading"><div><div class="eyebrow">Targeted practice</div><h1>Try the misses again.</h1><p>Only the species you missed in the last quiz are in this round.</p></div><button class="ghost-button" data-action="results">← Results</button></div>${wrongItems.length ? `<div class="panel" style="padding:20px"><div class="study-grid">${wrongItems.map((item) => `<article class="study-card"><img src="${item.images[0]}" alt="Unidentified species photograph"><div class="study-card-body"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.scientific)}</p><button class="secondary-button" data-review-id="${item.id}">Practice this</button></div></article>`).join('')}</div><div class="button-row" style="margin-top:18px"><button class="primary-button" data-action="practice-all">Practice all misses</button></div></div>` : '<div class="empty-state">No incorrect answers in this session. You can replay with a new randomized order.</div>'}</section>`;
}

function practiceItems(items) {
  const quiz = state.quiz || { mode: state.settings.mode };
  state.settings.mode = quiz.mode;
  state.settings.category = 'all';
  state.settings.length = String(items.length);
  saveSettings();
  state.quiz = { mode: quiz.mode, category: 'all', questions: shuffle(items), index: 0, score: 0, correct: 0, incorrect: 0, skipped: 0, hints: 0, hintOpen: false, hintUsed: false, answered: false, missingImage: false, selectedChoice: null, typedAnswer: '', wrongItems: [] };
  setScreen('quiz');
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.mode) { state.settings.mode = target.dataset.mode; saveSettings(); renderHome(); return; }
  if (target.dataset.studyCategory) { state.studyCategory = target.dataset.studyCategory; renderStudy(); return; }
  if (target.dataset.choice) { state.quiz.selectedChoice = target.dataset.choice; renderQuiz(); return; }
  if (target.dataset.studyId) { const item = QUESTION_BANK.find((candidate) => candidate.id === target.dataset.studyId) || SPECIES.find((candidate) => candidate.id === target.dataset.studyId); state.studyCategory = item?.category || 'all'; setScreen('study'); return; }
  if (target.dataset.reviewId) { const item = QUESTION_BANK.find((candidate) => candidate.id === target.dataset.reviewId) || SPECIES.find((candidate) => candidate.id === target.dataset.reviewId); if (item) practiceItems([item]); return; }
  const action = target.dataset.action;
  if (action === 'home') { state.quiz = null; setScreen('home'); }
  if (action === 'study') { state.studyCategory = 'all'; setScreen('study'); }
  if (action === 'theme') { state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'; document.body.classList.toggle('dark', state.settings.theme === 'dark'); saveSettings(); }
  if (action === 'start') createQuiz();
  if (action === 'hint' && state.quiz && !state.quiz.answered) { state.quiz.hintUsed = true; state.quiz.hintOpen = !state.quiz.hintOpen; state.quiz.hints += state.quiz.hintOpen ? 1 : 0; renderQuiz(); }
  if (action === 'dismiss-hint' && state.quiz) { state.quiz.hintOpen = false; renderQuiz(); }
  if (action === 'submit') submitAnswer();
  if (action === 'skip') skipQuestion();
  if (action === 'next') nextQuestion();
  if (action === 'again') createQuiz();
  if (action === 'review') setScreen('review');
  if (action === 'results') setScreen('results');
  if (action === 'practice-all') practiceItems(state.quiz.wrongItems);
  if (action === 'practice-saved') {
    const saved = JSON.parse(localStorage.getItem(STORAGE.incorrect) || '{}')[state.settings.mode] || [];
    const items = saved.map((id) => QUESTION_BANK.find((item) => item.id === id) || SPECIES.find((item) => item.id === id)).filter(Boolean);
    if (items.length) practiceItems(items);
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'category') { state.settings.category = event.target.value; if (state.settings.length !== 'all' && Number(state.settings.length) > filteredBank().length) state.settings.length = 'all'; saveSettings(); renderHome(); }
  if (event.target.id === 'length') { state.settings.length = event.target.value; saveSettings(); }
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'answer-form') return;
  event.preventDefault();
  submitAnswer(state.quiz.typedAnswer);
});

document.addEventListener('keydown', (event) => {
  if (state.screen !== 'quiz' || !state.quiz) return;
  if (event.key === 'Escape') { state.quiz.hintOpen = false; renderQuiz(); return; }
  if (state.quiz.mode === 'choice' && !state.quiz.answered && /^[1-4]$/.test(event.key)) { const choice = state.quiz.currentOptions[Number(event.key) - 1]; if (choice) { state.quiz.selectedChoice = choice.id; renderQuiz(); } }
  if (event.key === 'Enter' && state.quiz.mode === 'choice' && !state.quiz.answered && state.quiz.selectedChoice) submitAnswer(state.quiz.selectedChoice);
  if (event.key === 'Enter' && state.quiz.answered) nextQuestion();
});

render();
