const SENTENCE_CONTEXTS = {
  1: 'early for school', 2: 'before my alarm', 3: 'kind to my friend', 4: 'my heavy school bag',
  5: 'my brother at a board game', 6: 'taller this year', 7: 'my homework after dinner', 8: 'a paper clip',
  9: 'on the color of a car', 10: 'for a toy at the school auction', 11: 'my books with a ribbon', 12: 'an apple at lunch',
  13: 'a little after a scraped knee', 14: 'bubbles through a straw', 15: 'a dry twig', 16: 'baby fish in a game',
  17: 'my lunch box to school', 18: 'the class news', 19: 'a block tower', 20: 'toast for breakfast',
  21: 'a balloon by accident', 22: 'a snack at the school fair', 23: 'a ball with my friend', 24: 'a book from the library',
  25: 'home from school', 26: 'five dollars', 27: 'quietly to the kitchen', 28: 'paper for an art project', 29: 'a hole in the sand',
  30: 'my homework after dinner', 31: 'a picture of my pet', 32: 'about a fun trip', 33: 'milk with breakfast',
  34: 'a toy car on the floor', 35: 'an apple for a snack', 36: 'off my bike', 37: 'my goldfish',
  38: 'happy at the park', 39: 'a monster in my game', 40: 'my missing pencil', 41: 'me', 42: 'from a scary movie scene',
  43: 'my backpack onto the chair', 44: 'a kite at the beach', 45: 'me to eat candy before dinner', 46: 'rain tomorrow', 47: 'my lunch box at school', 48: 'a surprise ending', 49: 'my friend for a small mistake',
  50: 'my old teddy bear', 51: 'juice for a popsicle', 52: 'a sticker from my teacher', 53: 'my friend a turn',
  54: 'to the playground', 55: 'cookies for my family', 56: 'a bean plant in class', 57: 'my jacket by the door',
  58: 'a snack after school', 59: 'the school bell', 60: 'behind the sofa', 61: 'a baseball with my bat',
  62: 'my mom\'s hand', 63: 'my knee while playing', 64: 'my crayons in a box', 65: 'beside my bed',
  66: 'the answer to the question', 67: 'my book on the table', 68: 'my team in a game', 69: 'toward my friend',
  70: 'over a puddle', 71: 'a new song at school', 72: 'my shoes by the door', 73: 'my friend a pencil',
  74: 'my little brother play', 75: 'about breaking a crayon', 76: 'down for a nap', 77: 'a candle on my birthday cake',
  78: 'my favorite glove', 79: 'a card for my grandma', 80: 'something new', 81: 'my friend at the park', 82: 'my library book',
  83: 'my friend for my cousin', 84: 'my dad on a walk', 85: 'for a comic book', 86: 'I can be brave',
  87: 'my toy on the shelf', 88: 'playing my game before dinner', 89: 'a book before bed', 90: 'my room of old papers',
  91: 'my bike to school', 92: 'the bell for lunch', 93: 'up early for school', 94: 'to the bus stop',
  95: 'a piece of wood in class', 96: 'thank you to my teacher', 97: 'a rainbow after the rain', 98: 'my missing sock',
  99: 'lemonade at the school fair', 100: 'a card to my grandma', 101: 'the table for dinner', 102: 'a button on my shirt',
  103: 'the rain off my umbrella', 104: 'my doll\'s hair', 105: 'a sheep in a story', 106: 'my wet coat',
  107: 'my flashlight under the bed', 108: 'a basketball into the hoop', 109: 'my drawing to my dad', 110: 'my shirt in hot water',
  111: 'the door quietly', 112: 'a song in music class', 113: 'in the bath', 114: 'beside my friend', 115: 'a dragon in my game',
  116: 'in my cozy bed', 117: 'down the slide', 118: 'an orange for lunch', 119: 'cookies in the kitchen',
  120: 'English with my teacher', 121: 'up on my scooter', 122: 'my name correctly', 123: 'my pocket money on a toy',
  124: 'juice on the table', 125: 'a top on the floor', 126: 'out my toothpaste', 127: 'a sandwich with my friend',
  128: 'my surprise for my mom', 129: 'jam on my toast', 130: 'up when the bell rings', 131: 'in line at school',
  132: 'a cookie from the jar', 133: 'a star sticker on my book', 134: 'my finger on a thorn', 135: 'after wearing wet socks',
  136: 'a drum in music class', 137: 'beads for a bracelet', 138: 'to do my best', 139: 'to tell the truth',
  140: 'the kitchen floor', 141: 'after a bee sting', 142: 'in the pool', 143: 'on the swings', 144: 'my lunch to school',
  145: 'my friend a card game', 146: 'paper for my craft', 147: 'my mom about school', 148: 'about my next drawing',
  149: 'a ball to my dog', 150: 'my toy sword forward', 151: 'a checkup at school', 152: 'my teacher\'s question',
  153: 'a big art project', 154: 'my cup of water', 155: 'up before school', 156: 'my warm coat',
  157: 'a paper basket', 158: 'when my balloon pops', 159: 'my hands at the sink', 160: 'a ribbon in the race',
  161: 'my toy car key', 162: 'my hand from the hot cup', 163: 'water from my towel', 164: 'a note to my friend',
};

