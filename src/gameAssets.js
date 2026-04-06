import boomerImage from './assets/characters/boomer.png'
import patchesImage from './assets/characters/patches.png'
import picketImage from './assets/characters/picket.png'
import tantrumImage from './assets/characters/tantrum.png'

export const gameAssets = {
  characters: [
    {
      id: 'patches',
      name: 'Патчес',
      tagline: 'поддержка и гаджеты',
      description: 'Гибкий герой поддержки с точечным лечением, утилити-эффектами и аккуратным темпом игры.',
      image: patchesImage,
      accent: '#7ed3ff',
    },
    {
      id: 'picket',
      name: 'Пикет',
      tagline: 'танк и контроль фронта',
      description: 'Плотный защитник с щитом, провокацией, крепкой обороной и понятной передней линией.',
      image: picketImage,
      accent: '#ffb067',
    },
    {
      id: 'tantrum',
      name: 'Тантрум',
      tagline: 'ярость и добивание',
      description: 'Агрессивный ближний бой с быстрым нарастанием угрозы и мощным давлением на врага.',
      image: tantrumImage,
      accent: '#ffd166',
    },
    {
      id: 'boomer',
      name: 'Бумер',
      tagline: 'бомбы и рискованный урон',
      description: 'Взрывной персонаж с высокой угрозой, сильным burst-уроном и яркой атакующей подачей.',
      image: boomerImage,
      accent: '#ff8a80',
    },
  ],
  materials: {
    characters: 'ready',
    dice: 'reserved',
    tokens: 'reserved',
    references: 'reserved',
  },
}
