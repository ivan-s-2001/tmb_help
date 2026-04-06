
import boomerPortrait from './assets/characters/boomer.png'
import patchesPortrait from './assets/characters/patches.png'
import picketPortrait from './assets/characters/picket.png'
import tantrumPortrait from './assets/characters/tantrum.png'
import { dieBlueprints } from './gameDice'

function toDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function createRoundedSquareSvg({
  label,
  accent,
  background = '#151924',
  border = 'rgba(255,255,255,0.18)',
  textColor = '#f7f9ff',
  subLabel,
}) {
  const subLabelMarkup = subLabel
    ? `<text x="64" y="97" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" fill="rgba(255,255,255,0.66)">${subLabel}</text>`
    : ''

  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#0d1018" />
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.58" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="108" height="108" rx="24" fill="url(#bg)" stroke="${border}" stroke-width="2" />
      <rect x="18" y="18" width="92" height="10" rx="5" fill="url(#accent)" opacity="0.95" />
      <rect x="22" y="34" width="84" height="72" rx="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
      <text
        x="64"
        y="74"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Inter, Arial, sans-serif"
        font-size="28"
        font-weight="700"
        fill="${textColor}"
      >
        ${label}
      </text>
      ${subLabelMarkup}
    </svg>
  `)
}

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

const dieAssets = Object.fromEntries(
  dieBlueprints.map((die) => [
    die.visualAssetId,
    {
      id: die.visualAssetId,
      kind: 'image',
      group: 'dice',
      src: createRoundedSquareSvg({
        label: die.code,
        subLabel: die.shortName,
        accent: die.accent,
      }),
      alt: `${die.name} die`,
    },
  ]),
)

const dieFaceAssets = Object.fromEntries(
  dieBlueprints.flatMap((die) =>
    die.faces.map((face) => [
      face.visualAssetId,
      {
        id: face.visualAssetId,
        kind: 'image',
        group: 'dieFaces',
        src: createRoundedSquareSvg({
          label: face.shortLabel,
          subLabel: face.shortName,
          accent: die.accent,
          background: '#10141d',
        }),
        alt: `${die.name}: ${face.name}`,
      },
    ]),
  ),
)

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
  getImageAsset,
  getDieAsset,
  getDieFaceAsset,
}

export function getAsset(assetId) {
  if (!assetId) {
    return null
  }

  return assetIndex[assetId] ?? null
}

export function getImageAsset(assetId) {
  const asset = getAsset(assetId)
  return asset?.group === 'characters' || asset?.group === 'images' ? asset : null
}

export function getDieAsset(assetId) {
  const asset = getAsset(assetId)
  return asset?.group === 'dice' ? asset : null
}

export function getDieFaceAsset(assetId) {
  const asset = getAsset(assetId)
  return asset?.group === 'dieFaces' ? asset : null
}

function resolveAssetRef(assetId) {
  return getAsset(assetId)
}

function resolveDiceRefs(entity, registries = {}) {
  if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
    return entity
  }

  return {
    ...entity,
    die: entity.dieId ? registries.diceById?.[entity.dieId] ?? null : undefined,
    dice: Array.isArray(entity.diceIds)
      ? entity.diceIds.map((id) => registries.diceById?.[id]).filter(Boolean)
      : undefined,
    dieFace: entity.dieFaceId ? registries.dieFacesById?.[entity.dieFaceId] ?? null : undefined,
    dieFaces: Array.isArray(entity.dieFaceIds)
      ? entity.dieFaceIds.map((id) => registries.dieFacesById?.[id]).filter(Boolean)
      : undefined,
  }
}

function resolveCardItemAssets(item, registries = {}) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  return resolveDiceRefs(
    {
      ...item,
      imageAsset: resolveAssetRef(item.imageAssetId),
    },
    registries,
  )
}

function resolveRouteStepAssets(step, registries = {}) {
  if (!step || typeof step !== 'object' || Array.isArray(step)) {
    return step
  }

  return resolveDiceRefs(
    {
      ...step,
      imageAsset: resolveAssetRef(step.imageAssetId),
    },
    registries,
  )
}

function resolveChecklistItemAssets(item, registries = {}) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  return resolveDiceRefs(
    {
      ...item,
      imageAsset: resolveAssetRef(item.imageAssetId),
    },
    registries,
  )
}

function resolveBlockAssets(block, registries = {}) {
  if (!block || typeof block !== 'object') {
    return block
  }

  return resolveDiceRefs(
    {
      ...block,
      mediaAsset: resolveAssetRef(block.mediaAssetId),
      imageAsset: resolveAssetRef(block.imageAssetId),
      items: Array.isArray(block.items)
        ? block.items.map((item) => resolveCardItemAssets(item, registries))
        : block.items,
      steps: Array.isArray(block.steps)
        ? block.steps.map((step) => resolveRouteStepAssets(step, registries))
        : block.steps,
      checklistItems: Array.isArray(block.checklistItems)
        ? block.checklistItems.map((item) => resolveChecklistItemAssets(item, registries))
        : block.checklistItems,
    },
    registries,
  )
}

function resolveSectionAssets(section, registries = {}) {
  return {
    ...section,
    blocks: Array.isArray(section.blocks)
      ? section.blocks.map((block) => resolveBlockAssets(block, registries))
      : section.blocks,
  }
}

function resolvePageAssets(page, registries = {}) {
  return {
    ...page,
    sections: Array.isArray(page.sections)
      ? page.sections.map((section) => resolveSectionAssets(section, registries))
      : page.sections,
  }
}

export function resolveDieFaceAssets(dieFace) {
  return {
    ...dieFace,
    visualAsset: resolveAssetRef(dieFace.visualAssetId),
  }
}

export function resolveDieAssets(die, registries = {}) {
  return {
    ...die,
    visualAsset: resolveAssetRef(die.visualAssetId),
    faces: Array.isArray(die.faceIds)
      ? die.faceIds.map((faceId) => registries.dieFacesById?.[faceId]).filter(Boolean)
      : [],
  }
}

export function resolveHeroAssets(hero, registries = {}) {
  const visualAsset = resolveAssetRef(hero.visualAssetId)

  return {
    ...hero,
    visualAsset,
    dice: registries.diceByHeroId?.[hero.id] ?? [],
    pages: Array.isArray(hero.pages)
      ? hero.pages.map((page) => resolvePageAssets(page, registries))
      : hero.pages,
  }
}
