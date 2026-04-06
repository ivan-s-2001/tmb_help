import boomerImage from './assets/characters/boomer.png'
import patchesImage from './assets/characters/patches.png'
import picketImage from './assets/characters/picket.png'
import tantrumImage from './assets/characters/tantrum.png'

function createHeroPages(hero) {
  const { name, tagline, description } = hero

  return [
    {
      id: 'menu',
      slug: '',
      label: 'Главное',
      tabLabel: 'Главное',
      title: 'Главное',
      description: 'Быстрый вход в пространство героя и переход к нужным страницам.',
      lead: `Страницы ${name} собраны здесь. Открой нужную и переходи дальше без лишнего шума.`,
      component: 'menu',
      sections: [
        {
          id: 'hero-pages',
          title: 'Куда идти дальше',
          description: 'Каждая страница — отдельный смысловой экран внутри пространства героя.',
          layout: 'pageLinks',
        },
        {
          id: 'space-rhythm',
          title: 'Как пользоваться страницами',
          description: 'Пространство героя должно помогать во время партии, а не отвлекать.',
          layout: 'cards',
          cards: [
            {
              title: 'Один экран — одна задача',
              text: 'Переходи только на ту страницу, которая нужна прямо сейчас по ситуации за столом.',
            },
            {
              title: 'Спокойная структура',
              text: 'Внутри каждой страницы смысловые части разделены, чтобы нужное находилось быстрее.',
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
      component: 'overview',
      sections: [
        {
          id: 'hero-role',
          title: 'Роль героя',
          description: 'Базовая точка, чтобы быстро вспомнить, зачем этот герой в партии.',
          layout: 'cards',
          cards: [
            {
              title: tagline,
              text: description,
            },
          ],
        },
        {
          id: 'hero-focus',
          title: 'Что держать в фокусе',
          description: 'Это не полный гайд, а быстрый ориентир перед решениями.',
          layout: 'checklist',
          items: [
            `Помни, что ${name} раскрывается через свою основную роль, а не через попытку делать всё сразу.`,
            'Используй профиль как короткое напоминание перед ходом или перед сменой контекста.',
            'Дальше переходи на более узкую страницу, когда нужен конкретный игровой вопрос.',
          ],
        },
      ],
    },
    {
      id: 'prep',
      slug: 'prep',
      label: 'Перед партией',
      tabLabel: 'Старт',
      title: 'Перед партией',
      description: 'Спокойная стартовая точка перед началом партии.',
      lead: 'Быстрый вход перед началом партии и спокойная точка старта внутри героя.',
      component: 'prep',
      sections: [
        {
          id: 'before-start',
          title: 'Перед стартом',
          description: 'Минимум того, что стоит проверить до первых решений.',
          layout: 'checklist',
          items: [
            'Проверь роль героя и состав партии.',
            'Открой нужную страницу героя до первого хода.',
            'Не тащи в голову всё сразу — начни с ближайшей задачи.',
          ],
        },
        {
          id: 'during-game',
          title: 'Во время партии',
          description: 'Сайт должен работать как опора прямо по ходу игры.',
          layout: 'checklist',
          items: [
            'Держи пространство героя под рукой во время игры.',
            'Переходи только между теми страницами, которые нужны в текущий момент.',
          ],
        },
        {
          id: 'focus',
          title: 'Что не терять из вида',
          description: 'Короткие ориентиры, чтобы не расползаться вниманием.',
          layout: 'cards',
          cards: [
            {
              title: 'Роль в бою',
              text: `Возвращайся к тому, как ${name} должен помогать партии именно сейчас.`,
            },
            {
              title: 'Следующий экран',
              text: 'Заранее понимай, на какую страницу нужно перейти перед своим следующим решением.',
            },
          ],
        },
      ],
    },
  ]
}

const heroes = [
  {
    id: 'patches',
    name: 'Patches',
    tagline: 'поддержка и гаджеты',
    description: 'Гибкий герой поддержки с точечным лечением, утилити-эффектами и аккуратным темпом игры.',
    image: patchesImage,
    accent: '#7ed3ff',
  },
  {
    id: 'picket',
    name: 'Picket',
    tagline: 'танк и контроль фронта',
    description: 'Плотный защитник с щитом, провокацией, крепкой обороной и понятной передней линией.',
    image: picketImage,
    accent: '#ffb067',
  },
  {
    id: 'tantrum',
    name: 'Tantrum',
    tagline: 'ярость и добивание',
    description: 'Агрессивный ближний бой с быстрым нарастанием угрозы и мощным давлением на врага.',
    image: tantrumImage,
    accent: '#ffd166',
  },
  {
    id: 'boomer',
    name: 'Boomer',
    tagline: 'бомбы и рискованный урон',
    description: 'Взрывной персонаж с высокой угрозой, сильным burst-уроном и яркой атакующей подачей.',
    image: boomerImage,
    accent: '#ff8a80',
  },
]

export const gameAssets = {
  characters: heroes.map((hero) => ({
    ...hero,
    pages: createHeroPages(hero),
  })),
}
