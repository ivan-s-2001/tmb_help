import { useEffect, useMemo, useState } from 'react'
import HeroSpaceLayout from './components/HeroSpaceLayout'
import { gameAssets } from './gameAssets'
import { buildHeroPath, getHeroPage, navigate, readRoute } from './lib/routes'
import HomePage from './pages/HomePage'
import HeroMenuPage from './pages/hero/HeroMenuPage'
import HeroOverviewPage from './pages/hero/HeroOverviewPage'
import HeroPrepPage from './pages/hero/HeroPrepPage'

const heroPageComponents = {
  menu: HeroMenuPage,
  overview: HeroOverviewPage,
  prep: HeroPrepPage,
}

export default function App() {
  const { characters } = gameAssets
  const [route, setRoute] = useState(() => readRoute(window.location.pathname, characters))

  useEffect(() => {
    const syncRoute = () => {
      setRoute(readRoute(window.location.pathname, characters))
      window.scrollTo(0, 0)
    }

    syncRoute()
    window.addEventListener('popstate', syncRoute)

    return () => window.removeEventListener('popstate', syncRoute)
  }, [characters])

  const activeCharacter = useMemo(() => {
    if (route.screen !== 'hero') {
      return null
    }

    return characters.find((character) => character.id === route.characterId) ?? null
  }, [characters, route])

  const activePage = useMemo(() => {
    if (!activeCharacter || route.screen !== 'hero') {
      return null
    }

    return getHeroPage(activeCharacter, route.pageId)
  }, [activeCharacter, route])

  useEffect(() => {
    if (!activeCharacter || !activePage) {
      document.title = 'Too Many Bones Helper'
      return
    }

    document.title = `${activePage.title} — ${activeCharacter.name} — Too Many Bones Helper`
  }, [activeCharacter, activePage])

  const openCharacter = (characterId) => {
    const character = characters.find((item) => item.id === characterId)
    navigate(buildHeroPath(character))
  }

  const goHome = () => {
    navigate('/')
  }

  const openHeroPage = (characterId, pageId) => {
    const character = characters.find((item) => item.id === characterId)
    navigate(buildHeroPath(character, pageId))
  }

  const ActiveHeroPage = activePage ? heroPageComponents[activePage.component] : null

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-right" aria-hidden="true" />

      {activeCharacter && activePage && ActiveHeroPage ? (
        <HeroSpaceLayout
          character={activeCharacter}
          pages={activeCharacter.pages}
          currentPageId={activePage.id}
          onGoHome={goHome}
          onOpenPage={(pageId) => openHeroPage(activeCharacter.id, pageId)}
        >
          <ActiveHeroPage
            character={activeCharacter}
            page={activePage}
            pages={activeCharacter.pages}
            onOpenPage={(pageId) => openHeroPage(activeCharacter.id, pageId)}
          />
        </HeroSpaceLayout>
      ) : (
        <HomePage characters={characters} onOpenCharacter={openCharacter} />
      )}
    </div>
  )
}
