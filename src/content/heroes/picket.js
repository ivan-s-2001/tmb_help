import { createDefaultHeroPages } from './createDefaultHeroPages'

const heroBase = {
  id: 'picket',
  name: 'Picket',
  tagline: 'танк и контроль фронта',
  description: 'Плотный защитник с щитом, провокацией, крепкой обороной и понятной передней линией.',
  accent: '#ffb067',
  visualAssetId: 'character.picket.portrait',
  coreDieIndex: 0,
}

export const picketContent = {
  ...heroBase,
  pages: createDefaultHeroPages(heroBase),
}
