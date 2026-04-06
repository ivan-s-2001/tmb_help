
import { assetLayer, resolveDieAssets, resolveDieFaceAssets, resolveHeroAssets } from './assetLayer'
import { heroContent } from './gameContent'
import { diceContent, dieFaceContent } from './gameDice'

const resolvedDieFacesBase = dieFaceContent.map(resolveDieFaceAssets)
const resolvedDieFacesBaseById = Object.fromEntries(
  resolvedDieFacesBase.map((dieFace) => [dieFace.id, dieFace]),
)

const resolvedDice = diceContent.map((die) =>
  resolveDieAssets(die, {
    dieFacesById: resolvedDieFacesBaseById,
  }),
)

const resolvedDiceById = Object.fromEntries(
  resolvedDice.map((die) => [die.id, die]),
)

const resolvedDieFaces = resolvedDieFacesBase.map((dieFace) => ({
  ...dieFace,
  die: resolvedDiceById[dieFace.dieId] ?? null,
}))

const resolvedDieFacesById = Object.fromEntries(
  resolvedDieFaces.map((dieFace) => [dieFace.id, dieFace]),
)

const resolvedDiceWithFaces = resolvedDice.map((die) => ({
  ...die,
  faces: die.faceIds.map((faceId) => resolvedDieFacesById[faceId]).filter(Boolean),
}))

const diceById = Object.fromEntries(
  resolvedDiceWithFaces.map((die) => [die.id, die]),
)

const diceByHeroId = resolvedDiceWithFaces.reduce((accumulator, die) => {
  if (!accumulator[die.heroId]) {
    accumulator[die.heroId] = []
  }

  accumulator[die.heroId].push(die)
  return accumulator
}, {})

export const gameAssets = {
  assetLayer,
  characters: heroContent.map((hero) =>
    resolveHeroAssets(hero, {
      diceById,
      dieFacesById: resolvedDieFacesById,
      diceByHeroId,
    }),
  ),
  dice: resolvedDiceWithFaces,
  dieFaces: resolvedDieFaces,
}
