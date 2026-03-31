/* =========================================================
   BARROW QUEST QA LOGIC
   FULL REPLACEMENT
   - logic/riddle bank
   - tier-aware wording
   - seeded option shuffle
   - stable ids
========================================================= */

function seededIndex(length, salt = 0) {
  if (!length) return 0;
  const n = Math.abs(Number(salt) || 0);
  return n % length;
}

function pickOne(arr, salt = 0) {
  if (!Array.isArray(arr) || !arr.length) return null;
  return arr[seededIndex(arr.length, salt)];
}

function shuffleSeeded(arr, salt = 0) {
  const out = [...arr];
  let seed = Math.abs(Number(salt) || Date.now());

  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

export function getTieredText(value, tier = "kid") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value[tier] || value.kid || Object.values(value)[0] || "";
  }
  return "";
}

export function makeQuestionId(prefix, entry) {
  if (entry?.id) return String(entry.id);

  if (typeof entry === "string") {
    return `${prefix}_${slugify(entry)}`;
  }

  if (entry?.q && Array.isArray(entry?.options)) {
    const qText =
      typeof entry.q === "string" ? entry.q : getTieredText(entry.q, "kid");
    return `${prefix}_${slugify(qText)}`;
  }

  if (entry?.q && entry?.a) {
    const qText =
      typeof entry.q === "string" ? entry.q : getTieredText(entry.q, "kid");
    return `${prefix}_${slugify(qText)}_${slugify(entry.a)}`;
  }

  return `${prefix}_item`;
}

export function attachIds(pool, prefix) {
  return (pool || []).map((item, idx) => {
    if (typeof item === "string") {
      return {
        _type: "prompt",
        id: makeQuestionId(`${prefix}_${idx}`, item),
        value: item,
      };
    }

    return {
      ...item,
      id: makeQuestionId(`${prefix}_${idx}`, item),
    };
  });
}

