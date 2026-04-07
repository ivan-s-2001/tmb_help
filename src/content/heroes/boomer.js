import { createDefaultHeroPages } from './createDefaultHeroPages'

const heroBase = {
  id: 'boomer',
  name: 'Boomer',
  tagline: 'бомбы и рискованный урон',
  description: 'Взрывной персонаж с высокой угрозой, сильным burst-уроном и яркой атакующей подачей.',
  accent: '#ff8a80',
  visualAssetId: 'character.boomer.portrait',
  coreDieIndex: 0,
}

export const boomerContent = {
  ...heroBase,
  pages: createDefaultHeroPages(heroBase),
}
