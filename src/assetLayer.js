import boomerPortrait from './assets/characters/boomer.png'
import patchesPortrait from './assets/characters/patches.png'
import picketPortrait from './assets/characters/picket.png'
import tantrumPortrait from './assets/characters/tantrum.png'

const diceFaceFileModules = import.meta.glob(
  './assets/dices/**/*.{png,jpg,jpeg,webp,svg}',
  {
    eager: true,
    import: 'default',
  },
)

function stripExtension(fileName) {
  return fileName.replace(/\.[^.]+$/, '')
}

function trimSeparators(value) {
  return String(value).replace(/^[\s._-]+|[\s._-]+$/g, '')
}

function slugify(value) {
  const normalized = String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')

  return trimSeparators(normalized).replace(/^-+|-+$/g, '')
}

function humanize(value) {
  const cleaned = trimSeparators(
    String(value)
      .replace(/[\\/]+/g, ' ')
      .replace(/[_-]+/g, ' '),
  )

  if (!cleaned) {
    return ''
  }

  return cleaned
    .split(/\s+/)
    .map((word) => {
      if (/^\d+$/.test(word)) {
        return word
      }

      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function naturalCompare(left, right) {
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function inferTrailingNumber(value) {
  const normalized = String(value)
  const match = normalized.match(/(\d{1,2})$/)

  return match ? Number(match[1]) : null
}

function removeFaceSuffix(baseName) {
  const patterns = [
    /(?:[-_\s]?(?:face|side|f))[-_\s]?\d{1,2}$/i,
    /[-_\s]\d{1,2}$/i,
    /\d{1,2}$/i,
  ]

  for (const pattern of patterns) {
    const nextValue = trimSeparators(baseName.replace(pattern, ''))

    if (nextValue && nextValue !== baseName) {
      return nextValue
    }
  }

  return trimSeparators(baseName)
}

function inferDieKey(baseName) {
  return removeFaceSuffix(baseName) || baseName || 'die'
}

function inferFaceKey(baseName) {
  const faceIndex = inferTrailingNumber(baseName)

  if (faceIndex !== null) {
    return `face-${String(faceIndex).padStart(2, '0')}`
  }

  return trimSeparators(baseName) || 'face'
}

function createUniqueSlug(baseSlug, usedSlugs, fallbackPrefix) {
  const normalizedBase = baseSlug || fallbackPrefix
  let candidate = normalizedBase
  let suffix = 2

  while (usedSlugs.has(candidate)) {
    candidate = `${normalizedBase}-${suffix}`
    suffix += 1
  }

  usedSlugs.add(candidate)
  return candidate
}

function parseDiceAssetFile(filePath, src) {
  const normalizedPath = filePath.replace(/^\.\//, '')
  const pathParts = normalizedPath.split('/')
  const dicesIndex = pathParts.indexOf('dices')

  if (dicesIndex === -1 || pathParts.length < dicesIndex + 4) {
    return null
  }

  const heroFolder = pathParts[dicesIndex + 1]
  const heroId = slugify(heroFolder)

  if (!heroId) {
    return null
  }

  const remainder = pathParts.slice(dicesIndex + 2)
  const fileName = remainder.at(-1)
  const baseName = stripExtension(fileName)
  const directoryParts = remainder.slice(0, -1)

  return {
    filePath,
    src,
    heroId,
    heroFolder,
    dieKey: directoryParts.length ? directoryParts.join(' ') : inferDieKey(baseName),
    faceKey: directoryParts.length ? baseName : inferFaceKey(baseName),
    faceIndex: inferTrailingNumber(baseName),
    sortKey: remainder.join('/'),
  }
}

function buildDiceAssetCatalog(assetModules) {
  const parsedFiles = Object.entries(assetModules)
    .map(([filePath, src]) => parseDiceAssetFile(filePath, src))
    .filter(Boolean)

  if (!parsedFiles.length) {
    return {
      dice: [],
      dieFaces: [],
      dieAssets: {},
      dieFaceAssets: {},
    }
  }

  const filesByHero = parsedFiles.reduce((accumulator, file) => {
    if (!accumulator[file.heroId]) {
      accumulator[file.heroId] = []
    }

    accumulator[file.heroId].push(file)
    return accumulator
  }, {})

  const dice = []
  const dieFaces = []
  const dieAssets = {}
  const dieFaceAssets = {}

  Object.entries(filesByHero)
    .sort(([leftHeroId], [rightHeroId]) => naturalCompare(leftHeroId, rightHeroId))
    .forEach(([heroId, heroFiles]) => {
      const filesByDie = heroFiles.reduce((accumulator, file) => {
        if (!accumulator[file.dieKey]) {
          accumulator[file.dieKey] = []
        }

        accumulator[file.dieKey].push(file)
        return accumulator
      }, {})

      const usedDieSlugs = new Set()
      let dieOrder = 0

      Object.entries(filesByDie)
        .sort(([leftDieKey], [rightDieKey]) => naturalCompare(leftDieKey, rightDieKey))
        .forEach(([dieKey, dieFiles]) => {
          dieOrder += 1

          const dieSlug = createUniqueSlug(
            slugify(dieKey) || `die-${String(dieOrder).padStart(2, '0')}`,
            usedDieSlugs,
            `die-${String(dieOrder).padStart(2, '0')}`,
          )

          const dieId = `die.${heroId}.${dieSlug}`
          const dieAssetId = `asset.die.${heroId}.${dieSlug}`
          const dieName = humanize(dieKey) || `Die ${String(dieOrder).padStart(2, '0')}`

          const sortedFaces = [...dieFiles].sort((leftFace, rightFace) => {
            const leftIndex = leftFace.faceIndex ?? Number.MAX_SAFE_INTEGER
            const rightIndex = rightFace.faceIndex ?? Number.MAX_SAFE_INTEGER

            if (leftIndex !== rightIndex) {
              return leftIndex - rightIndex
            }

            return naturalCompare(leftFace.sortKey, rightFace.sortKey)
          })

          const usedFaceSlugs = new Set()
          const faceIds = []

          sortedFaces.forEach((faceFile, faceOrder) => {
            const fallbackFaceKey = `face-${String(faceOrder + 1).padStart(2, '0')}`
            const faceSlug = createUniqueSlug(
              slugify(faceFile.faceKey) || fallbackFaceKey,
              usedFaceSlugs,
              fallbackFaceKey,
            )

            const faceId = `dieFace.${heroId}.${dieSlug}.${faceSlug}`
            const faceAssetId = `asset.dieFace.${heroId}.${dieSlug}.${faceSlug}`
            const faceName = humanize(faceFile.faceKey) || `Face ${faceOrder + 1}`

            faceIds.push(faceId)

            dieFaces.push({
              id: faceId,
              heroId,
              dieId,
              name: faceName,
              shortName: faceName,
              shortLabel: `F${faceOrder + 1}`,
              meaning: faceName.toLowerCase(),
              sortOrder: faceOrder,
              visualAssetId: faceAssetId,
            })

            dieFaceAssets[faceAssetId] = {
              id: faceAssetId,
              kind: 'image',
              group: 'dieFaces',
              src: faceFile.src,
              alt: `${dieName}: ${faceName}`,
            }
          })

          const previewFace = sortedFaces[0]

          if (previewFace) {
            dieAssets[dieAssetId] = {
              id: dieAssetId,
              kind: 'image',
              group: 'dice',
              src: previewFace.src,
              alt: `${dieName} die`,
            }
          }

          dice.push({
            id: dieId,
            heroId,
            name: dieName,
            shortName: `D${String(dieOrder).padStart(2, '0')}`,
            code: `D${String(dieOrder).padStart(2, '0')}`,
            visualAssetId: dieAssetId,
            faceIds,
            sortOrder: dieOrder - 1,
          })
        })
    })

  return {
    dice,
    dieFaces,
    dieAssets,
    dieFaceAssets,
  }
}

export const diceAssetCatalog = buildDiceAssetCatalog(diceFaceFileModules)

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

const dieAssets = diceAssetCatalog.dieAssets
const dieFaceAssets = diceAssetCatalog.dieFaceAssets

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

function resolveDiceRefs(entity, registries = {}, context = {}) {
  if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
    return entity
  }

  const heroDice = registries.diceByHeroId?.[context.heroId] ?? []
  const resolvedDie =
    entity.dieId
      ? registries.diceById?.[entity.dieId] ?? null
      : Number.isInteger(entity.heroDieIndex)
        ? heroDice[entity.heroDieIndex] ?? null
        : undefined

  return {
    ...entity,
    die: resolvedDie,
    dice: Array.isArray(entity.diceIds)
      ? entity.diceIds.map((id) => registries.diceById?.[id]).filter(Boolean)
      : undefined,
    dieFace: entity.dieFaceId ? registries.dieFacesById?.[entity.dieFaceId] ?? null : undefined,
    dieFaces: Array.isArray(entity.dieFaceIds)
      ? entity.dieFaceIds.map((id) => registries.dieFacesById?.[id]).filter(Boolean)
      : undefined,
  }
}

function resolveCardItemAssets(item, registries = {}, context = {}) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  return resolveDiceRefs(
    {
      ...item,
      imageAsset: resolveAssetRef(item.imageAssetId),
    },
    registries,
    context,
  )
}

function resolveRouteStepAssets(step, registries = {}, context = {}) {
  if (!step || typeof step !== 'object' || Array.isArray(step)) {
    return step
  }

  return resolveDiceRefs(
    {
      ...step,
      imageAsset: resolveAssetRef(step.imageAssetId),
    },
    registries,
    context,
  )
}

function resolveChecklistItemAssets(item, registries = {}, context = {}) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  return resolveDiceRefs(
    {
      ...item,
      imageAsset: resolveAssetRef(item.imageAssetId),
    },
    registries,
    context,
  )
}

function resolveBlockAssets(block, registries = {}, context = {}) {
  if (!block || typeof block !== 'object') {
    return block
  }

  return resolveDiceRefs(
    {
      ...block,
      mediaAsset: resolveAssetRef(block.mediaAssetId),
      imageAsset: resolveAssetRef(block.imageAssetId),
      items: Array.isArray(block.items)
        ? block.items.map((item) => resolveCardItemAssets(item, registries, context))
        : block.items,
      steps: Array.isArray(block.steps)
        ? block.steps.map((step) => resolveRouteStepAssets(step, registries, context))
        : block.steps,
      checklistItems: Array.isArray(block.checklistItems)
        ? block.checklistItems.map((item) => resolveChecklistItemAssets(item, registries, context))
        : block.checklistItems,
    },
    registries,
    context,
  )
}

function resolveSectionAssets(section, registries = {}, context = {}) {
  return {
    ...section,
    blocks: Array.isArray(section.blocks)
      ? section.blocks.map((block) => resolveBlockAssets(block, registries, context))
      : section.blocks,
  }
}

function resolvePageAssets(page, registries = {}, context = {}) {
  return {
    ...page,
    sections: Array.isArray(page.sections)
      ? page.sections.map((section) => resolveSectionAssets(section, registries, context))
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
  const heroDice = registries.diceByHeroId?.[hero.id] ?? []
  const coreDie =
    Number.isInteger(hero.coreDieIndex)
      ? heroDice[hero.coreDieIndex] ?? heroDice[0] ?? null
      : heroDice[0] ?? null

  return {
    ...hero,
    visualAsset,
    coreDie,
    dice: heroDice,
    pages: Array.isArray(hero.pages)
      ? hero.pages.map((page) => resolvePageAssets(page, registries, { heroId: hero.id }))
      : hero.pages,
  }
}
