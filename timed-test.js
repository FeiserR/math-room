import { topics, problems } from './content.js';
import { createAttempt, gradeAttempt, remainingSeconds } from './test-core.js';

export function createTestMode({ state, persist, refresh, showTest, esc, title }) {
  state.tests ??= [];
  state.activeTest ??= null;
  let resultId = null;
  let submitting = false;
  const formatTime = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const topicName = id => topics.find(t => t.id === id)?.name || 'All topics';
  const answered = attempt => Object.values(attempt.answers).filter(a => String(a).trim()).length;

  function finish() {
    if (!state.activeTest || submitting) return;
    submitting = true;
    const result = gradeAttempt(state.activeTest);
    if (!state.tests.some(t => t.id === result.id)) state.tests.push(result);
    state.activeTest = null;
    resultId = result.id;
    persist();
    submitting = false;
    document.querySelector('#submit-test-dialog')?.close();
    showTest();
  }

  function tick() {
    if (!state.activeTest) return;
    const seconds = remainingSeconds(state.activeTest);
    if (seconds === 0) { finish(); return; }
    const timer = document.querySelector('#test-timer');
    if (timer) {
      timer.textContent = formatTime(seconds);
      timer.closest('.test-clock').classList.toggle('urgent', seconds <= 60);
    }
  }
  setInterval(tick, 250);
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('focus', tick);

  function history() {
    return `<section class="panel test-history"><h2>Your test results</h2><p>Scores and answer reviews are saved in this browser.</p>${state.tests.length ? state.tests.slice().reverse().map(result => `<button class="test-history-row" data-test-result="${esc(result.id)}"><span><strong>${esc(topicName(result.topic))}</strong><small>${esc(new Date(result.completedAt).toLocaleString())} · ${formatTime(result.elapsedSeconds)} used</small></span><span class="test-history-score">${result.score}/${result.total} <small>${result.percentage}%</small></span><span>Review →</span></button>`).join('') : '<p class="test-empty">Your first test will appear here. Start whenever you feel ready.</p>'}</section>`;
  }

  function setup() {
    return `${title('PUT YOUR KNOWLEDGE TO WORK', 'A little challenge. A clearer picture.', 'Set a timer, give it your best, and see what to work on next.')}<div class="lesson-layout"><section class="panel test-setup"><span class="topic-icon green">◷</span><h2>Build your test</h2><form id="test-setup"><div class="test-field"><label for="test-topic">Choose a topic</label><select id="test-topic"><option value="all">All topics · 18 questions available</option>${topics.map(t => `<option value="${t.id}">${t.name} · 3 available</option>`).join('')}</select></div><div class="test-settings"><div class="test-field"><label for="test-count">Questions</label><select id="test-count"><option value="3">3 questions</option><option value="5">5 questions</option><option value="10" selected>10 questions</option><option value="18">All 18 questions</option></select></div><div class="test-field"><label for="test-minutes">Time limit</label><select id="test-minutes"><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15" selected>15 minutes</option><option value="30">30 minutes</option></select></div></div><button class="button primary" type="submit">Start timed test →</button></form></section><aside class="panel test-rules"><div class="eyebrow">HERE’S HOW IT WORKS</div><h2>Your own checkpoint</h2><ul><li>Questions are shuffled from your worksheet practice bank.</li><li>Enter numbers or fractions; symbolic questions use multiple choice.</li><li>Each correct answer earns 1 point. Wrong or blank answers earn 0.</li><li>Move between questions and edit answers before submitting.</li><li>Solutions appear after submission. When time runs out, your saved answers are submitted automatically.</li></ul><p>The timer keeps running if you leave or reload the page. Your answers save as you go.</p></aside></div>${history()}`;
  }

  function running() {
    const attempt = state.activeTest;
    const question = attempt.questions[attempt.index];
    const problem = problems.find(p => p.id === question.id);
    const topic = topics.find(t => t.id === problem.topic);
    const answer = attempt.answers[question.id] || '';
    return `${title('FOCUS ON ONE STEP AT A TIME', 'Your timed test', `${topicName(attempt.topic)} · ${attempt.questions.length} questions`, `<div class="test-clock"><span>Time remaining</span><strong id="test-timer" role="timer" aria-label="Time remaining">${formatTime(remainingSeconds(attempt))}</strong></div>`)}<div class="test-status"><span id="test-answer-count">${answered(attempt)} of ${attempt.questions.length} answered</span><span>Answers saved · 1 point each</span></div><div class="test-layout"><section class="panel test-question"><div class="problem-meta"><span class="pill ${topic.color}">${topic.name}</span><span>Question ${attempt.index + 1} of ${attempt.questions.length}</span></div><h2>${problem.title}</h2><p class="problem-prompt">${problem.prompt}</p>${question.options ? `<fieldset class="test-choices"><legend>Choose one answer</legend>${question.options.map((option, i) => `<label class="test-choice"><input type="radio" name="test-choice" value="${esc(option)}" ${answer === option ? 'checked' : ''}><span class="choice-letter">${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span></label>`).join('')}</fieldset><button id="test-clear" class="text-button">Clear answer</button>` : `<label for="test-answer">Your answer</label><input id="test-answer" type="text" autocomplete="off" spellcheck="false" value="${esc(answer)}" placeholder="Enter a number or fraction"><p class="test-input-note">Fractions such as 3/4 are accepted. Decimals are checked within 0.000001.</p>`}<div class="test-question-actions"><button class="button secondary" data-test-jump="${attempt.index - 1}" ${attempt.index === 0 ? 'disabled' : ''}>← Previous</button>${attempt.index < attempt.questions.length - 1 ? `<button class="button primary" data-test-jump="${attempt.index + 1}">Next question →</button>` : '<button class="button primary" data-test-submit>Finish test →</button>'}</div></section><aside class="panel test-navigator"><h3>Your questions</h3><p>Jump to any question before you submit.</p><div class="test-question-grid">${attempt.questions.map((q, i) => `<button data-test-jump="${i}" aria-label="Question ${i + 1}${String(attempt.answers[q.id] || '').trim() ? ', answered' : ', unanswered'}" ${i === attempt.index ? 'aria-current="step"' : ''} class="${i === attempt.index ? 'current' : ''} ${String(attempt.answers[q.id] || '').trim() ? 'answered' : ''}">${i + 1}</button>`).join('')}</div><p class="test-key"><span></span> Filled = answered</p><button class="button secondary full" data-test-submit>Submit test</button><p class="test-input-note">You can finish early. Unanswered questions count as 0 points.</p></aside></div>`;
  }

  function results(result) {
    const skipped = result.items.filter(item => item.skipped).length;
    return `${title(result.timedOut ? 'TIME’S UP — YOUR ANSWERS ARE SAVED' : 'TEST COMPLETE', 'Here’s how you did.', `${topicName(result.topic)} · ${esc(new Date(result.completedAt).toLocaleString())}`, '<button class="button secondary" id="test-new">New test →</button>')}<section class="panel test-result-summary"><div class="test-score-circle"><strong>${result.percentage}<span>%</span></strong><small>your score</small></div><div><h2>${result.score} out of ${result.total} correct</h2><p>${result.total - result.score - skipped} incorrect · ${skipped} unanswered · ${formatTime(result.elapsedSeconds)} of ${result.minutes} minutes used</p><p>Review your reasoning below, then return to practice where you need it.</p></div></section><div class="section-heading"><h2>Your answer review</h2><span class="muted">1 point per correct answer</span></div><div class="test-review-list">${result.items.map((item, i) => {const p = problems.find(p => p.id === item.id);return `<section class="panel test-review"><div class="problem-meta"><strong>Question ${i + 1} · ${p.title}</strong><span class="pill ${item.correct ? 'green' : 'peach'}">${item.correct ? 'Correct · 1 point' : item.skipped ? 'Unanswered · 0 points' : 'Incorrect · 0 points'}</span></div><p class="review-prompt">${p.prompt}</p><div class="test-answer-comparison"><div><small>Your answer</small><strong>${esc(item.answer || 'Not answered')}</strong></div><div><small>Correct answer</small><strong>${esc(p.answer)}</strong></div></div><details><summary>See the worked solution</summary><ol class="solution-steps">${p.steps.map(step => `<li>${step}</li>`).join('')}</ol></details></section>`;}).join('')}</div><button class="button secondary" id="test-history-back">← All test results</button>`;
  }

  function view() {
    if (state.activeTest) return running();
    const result = state.tests.find(t => t.id === resultId);
    return result ? results(result) : setup();
  }

  function saveAnswer(value) {
    const attempt = state.activeTest;
    if (!attempt) return;
    if (!remainingSeconds(attempt)) { finish(); return; }
    attempt.answers[attempt.questions[attempt.index].id] = value;
    persist();
    document.querySelector('#test-answer-count').textContent = `${answered(attempt)} of ${attempt.questions.length} answered`;
    const button = document.querySelector(`.test-question-grid [data-test-jump="${attempt.index}"]`);
    button.classList.toggle('answered', Boolean(value.trim()));
    button.setAttribute('aria-label', `Question ${attempt.index + 1}, ${value.trim() ? 'answered' : 'unanswered'}`);
  }

  function confirmSubmit() {
    if (!state.activeTest) return;
    if (!remainingSeconds(state.activeTest)) { finish(); return; }
    const left = state.activeTest.questions.length - answered(state.activeTest);
    const dialog = document.createElement('dialog');
    dialog.id = 'submit-test-dialog';
    dialog.className = 'test-submit-dialog panel';
    dialog.innerHTML = `<h2>Ready to submit?</h2><p>${left ? `${left} question${left === 1 ? ' is' : 's are'} unanswered and will score 0.` : 'You’ve answered every question.'} Your score and solutions will appear next.</p><p>The timer keeps running until you submit.</p><div class="test-question-actions"><button class="button secondary" id="test-keep-working">Keep working</button><button class="button primary" id="test-confirm-submit">Submit answers</button></div>`;
    document.body.append(dialog);
    dialog.onclose = () => dialog.remove();
    dialog.querySelector('#test-keep-working').onclick = () => dialog.close();
    dialog.querySelector('#test-confirm-submit').onclick = finish;
    dialog.showModal();
  }

  function bind() {
    const form = document.querySelector('#test-setup');
    if (form) {
      document.querySelector('#test-topic').onchange = event => {
        const count = document.querySelector('#test-count');
        for (const option of count.options) option.disabled = event.target.value !== 'all' && Number(option.value) > 3;
        if (event.target.value !== 'all') count.value = '3';
      };
      form.onsubmit = event => {
        event.preventDefault();
        state.activeTest = createAttempt({ topic: document.querySelector('#test-topic').value, count: Number(document.querySelector('#test-count').value), minutes: Number(document.querySelector('#test-minutes').value) });
        resultId = null;
        persist();
        refresh();
      };
    }
    document.querySelectorAll('[data-test-jump]').forEach(button => button.onclick = () => {
      if (!state.activeTest) return;
      if (!remainingSeconds(state.activeTest)) { finish(); return; }
      const index = Number(button.dataset.testJump);
      if (index < 0 || index >= state.activeTest.questions.length) return;
      state.activeTest.index = index;
      persist();refresh();
    });
    const input = document.querySelector('#test-answer');
    if (input) input.oninput = event => saveAnswer(event.target.value);
    document.querySelectorAll('[name="test-choice"]').forEach(input => input.onchange = event => saveAnswer(event.target.value));
    const clear = document.querySelector('#test-clear');
    if (clear) clear.onclick = () => {saveAnswer('');refresh();};
    document.querySelectorAll('[data-test-submit]').forEach(button => button.onclick = confirmSubmit);
    document.querySelectorAll('[data-test-result]').forEach(button => button.onclick = () => {resultId = button.dataset.testResult;refresh();});
    for (const id of ['test-new', 'test-history-back']) {
      const button = document.getElementById(id);
      if (button) button.onclick = () => {resultId = null;refresh();};
    }
  }
  return { view, bind, tick, history };
}