export function makeFallbackTask(message, meta = {}) {
  return {
    id: `fallback_${slugify(message) || "task"}`,
    q: message,
    options: ["DONE", "NOT YET", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: { fallback: true, ...meta },
  };
}

/* =========================================================
   RIDDLE / LOGIC BANK
========================================================= */

export const RIDDLE_POOL = [
  {
    q: {
      kid: "What has keys all over it, but still can’t open locks?",
      teen: "What has loads of keys but is useless at opening locks?",
      adult: "What has many keys, but none of them can open a lock?",
    },
    a: "A piano",
  },
  {
    q: {
      kid: "What has hands but never gives you a high five?",
      teen: "What has hands but can’t clap, wave, or fight?",
      adult: "What has hands, but can’t clap, hold, or touch?",
    },
    a: "A clock",
  },
  {
    q: {
      kid: "What gets wetter every time it helps dry something?",
      teen: "What’s meant to dry things… but ends up wetter instead?",
      adult: "What is used for drying, yet becomes wetter with use?",
    },
    a: "A towel",
  },
  {
    q: {
      kid: "What do you go up and down on, but it stays in the same place?",
      teen: "What do people go up and down on all day, but it never moves?",
      adult: "What is used for movement up and down, but never moves itself?",
    },
    a: "Stairs",
  },
  {
    q: {
      kid: "What has one eye, but can’t see at all?",
      teen: "What has one eye but is completely blind?",
      adult: "What has an eye, yet lacks all ability to see?",
    },
    a: "A needle",
  },
  {
    q: {
      kid: "What has a neck but no head?",
      teen: "What has a neck, but no head at all?",
      adult: "What has a neck, yet no head?",
    },
    a: "A bottle",
  },
  {
    q: {
      kid: "What can run, but doesn’t have legs?",
      teen: "What runs but has no legs at all?",
      adult: "What runs, but has no physical form to walk?",
    },
    a: "Water",
  },
  {
    q: {
      kid: "What has lots of teeth but doesn’t bite?",
      teen: "What has loads of teeth but is harmless?",
      adult: "What has numerous teeth, but no ability to bite?",
    },
    a: "A comb",
  },
  {
    q: {
      kid: "What can you catch, but never throw?",
      teen: "What can you catch, but you definitely can’t throw back?",
      adult: "What can be caught, yet cannot be thrown?",
    },
    a: "A cold",
  },
  {
    q: {
      kid: "The more you take, the more you leave behind. What am I?",
      teen: "The more you take, the more you leave behind — what is it?",
      adult: "The more you take, the more you leave behind. What are they?",
    },
    a: "Footsteps",
  },
  {
    q: {
      kid: "What comes down, but never goes back up?",
      teen: "What falls down, but never rises back up?",
      adult: "What comes down, yet never returns upward?",
    },
    a: "Rain",
  },
  {
    q: {
      kid: "What has lots of cities, but no houses?",
      teen: "What has cities all over it, but no actual houses?",
      adult: "What contains cities, yet no houses?",
    },
    a: "A map",
  },
  {
    q: {
      kid: "What can fill a whole room, but doesn’t take up any space?",
      teen: "What can fill a room completely, but takes up no space at all?",
      adult: "What can fill an entire room, yet occupies no space?",
    },
    a: "Light",
  },
  {
    q: {
      kid: "What goes up every year, but never comes back down?",
      teen: "What keeps going up, but never drops back down?",
      adult: "What increases steadily, yet never decreases?",
    },
    a: "Your age",
  },
  {
    q: {
      kid: "What is full of holes, but still holds water?",
      teen: "What’s covered in holes, but still manages to hold water?",
      adult: "What is full of holes, yet still retains water?",
    },
    a: "A sponge",
  },
  {
    q: {
      kid: "What is always coming, but never actually gets here?",
      teen: "What’s always on the way, but never really arrives?",
      adult: "What is always approaching, yet never truly arrives?",
    },
    a: "Tomorrow",
  },
  {
    q: {
      kid: "What can’t be used until it’s broken?",
      teen: "What only becomes useful after you break it?",
      adult: "What cannot be used until it has been broken?",
    },
    a: "An egg",
  },
  {
    q: {
      kid: "What disappears as soon as you say its name?",
      teen: "What vanishes the moment you say it out loud?",
      adult: "What disappears the instant its name is spoken?",
    },
    a: "Silence",
  },
  {
    q: {
      kid: "What has a ring, but no finger?",
      teen: "What has a ring, but never goes on your hand?",
      adult: "What has a ring, yet no finger?",
    },
    a: "A phone",
  },
  {
    q: {
      kid: "What has branches, but no leaves?",
      teen: "What has branches, but none of them grow leaves?",
      adult: "What has branches, yet no leaves?",
    },
    a: "A bank",
  },
];

/* =========================================================
   DISTRACTOR BANKS
========================================================= */

const RIDDLE_FUNNY = {
  kid: [
    "A confused potato in a wizard hat",
    "Your dad’s lost TV remote",
    "A chicken wearing sunglasses",
    "A penguin driving a bus",
  ],
  teen: [
    "Your group chat at 2am",
    "A dramatic pigeon with attitude",
    "A seagull running a business",
    "Your mate after one hour of sleep",
  ],
  adult: [
    "That one drawer full of random cables",
    "Your sat-nav after a wrong turn",
    "A neighbour with strong opinions",
    "The weekly shop before payday",
  ],
};

const RIDDLE_CLOSE = {
  kid: ["A shadow", "A map", "A mirror", "A clock"],
  teen: ["An echo", "A sign", "A picture", "A tool"],
  adult: ["A symbol", "A signal", "A reflection", "A marker"],
};

const RIDDLE_VERY_CLOSE = {
  kid: ["A book", "A bottle", "A road", "A bell"],
  teen: ["A keypad", "A notebook", "A footprint", "A tower"],
  adult: ["A memory", "A pattern", "A route", "A record"],
};

/* =========================================================
   PUBLIC BUILDERS
========================================================= */

export function getLogicPool(prefix = "logic") {
  return attachIds(RIDDLE_POOL, prefix);
}

export function makeMcqFromRiddle(riddle, tier = "kid", salt = 0, forcedId = null) {
  if (!riddle?.q || !riddle?.a) {
    return makeFallbackTask("Broken riddle entry.", { mode: "logic" });
  }

  const correct = riddle.a;
  const funny = pickOne(RIDDLE_FUNNY[tier], salt + 11) || "A confused potato";
  const close = pickOne(RIDDLE_CLOSE[tier], salt + 22) || "A shadow";
  const veryClose = pickOne(RIDDLE_VERY_CLOSE[tier], salt + 33) || "A map";

  let options = [correct, veryClose, close, funny];
  options = [...new Set(options)];

  while (options.length < 4) {
    options.push(`Option ${options.length + 1}`);
  }

  const shuffled = shuffleSeeded(options, salt);
  const answer = shuffled.indexOf(correct);
  const riddleText = getTieredText(riddle.q, tier);

  return {
    id: forcedId || riddle.id || makeQuestionId("logic", riddle),
    q: riddleText,
    options: shuffled,
    answer,
    fact: riddle.a,
    meta: { type: "riddle", tier, mode: "logic" },
  };
}
