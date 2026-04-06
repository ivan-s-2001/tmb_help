import boomerPortrait from './assets/characters/boomer.png'
import patchesPortrait from './assets/characters/patches.png'
import picketPortrait from './assets/characters/picket.png'
import tantrumPortrait from './assets/characters/tantrum.png'

const imageAssets = {
  'character.patches.portrait': {
    id: 'character.patches.portrait',
    kind: 'image',
    group: 'characters',
    src: patchesPortrait,
    alt: 'Patches portrait',
  },
  'character.picket.portrait': {
    id: 'character.picket.portrait',
    kind: 'image',
    group: 'characters',
    src: picketPortrait,
    alt: 'Picket portrait',
  },
  'character.tantrum.portrait': {
    id: 'character.tantrum.portrait',
    kind: 'image',
    group: 'characters',
    src: tantrumPortrait,
    alt: 'Tantrum portrait',
  },
  'character.boomer.portrait': {
    id: 'character.boomer.portrait',
    kind: 'image',
    group: 'characters',
    src: boomerPortrait,
    alt: 'Boomer portrait',
  },
}

const dieAssets = {}
const dieFaceAssets = {}

const assetCollections = {
  images: imageAssets,
  dice: dieAssets,
  dieFaces: dieFaceAssets,
}

const assetIndex = {
  ...imageAssets,
  ...dieAssets,
  ...dieFaceAssets,
}

export const assetLayer = {
  collections: assetCollections,
  getAsset,
}

export function getAsset(assetId) {
  if (!assetId) {
    return null
  }

  return assetIndex[assetId] ?? null
}

function resolveAssetRef(assetId) {
  return getAsset(assetId)
}

function resolveCardItemAssets(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  return {
    ...item,
    imageAsset: resolveAssetRef(item.imageAssetId),
  }
}

function resolveRouteStepAssets(step) {
  if (!step || typeof step !== 'object' || Array.isArray(step)) {
    return step
  }

  return {
    ...step,
    imageAsset: resolveAssetRef(step.imageAssetId),
  }
}

function resolveChecklistItemAssets(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  return {
    ...item,
    imageAsset: resolveAssetRef(item.imageAssetId),
  }
}

function resolveBlockAssets(block) {
  if (!block || typeof block !== 'object') {
    return block
  }

  return {
    ...block,
    mediaAsset: resolveAssetRef(block.mediaAssetId),
    imageAsset: resolveAssetRef(block.imageAssetId),
    items: Array.isArray(block.items) ? block.items.map(resolveCardItemAssets) : block.items,
    steps: Array.isArray(block.steps) ? block.steps.map(resolveRouteStepAssets) : block.steps,
  }
}

function resolveSectionAssets(section) {
  return {
    ...section,
    blocks: Array.isArray(section.blocks) ? section.blocks.map(resolveBlockAssets) : section.blocks,
  }
}

function resolvePageAssets(page) {
  return {
    ...page,
    sections: Array.isArray(page.sections) ? page.sections.map(resolveSectionAssets) : page.sections,
  }
}

export function resolveHeroAssets(hero) {
  const visualAsset = resolveAssetRef(hero.visualAssetId)

  return {
    ...hero,
    visualAsset,
    pages: Array.isArray(hero.pages) ? hero.pages.map(resolvePageAssets) : hero.pages,
  }
}
