import boomerImage from './assets/characters/boomer.png'
import patchesImage from './assets/characters/patches.png'
import picketImage from './assets/characters/picket.png'
import tantrumImage from './assets/characters/tantrum.png'

function createHeroPages() {
  return [
    {
      id: 'menu',
      slug: '',
      label: 'Главное',
      title: 'Главное',
      description: 'Быстрый вход в пространство героя и переход к нужным страницам.',
      component: 'menu',
    },
    {
      id: 'overview',
      slug: 'overview',
      label: 'Профиль',
      title: 'Профиль',
      description: 'Короткий ориентир по роли героя и общему стилю игры за него.',
      component: 'overview',
    },
    {
      id: 'prep',
      slug: 'prep',
      label: 'Перед партией',
      title: 'Перед партией',
      description: 'Спокойная стартовая точка перед началом партии.',
      component: 'prep',
    },
  ]
}

export const gameAssets = {
  characters: [
    {
      id: 'patches',
      name: 'Patches',
      tagline: 'поддержка и гаджеты',
      description: 'Гибкий герой поддержки с точечным лечением, утилити-эффектами и аккуратным темпом игры.',
      image: patchesImage,
      accent: '#7ed3ff',
      pages: createHeroPages(),
    },
    {
      id: 'picket',
      name: 'Picket',
      tagline: 'танк и контроль фронта',
      description: 'Плотный защитник с щитом, провокацией, крепкой обороной и понятной передней линией.',
      image: picketImage,
      accent: '#ffb067',
      pages: createHeroPages(),
    },
    {
      id: 'tantrum',
      name: 'Tantrum',
      tagline: 'ярость и добивание',
      description: 'Агрессивный ближний бой с быстрым нарастанием угрозы и мощным давлением на врага.',
      image: tantrumImage,
      accent: '#ffd166',
      pages: createHeroPages(),
    },
    {
      id: 'boomer',
      name: 'Boomer',
      tagline: 'бомбы и рискованный урон',
      description: 'Взрывной персонаж с высокой угрозой, сильным burst-уроном и яркой атакующей подачей.',
      image: boomerImage,
      accent: '#ff8a80',
      pages: createHeroPages(),
    },
  ],
}
