export function normalizePath(pathname = '/') {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const cleanPath = pathname.replace(/\/+$/, '')
  return cleanPath || '/'
}

export function getHeroPages(character) {
  return character?.pages ?? []
}

export function getHeroPage(character, pageId) {
  const pages = getHeroPages(character)

  if (!pages.length) {
    return null
  }

  return pages.find((page) => page.id === pageId) ?? pages[0]
}

export function getHeroPageBySlug(character, slug = '') {
  const pages = getHeroPages(character)

  if (!pages.length) {
    return null
  }

  return pages.find((page) => (page.slug ?? '') === slug) ?? null
}

export function buildHeroPath(character, pageId) {
  if (!character) {
    return '/'
  }

  const page = pageId ? getHeroPage(character, pageId) : getHeroPages(character)[0]

  if (!page) {
    return `/menu/${character.id}`
  }

  return page.slug ? `/menu/${character.id}/${page.slug}` : `/menu/${character.id}`
}

export function readRoute(pathname, characters) {
  const cleanPath = normalizePath(pathname)

  if (cleanPath === '/') {
    return { screen: 'home' }
  }

  const parts = cleanPath.split('/').filter(Boolean)

  if (parts[0] !== 'menu' || !parts[1]) {
    return { screen: 'home' }
  }

  const character = characters.find((item) => item.id === parts[1])

  if (!character) {
    return { screen: 'home' }
  }

  const slug = parts[2] ?? ''
  const page = getHeroPageBySlug(character, slug) ?? getHeroPages(character)[0]

  if (!page) {
    return { screen: 'home' }
  }

  return {
    screen: 'hero',
    characterId: character.id,
    pageId: page.id,
  }
}

export function navigate(to, { replace = false } = {}) {
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