const SENTENCE_SUBJECTS = {
  26: ['My lunch', 'has'], 41: ['My new shirt', 'has'], 45: ['My dad', 'has'], 46: ['The weather app', 'has'],
  48: ['The story', 'has'], 80: ['This word', 'has'], 113: ['My toy boat', 'has'],
  141: ['My ankle', 'has'],
};

const BASE_SENTENCES = {
  1: { sentence: 'The sun rises while I eat breakfast.', word: 'rises' },
  3: { sentence: 'I am kind to my friends.', word: 'am' },
  4: { sentence: 'My backpack is easy to bear.', word: 'bear' },
  5: { sentence: 'My drum beats loudly in music class.', word: 'beats' },
  6: { sentence: 'My plant becomes taller each week.', word: 'becomes' },
  7: { sentence: 'Our class begins after the bell rings.', word: 'begins' },
  8: { sentence: 'A paper clip bends easily.', word: 'bends' },
  12: { sentence: 'A puppy bites a chewy toy.', word: 'bites' },
  13: { sentence: 'My scraped knee bleeds a little.', word: 'bleeds' },
  14: { sentence: 'The wind blows bubbles across the yard.', word: 'blows' },
  15: { sentence: 'A dry twig breaks under my shoe.', word: 'breaks' },
  17: { sentence: 'My mom brings snacks for our picnic.', word: 'brings' },
  21: { sentence: 'A balloon bursts when I sit on it.', word: 'bursts' },
  25: { sentence: 'My friend comes over after school.', word: 'comes' },
  27: { sentence: 'A snail creeps along the garden wall.', word: 'creeps' },
  34: { sentence: 'My dad drives us to the pool.', word: 'drives' },
  36: { sentence: 'My ball falls behind the sofa.', word: 'falls' },
  42: { sentence: 'A squirrel flees when our dog barks.', word: 'flees' },
  44: { sentence: 'A bird flies over the playground.', word: 'flies' },
  51: { sentence: 'Water freezes in my ice tray.', word: 'freezes' },
  54: { sentence: 'My family goes to the park on Sundays.', word: 'goes' },
  56: { sentence: 'My bean plant grows by the window.', word: 'grows' },
  57: { sentence: 'My jacket hangs by the front door.', word: 'hangs' },
  68: { sentence: 'My teacher leads us to the library.', word: 'leads' },
  69: { sentence: 'My block tower leans to one side.', word: 'leans' },
  70: { sentence: 'A frog leaps over the puddle.', word: 'leaps' },
  92: { sentence: 'The school bell rings for lunch.', word: 'rings' },
  93: { sentence: 'The sun rises before I leave for school.', word: 'rises' },
  103: { sentence: 'My dog shakes water from his fur.', word: 'shakes' },
  107: { sentence: 'My flashlight shines under the bed.', word: 'shines' },
  110: { sentence: 'My sweater shrinks in hot water.', word: 'shrinks' },
  112: { sentence: 'Our class sings in music time.', word: 'sings' },
  113: { sentence: 'My toy boat sinks in the bath.', word: 'sinks' },
  117: { sentence: 'My toy car slides down the ramp.', word: 'slides' },
  125: { sentence: 'A top spins on the floor.', word: 'spins' },
  130: { sentence: 'A frog springs into the pond.', word: 'springs' },
  132: { sentence: 'A raccoon steals a cookie from the table.', word: 'steals' },
  134: { sentence: 'A bee stings my finger.', word: 'stings' },
  135: { sentence: 'Wet socks stink after a rainy day.', word: 'stink' },
  141: { sentence: 'My ankle swells after a bee sting.', word: 'swells' },
  143: { sentence: 'The swing swings at the playground.', word: 'swings' },
};

