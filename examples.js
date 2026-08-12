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
  3: 'I like to be kind to my friend.',
  26: 'This snack does cost five dollars.',
  41: 'I can fit into my new shirt.',
  45: 'I forbid my toy dragon to take my crayons.',
  46: 'I forecast rain in my weather journal.',
  48: 'I foretell a happy ending in my story.',
  80: 'I mean what I say.',
  113: 'I sink my toy boat in the bath.',
  141: 'I swell my cheeks like a frog.',
};

function primaryVerbForm(value) {
  return value.split('/')[0].trim();
}

function lowerFirst(value) {
  if (value === 'I') return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function exampleSentences(verb) {
  const [subject, perfectAuxiliary] = SENTENCE_SUBJECTS[verb.id] || ['I', 'have'];
  const ending = SENTENCE_CONTEXTS[verb.id] || 'after school';
  const base = primaryVerbForm(verb.base);
  const past = primaryVerbForm(verb.past);
  const participle = primaryVerbForm(verb.participle);
  return [
    { sentence: BASE_SENTENCES[verb.id] || `I ${base} ${ending}.`, word: base },
    { sentence: `Yesterday, ${lowerFirst(subject)} ${past} ${ending}.`, word: past },
    { sentence: `${subject} ${perfectAuxiliary} ${participle} ${ending}.`, word: participle },
  ];
}
