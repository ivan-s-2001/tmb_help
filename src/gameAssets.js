import { assetLayer, resolveHeroAssets } from './assetLayer'
import { heroContent } from './gameContent'

export const gameAssets = {
  assetLayer,
  characters: heroContent.map(resolveHeroAssets),
}
