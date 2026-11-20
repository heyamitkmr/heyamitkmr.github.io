/* Dailyish: built-in templates for the instant, no-AI plan.
   One goal sentence → best-matching template → a complete plan.json.
   Each template is deliberately modest; the person tunes it later. */
'use strict';

const DEFAULT_IF_THEN = [
  ['I missed yesterday', 'do the minimum day today; never miss twice'],
  ['I\'m ill or travelling', 'log a note; the plan pauses, it doesn\'t fail'],
];
const DEFAULT_TUNE = [
  'When did you last stick with something for a month or more, and what made it work?',
  'What usually makes you stop: time, energy, boredom, guilt after a missed day, or something else?',
  'What time of day is most reliably yours?',
];

/* m: [key, label, count, target_per_week, outcome?] */
const TEMPLATES = [
  { id: 'fitness', arch: 'habit', horizon: 6,
    kw: ['fit', 'fitter', 'fitness', 'exercise', 'workout', 'work out', 'gym', 'run', 'running', 'jog', 'walk', 'walking', 'lose weight', 'weight', 'strength', 'stronger', 'active', '5k', '10k', 'marathon', 'yoga', 'swim', 'cycle', 'cycling', 'move more', 'stamina'],
    title: 'Move most days',
    near: 'Exercise on 4 days a week for 8 weeks in a row',
    lanes: [
      { key: 'M', name: 'Move', purpose: 'Build the habit of moving', color: '#2f6f5e',
        m: [['session', 'Exercise session (any length)', 'days', 4], ['longer', 'Longer weekend session', 'events', 1]],
        themes: { sat: 'Longer, easy session' },
        starters: ['Put your shoes or kit by the door', 'Walk to the end of the street and back'] },
      { key: 'R', name: 'Recover', purpose: 'Keep it sustainable', color: '#2463a6',
        m: [['stretch', '5-minute stretch', 'days', 3]], starters: ['Five minutes of stretching after the session'] },
    ],
    trigger: 'After I make my morning drink, I put my shoes on. (Easy to change.)',
    warmup: 'Two minutes of brisk walking always counts',
    minimum: 'Shoes on, walk for 5 minutes',
    ifthen: [['it\'s raining', '10-minute indoor bodyweight routine']],
    first: 'Put your shoes by the door right now',
    habit: 'Shoes on after the morning drink',
    tune: ['When did you last stick with exercise for a month, and what made it work?', 'What kind of movement do you actually enjoy (or hate least)?', 'Any injury or health condition to work around?'] },

  { id: 'language', arch: 'habit', horizon: 12, label: true,
    kw: ['language', 'spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'korean', 'mandarin', 'chinese', 'cantonese', 'arabic', 'hindi', 'kannada', 'tamil', 'telugu', 'bengali', 'urdu', 'russian', 'dutch', 'swedish', 'turkish', 'greek', 'hebrew', 'polish', 'vietnamese', 'thai', 'swahili', 'conversational', 'fluent', 'fluency', 'vocabulary', 'speak'],
    title: 'Speak {X}, a little daily',
    near: 'Hold a 5-minute {X} conversation by month 3',
    lanes: [
      { key: 'L', name: '{X} practice', purpose: 'Daily contact with the language', color: '#7c5cbf',
        m: [['practice', 'Practice session (10 min)', 'days', 5]],
        themes: { mon: 'New words', wed: 'Listening', fri: 'Review' },
        starters: ['Learn 5 everyday phrases', 'Listen to 5 minutes of {X} audio'] },
      { key: 'S', name: 'Speak', purpose: 'Use it with a real person', color: '#c2590a',
        m: [['conversation', 'Spoke with someone in {X}', 'events', 1]],
        starters: ['Message someone to arrange a short {X} chat'] },
    ],
    trigger: 'After my morning drink, I open my {X} practice. (Easy to change.)',
    warmup: 'Say three phrases out loud',
    minimum: 'Say 3 phrases out loud',
    ifthen: [['I feel embarrassed to speak', 'speak to myself first, then one short real exchange']],
    first: 'Write down 5 phrases you\'d use every day and say them out loud',
    habit: 'Three phrases out loud every morning',
    tune: ['Why {X}, and who would you speak it with?', 'Have you tried learning it before? What made you stop?', 'Do you prefer apps, classes, or talking to people?'] },

  { id: 'instrument', arch: 'habit', horizon: 6, label: true,
    kw: ['guitar', 'piano', 'keyboard', 'violin', 'cello', 'drums', 'ukulele', 'bass', 'flute', 'saxophone', 'trumpet', 'instrument', 'music', 'tabla', 'sitar', 'harmonica'],
    title: 'Play your {X} most days',
    near: 'Play one full song on your {X} by month 2',
    lanes: [
      { key: 'P', name: 'Practise', purpose: 'Short, frequent practice', color: '#2f6f5e',
        m: [['practice', 'Practice (even 10 min)', 'days', 5]],
        themes: { mon: 'Technique', wed: 'Song', fri: 'Play for fun' },
        starters: ['Pick up your {X} and play anything for 2 minutes'] },
      { key: 'S', name: 'Songs', purpose: 'Visible progress', color: '#c2590a',
        m: [['playthrough', 'Played a song start to finish', 'events', 2]],
        starters: ['Choose the one song you most want to play'] },
    ],
    trigger: 'After dinner, I take your {X} out of its case. (Easy to change.)',
    warmup: 'Play one thing you already know',
    minimum: 'Play for 2 minutes',
    ifthen: [['practice feels boring', 'play a song I love, badly, for fun']],
    first: 'Put your {X} somewhere you\'ll see it today, out of its case',
    habit: 'The {X} is out and within reach',
    tune: ['What song or skill would make you feel you\'ve "got it"?', 'Have you tried before? What stopped you?', 'Teacher, app, or videos?'] },

  { id: 'writing', arch: 'project', horizon: 12,
    kw: ['write', 'writing', 'book', 'novel', 'blog', 'essay', 'newsletter', 'memoir', 'poem', 'poetry', 'story', 'stories', 'screenplay', 'thesis', 'dissertation', 'manuscript', 'chapter', 'substack', 'author'],
    title: 'Write most days',
    near: 'A complete rough first draft of one piece by month 3',
    lanes: [
      { key: 'W', name: 'Write', purpose: 'Words on the page, no editing', color: '#2f6f5e',
        m: [['session', 'Writing session', 'days', 5], ['pages', 'Page drafted', 'events', 5]],
        themes: { sat: 'Read back the week, no edits' },
        starters: ['Open the document and write one sentence', 'Write the scene or section you most want to write'] },
      { key: 'S', name: 'Share', purpose: 'Someone sees it', color: '#2463a6',
        m: [['shared', 'Shared with a reader', 'events', 1]],
        starters: ['Ask one person to be your first reader'] },
    ],
    trigger: 'After my morning drink, I open the draft before anything else. (Easy to change.)',
    warmup: 'Rewrite the last sentence you wrote yesterday',
    minimum: 'Write one sentence',
    ifthen: [['I don\'t know what to write', 'write what happens next, badly'], ['I want to edit', 'leave a note in [brackets] and keep going']],
    first: 'Create the document, give it a working title, and write one sentence',
    habit: 'Open the draft before email',
    tune: ['What are you writing, and who is it for?', 'What stopped your last writing project?', 'Do you write best in the morning or evening?'] },

  { id: 'career', arch: 'outcome', horizon: 9, strong: ['job', 'career', 'hired', 'interview', 'new job', 'career change'],
    kw: ['job', 'career', 'role', 'hired', 'employment', 'interview', 'resume', 'cv', 'switch careers', 'change careers', 'career change', 'transition', 'promotion', 'apply', 'applications', 'position', 'get into', 'break into', 'new job', 'work in', 'work as', 'become a', 'land a'],
    title: 'Steady steps to a new role',
    near: '30 applications and 15 conversations by month 3',
    lanes: [
      { key: 'S', name: 'Skills', arch: 'habit', purpose: 'Close the biggest gap', color: '#7c5cbf',
        m: [['study', 'Skill session', 'days', 3]],
        starters: ['List the 3 skills that appear most in job ads you want'] },
      { key: 'A', name: 'Apply', arch: 'outcome', purpose: 'Things you send (you control these)', color: '#c2590a', pipeline: true,
        m: [['application', 'Application sent', 'events', 2], ['outreach', 'Outreach message sent', 'events', 2], ['reply', 'Reply or interview', 'events', 0, true]],
        themes: { mon: 'Find 3 roles', tue: 'Apply', wed: 'Outreach', thu: 'Apply', fri: 'Follow up' },
        starters: ['Find 3 roles you\'d genuinely want', 'Message one person doing the job you want'] },
    ],
    trigger: 'After my morning drink, before email, I open today\'s card. (Easy to change.)',
    warmup: 'Save one interesting job ad',
    minimum: 'Send one message or save one role',
    ifthen: [['I get a rejection', 'log it and send one more thing the same day'], ['no replies for 2 weeks', 'change the message, not the volume']],
    first: 'Write down the job title you want and find one real ad for it',
    habit: 'One thing sent before email',
    tune: ['What role are you aiming for, and what makes you credible for it today?', 'What has stopped your job search before?', 'How many hours a week can you really give this?'] },

  { id: 'study', arch: 'habit', horizon: 6,
    kw: ['study', 'exam', 'course', 'certification', 'certificate', 'degree', 'revise', 'revision', 'gre', 'gmat', 'ielts', 'toefl', 'sat', 'class', 'coding', 'code', 'programming', 'python', 'javascript', 'data', 'analytics', 'machine learning', 'statistics', 'math', 'maths', 'skill', 'learn'],
    title: 'Study most days',
    near: 'Finish one course or syllabus section a month',
    lanes: [
      { key: 'S', name: 'Study', purpose: 'Steady contact with the material', color: '#2463a6',
        m: [['session', 'Study session', 'days', 5]],
        themes: { fri: 'Review the week' },
        starters: ['Open the course and do the next 10 minutes'] },
      { key: 'P', name: 'Practise', purpose: 'Use it, don\'t just read it', color: '#2f6f5e',
        m: [['practice', 'Practice set or mini-project', 'events', 2]],
        starters: ['Do 3 practice questions or one tiny exercise'] },
    ],
    trigger: 'After my evening meal, I open the course. (Easy to change.)',
    warmup: 'Re-read yesterday\'s notes for 2 minutes',
    minimum: 'Do one question or read one page',
    ifthen: [['I\'m stuck', 'write down the exact question and move to the next thing']],
    first: 'Choose the one course or resource you\'ll use and open it',
    habit: 'Open the course after dinner',
    tune: ['What exactly are you studying, and by when?', 'What stopped your last attempt to study something?', 'Do you learn better by reading, videos, or doing?'] },

  { id: 'money', arch: 'habit', horizon: 12,
    kw: ['save', 'saving', 'savings', 'money', 'budget', 'budgeting', 'debt', 'deposit', 'spend', 'spending', 'finances', 'financial', 'emergency fund', 'pay off', 'frugal'],
    title: 'A calm money habit',
    near: 'Track spending on most days for 8 weeks',
    lanes: [
      { key: 'M', name: 'Money', purpose: 'Know where it goes', color: '#2f6f5e',
        m: [['log', 'Logged today\'s spending', 'days', 5], ['review', 'Weekly money review', 'events', 1]],
        themes: { sun: 'Weekly review (10 min)' },
        starters: ['Write down everything you spent yesterday'] },
    ],
    trigger: 'After dinner, I note today\'s spending. (Easy to change.)',
    warmup: 'Check one account balance',
    minimum: 'Note one purchase',
    ifthen: [['I overspend', 'log it without judgement; the log matters, not the number']],
    first: 'Write down what you spent yesterday',
    habit: 'Note spending after dinner',
    tune: ['What is the money for, and roughly by when?', 'What has made budgeting stop working before?', 'Paper, spreadsheet, or app?'],
    note: 'This is a habit plan, not financial advice.' },

  { id: 'calm', arch: 'habit', horizon: 3,
    kw: ['meditate', 'meditation', 'mindful', 'mindfulness', 'calm', 'calmer', 'anxiety', 'anxious', 'stress', 'stressed', 'breathe', 'breathing', 'gratitude', 'present', 'relax'],
    title: 'A few calm minutes daily',
    near: 'Sit on 5 days a week for 6 weeks',
    lanes: [
      { key: 'C', name: 'Calm', purpose: 'A short daily sit', color: '#2f6f5e',
        m: [['sit', 'Sat (even 2 minutes)', 'days', 5]],
        starters: ['Sit and take 10 slow breaths'] },
    ],
    trigger: 'After I brush my teeth in the morning, I sit for 2 minutes. (Easy to change.)',
    warmup: 'Three slow breaths',
    minimum: 'Three slow breaths',
    ifthen: [['my mind won\'t settle', 'count 10 breaths; that\'s the whole session']],
    first: 'Sit down now and take 10 slow breaths',
    habit: 'Three breaths after brushing teeth',
    tune: ['What do you hope a calmer mind changes for you?', 'Have you tried meditating before? What happened?', 'Guided audio or silence?'],
    note: 'Not a substitute for professional help with anxiety or mental health.' },

  { id: 'build', arch: 'project', horizon: 6,
    kw: ['build', 'app', 'website', 'site', 'launch', 'startup', 'business', 'side project', 'side hustle', 'product', 'ship', 'game', 'podcast', 'channel', 'youtube', 'shop', 'etsy', 'saas', 'tool', 'open source'],
    title: 'Ship something weekly',
    near: 'A first version someone else has used, by month 2',
    lanes: [
      { key: 'B', name: 'Build', purpose: 'Small, shippable steps', color: '#2f6f5e',
        m: [['session', 'Build session', 'days', 4], ['shipped', 'Shipped a small piece', 'events', 1]],
        themes: { fri: 'Ship something, however small' },
        starters: ['Write the one-sentence version of what you\'re building', 'Do the smallest next step'] },
      { key: 'U', name: 'Users', purpose: 'Real people see it', color: '#c2590a',
        m: [['shown', 'Showed it to someone / asked for feedback', 'events', 1], ['users', 'Person used it', 'events', 0, true]],
        starters: ['Name 3 people who might use it'] },
    ],
    trigger: 'After my morning drink, I open the project before anything else. (Easy to change.)',
    warmup: 'Read yesterday\'s note to self',
    minimum: 'Write tomorrow\'s next step',
    ifthen: [['I want to add features', 'write them on a later list; ship what exists'], ['I\'m stuck', 'show it to someone as it is']],
    first: 'Write one sentence: what it is and who it\'s for',
    habit: 'Open the project before email',
    tune: ['What are you building, and who is it for?', 'What happened to your last side project?', 'How many hours a week do you have?'] },

  { id: 'reading', arch: 'habit', horizon: 6,
    kw: ['read', 'reading', 'books', 'novels', 'kindle'],
    title: 'Read most days',
    near: 'Finish one book a month',
    lanes: [
      { key: 'R', name: 'Read', purpose: 'A few pages daily', color: '#2463a6',
        m: [['read', 'Read (any amount)', 'days', 5]],
        starters: ['Read 2 pages'] },
    ],
    trigger: 'After I get into bed, I read before my phone. (Easy to change.)',
    warmup: 'Read one page',
    minimum: 'Read one page',
    ifthen: [['the book is a slog', 'drop it and start one I want to read']],
    first: 'Put the book on your pillow now',
    habit: 'One page before the phone',
    tune: ['What do you want to read, and why now?', 'What usually takes reading time instead?', 'Paper, e-reader or audio?'] },

  { id: 'sleep', arch: 'habit', horizon: 3,
    kw: ['sleep', 'bedtime', 'bed earlier', 'wake up', 'wake early', 'early riser', 'insomnia', 'tired', 'morning routine', 'night routine', 'screen time', 'phone less', 'doomscroll'],
    title: 'Wind down on time',
    near: 'In bed at my target time on 4 nights a week',
    lanes: [
      { key: 'S', name: 'Sleep', purpose: 'A steady wind-down', color: '#2463a6',
        m: [['winddown', 'Phone away at wind-down time', 'days', 5], ['ontime', 'In bed by target time', 'days', 4]],
        starters: ['Set a wind-down alarm 30 minutes before bed'] },
    ],
    trigger: 'When the wind-down alarm rings, the phone goes on the charger outside the bedroom. (Easy to change.)',
    warmup: 'Dim the lights',
    minimum: 'Phone on the charger at wind-down time',
    ifthen: [['I can\'t sleep', 'get up, read something dull, back to bed when sleepy']],
    first: 'Set a daily wind-down alarm now',
    habit: 'Phone charges outside the bedroom',
    tune: ['What time do you want to be asleep, and what time do you wake?', 'What keeps you up most often?', 'Anything else (kids, shifts) that affects your nights?'],
    note: 'Not medical advice; see a doctor for ongoing sleep problems.' },

  { id: 'create', arch: 'habit', horizon: 6,
    kw: ['draw', 'drawing', 'paint', 'painting', 'sketch', 'sketching', 'art', 'photo', 'photography', 'illustrate', 'design', 'craft', 'knit', 'knitting', 'sew', 'pottery', 'creative', 'dance', 'dancing'],
    title: 'Make something most days',
    near: 'A small body of 30 pieces by month 3',
    lanes: [
      { key: 'C', name: 'Create', purpose: 'Quantity before quality', color: '#c2590a',
        m: [['piece', 'Made something (any size)', 'days', 5], ['shared', 'Shared a piece', 'events', 1]],
        starters: ['Make one small thing in 5 minutes'] },
    ],
    trigger: 'After dinner, I put my materials on the table. (Easy to change.)',
    warmup: 'One 2-minute sketch or study',
    minimum: 'Make one tiny thing',
    ifthen: [['I don\'t like what I made', 'it still counts; quantity first']],
    first: 'Leave your materials out where you\'ll see them',
    habit: 'Materials out after dinner',
    tune: ['What do you want to make, and what would progress look like?', 'What stopped you before?', 'Do you want to share your work, or keep it private?'] },

  { id: 'garden', arch: 'habit', horizon: 6, strong: ['garden', 'gardening', 'grow', 'growing', 'balcony', 'allotment'],
    kw: ['garden', 'gardening', 'grow', 'growing', 'plants', 'plant', 'balcony', 'allotment', 'herbs', 'seeds', 'sow', 'compost', 'vegetable patch', 'terrace', 'houseplants', 'kitchen garden'],
    title: 'Tend the garden most days',
    near: 'Something you grew, harvested or flowering by month 3',
    lanes: [
      { key: 'T', name: 'Tend', purpose: 'A few minutes with the plants', color: '#2f6f5e',
        m: [['tend', 'Checked and watered', 'days', 5]],
        themes: { sat: 'Weed, tidy, and look at what\'s working' },
        starters: ['Check the soil with a finger and water anything dry'] },
      { key: 'G', name: 'Grow', purpose: 'Small steps that add up', color: '#c2590a',
        m: [['grow', 'Sowed, planted or built something', 'events', 1]],
        themes: { sun: 'One growing step' },
        starters: ['List 3 easy things to grow in your space', 'Get one pot, soil and seeds'] },
    ],
    trigger: 'After my morning drink, I step out to the plants. (Easy to change.)',
    warmup: 'Look at every plant for a minute',
    minimum: 'Check the soil and water anything dry',
    ifthen: [['a plant dies', 'note why, and try one easier plant'], ['it\'s raining', 'skip watering; just look and log it']],
    first: 'Pick one spot and list 3 easy things to grow there',
    habit: 'A morning look at the plants',
    tune: ['What do you want to grow, and where?', 'Have you grown things before? What happened?', 'How much space and sun do you have?'] },

  { id: 'eating', arch: 'habit', horizon: 6,
    kw: ['eat', 'eating', 'diet', 'food', 'cook', 'cooking', 'vegetables', 'veg', 'sugar', 'nutrition', 'meal', 'meals', 'snacking', 'healthier'],
    title: 'Eat a bit better',
    near: 'Cook at home 4 times a week for 8 weeks',
    lanes: [
      { key: 'E', name: 'Eat', purpose: 'Small, repeatable food habits', color: '#2f6f5e',
        m: [['cooked', 'Cooked a meal at home', 'days', 4], ['veg', 'Vegetables with a meal', 'days', 5]],
        themes: { sun: 'Plan 3 meals for the week' },
        starters: ['Write 3 simple meals you like'] },
    ],
    trigger: 'When I get home, I check what\'s for dinner before sitting down. (Easy to change.)',
    warmup: 'Drink a glass of water',
    minimum: 'Add one vegetable to one meal',
    ifthen: [['I eat badly one day', 'just the minimum next meal; no "start again Monday"']],
    first: 'Write down 3 simple meals you\'d happily eat this week',
    habit: 'Vegetables with dinner',
    tune: ['What does "eating better" mean for you, specifically?', 'What has derailed food changes before?', 'Any dietary needs or health conditions?'],
    note: 'Habits only, not medical or dietary advice.' },
];

const GENERIC = {
  habit: { id: 'habit', arch: 'habit', horizon: 3, kw: [],
    title: 'A little, most days',
    near: 'Do it on 4 days a week for 8 weeks',
    lanes: [{ key: 'A', name: 'Do it', purpose: 'Show up most days', color: '#2f6f5e',
      m: [['session', 'Did it (any amount)', 'days', 4]], starters: ['Do the smallest possible version for 2 minutes'] }],
    trigger: 'After my morning drink, I do the smallest version. (Easy to change.)',
    warmup: 'Two minutes counts',
    minimum: 'Two minutes',
    ifthen: [],
    first: 'Do the 2-minute version right now',
    habit: 'Two minutes after the morning drink' },
  project: { id: 'project', arch: 'project', horizon: 6, kw: [],
    title: 'Small steps, shipped weekly',
    near: 'A first finished version by month 2',
    lanes: [{ key: 'P', name: 'Project', purpose: 'Steady progress on the work', color: '#2f6f5e',
      m: [['session', 'Work session', 'days', 4], ['done', 'Finished a piece', 'events', 1]],
      themes: { fri: 'Finish something small' },
      starters: ['Write down the next step that takes under 15 minutes'] }],
    trigger: 'After my morning drink, I open the project first. (Easy to change.)',
    warmup: 'Read yesterday\'s note to self',
    minimum: 'Write tomorrow\'s next step',
    ifthen: [['I\'m stuck', 'make the next step smaller, or ask someone']],
    first: 'Write the next step that takes under 15 minutes, and start it',
    habit: 'Open the project first thing' },
};

const PROJECT_VERBS = /\b(finish|complete|launch|create|make|build|publish|release|organi[sz]e|renovate|plan|prepare)\b/i;

function norm(s) { return ' ' + String(s).toLowerCase().replace(/[^a-z0-9À-ɏ]+/g, ' ').trim() + ' '; }

/** Returns {template, keyword, score} for a goal sentence. */
function matchTemplate(goal) {
  const g = norm(goal);
  let best = null;
  for (const t of TEMPLATES) {
    let score = 0, kwHit = null;
    for (const k of t.kw) {
      if (g.includes(' ' + k + ' ')) {
        const w = k === 'learn' ? 0.3 : (t.strong && t.strong.includes(k)) ? 3 : (k.includes(' ') ? 2 : 1);
        score += w;
        if (!kwHit || w >= 1) kwHit = kwHit && kwHit.w >= w ? kwHit : { k, w };
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { template: t, keyword: kwHit && kwHit.k, score };
  }
  if (best && best.score >= 0.9) return best;
  const t = PROJECT_VERBS.test(goal) ? GENERIC.project : GENERIC.habit;
  return { template: t, keyword: null, score: 0 };
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function parseHorizon(goal, dflt) {
  const m = /\b(\d{1,3})\s*(week|month|year)s?\b/i.exec(goal);
  if (!m) return dflt;
  const n = +m[1], u = m[2].toLowerCase();
  const months = u === 'week' ? Math.ceil(n / 4.3) : u === 'year' ? n * 12 : n;
  return Math.min(120, Math.max(1, months));
}

/** Builds a complete plan.json object from a goal sentence. */
function instantPlanFromTemplate(goal, today) {
  goal = String(goal).trim().slice(0, 300);
  const { template: t, keyword } = matchTemplate(goal);
  const GENERIC_KW = ['language', 'conversational', 'fluent', 'fluency', 'vocabulary', 'speak', 'instrument', 'music'];
  let X = '';
  if (t.id === 'language') X = keyword && !GENERIC_KW.includes(keyword) ? cap(keyword) : 'the language';
  if (t.id === 'instrument') X = keyword && !GENERIC_KW.includes(keyword) ? keyword : 'instrument';
  const fill = (s) => (s || '').replace(/\{X\}/g, X);
  const fillCap = (s) => cap(fill(s));
  const lanes = t.lanes.map(l => {
    const lane = {
      key: l.key, name: fillCap(l.name), archetype: l.arch || t.arch, purpose: fill(l.purpose), color: l.color,
      measures: l.m.map(([key, label, count, target, outcome]) => Object.assign(
        { key, label: fill(label), count, target_per_week: target }, outcome ? { outcome: true } : {})),
    };
    if (l.themes) lane.themes = Object.fromEntries(Object.entries(l.themes).map(([d, v]) => [d, fill(v)]));
    if (l.starters) lane.starter_actions = l.starters.map(fill);
    if (l.pipeline) lane.pipeline = true;
    return lane;
  });
  const controllable = lanes.flatMap(l => l.measures.filter(m => !m.outcome));
  const lead = controllable[0];
  const minHits = Math.max(1, Math.min(controllable.length, Math.round(controllable.length * 0.7)));
  const archetypes = [...new Set([t.arch, ...lanes.map(l => l.archetype)])];
  const plan = {
    schema_version: '1',
    meta: { title: fill(t.title).slice(0, 80), created: today, source: 'instant' },
    goal: { statement: goal.length >= 3 ? goal : 'My goal', horizon_months: parseHorizon(goal, t.horizon), near_target: fill(t.near), archetypes },
    blocker: { type: 'consistency', note: 'Assumed; tune to change.' },
    lanes,
    ritual: {
      trigger: fill(t.trigger), warmup: fill(t.warmup),
      day_shape: ['Cue: ' + fill(t.warmup).toLowerCase(), 'Today\'s first action for each lane', 'Tap what you did (10 seconds)'],
      minimum_day: fill(t.minimum),
      shutdown: 'Tap what you did; glance at tomorrow\'s first action',
      if_then: [...(t.ifthen || []), ...DEFAULT_IF_THEN].slice(0, 4).map(([a, b]) => ({ if: fill(a), then: fill(b) })),
      weekly_win: { min_hits: minHits },
      dailyish_days: 4,
    },
    checkpoints: [
      { label: 'Week 4', after_weeks: 4, keep_going_if: { [lead.key]: Math.max(1, Math.round(lead.target_per_week * 4 * 0.7)) },
        ask: 'Is the minimum day small enough for your worst days?' },
      { label: 'Month 3', after_weeks: 13, keep_going_if: { weekly_wins: 8 },
        rethink_if: 'fewer than 6 weekly wins → make it smaller, not stricter',
        ask: 'Is this helping, or just tracking? What would make it easier?' },
    ],
    surviving_habit: fill(t.habit),
    first_action: { text: fill(t.first), done: false },
    tune_questions: (t.tune || DEFAULT_TUNE).map(fill),
    compass: `WHY: ${goal}\nHOW: ${fill(t.trigger).replace(/ \(Easy to change\.\)$/, '')} ${lead.label}: ${lead.target_per_week}× a week.\nIF IT SLIPS: do the minimum day (${fill(t.minimum).toLowerCase()}). Missing a day is normal; just don't miss twice.`,
    notes: `Made instantly from the built-in "${t.id}" template. Assumptions: modest targets, a morning or evening cue, no history yet.${t.note ? ' ' + t.note : ''}`,
  };
  return plan;
}

if (typeof module !== 'undefined') module.exports = { TEMPLATES, GENERIC, matchTemplate, instantPlanFromTemplate };
