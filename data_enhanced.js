// Converted from data_enhanced.py
const regions = {
  eastern: {
    name: "Baloch of Eastern Region",
    description: "Eastern Baloch traditions shaped by coastal plains, trade, and woven storytelling.",
    stories: [
      "The sailor who mapped the stars into songs.",
      "A mother weaving memories into a dowry cloth."
    ],
    songs: [
      "Coastal lullaby – tide and time",
      "Harbor chorus – call and response"
    ],
    patterns: [
      "Linear wave border",
      "Shell-motif embroidery"
    ],
    folk_stories: [
      {
        title: "رپایین (The Magic Lamp)",
        text: "تیب اتن کی رمدے ُء کی ے۔اے دوںیئ نج ُء رمد کسّ ابز رغبی اِت اَتن۔کی روےچ تیب اے رمد ُء نج ہپ الپ ِء اسحبَء ابز ویبس تنب۔ڑگا ٛوگتیش: نینج ویت رمد َءرا \"وت رمدےنی ےئ کشُح َء ہم دنن۔ّاسری َء ےئم روچ رشْوگزگ َء ہن اتن، ونں ااگں اکر ہم رتیسُت امونں ہچ ش َء اجنجل ںیئب۔وت ربو اکر ُء روزاگرے درجیگ ہکنت ینم ُء یئت ارموز درتمی َء ہب روتاِتن۔\"ڑگا رمد ٓارا وجاب دتن ُء ٛوگتیش:\"رشںی ب انن ہب دےئ۔نم روںی اکر ُء روزاگرےںینک۔",
        origin: "Baloch Folk Heritage",
        language: "Balochi"
      }
    ]
  },
  western: {
    name: "Baloch of Western Region",
    description: "Western highland customs, oral epics, and mountain craft traditions.",
    stories: [
      "The mountain courier who carried promises across valleys.",
      "The elder who taught children the language of stones."
    ],
    songs: [
      "Highland chant – echo and call",
      "Nomad ballad – journey and return"
    ],
    patterns: [
      "Chevron peak stitch",
      "Stone-edge geometric"
    ],
    folk_stories: [
      {
        title: "رپایین (The Magic Lamp)",
        text: "تیب اتن کی رمدے ُء کی ے۔اے دوںیئ نج ُء رمد کسّ ابز رغبی اِت اَتن۔کی روےچ تیب اے رمد ُء نج ہپ الپ ِء اسحبَء ابز ویبس تنب۔ڑگا ٛوگتیش: نینج ویت رمد َءرا \"وت رمدےنی ےئ کشُح َء ہم دنن۔ّاسری َء ےئم روچ رشْوگزگ َء ہن اتن، ونں ااگں اکر ہم رتیسُت امونں ہچ ش َء اجنجل ںیئب۔وت ربو اکر ُء روزاگرے درجیگ ہکنت ینم ُء یئت ارموز درتمی َء ہب روتاِتن۔\"ڑگا رمد ٓارا وجاب دتن ُء ٛوگتیش:\"رشںی ب انن ہب دےئ۔نم روںی اکر ُء روزاگرےںینک۔",
        origin: "Baloch Folk Heritage",
        language: "Balochi"
      }
    ]
  },
  southern: {
    name: "Baloch of Southern Region",
    description: "Southern coastal and plain customs, a fusion of sea, spice and market rhythms.",
    stories: [
      "The market storyteller who traded tales for tea.",
      "The fisherwoman who saved a village with a song."
    ],
    songs: [
      "Market rhythm – lively and communal",
      "Sea chant – call of the nets"
    ],
    patterns: [
      "Market stripe weaving",
      "Spice-dye motifs"
    ],
    folk_stories: [
      {
        title: "رپایین (The Magic Lamp)",
        text: "تیب اتن کی رمدے ُء کی ے۔اے دوںیئ نج ُء رمد کسّ ابز رغبی اِت اَتن۔کی روےچ تیب اے رمد ُء نج ہپ الپ ِء اسحبَء ابز ویبس تنب۔ڑگا ٛوگتیش: نینج ویت رمد َءرا \"وت رمدےنی ےئ کشُح َء ہم دنن۔ّاسری َء ےئم روچ رشْوگزگ َء ہن اتن، ونں ااگں اکر ہم رتیسُت امونں ہچ ش َء اجنجل ںیئب۔وت ربو اکر ُء روزاگرے درجیگ ہکنت ینم ُء یئت ارموز درتمی َء ہب روتاِتن۔\"ڑگا رمد ٓارا وجاب دتن ُء ٛوگتیش:\"رشںی ب انن ہب دےئ۔نم روںی اکر ُء روزاگرےںینک۔",
        origin: "Baloch Folk Heritage",
        language: "Balochi"
      }
    ]
  }
};

const culturalCategories = {
  folk_stories: {
    count: 156,
    icon: "fas fa-book-open",
    description: "Ancient tales of heroes, spirits, and the land passed down through generations."
  },
  traditional_music: {
    count: 89,
    icon: "fas fa-music",
    description: "Haunting melodies played on sorod and benjo, telling stories of love and land."
  },
  embroidery_patterns: {
    count: 234,
    icon: "fas fa-palette",
    description: "Intricate needlework designs that have adorned Balochi garments for centuries."
  },
  traditional_recipes: {
    count: 67,
    icon: "fas fa-utensils",
    description: "Savory dishes and sweet treats that define Balochi hospitality and gatherings."
  },
  festivals_events: {
    count: 45,
    icon: "fas fa-calendar-alt",
    description: "Celebrations and gatherings that mark the rhythms of Balochi seasons and milestones."
  }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    regions, 
    culturalCategories 
  };
}
