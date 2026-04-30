export const locales = ['en', 'it', 'de', 'es', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const ui = {
  en: {
    nav: {
      craft: 'Craft',
      toolkit: 'Toolkit',
      impact: 'Impact',
      reputation: 'Reputation',
      now: 'Now',
      growth: 'Growth',
      blogs: 'Blogs',
      cta: "Let's Connect",
    },
    footer: {
      messages: [
        "Let's change the world together.",
        'Ready to get cooking?',
        "I'm excited to hear from you.",
        'Ready when you are!',
        'Got a challenging project? Music to my ears.',
      ],
    },
  },
  it: {
    nav: {
      craft: 'Lavoro',
      toolkit: 'Strumenti',
      impact: 'Impatto',
      reputation: 'Reputazione',
      now: 'Ora',
      growth: 'Crescita',
      blogs: 'Blog',
      cta: 'Contattiamoci',
    },
    footer: {
      messages: [
        'Cambiamo il mondo insieme.',
        'Pronti a metterci al lavoro?',
        "Non vedo l'ora di sentirti.",
        'Pronto quando vuoi!',
        'Hai un progetto sfidante? Musica per le mie orecchie.',
      ],
    },
  },
  de: {
    nav: {
      craft: 'Arbeit',
      toolkit: 'Werkzeuge',
      impact: 'Auswirkung',
      reputation: 'Reputation',
      now: 'Jetzt',
      growth: 'Wachstum',
      blogs: 'Blog',
      cta: 'Kontakt',
    },
    footer: {
      messages: [
        'Lass uns gemeinsam die Welt verändern.',
        'Bereit loszulegen?',
        'Ich freue mich, von dir zu hören.',
        'Bereit, wenn du es bist!',
        'Ein herausforderndes Projekt? Musik in meinen Ohren.',
      ],
    },
  },
  es: {
    nav: {
      craft: 'Trabajo',
      toolkit: 'Herramientas',
      impact: 'Impacto',
      reputation: 'Reputación',
      now: 'Ahora',
      growth: 'Crecimiento',
      blogs: 'Blog',
      cta: 'Conectemos',
    },
    footer: {
      messages: [
        'Cambiemos el mundo juntos.',
        '¿Listos para ponernos manos a la obra?',
        'Estoy emocionado de saber de ti.',
        '¡Listo cuando tú lo estés!',
        '¿Un proyecto desafiante? Música para mis oídos.',
      ],
    },
  },
  ja: {
    nav: {
      craft: '仕事',
      toolkit: 'ツール',
      impact: '実績',
      reputation: '評判',
      now: '近況',
      growth: '成長',
      blogs: 'ブログ',
      cta: 'お問い合わせ',
    },
    footer: {
      messages: [
        '一緒に世界を変えましょう。',
        'さあ、始めましょうか？',
        'ご連絡をお待ちしています。',
        'いつでもどうぞ！',
        'やりがいのあるプロジェクトですか？ぜひお聞かせください。',
      ],
    },
  },
  zh: {
    nav: {
      craft: '工作',
      toolkit: '技术栈',
      impact: '成果',
      reputation: '口碑',
      now: '近况',
      growth: '成长',
      blogs: '博客',
      cta: '联系我',
    },
    footer: {
      messages: [
        '让我们一起改变世界。',
        '准备好大干一场了吗？',
        '期待您的来信。',
        '随时准备好了！',
        '有挑战性的项目？正合我意。',
      ],
    },
  },
} satisfies Record<Locale, object>;
