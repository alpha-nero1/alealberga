export const locales = ['en', 'it', 'de', 'es', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const ui = {
  en: {
    nav: {
      specialisation: 'Specialisation',
      toolkit: 'Toolkit',
      achievements: 'Achievements',
      history: 'History',
      hobbies: 'Hobbies',
      contact: 'Contact',
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
      specialisation: 'Specializzazione',
      toolkit: 'Strumenti',
      achievements: 'Traguardi',
      history: 'Esperienza',
      hobbies: 'Hobby',
      contact: 'Contatti',
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
      specialisation: 'Spezialisierung',
      toolkit: 'Werkzeuge',
      achievements: 'Erfolge',
      history: 'Werdegang',
      hobbies: 'Hobbys',
      contact: 'Kontakt',
      blogs: 'Blog',
      cta: 'Kontaktieren',
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
      specialisation: 'Especialización',
      toolkit: 'Herramientas',
      achievements: 'Logros',
      history: 'Experiencia',
      hobbies: 'Aficiones',
      contact: 'Contacto',
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
      specialisation: '専門分野',
      toolkit: 'ツール',
      achievements: '実績',
      history: '経歴',
      hobbies: '趣味',
      contact: '連絡先',
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
      specialisation: '专长',
      toolkit: '技术栈',
      achievements: '成就',
      history: '经历',
      hobbies: '爱好',
      contact: '联系方式',
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