const NATURAL_FORMS = {
  20: { past: 'burned', participle: 'burned' }, 32: { past: 'dreamed', participle: 'dreamed' },
  45: { past: 'forbade' }, 52: { participle: 'gotten' }, 65: { past: 'kneeled', participle: 'kneeled' },
  69: { past: 'leaned', participle: 'leaned' }, 70: { past: 'leaped', participle: 'leaped' },
  71: { past: 'learned', participle: 'learned' }, 77: { past: 'lit', participle: 'lit' },
  86: { participle: 'proven' }, 102: { participle: 'sewn' }, 104: { participle: 'shaved' },
  105: { participle: 'sheared' }, 110: { past: 'shrank', participle: 'shrunk' },
  119: { past: 'smelled', participle: 'smelled' }, 121: { past: 'sped', participle: 'sped' },
  122: { past: 'spelled', participle: 'spelled' }, 124: { past: 'spilled', participle: 'spilled' },
  126: { past: 'spit', participle: 'spit' }, 128: { past: 'spoiled', participle: 'spoiled' },
  130: { past: 'sprang', participle: 'sprung' }, 135: { past: 'stank', participle: 'stunk' },
  141: { participle: 'swollen' }, 159: { past: 'wetted', participle: 'wetted' },
};

const NATURAL_SENTENCE_SETS = {
  2: [
    { sentence: 'I wake up before my alarm goes off.', word: 'wake' },
    { sentence: 'Yesterday, I woke up before my alarm went off.', word: 'woke' },
    { sentence: "I've woken up before my alarm many times.", word: 'woken' },
  ],
  26: [
    { sentence: 'This snack costs five dollars.', word: 'costs' },
    { sentence: 'Yesterday, this snack cost five dollars.', word: 'cost' },
    { sentence: 'This snack has cost five dollars all week.', word: 'cost' },
  ],
  41: [
    { sentence: 'My new shirt fits me well.', word: 'fits' },
    { sentence: 'Yesterday, my new shirt fit me well.', word: 'fit' },
    { sentence: 'My new shirt has fit me all year.', word: 'fit' },
  ],
  45: [
    { sentence: 'My dad forbids candy before dinner.', word: 'forbids' },
    { sentence: 'Yesterday, my dad forbade candy before dinner.', word: 'forbade' },
    { sentence: 'My dad has forbidden candy before dinner.', word: 'forbidden' },
  ],
  46: [
    { sentence: 'The weather app forecasts rain tomorrow.', word: 'forecasts' },
    { sentence: 'Yesterday, the weather app forecast rain.', word: 'forecast' },
    { sentence: 'The weather app has forecast rain for tomorrow.', word: 'forecast' },
  ],
  48: [
    { sentence: 'The story foretells a surprise ending.', word: 'foretells' },
    { sentence: 'The story foretold a surprise ending.', word: 'foretold' },
    { sentence: 'The story has foretold a surprise ending.', word: 'foretold' },
  ],
  80: [
    { sentence: 'I mean what I say.', word: 'mean' },
    { sentence: "Yesterday, my teacher meant 'happy' when she said 'glad.'", word: 'meant' },
    { sentence: 'My teacher has meant well.', word: 'meant' },
  ],
  113: [
    { sentence: 'My toy boat sinks in the bath.', word: 'sinks' },
    { sentence: 'Yesterday, my toy boat sank in the bath.', word: 'sank' },
    { sentence: 'My toy boat has sunk in the bath.', word: 'sunk' },
  ],
  141: [
    { sentence: 'My ankle swells after a bee sting.', word: 'swells' },
    { sentence: 'My ankle swelled after a bee sting.', word: 'swelled' },
    { sentence: 'My ankle has swollen since the bee sting.', word: 'swollen' },
  ],
};

function primaryVerbForm(value) {
  return value.split('/')[0].trim();
}

function lowerFirst(value) {
  if (value === 'I') return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function presentForm(base) {
  if (base === 'be') return 'is';
  if (base === 'have') return 'has';
  if (base === 'do') return 'does';
  if (base === 'go') return 'goes';
  if (/[^aeiou]y$/i.test(base)) return `${base.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(base)) return `${base}es`;
  return `${base}s`;
}

function exampleSentences(verb) {
  if (NATURAL_SENTENCE_SETS[verb.id]) return NATURAL_SENTENCE_SETS[verb.id];
  const [subject, perfectAuxiliary] = SENTENCE_SUBJECTS[verb.id] || ['I', 'have'];
  const ending = SENTENCE_CONTEXTS[verb.id] || 'after school';
  const base = primaryVerbForm(verb.base);
  const past = NATURAL_FORMS[verb.id]?.past || primaryVerbForm(verb.past);
  const participle = NATURAL_FORMS[verb.id]?.participle || primaryVerbForm(verb.participle);
  const baseExample = BASE_SENTENCES[verb.id]
    || { sentence: `${subject} ${subject === 'I' ? base : presentForm(base)} ${ending}.`, word: subject === 'I' ? base : presentForm(base) };
  const perfectStart = subject === 'I' ? "I've" : `${subject} ${perfectAuxiliary}`;
  return [
    baseExample,
    { sentence: `Yesterday, ${lowerFirst(subject)} ${past} ${ending}.`, word: past },
    { sentence: `${perfectStart} ${participle} ${ending}.`, word: participle },
  ];
}
