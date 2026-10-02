import { flashcards, flashcardDecks } from './flashcard-content.js';

export function cardDue(record, now = Date.now()) {
  return Boolean(record && record.due <= now);
}

function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function newFlashSession(kind, records = {}, now = Date.now(), random = Math.random) {
  const deck = flashcardDecks.find(d => d.id === kind);
  let pool = deck ? flashcards.filter(c => c.deck === kind)
    : kind === 'mixed' ? flashcards
    : kind === 'review' ? flashcards.filter(c => cardDue(records[c.id], now))
    : flashcards.filter(c => c.topic === kind);
  if (!pool.length) return null;
  if (!deck) {
    const rank = card => cardDue(records[card.id], now) ? 0 : !records[card.id] ? 1 : 2;
    pool = shuffle(pool, random).sort((a, b) => rank(a) - rank(b));
  }
  const selected = pool.slice(0, deck ? pool.length : 10).map(c => c.id);
  return { kind, selected, pending: [...selected], firstRatings: {}, repeated: {}, attempts: 0, startedAt: now };
}

export function rateFlashcard(session, records, rating, now = Date.now()) {
  if (!session?.pending.length || !['again', 'got'].includes(rating)) return null;
  const id = session.pending.shift();
  const previous = records[id];
  const streak = rating === 'got' ? Math.min((previous?.streak || 0) + 1, 5) : 0;
  const delay = rating === 'again' ? 10 * 60000 : [0, 1, 3, 7, 14, 30][streak] * 86400000;
  records[id] = { seen: (previous?.seen || 0) + 1, streak, last: now, due: now + delay, rating };
  session.firstRatings[id] ??= rating;
  session.attempts++;
  // A miss comes back after two other cards, once per session, keeping sessions finite.
  if (rating === 'again' && !session.repeated[id]) {
    session.pending.splice(Math.min(2, session.pending.length), 0, id);
    session.repeated[id] = true;
  }
  if (!session.pending.length) session.completedAt = now;
  return { id, rating, at: now };
}
