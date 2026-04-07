import { patchesContent } from './patches'
import { createPatchesDicePage } from './patchesDicePage'

function injectDicePage(hero) {
  const dicePage = createPatchesDicePage()
  const pagesWithoutDice = hero.pages.filter((page) => page.id !== 'dice')
  const battleIndex = pagesWithoutDice.findIndex((page) => page.id === 'battle')

  if (battleIndex === -1) {
    return {
      ...hero,
      pages: [...pagesWithoutDice, dicePage],
    }
  }

  const pages = [...pagesWithoutDice]
  pages.splice(battleIndex, 0, dicePage)

  return {
    ...hero,
    pages,
  }
}

export const patchesHeroContent = injectDicePage(patchesContent)
