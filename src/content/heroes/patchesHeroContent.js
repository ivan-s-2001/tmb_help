import { patchesContent } from './patches'
import { createPatchesDicePage } from './patchesDicePage'

function buildPatchesPages() {
  const pagesWithoutDice = patchesContent.pages.filter((page) => page.id !== 'dice')
  const dicePage = createPatchesDicePage()
  const battleIndex = pagesWithoutDice.findIndex((page) => page.id === 'battle')

  if (battleIndex === -1) {
    return [...pagesWithoutDice, dicePage]
  }

  return [
    ...pagesWithoutDice.slice(0, battleIndex),
    dicePage,
    ...pagesWithoutDice.slice(battleIndex),
  ]
}

export const patchesHeroContent = {
  ...patchesContent,
  pages: buildPatchesPages(),
}
