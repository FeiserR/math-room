import { topics } from './content.js';
import { additionalTopics, additionalDecks } from './new-worksheet-content.js';
export const flashcardTopics = [...topics, ...additionalTopics];
import { flashcardSources } from './flashcard-sources.js';

// Each row is [given information, one question, one answer, one short reason].
// Published examples are independently rewritten as next-step prompts, not copied solutions.
const worksheet = (file, question) => ({ kind: 'worksheet', file, label: `Your worksheet · Question ${question}` });
const online = (key, example) => ({ kind: 'online', ...flashcardSources[key], label: example });
export const flashcardDecks = [
  { id: 'gcd-factors', topic: 'numbers', title: 'Keep the common factors', source: worksheet('1000060778.jpg', '1 (1)'), steps: [
    ['90 = 2 × 3² × 5\n210 = 2 × 3 × 5 × 7', 'Which primes belong in their GCD?', '2, 3, and 5', 'Keep only the primes that appear in both numbers.'],
    ['GCD of 90 and 210\nThe powers of 3 are 3² and 3¹.', 'Which power of 3 do you keep?', '3¹', 'For a GCD, choose the smaller exponent.'],
    ['GCD of 90 and 210\nCommon factors: 2, 3, 5', 'Multiply the shared factors.', '2 × 3 × 5 = 30', 'Their product is the greatest common divisor.'],
    ['gcd(90, 210) = 30', 'Set up their LCM using the GCD.', '(90 × 210) / 30', 'For positive integers, GCD × LCM equals their product.']
  ]},
  { id: 'divisor-choices', topic: 'numbers', title: 'Count divisor choices', source: worksheet('1000060778.jpg', '3'), steps: [
    ['504 = 2³ × 3² × 7¹', 'How many exponent choices does the factor 2 have?', '4 choices: 0, 1, 2, 3', 'Include exponent zero.'],
    ['504 = 2³ × 3² × 7¹', 'How many exponent choices does the factor 3 have?', '3 choices: 0, 1, 2', 'An exponent from zero through two gives three choices.'],
    ['504 = 2³ × 3² × 7¹', 'How many exponent choices does the factor 7 have?', '2 choices: 0, 1', 'Either omit 7 or include it once.'],
    ['Divisors of 504\nExponent choices: 4, 3, and 2', 'Combine the independent choices.', '4 × 3 × 2 = 24 divisors', 'Multiply the number of choices for each prime.']
  ]},
  { id: 'online-euclid', topic: 'numbers', title: 'Use the remainder', source: online('gcd', 'Exercise 1: gcd(48, 360)'), steps: [
    ['Find gcd(48, 360)\n360 = 7 × 48 + r', 'What remainder replaces r?', 'r = 24', 'Subtract 336 from 360.'],
    ['360 = 7 × 48 + 24', 'Which smaller GCD do you find next?', 'gcd(48, 24)', 'Replace the larger number with the remainder.'],
    ['Find gcd(48, 24)\n48 = 2 × 24 + r', 'What is the new remainder?', 'r = 0', '24 divides 48 exactly.'],
    ['360 = 7 × 48 + 24\n48 = 2 × 24 + 0', 'Which number is the GCD?', '24', 'Stop at zero; take the previous nonzero remainder.']
  ]},
  { id: 'quadratic-vertex', topic: 'algebra', title: 'Find the vertex', source: worksheet('1000060782.jpg', '5 (1)'), steps: [
    ['y = −x² + 6x − 4', 'Factor −1 out of the two x terms.', 'y = −(x² − 6x) − 4', 'Keep the constant outside for now.'],
    ['x² − 6x', 'What number completes this square?', '9', 'Half of −6 is −3; square it.'],
    ['y = −[(x − 3)² − 9] − 4', 'Simplify the constants.', 'y = −(x − 3)² + 5', 'The outer minus turns −9 into +9.'],
    ['y = −(x − 3)² + 5\n−1 ≤ x ≤ 4', 'At what x does the maximum occur?', 'x = 3', 'The squared term is zero there, inside the interval.']
  ]},
  { id: 'quartic-substitution', topic: 'algebra', title: 'Treat x² as one piece', source: worksheet('1000060782.jpg', '1 (3)'), steps: [
    ['Factor x⁴ − 13x² + 36', 'What substitution makes this a quadratic?', 'u = x²', 'Then x⁴ becomes u².'],
    ['u² − 13u + 36', 'Which two numbers multiply to 36 and add to −13?', '−4 and −9', 'These numbers determine the two factors.'],
    ['(u − 4)(u − 9)\nu = x²', 'Replace u with x².', '(x² − 4)(x² − 9)', 'Return to the original variable.'],
    ['(x² − 4)(x² − 9)', 'Factor just x² − 4.', '(x − 2)(x + 2)', 'Use the difference of two squares.']
  ]},
  { id: 'online-factor', topic: 'algebra', title: 'Turn factors into roots', source: online('algebra', 'Example 1: x² + x − 6 = 0'), steps: [
    ['x² + x − 6 = 0', 'Which pair multiplies to −6 and adds to 1?', '3 and −2', 'Match the constant and the coefficient of x.'],
    ['x² + x − 6 = 0\nUse the pair 3 and −2.', 'Write the equation in factored form.', '(x + 3)(x − 2) = 0', 'Use one number in each factor.'],
    ['(x + 3)(x − 2) = 0', 'What equations do the factors give?', 'x + 3 = 0 or x − 2 = 0', 'A product is zero when at least one factor is zero.'],
    ['x + 3 = 0', 'Isolate x.', 'x = −3', 'Subtract 3 from both sides.']
  ]},
  { id: 'power-rule', topic: 'derivatives', title: 'Differentiate one term', source: worksheet('1000060777.jpg', '1 (1)'), steps: [
    ['Differentiate 2x³.', 'Multiply the coefficient by the exponent.', '2 × 3 = 6', 'The old exponent becomes a multiplier.'],
    ['d/dx (2x³) = 6xᵏ', 'What is the new exponent k?', 'k = 2', 'Reduce the original exponent by one.'],
    ['y = 2x³ − 4x + 1', 'Differentiate just −4x.', '−4', 'A linear term has its coefficient as the slope.'],
    ['d/dx (2x³) = 6x²\nd/dx (−4x) = −4; d/dx (1) = 0', 'Combine these derivatives.', 'y′ = 6x² − 4', 'Add the derivatives term by term.']
  ]},
  { id: 'stationary-point', topic: 'derivatives', title: 'Spot a turning point', source: worksheet('1000060777.jpg', '4'), steps: [
    ['f(x) = x³ − 6x² + 9x − 1\nf′(x) = 3x² − 12x + 9', 'What equation finds the stationary points?', '3x² − 12x + 9 = 0', 'Stationary points have derivative zero.'],
    ['3x² − 12x + 9 = 0', 'Divide by 3.', 'x² − 4x + 3 = 0', 'Every term has the same nonzero factor.'],
    ['(x − 1)(x − 3) = 0', 'Read the two stationary x values.', 'x = 1 and x = 3', 'Set each factor equal to zero.'],
    ['At x = 1, f′ changes from positive to negative.', 'Is this a local maximum or minimum?', 'A local maximum', 'The curve changes from rising to falling.']
  ]},
  { id: 'online-tangent', topic: 'derivatives', title: 'Build a tangent line', source: online('derivatives', 'Example 3.22: tangent at x = 1'), steps: [
    ['f(x) = x² − 4x + 6\nThe tangent point has x = 1.', 'Find the point’s y coordinate.', 'f(1) = 3', 'Substitute 1 into the original function.'],
    ['f(x) = x² − 4x + 6', 'Differentiate to find the slope function.', 'f′(x) = 2x − 4', 'Use the power rule on each term.'],
    ['f′(x) = 2x − 4\nThe tangent point has x = 1.', 'Evaluate the tangent slope.', 'm = −2', 'Evaluate the derivative at the point.'],
    ['Tangent point: (1, 3)\nSlope: −2', 'Write the line in point-slope form.', 'y − 3 = −2(x − 1)', 'Use y − y₁ = m(x − x₁).']
  ]},
  { id: 'reverse-power', topic: 'integrals', title: 'Reverse the power rule', source: worksheet('1000060777.jpg', '14 (1)'), steps: [
    ['∫ 6x² dx', 'What is the new exponent after integration?', '3', 'Increase the exponent by one.'],
    ['∫ 6x² dx = (6 / k)x³ + C', 'What number goes in the denominator?', 'k = 3', 'Divide by the new exponent.'],
    ['(6 / 3)x³ + C', 'Simplify the coefficient.', '2x³ + C', 'Six divided by three is two.'],
    ['You found an antiderivative: 2x³.', 'What completes the indefinite integral?', '+ C', 'All constant shifts have the same derivative.']
  ]},
  { id: 'area-setup', topic: 'integrals', title: 'Set up an area integral', source: worksheet('1000060780.jpg', '6'), steps: [
    ['Curves: y = x³ and y = 3x − 2', 'What equation finds their intersections?', 'x³ = 3x − 2', 'At an intersection, the two y values match.'],
    ['(x − 1)²(x + 2) = 0', 'What are the distinct integration bounds?', '−2 and 1', 'Repeated roots give only one intersection x value.'],
    ['On [−2, 1], x³ is above 3x − 2.', 'Write upper minus lower.', 'x³ − 3x + 2', 'Subtract the whole lower expression, including its constant.'],
    ['Area integrand: x³ − 3x + 2\nBounds: −2 to 1', 'Write the definite integral.', '∫ from −2 to 1 of (x³ − 3x + 2) dx', 'Integrate the vertical gap over the interval.']
  ]},
  { id: 'online-definite', topic: 'integrals', title: 'Evaluate at the bounds', source: online('integrals', 'Example 5.20: integral of t² − 4'), steps: [
    ['∫ from −2 to 2 of (t² − 4) dt', 'Find an antiderivative F(t).', 'F(t) = t³/3 − 4t', 'Integrate each term; choose the constant as zero.'],
    ['F(t) = t³/3 − 4t', 'Evaluate the upper endpoint F(2).', 'F(2) = −16/3', 'Substitute 2: 8/3 − 8.'],
    ['F(t) = t³/3 − 4t', 'Evaluate the lower endpoint F(−2).', 'F(−2) = 16/3', 'Substitute −2: −8/3 + 8.'],
    ['F(2) = −16/3\nF(−2) = 16/3', 'Compute F(2) − F(−2).', '−32/3', 'Subtract the lower endpoint value from the upper one.']
  ]},
  { id: 'choose-triangle', topic: 'probability', title: 'Choose, don’t arrange', source: worksheet('1000060782.jpg', '7 (2)'), steps: [
    ['Choose 3 vertices of a regular decagon to make a triangle.', 'Does changing their order make a new triangle?', 'No', 'The same three vertices describe the same triangle.'],
    ['Choose 3 vertices from 10; order does not matter.', 'Which counting expression should you use?', 'C(10, 3)', 'Use combinations for an unordered selection.'],
    ['C(10, 3) = 10! / (3! × 7!)', 'Cancel the 7! factor.', '(10 × 9 × 8) / (3 × 2 × 1)', 'Cancel the shared factorial before multiplying.'],
    ['(10 × 9 × 8) / (3 × 2 × 1)', 'Evaluate the count.', '120', 'Divide 720 by 6.']
  ]},
  { id: 'dice-binomial', topic: 'probability', title: 'Build a dice probability', source: worksheet('1000060782.jpg', '8 (1)'), steps: [
    ['A fair die: success means a multiple of 3.', 'What is the success probability p?', 'p = 2/6 = 1/3', 'The successful faces are 3 and 6.'],
    ['5 independent rolls, exactly 3 successes.', 'How many failures are needed?', '2 failures', 'Subtract the successes from the total trials.'],
    ['5 rolls, exactly 3 successes.', 'How many choices are there for the successful rolls?', 'C(5, 3) = 10', 'Choose three positions out of five.'],
    ['10 position choices; p = 1/3\n3 successes and 2 failures', 'Write the probability product.', '10 × (1/3)³ × (2/3)²', 'Multiply choices by the probability of one such pattern.']
  ]},
  { id: 'online-binomial', topic: 'probability', title: 'Translate wins into a formula', source: online('probability', 'Example 4.10: 15 wins in 20 independent games'), steps: [
    ['Each independent game has a 55% win chance.', 'Write the success probability as a decimal.', 'p = 0.55', 'Divide a percentage by 100.'],
    ['Win probability p = 0.55', 'Find the loss probability.', 'q = 0.45', 'The two probabilities must sum to one.'],
    ['Exactly 15 wins in 20 games.', 'What exponent belongs on the loss probability?', '5', 'There are 20 − 15 losses.'],
    ['20 games; 15 wins\np = 0.55 and q = 0.45', 'Write the binomial probability.', 'C(20, 15) × 0.55¹⁵ × 0.45⁵', 'Choose win positions, then multiply the outcome probabilities.']
  ]},
  { id: 'positive-pairs', topic: 'equations', title: 'Restrict integer solutions', source: worksheet('1000060779.jpg', '11'), steps: [
    ['3x + 5y = 45\nx and y are positive integers.', 'Reduce the equation modulo 3.', '2y ≡ 0 (mod 3)', 'The terms 3x and 45 vanish modulo 3.'],
    ['2y ≡ 0 (mod 3)', 'What does this tell you about y?', 'y is a multiple of 3', '2 and 3 are coprime.'],
    ['3x + 5y = 45\nx > 0, y > 0; y is a multiple of 3.', 'Which values of y are possible?', 'y = 3 or y = 6', 'Positivity gives 0 < y < 9.'],
    ['3x + 5y = 45\ny = 3', 'Find x for this value of y.', 'x = 10', 'Solve 3x + 15 = 45.']
  ]},
  { id: 'two-remainders', topic: 'equations', title: 'Combine two remainders', source: worksheet('1000060779.jpg', '13'), steps: [
    ['n leaves remainder 3 when divided by 6.', 'Write n using an integer k.', 'n = 6k + 3', 'Use divisor × quotient + remainder.'],
    ['n = 6k + 3\nAlso n ≡ 5 (mod 17).', 'Substitute and simplify modulo 17.', '6k ≡ 2 (mod 17)', 'Subtract 3 from both sides.'],
    ['6k ≡ 2 (mod 17)\nThe inverse of 6 modulo 17 is 3.', 'Multiply both sides by the inverse.', 'k ≡ 6 (mod 17)', '18 leaves remainder 1 modulo 17.'],
    ['n = 39 + 102t\nChoose the largest three-digit n.', 'What is the largest integer t allowed?', 't = 9', 'Use 39 + 102t ≤ 999 and round down.']
  ]},
  { id: 'online-diophantine', topic: 'equations', title: 'Extend one integer solution', source: online('equations', 'Example 3: 5x + 3y = 4'), steps: [
    ['5x + 3y = 4; x and y are integers.', 'What divisibility check comes first?', 'Does gcd(5, 3) divide 4?', 'A linear integer equation requires this divisibility.'],
    ['5x + 3y = 4\nTry x = 5: then 3y = −21.', 'Find y.', 'y = −7', 'Divide both sides by 3.'],
    ['Keep 5x + 3y unchanged.\nIncrease x by 3.', 'How much must y change?', 'Decrease y by 5', 'The changes contribute +15 and −15.'],
    ['One solution: (5, −7)\nA repeatable change: (+3, −5)', 'Write the full integer solution family.', '(x, y) = (5 + 3t, −7 − 5t), t ∈ ℤ', 'Apply any integer number of these changes.']
  ]}
, ...additionalDecks
];

export const flashcards = flashcardDecks.flatMap(deck => deck.steps.map(([given, prompt, answer, why], index) => ({
  id: `${deck.id}-${index + 1}`, deck: deck.id, topic: deck.topic, title: deck.title,
  step: index + 1, steps: deck.steps.length, given, prompt, answer, why, source: deck.source
})));
