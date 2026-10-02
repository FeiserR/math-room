import { flashcardTopics as topics } from './flashcard-content.js';
import { flashcards, flashcardDecks } from './flashcard-content.js';
import { cardDue, newFlashSession, rateFlashcard } from './flashcard-core.js';

export function createFlashcards({ state, persist, refresh, esc, title, openPhoto }) {
  state.cardRecords ??= {};
  state.cardActivity ??= [];
  let studying = Boolean(state.flashSession?.pending?.length);
  let revealed = false;
  let filter = 'all';
  const cardById = id => flashcards.find(card => card.id === id);
  const topicById = id => topics.find(topic => topic.id === id);
  const dueCount = () => flashcards.filter(card => cardDue(state.cardRecords[card.id])).length;
  const seenCount = () => flashcards.filter(card => state.cardRecords[card.id]).length;
  const topicStats = id => {
    const cards = flashcards.filter(card => card.topic === id);
    return { total: cards.length, seen: cards.filter(card => state.cardRecords[card.id]).length };
  };

  function start(kind) {
    const session = newFlashSession(kind, state.cardRecords);
    if (!session) return;
    state.flashSession = session;
    studying = true;
    revealed = false;
    persist();refresh();
  }

  function reveal() {
    if (!studying || revealed || !state.flashSession?.pending?.length) return;
    revealed = true;
    refresh();
    // Keep keyboard users at the card without requiring another scroll or click.
    document.querySelector('[data-flash-rate="got"]')?.focus({ preventScroll: true });
  }

  function rate(rating) {
    if (!studying || !revealed) return;
    const event = rateFlashcard(state.flashSession, state.cardRecords, rating);
    if (!event) return;
    state.cardActivity.push(event);
    revealed = false;
    persist();refresh();
    document.querySelector('#flash-flip')?.focus({ preventScroll: true });
  }

  function source(card) {
    if (card.source.kind === 'online') return `<details class="flash-source"><summary>Problem source</summary><p>${esc(card.source.label)} · Rewritten as short step cards.</p><a href="${esc(card.source.url)}" target="_blank" rel="noopener noreferrer">${esc(card.source.title)} ↗</a></details>`;
    return `<details class="flash-source"><summary>Problem source</summary><button class="text-button" data-flash-photo="${card.source.file}">${esc(card.source.label)} · Open original ↗</button></details>`;
  }

  function landing() {
    const session = state.flashSession;
    const decks = flashcardDecks.filter(deck => filter === 'all' || deck.topic === filter);
    return `${title('SMALL CARDS. QUICK RECALL.', 'Just the next step.', 'Look at the equation. Recall one move. Flip and keep going.')}<section class="flash-intro"><div><span class="pill green">${flashcards.length} small cards · ${topics.length} topics</span><h2>A few minutes is enough.</h2><p>No typing needed. Each back shows one answer and one short reason.</p><div class="flash-start-actions"><button class="button primary" data-flash-start="mixed">Quick 10 cards →</button><button class="button secondary" data-flash-start="review" ${dueCount() ? '' : 'disabled'}>Review due (${dueCount()})</button></div></div><div class="flash-example" aria-label="Example flashcard"><small>GIVEN</small><div>x² − 4 = 0</div><p>What’s the next step?</p><span>Factor the difference of squares.</span></div></section>${session?.pending?.length ? `<div class="flash-resume"><span>You have ${session.pending.length} cards left in your saved session.</span><button class="button secondary" id="flash-resume">Resume →</button></div>` : ''}<div class="section-heading flash-deck-heading"><div><h2>Follow a problem, four small steps</h2><p>Choose a set below, or use Quick 10 to mix independent cards.</p></div><label class="sr-only" for="flash-topic">Filter by topic</label><select id="flash-topic"><option value="all">All topics</option>${topics.map(t => `<option value="${t.id}" ${filter === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select></div><div class="flash-deck-grid">${decks.map(deck => {const topic = topicById(deck.topic);const cards = flashcards.filter(c => c.deck === deck.id);const seen = cards.filter(c => state.cardRecords[c.id]).length;return `<button class="flash-deck" data-flash-start="${deck.id}"><span class="topic-icon ${topic.color}">${topic.icon}</span><span><small>${topic.name} · ${deck.source.kind === 'online' ? 'Online example' : 'Your worksheet'}</small><strong>${deck.title}</strong><em>4 cards · ${seen}/4 explored</em></span><span aria-hidden="true">→</span></button>`;}).join('')}</div><p class="flash-footnote">24 cards use related OpenStax and LibreTexts examples; ${flashcards.filter(c => c.source.kind === 'worksheet').length} break down your worksheets. Sources are linked on card backs. “Got it” records your own recall, not an automatic score.</p>`;
  }

  function sessionView() {
    const session = state.flashSession;
    if (!session.pending.length) return complete();
    const card = cardById(session.pending[0]);
    const topic = topicById(card.topic);
    const done = Object.keys(session.firstRatings).length;
    const repeat = card.id in session.firstRatings;
    return `<div class="flash-session-top"><button class="text-button" id="flash-exit">← Save & exit</button><span>${done}/${session.selected.length} explored${repeat ? ' · Another try' : ''}</span><span class="pill ${topic.color}">${topic.name}</span></div><div class="flash-session-track"><i style="width:${done / session.selected.length * 100}%"></i></div><div class="flash-stage"><div class="flash-card ${revealed ? 'is-revealed' : ''}" data-flash-id="${card.id}"><div class="flash-card-heading"><span>${esc(card.title)}</span><small>Step ${card.step} / ${card.steps}</small></div><div class="flash-given-label">GIVEN</div><div class="flash-equation">${esc(card.given)}</div><h1 class="flash-prompt">${esc(card.prompt)}</h1>${revealed ? `<div class="flash-answer" role="status"><span>THE NEXT STEP</span><strong>${esc(card.answer)}</strong><p>${esc(card.why)}</p></div>` : '<div class="flash-recall-space"><span>Say it in your head.</span><button class="button primary" id="flash-flip">Show next step <kbd>Space</kbd></button></div>'}</div>${revealed ? `<div class="flash-ratings"><button data-flash-rate="again" class="button secondary"><span><kbd>1</kbd> Again</span><small>Bring this card back</small></button><button data-flash-rate="got" class="button primary"><span><kbd>2</kbd> Got it</span><small>Schedule a later review</small></button></div>${source(card)}` : '<p class="flash-key-hint">One small answer. No full solution to memorize.</p>'}</div>`;
  }

  function complete() {
    const session = state.flashSession;
    const recalled = Object.values(session.firstRatings).filter(r => r === 'got').length;
    const misses = session.selected.filter(id => session.firstRatings[id] === 'again');
    return `${title('A FEW SMALL STEPS FORWARD', 'That’s a set.', 'Your card progress is saved.')}<section class="panel flash-complete"><span class="completion-icon">✓</span><h2>${recalled} / ${session.selected.length} recalled on the first try</h2><p>${session.attempts} flips reviewed · ${misses.length} cards to revisit</p><div class="flash-start-actions"><button class="button primary" data-flash-start="mixed">Another 10 cards →</button><button class="button secondary" id="flash-exit">Choose a set</button></div>${misses.length ? `<details><summary>Cards to revisit (${misses.length})</summary>${misses.map(id => {const card = cardById(id);return `<p>${esc(card.title)} · Step ${card.step}: ${esc(card.prompt)}</p>`;}).join('')}</details>` : ''}</section>`;
  }

  function progress() {
    return `<section class="panel flash-progress"><h2>Flashcard recall</h2><p>${seenCount()} of ${flashcards.length} cards explored · ${dueCount()} due for review</p>${topics.map(topic => {const stats = topicStats(topic.id);return `<div class="progress-row"><span class="topic-icon ${topic.color}">${topic.icon}</span><div><strong>${topic.name}</strong><div class="progress-track"><i style="width:${stats.seen / stats.total * 100}%"></i></div><small>${stats.seen} / ${stats.total} cards explored</small></div><button class="text-button" data-flash-start="${topic.id}">Study →</button></div>`;}).join('')}</section>`;
  }

  function bind() {
    document.querySelectorAll('[data-flash-start]').forEach(button => button.onclick = () => start(button.dataset.flashStart));
    const flip = document.querySelector('#flash-flip');if (flip) flip.onclick = reveal;
    document.querySelectorAll('[data-flash-rate]').forEach(button => button.onclick = () => rate(button.dataset.flashRate));
    const exit = document.querySelector('#flash-exit');if (exit) exit.onclick = () => {studying = false;revealed = false;refresh();};
    const resume = document.querySelector('#flash-resume');if (resume) resume.onclick = () => {studying = true;revealed = false;refresh();};
    const select = document.querySelector('#flash-topic');if (select) select.onchange = event => {filter = event.target.value;refresh();};
    document.querySelectorAll('[data-flash-photo]').forEach(button => button.onclick = () => openPhoto(button.dataset.flashPhoto));
  }

  document.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || !document.querySelector('.flash-card') || document.querySelector('dialog[open]')) return;
    if (event.target.closest('input, textarea, select, a, summary, [contenteditable]')) return;
    if (event.code === 'Space' && !revealed) {event.preventDefault();reveal();}
    else if (revealed && ['1', '2'].includes(event.key)) {event.preventDefault();rate(event.key === '1' ? 'again' : 'got');}
  });

  return { start, bind, view: () => studying && state.flashSession ? sessionView() : landing(), progress, dueCount, seenCount, topicStats, total: flashcards.length };
}
