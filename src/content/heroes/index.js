import { patchesContent } from './patches'
import { createPatchesDicePage } from './patchesDicePage'
import { picketContent } from './picket'
import { tantrumContent } from './tantrum'
import { boomerContent } from './boomer'

function withPatchesDicePage(hero) {
  const dicePage = createPatchesDicePage()
  const pages = [...hero.pages]
  const battleIndex = pages.findIndex((page) => page.id === 'battle')

  if (battleIndex === -1) {
    pages.push(dicePage)
  } else {
    pages.splice(battleIndex, 0, dicePage)
  }

  return {
    ...hero,
    pages,
  }
}

export const heroContent = [
  withPatchesDicePage(patchesContent),
  picketContent,
  tantrumContent,
  boomerContent,
]
