export const heroPages = [
  {
    id: 'menu',
    slug: '',
    label: 'Меню',
    title: 'Меню героя',
    description: 'Выбери следующий экран внутри пространства героя.',
  },
  {
    id: 'overview',
    slug: 'overview',
    label: 'Профиль',
    title: 'Профиль героя',
    description: 'Короткий и чистый экран с ролью и общим ощущением героя.',
  },
  {
    id: 'prep',
    slug: 'prep',
    label: 'Перед партией',
    title: 'Перед партией',
    description: 'Спокойный стартовый экран героя перед началом игры.',
  },
]

export function normalizePath(pathname = '/') {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const cleanPath = pathname.replace(/\/+$/, '')
  return cleanPath || '/'
}

export function buildHeroPath(characterId, pageId = 'menu') {
  const page = heroPages.find((item) => item.id === pageId)

  if (!page) {
    return `/menu/${characterId}`
  }

  return page.slug ? `/menu/${characterId}/${page.slug}` : `/menu/${characterId}`
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

  if (!parts[2]) {
    return { screen: 'hero', characterId: character.id, pageId: 'menu' }
  }

  const page = heroPages.find((item) => item.slug === parts[2])

  if (!page) {
    return { screen: 'home' }
  }

  return { screen: 'hero', characterId: character.id, pageId: page.id }
}

export function navigate(to, { replace = false } = {}) {
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
