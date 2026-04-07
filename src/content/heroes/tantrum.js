import { createDefaultHeroPages } from './createDefaultHeroPages'

const tantrumHeroBase = {
  id: 'tantrum',
  name: 'Tantrum',
  tagline: 'ярость и добивание',
  description: 'Агрессивный ближний бой с быстрым нарастанием угрозы и мощным давлением на врага.',
  accent: '#ffd166',
  visualAssetId: 'character.tantrum.portrait',
  coreDieIndex: 0,
}

export const tantrumContent = {
  ...tantrumHeroBase,
  pages: createDefaultHeroPages(tantrumHeroBase),
}
