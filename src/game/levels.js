// ---------------------------------------------------------------------------
// Shape registry — every shape used by the game.
// Polygons use CSS clip-path; round shapes use border-radius.
// ---------------------------------------------------------------------------

function ngon(sides) {
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides
    return `${(50 + 48 * Math.cos(a)).toFixed(1)}% ${(50 + 48 * Math.sin(a)).toFixed(1)}%`
  })
  return `polygon(${pts.join(', ')})`
}

export const SHAPES = {
  circle:       { label: 'Circle',       radius: '50%' },
  oval:         { label: 'Oval',         radius: '50% / 30%' },
  square:       { label: 'Square',       radius: '16%' },
  rectangle:    { label: 'Rectangle',    clip: 'polygon(6% 24%, 94% 24%, 94% 76%, 6% 76%)' },
  triangle:     { label: 'Triangle',     clip: 'polygon(50% 2%, 98% 96%, 2% 96%)' },
  diamond:      { label: 'Diamond',      clip: 'polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)' },
  star:         { label: 'Star',         clip: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  heart:        { label: 'Heart',        clip: 'polygon(50% 94%, 6% 50%, 6% 26%, 22% 8%, 38% 8%, 50% 22%, 62% 8%, 78% 8%, 94% 26%, 94% 50%)' },
  crescent:     { label: 'Crescent',     clip: 'polygon(50% 2%, 72% 8%, 88% 24%, 96% 48%, 88% 72%, 72% 88%, 50% 96%, 62% 82%, 72% 66%, 76% 48%, 72% 32%, 62% 16%)' },
  pentagon:     { label: 'Pentagon',     clip: ngon(5) },
  hexagon:      { label: 'Hexagon',      clip: ngon(6) },
  heptagon:     { label: 'Heptagon',     clip: ngon(7) },
  octagon:      { label: 'Octagon',      clip: ngon(8) },
  nonagon:      { label: 'Nonagon',      clip: ngon(9) },
  decagon:      { label: 'Decagon',      clip: ngon(10) },
  cross:        { label: 'Cross',        clip: 'polygon(34% 2%, 66% 2%, 66% 34%, 98% 34%, 98% 66%, 66% 66%, 66% 98%, 34% 98%, 34% 66%, 2% 66%, 2% 34%, 34% 34%)' },
  arrow:        { label: 'Arrow',        clip: 'polygon(50% 2%, 98% 50%, 70% 50%, 70% 96%, 30% 96%, 30% 50%, 2% 50%)' },
  trapezoid:    { label: 'Trapezoid',    clip: 'polygon(18% 20%, 82% 20%, 98% 88%, 2% 88%)' },
  parallelogram:{ label: 'Parallelogram',clip: 'polygon(22% 8%, 98% 8%, 78% 92%, 2% 92%)' }
}

export function shapeStyle(shapeId, color) {
  const s = SHAPES[shapeId] || SHAPES.circle
  return s.radius
    ? `--c:${color};border-radius:${s.radius};`
    : `--c:${color};clip-path:${s.clip};`
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
const COLORS = {
  red:    { hex: '#ef5350', label: 'Red' },
  blue:   { hex: '#42a5f5', label: 'Blue' },
  green:  { hex: '#66bb6a', label: 'Green' },
  yellow: { hex: '#fdd835', label: 'Yellow' },
  orange: { hex: '#fb8c00', label: 'Orange' },
  purple: { hex: '#ab47bc', label: 'Purple' },
  pink:   { hex: '#ec407a', label: 'Pink' },
  rose:   { hex: '#f06292', label: 'Rose' },
  teal:   { hex: '#26a69a', label: 'Teal' },
  lime:   { hex: '#9ccc65', label: 'Lime' },
  brown:  { hex: '#8d6e63', label: 'Brown' },
  navy:   { hex: '#5c6bc0', label: 'Navy' }
}

const PIECE_COLORS = ['#5c6bc0', '#ef5350', '#66bb6a', '#fb8c00', '#ab47bc', '#26a69a', '#ec407a', '#8d6e63']
const HOLE = '#90a4ae'

// Deterministic shuffle so a level always looks the same.
function shuffled(arr, seed) {
  const a = [...arr]
  let s = seed * 9301 + 49297
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const zip = (colors, shapes) => colors.map((c, i) => [c, shapes[i % shapes.length]])

function shapeLevel(n, name, shapeIds) {
  const pieceColor = PIECE_COLORS[(n - 1) % PIECE_COLORS.length]
  return {
    id: `shapes-${n}`, world: 'shapes', title: name, name,
    instruction: 'Put each shape in its home!',
    targets: shapeIds.map(s => ({ key: s, shape: s, color: HOLE, label: SHAPES[s].label })),
    pieces: shuffled(shapeIds, n).map(s => ({ key: s, shape: s, color: pieceColor, label: SHAPES[s].label }))
  }
}

function colorLevel(n, name, colorIds, pieceShape) {
  return {
    id: `shapes-${n}`, world: 'shapes', title: name, name,
    instruction: 'Drop each piece in the matching bin!',
    targets: colorIds.map(c => ({ key: c, shape: 'square', color: COLORS[c].hex, label: `${COLORS[c].label} bin` })),
    pieces: shuffled(colorIds, n).map(c => ({
      key: c, shape: pieceShape, color: COLORS[c].hex,
      label: `${COLORS[c].label} ${SHAPES[pieceShape].label}`
    }))
  }
}

function bothLevel(n, name, pairs) {
  const key = ([c, s]) => `${c}-${s}`
  const item = ([c, s]) => ({ key: key([c, s]), shape: s, color: COLORS[c].hex, label: `${COLORS[c].label} ${SHAPES[s].label}` })
  return {
    id: `shapes-${n}`, world: 'shapes', title: name, name,
    instruction: 'Match both the shape and the color!',
    targets: pairs.map(item),
    pieces: shuffled(pairs, n).map(item)
  }
}

// ---------------------------------------------------------------------------
// 30 Shape World levels
// ---------------------------------------------------------------------------
const C4  = ['red', 'blue', 'green', 'yellow']
const C5  = [...C4, 'orange']
const C6  = [...C5, 'purple']
const C6b = ['pink', 'rose', 'purple', 'red', 'orange', 'yellow']
const C6c = ['teal', 'lime', 'blue', 'green', 'yellow', 'brown']
const C6d = ['navy', 'blue', 'purple', 'pink', 'red', 'orange']

const shapeWorld = [
  shapeLevel(1,  'First Shapes',    ['circle', 'square', 'triangle', 'star']),
  shapeLevel(2,  'More Shapes',     ['circle', 'square', 'rectangle', 'oval']),
  shapeLevel(3,  'Pointy Shapes',   ['triangle', 'diamond', 'star', 'heart']),
  shapeLevel(4,  'Round Shapes',    ['circle', 'oval', 'heart', 'star']),
  shapeLevel(5,  'Five & Six',      ['pentagon', 'hexagon', 'circle', 'square']),
  shapeLevel(6,  'Many Sides',      ['pentagon', 'hexagon', 'heptagon', 'octagon']),
  shapeLevel(7,  'Polygon Parade',  ['heptagon', 'octagon', 'nonagon', 'decagon']),
  shapeLevel(8,  'Fun Shapes',      ['star', 'heart', 'cross', 'arrow']),
  shapeLevel(9,  'New Shapes',      ['trapezoid', 'parallelogram', 'diamond', 'rectangle']),
  shapeLevel(10, 'Shape Mix 1',     ['circle', 'pentagon', 'star', 'cross', 'heart']),
  shapeLevel(11, 'Shape Mix 2',     ['square', 'hexagon', 'arrow', 'oval', 'diamond']),
  shapeLevel(12, 'Shape Mix 3',     ['triangle', 'octagon', 'crescent', 'heart', 'pentagon']),
  colorLevel(13, 'Color Fun 1',     C4,  'circle'),
  colorLevel(14, 'Color Fun 2',     C5,  'circle'),
  colorLevel(15, 'Color Fun 3',     C6,  'circle'),
  colorLevel(16, 'Star Colors',     C6,  'star'),
  colorLevel(17, 'Heart Colors',    C6b, 'heart'),
  colorLevel(18, 'Rainbow Colors',  C6c, 'diamond'),
  bothLevel(19,  'Shape & Color 1', zip(C4,  ['circle', 'square', 'triangle', 'star'])),
  bothLevel(20,  'Shape & Color 2', zip(C5,  ['circle', 'star', 'heart', 'diamond', 'pentagon'])),
  bothLevel(21,  'Shape & Color 3', zip(C6,  ['circle', 'square', 'triangle', 'star', 'heart', 'hexagon'])),
  bothLevel(22,  'Shape & Color 4', zip(C5,  ['triangle', 'octagon', 'crescent', 'heart', 'pentagon'])),
  bothLevel(23,  'Shape & Color 5', zip(C6b, ['circle', 'oval', 'rectangle', 'trapezoid', 'parallelogram', 'cross'])),
  bothLevel(24,  'Shape & Color 6', zip(C6c, ['star', 'heart', 'arrow', 'cross', 'crescent', 'diamond'])),
  shapeLevel(25, 'Grand Shape Mix', ['circle', 'square', 'triangle', 'star', 'heart', 'diamond']),
  shapeLevel(26, 'Polygons Again',  ['pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon']),
  shapeLevel(27, 'Everything Mix',  ['circle', 'oval', 'rectangle', 'trapezoid', 'parallelogram', 'cross']),
  colorLevel(28, 'Color Challenge', C6d, 'parallelogram'),
  bothLevel(29,  'Shape & Color 7', zip(C6d, ['pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon'])),
  bothLevel(30,  'Master Sorter',   zip(C6,  ['circle', 'octagon', 'star', 'heart', 'hexagon', 'diamond']))
]

// ---------------------------------------------------------------------------
// Animal Homes world — 24 animal/home pairs across 30 levels
// ---------------------------------------------------------------------------
const ANIMAL_PAIRS = [
  ['bird',     'Bird',     'nest',        'Nest'],
  ['bear',     'Bear',     'cave',        'Cave'],
  ['rabbit',   'Rabbit',   'burrow',      'Burrow'],
  ['fish',     'Fish',     'pond',        'Pond'],
  ['bee',      'Bee',      'hive',        'Hive'],
  ['squirrel', 'Squirrel', 'tree-hollow', 'Tree hollow'],
  ['dog',      'Dog',      'doghouse',    'Doghouse'],
  ['cat',      'Cat',      'cat-house',   'Cat house'],
  ['fox',      'Fox',      'fox-den',     'Fox den'],
  ['owl',      'Owl',      'treehouse',   'Treehouse'],
  ['duck',     'Duck',     'reed-nest',   'Reed nest'],
  ['frog',     'Frog',     'lily-pad',    'Lily pad'],
  ['hen',      'Hen',      'coop',        'Coop'],
  ['cow',      'Cow',      'barn',        'Barn'],
  ['horse',    'Horse',    'stable',      'Stable'],
  ['sheep',    'Sheep',    'sheep-pen',   'Sheep pen'],
  ['pig',      'Pig',      'pigsty',      'Pigsty'],
  ['turtle',   'Turtle',   'beach',       'Beach'],
  ['snail',    'Snail',    'shell',       'Shell'],
  ['ant',      'Ant',      'anthill',     'Anthill'],
  ['mole',     'Mole',     'molehill',    'Molehill'],
  ['mouse',    'Mouse',    'mouse-hole',  'Mouse hole'],
  ['hedgehog', 'Hedgehog', 'leaf-pile',   'Leaf pile'],
  ['penguin',  'Penguin',  'iceberg',     'Iceberg']
]

function pickAnimals(start, count) {
  return Array.from({ length: count }, (_, i) => {
    const [key, animalLabel, home, homeLabel] = ANIMAL_PAIRS[(start + i) % ANIMAL_PAIRS.length]
    return { key, animalLabel, home, homeLabel }
  })
}

function animalLevel(n, name, start, count) {
  const pairs = pickAnimals(start, count)
  return {
    id: `animals-${n}`, world: 'animals', title: name, name,
    instruction: count === 6 ? 'Can you find all six homes?'
                : count === 5 ? 'Can you find all five homes?'
                : 'Help each animal find its home!',
    targets: pairs.map(p => ({ key: p.key, image: `art/${p.home}.png`, label: p.homeLabel })),
    pieces: shuffled(pairs, n).map(p => ({ key: p.key, image: `art/${p.key}.png`, label: p.animalLabel }))
  }
}

// [level name, first pair index, number of pairs] — capped at 6 for small screens.
const ANIMAL_LEVELS = [
  ['First Friends',     0,  4], ['Garden Friends',   4,  4],
  ['Farm Pals',        12,  4], ['Woodland Pals',   17,  4],
  ['Five Friends',      0,  5], ['Forest Five',      5,  5],
  ['Pond Five',         9,  5], ['Farm Five',       12,  5],
  ['Tiny Five',        18,  5], ['Home Five',       20,  5],
  ['Six Friends',       0,  6], ['Backyard Six',     2,  6],
  ['Forest Six',        4,  6], ['Flying Six',       6,  6],
  ['Water Six',         8,  6], ['Farm Six',        12,  6],
  ['Field Six',        14,  6], ['Small Six',       18,  6],
  ['Night Six',        20,  6], ['Winter Six',      22,  6],
  ['Mixed Homes 1',     1,  6], ['Mixed Homes 2',    3,  6],
  ['Mixed Homes 3',     7,  6], ['Mixed Homes 4',   11,  6],
  ['Animal Parade 1',  13,  6], ['Animal Parade 2', 15,  6],
  ['Animal Parade 3',  17,  6], ['Animal Parade 4', 19,  6],
  ['Animal Parade 5',  21,  6], ['Master Sorter',    0,  6]
]

const animalWorld = ANIMAL_LEVELS.map(([name, start, count], i) => animalLevel(i + 1, name, start, count))

export const levels = {
  shapes: shapeWorld,
  animals: animalWorld
}
