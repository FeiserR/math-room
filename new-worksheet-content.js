// Selected steps from the six additional user-supplied worksheets.
export const additionalTopics = [
  {id:'complex',name:'Complex numbers',jp:'複素数',icon:'i',color:'lavender',description:'Work with imaginary numbers one move at a time.'},
  {id:'trig',name:'Trigonometry',jp:'三角関数',icon:'θ',color:'blue',description:'Recall angles, signs, and identities.'},
  {id:'vectors',name:'Vectors',jp:'ベクトル',icon:'→',color:'pink',description:'Connect lengths, directions, and dot products.'}
];
export const additionalPhotoNames = {
  'IMG_20260930_053759.jpg':['Integration & enclosed area','Calculus · Questions 15–26',0],
  '1000060775.jpg':['Complex numbers','Questions 1–14',90],
  '1000060774.jpg':['Trigonometry','Questions 1–16',0],
  '1000060773.jpg':['Vectors','Questions 1–10',0],
  '1000060772.jpg':['Graphs & area','Alternate photo · Questions 1–6',0],
  '1000060771.jpg':['Mixed mathematics','Alternate photo · Algebra & probability',90]
};
const deck = (id,topic,title,file,question,steps) => ({id,topic,title,source:{kind:'worksheet',file,label:`Your worksheet · Question ${question}`},steps});
export const additionalDecks = [
  deck('complex-product','complex','Multiply with i² = −1','1000060775.jpg','3 (1)',[
    ['(2 + 3i)(3 − 2i)','Distribute the two factors.','6 − 4i + 9i − 6i²','Multiply each term in the first factor by each in the second.'],
    ['6 − 4i + 9i − 6i²; i² = −1','Replace −6i².','+6','Multiplying two negative numbers gives a positive.'],
    ['6 − 4i + 9i + 6','Combine the imaginary terms.','5i','Add their coefficients: −4 + 9.'],
    ['6 + 5i + 6','Write in a + bi form.','12 + 5i','Combine the real terms.']
  ]),
  deck('complex-division','complex','Clear an imaginary denominator','1000060775.jpg','5 (1)',[
    ['(7 + i) / (1 + 3i)','Which conjugate should multiply top and bottom?','1 − 3i','Change the sign of the denominator’s imaginary part.'],
    ['(1 + 3i)(1 − 3i)','Simplify the denominator.','10','The product is 1 − 9i² = 1 + 9.'],
    ['(7 + i)(1 − 3i) = 7 − 20i − 3i²','Simplify the numerator.','10 − 20i','Use i² = −1.'],
    ['(10 − 20i) / 10','Divide each term by 10.','1 − 2i','Divide both the real and imaginary coefficients.']
  ]),
  deck('complex-root-relations','complex','Use the roots without solving','1000060775.jpg','11 (3)',[
    ['α and β are roots of x² − 3x − 1 = 0.','What is α + β?','3','The sum is the negative coefficient of x.'],
    ['α and β are roots of x² − 3x − 1 = 0.','What is αβ?','−1','For a monic quadratic, the product is the constant.'],
    ['Find (α − β)² using the sum and product.','Rewrite with α + β and αβ.','(α + β)² − 4αβ','Expand both sides to check this identity.'],
    ['(α − β)² = (α + β)² − 4αβ\nα + β = 3; αβ = −1','Substitute and evaluate.','13','3² − 4(−1) = 9 + 4.']
  ]),
  deck('trig-quadrant','trig','Let the quadrant choose the sign','1000060774.jpg','2',[
    ['cos θ = 5/13; θ is in quadrant IV.','Express sin² θ using cos θ.','sin² θ = 1 − cos² θ','Use sin² θ + cos² θ = 1.'],
    ['sin² θ = 1 − (5/13)²','Simplify the right side.','144/169','169/169 − 25/169 = 144/169.'],
    ['sin² θ = 144/169; θ is in quadrant IV.','Choose the correct square root.','sin θ = −12/13','Sine is negative in quadrant IV.'],
    ['sin θ = −12/13; cos θ = 5/13','Find tan θ.','−12/5','Divide sine by cosine.']
  ]),
  deck('trig-sine-equation','trig','Find both sine angles','1000060774.jpg','8 (1)',[
    ['2 sin θ − 1 = 0','Isolate sin θ.','sin θ = 1/2','Add 1, then divide by 2.'],
    ['sin θ = 1/2','What is the reference angle?','π/6','sin(π/6) = 1/2.'],
    ['sin θ = 1/2; 0 ≤ θ < 2π\nOne angle is π/6.','Find the second angle.','5π/6','Sine is also positive in quadrant II: π − π/6.'],
    ['One-cycle solutions: π/6 and 5π/6','Extend to all real angles.','θ = π/6 + 2πn or 5π/6 + 2πn, n ∈ ℤ','Sine repeats every 2π.']
  ]),
  deck('trig-angle-addition','trig','Build cos 75° from familiar angles','1000060774.jpg','15 (1)',[
    ['Find cos 75° using standard angles.','Split 75° into two familiar angles.','45° + 30°','Both angles have known exact sine and cosine values.'],
    ['cos(45° + 30°)','Apply the cosine addition formula.','cos 45° cos 30° − sin 45° sin 30°','Cosine of a sum uses a minus sign.'],
    ['cos 45° = √2/2; cos 30° = √3/2','Multiply these two values.','√6/4','Multiply numerators and denominators separately.'],
    ['cos 75° = √6/4 − √2/4','Combine the fractions.','(√6 − √2)/4','The denominators already match.']
  ]),
  deck('vector-norms','vectors','Recover a dot product from lengths','1000060773.jpg','5',[
    ['Vectors a, b: |a + b| = 6 and |a − b| = 2.','Compute |a + b|² − |a − b|².','32','Square first: 36 − 4.'],
    ['|a + b|² − |a − b|²','Simplify in terms of a · b.','4(a · b)','The squared lengths cancel when the expansions are subtracted.'],
    ['4(a · b) = 32','Find a · b.','8','Divide by 4.'],
    ['|a + b|² + |a − b|² = 40\n|b|² = 9; sum = 2|a|² + 2|b|²','Find |a|².','11','Solve 2|a|² + 18 = 40.']
  ]),
  deck('vector-area','vectors','Turn coordinates into area','1000060773.jpg','8',[
    ['O = (0, 0), A = (3, 2), B = (1, 5)','Set up the area of triangle OAB.','|3 × 5 − 2 × 1| / 2','Take half the absolute determinant.'],
    ['Area of triangle OAB = |15 − 2| / 2','Evaluate the area.','13/2','Subtract before dividing by 2.'],
    ['P = sA + tB; s,t ≥ 0\nThe triangle s + t ≤ 1 has area 13/2.','What is the area for s + t ≤ 2?','26','Doubling lengths multiplies area by four.'],
    ['P = sA + tB; s,t ≥ 0\nAreas for s+t ≤ 2 and s+t ≤ 1: 26 and 13/2','Find the area where 1 ≤ s + t ≤ 2.','39/2','Subtract the inner triangle from the outer triangle.']
  ]),
  deck('vector-perpendicular','vectors','Translate perpendicular into zero','1000060773.jpg','9',[
    ['Vectors a + b and a + tb are perpendicular.','Write the dot-product condition.','(a + b) · (a + tb) = 0','Perpendicular vectors have zero dot product.'],
    ['(a + b) · (a + tb) = 0','Expand using dot products.','|a|² + (t + 1)(a · b) + t|b|² = 0','Distribute and combine the two mixed terms.'],
    ['|a| = |b| = 2; a · b = −2\n|a|² + (t + 1)(a · b) + t|b|² = 0','Substitute and simplify.','2 + 2t = 0','4 − 2(t + 1) + 4t simplifies to 2 + 2t.'],
    ['2 + 2t = 0','Solve for t.','t = −1','Subtract 2, then divide by 2.']
  ]),
  deck('integral-expand-product','integrals','Expand before integrating','IMG_20260930_053759.jpg','15 (1)',[
    ['∫ (3x − 1)(2x + 1) dx','Expand the product inside the integral.','6x² + x − 1','Distribute, then combine 3x − 2x.'],
    ['∫ (6x² + x − 1) dx','Integrate just 6x².','2x³','Raise the power to 3 and divide by 3.'],
    ['∫ (6x² + x − 1) dx','Integrate just x.','x²/2','Raise the power to 2 and divide by 2.'],
    ['∫ (6x² + x − 1) dx\nFirst terms: 2x³ + x²/2','Finish with the integral of −1 and the constant.','2x³ + x²/2 − x + C','An indefinite integral includes an arbitrary constant.']
  ]),
  deck('integral-initial-point','integrals','Use a point to find C','IMG_20260930_053759.jpg','16',[
    ['The tangent slope is 3x² at every point of y = f(x).','Write the derivative equation.','f′(x) = 3x²','The derivative gives the tangent slope.'],
    ['f′(x) = 3x²','Integrate to find f(x).','f(x) = x³ + C','Reverse the power rule and include C.'],
    ['f(x) = x³ + C passes through (1, 2).','Substitute the point.','2 = 1 + C','Use x = 1 and f(1) = 2.'],
    ['2 = 1 + C','Find C.','C = 1','Subtract 1 from both sides.']
  ]),
  deck('integral-signed-area','integrals','Split area where the sign changes','IMG_20260930_053759.jpg','23',[
    ['f(x) = x³ − 3x² + 2x','Factor the polynomial.','f(x) = x(x − 1)(x − 2)','Factor out x, then factor the quadratic.'],
    ['f(x) = x(x − 1)(x − 2)','Find the three x-intercepts.','0, 1, 2','Set each factor equal to zero.'],
    ['f(x) is positive on (0,1) and negative on (1,2).','Set up the total enclosed area.','∫₀¹ f(x) dx − ∫₁² f(x) dx','Negate the integral where the curve is below the axis.'],
    ['∫₀¹ f(x) dx = 1/4; ∫₁² f(x) dx = −1/4','Find the total enclosed area.','1/2','Add the magnitudes: 1/4 + 1/4.']
  ]),
  deck('cubic-interval-extrema','derivatives','Keep only candidates in the interval','1000060772.jpg','1',[
    ['f(x) = x³ + x²/2 − 2x; 0 ≤ x ≤ 4','Differentiate f(x).','f′(x) = 3x² + x − 2','Apply the power rule to each term.'],
    ['f′(x) = 3x² + x − 2','Factor the derivative.','(3x − 2)(x + 1)','The middle terms are 3x − 2x.'],
    ['Stationary points: x = −1 and x = 2/3\nInterval: 0 ≤ x ≤ 4','Which stationary point is inside?','x = 2/3','Discard −1 because it is outside the interval.'],
    ['Candidates: f(0) = 0, f(2/3) = −22/27, f(4) = 64','Which value is the minimum?','−22/27 at x = 2/3','Compare the stationary value with both endpoint values.']
  ]),
  deck('constrained-quadratic','algebra','Reduce two variables to one','1000060771.jpg','10 (2)',[
    ['2x + y = 1','Solve for y.','y = 1 − 2x','Subtract 2x from both sides.'],
    ['x ≥ 0, y ≥ 0; y = 1 − 2x','What interval can x lie in?','0 ≤ x ≤ 1/2','Nonnegative y requires 1 − 2x ≥ 0.'],
    ['z = 2x² + y²; y = 1 − 2x','Substitute and expand z.','z = 6x² − 4x + 1','Expand (1 − 2x)² and add 2x².'],
    ['z = 6(x − 1/3)² + 1/3; 0 ≤ x ≤ 1/2','Read off the minimum value.','1/3','The square can equal zero at x = 1/3.']
  ])
];
