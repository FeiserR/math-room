import { problems } from './content.js';

const alternatives = {
  a3: ['(x² − 4)(x² + 9)', '(x + 1)(x − 1)(x + 6)(x − 6)', '(x² − 6)(x² − 7)'],
  d1: ['6x² − 4x', '2x² − 4', '6x³ − 4'],
  i1: ['6x³ + C', '3x³ + C', '12x + C'],
  i2: ['7√7 / 6', '14√7 / 3', '16 / 3'],
  e3: ['(5, 4) only', '(3, 1) only', '(4, 3) and (2, 1)']
};

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createAttempt({ topic = 'all', count = 10, minutes = 15 }, now = Date.now(), random = Math.random) {
  const pool = problems.filter(p => topic === 'all' || p.topic === topic);
  if (!pool.length || ![3, 5, 10, 18].includes(count) || ![5, 10, 15, 30].includes(minutes)) throw new Error('Choose a valid test setup.');
  return {
    id: `${now}-${random().toString(36).slice(2)}`, topic,
    startedAt: now, deadline: now + minutes * 60000, minutes, index: 0, answers: {},
    questions: shuffle(pool, random).slice(0, count).map(p => ({
      id: p.id,
      options: p.mode === 'self' ? shuffle([p.answer, ...alternatives[p.id]], random) : null
    }))
  };
}

export function remainingSeconds(attempt, now = Date.now()) {
  return Math.max(0, Math.ceil((attempt.deadline - now) / 1000));
}

export function numericValue(value) {
  const text = String(value ?? '').trim().replace(/−/g, '-');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(text)) return null;
  const [a, b = 1] = text.split('/').map(Number);
  return b !== 0 && Number.isFinite(a / b) ? a / b : null;
}

export function gradeAttempt(attempt, now = Date.now()) {
  const items = attempt.questions.map(q => {
    const problem = problems.find(p => p.id === q.id);
    const answer = String(attempt.answers[q.id] ?? '').trim();
    const value = numericValue(answer);
    const correct = problem.mode === 'self'
      ? q.options.includes(answer) && answer === problem.answer
      : value !== null && Math.abs(value - numericValue(problem.answer)) <= 0.000001;
    return { id: q.id, answer, correct, skipped: answer === '' };
  });
  const score = items.filter(item => item.correct).length;
  return {
    id: attempt.id, topic: attempt.topic, minutes: attempt.minutes,
    completedAt: now, timedOut: now >= attempt.deadline,
    elapsedSeconds: Math.max(0, Math.floor((Math.min(now, attempt.deadline) - attempt.startedAt) / 1000)),
    score, total: items.length, percentage: Math.round(score / items.length * 100), items
  };
}
