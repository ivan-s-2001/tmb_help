export function createDefaultHeroPages(hero) {
  const { name, tagline, description, coreDieIndex = 0 } = hero

  return [
    {
      id: 'menu',
      slug: '',
      label: 'Главное',
      tabLabel: 'Главное',
      title: 'Главное',
      description: 'Быстрый вход в пространство героя и переход к нужным страницам.',
      lead: `Страницы ${name} собраны здесь. Открой нужную и переходи дальше без лишнего шума.`,
      sections: [
        {
          id: 'hero-pages',
          title: 'Куда идти дальше',
          description: 'Каждая страница — отдельный смысловой экран внутри пространства героя.',
          blocks: [
            {
              id: 'hero-pages-links',
              type: 'cards',
              source: 'otherPages',
            },
            {
              id: 'hero-pages-route',
              type: 'route',
              title: 'Быстрый маршрут по помощнику',
              steps: [
                {
                  label: 'Открой нужную страницу',
                  note: 'Сначала выбери смысловой экран, а не пытайся читать всё сразу.',
                },
                {
                  label: 'Перейди в нужную секцию',
                  note: 'Сверху всегда доступен бургер, чтобы быстро прыгнуть к нужной части страницы.',
                },
                {
                  label: 'Вернись к решению',
                  note: 'Помощник должен ускорять ход, а не втягивать в лишнее чтение.',
                },
              ],
            },
          ],
        },
        {
          id: 'hero-role',
          title: 'Роль героя',
          description: 'Базовая точка, чтобы быстро вспомнить, зачем этот герой в партии.',
          blocks: [
            {
              id: 'hero-role-accent',
              type: 'accent',
              tone: 'important',
              eyebrow: 'Роль',
              title: tagline,
              text: description,
            },
            {
              id: 'hero-role-fact',
              type: 'fact',
              label: 'Фокус',
              value: tagline,
              note: `${name} должен усиливать партию через свою основную функцию.`,
            },
            {
              id: 'hero-role-die',
              type: 'die',
              heroDieIndex: coreDieIndex,
              eyebrow: 'Кубик',
              title: 'Ключевой дайс героя',
              text: 'Этот блок уже использует сущность дайса и его граней внутри живой страницы героя.',
              caption: 'Кубик и все грани приходят из dice/faces и используют asset-layer.',
            },
          ],
        },
      ],
    },
    {
      id: 'overview',
      slug: 'overview',
      label: 'Профиль',
      tabLabel: 'Профиль',
      title: 'Профиль',
      description: 'Короткий ориентир по роли героя и общему стилю игры за него.',
      lead: 'Короткий ориентир по роли героя и общему стилю игры за него.',
      sections: [
        {
          id: 'overview-basics',
          title: 'Базовый ориентир',
          description: 'Страница оставлена как общая заготовка.',
          blocks: [
            {
              id: 'overview-text',
              type: 'text',
              text: 'Здесь позже можно собрать полноценный профиль героя через страницы, секции и блоки.',
            },
          ],
        },
      ],
    },
    {
      id: 'prep',
      slug: 'prep',
      label: 'Старт',
      tabLabel: 'Старт',
      title: 'Старт',
      description: 'Спокойная стартовая точка перед началом партии.',
      lead: 'Быстрый вход перед началом партии и спокойная точка старта внутри героя.',
      sections: [
        {
          id: 'prep-basics',
          title: 'Подготовка',
          description: 'Страница оставлена как общая заготовка.',
          blocks: [
            {
              id: 'prep-text',
              type: 'text',
              text: 'Здесь позже можно собрать стартовую прокачку, подготовку и приоритеты героя.',
            },
          ],
        },
      ],
    },
    {
      id: 'blocks',
      slug: 'battle',
      label: 'Бой',
      tabLabel: 'Бой',
      title: 'Бой',
      description: 'Практика хода и живые решения во время партии.',
      lead: 'Здесь позже можно собрать практические боевые экраны героя.',
      sections: [
        {
          id: 'battle-basics',
          title: 'Практика',
          description: 'Страница оставлена как общая заготовка.',
          blocks: [
            {
              id: 'battle-text',
              type: 'text',
              text: 'Здесь позже можно собрать сценарии боя, ошибки и короткие шпаргалки героя.',
            },
          ],
        },
      ],
    },
  ]
}
