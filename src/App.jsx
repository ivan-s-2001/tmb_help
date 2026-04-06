import { useEffect, useMemo, useState } from 'react'
import { gameAssets } from './gameAssets'

function readRoute(characters) {
  const hash = window.location.hash || '#/'
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
  const parts = cleanHash.split('/').filter(Boolean)

  if (parts[0] === 'hero' && parts[1]) {
    const character = characters.find((item) => item.id === parts[1])

    if (character) {
      return { screen: 'hero', characterId: character.id }
    }
  }

  return { screen: 'home' }
}

function HomeScreen({ characters, onOpenCharacter }) {
  return (
    <main className="home-screen">
      <section className="intro-block">
        <span className="eyebrow">Too Many Bones Helper</span>
        <h1>Выбери героя</h1>
        <p className="lead">
          Открой нужного персонажа и сразу переходи в помощник для партии.
        </p>
      </section>

      <section className="selection-panel" aria-label="Меню выбора персонажа">
        <div className="selection-panel-head">
          <div>
            <span className="section-kicker">Базовые герои</span>
            <h2>Кого открываем?</h2>
          </div>
          <p>Все карточки равноправны — просто нажми на нужного героя.</p>
        </div>

        <div className="character-grid">
          {characters.map((character) => (
            <button
              key={character.id}
              type="button"
              className="character-card"
              style={{ '--accent': character.accent }}
              aria-label={`Открыть ${character.name}`}
              onClick={() => onOpenCharacter(character.id)}
            >
              <div className="character-card-copy">
                <span className="character-name">{character.name}</span>
                <span className="character-tagline">{character.tagline}</span>
              </div>

              <div className="character-card-visual" aria-hidden="true">
                <div className="character-card-halo" />
                <img
                  src={character.image}
                  alt=""
                  className="character-card-image"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <span className="character-card-action" aria-hidden="true">
                <span>Открыть</span>
                <span className="character-card-arrow">→</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

function HeroScreen({ character, onBack }) {
  return (
    <main className="hero-screen" style={{ '--accent': character.accent }}>
      <header className="hero-topbar">
        <button
          type="button"
          className="hero-back-button"
          onClick={onBack}
          aria-label="Вернуться к выбору героя"
        >
          <span className="hero-back-arrow">←</span>
          <span>К героям</span>
        </button>

        <span className="hero-topbar-label">Пространство героя</span>
      </header>

      <section className="hero-card" aria-label={`Экран героя ${character.name}`}>
        <div className="hero-card-copy">
          <span className="section-kicker">Личный экран героя</span>
          <h1 className="hero-card-title">{character.name}</h1>
          <p className="hero-card-role">{character.tagline}</p>
          <p className="hero-card-description">{character.description}</p>
        </div>

        <div className="hero-card-visual" aria-hidden="true">
          <div className="hero-card-halo" />
          <img
            src={character.image}
            alt=""
            className="hero-card-image"
            loading="eager"
            decoding="async"
          />
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const { characters } = gameAssets
  const [route, setRoute] = useState(() => readRoute(characters))

  useEffect(() => {
    const syncRoute = () => {
      setRoute(readRoute(characters))
      window.scrollTo(0, 0)
    }

    syncRoute()
    window.addEventListener('hashchange', syncRoute)

    return () => window.removeEventListener('hashchange', syncRoute)
  }, [characters])

  const activeCharacter = useMemo(() => {
    if (route.screen !== 'hero') {
      return null
    }

    return characters.find((character) => character.id === route.characterId) ?? null
  }, [characters, route])

  useEffect(() => {
    document.title = activeCharacter
      ? `${activeCharacter.name} — Too Many Bones Helper`
      : 'Too Many Bones Helper'
  }, [activeCharacter])

  const openCharacter = (characterId) => {
    window.location.hash = `#/hero/${characterId}`
  }

  const goHome = () => {
    window.location.hash = '#/'
  }

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-right" aria-hidden="true" />

      {activeCharacter ? (
        <HeroScreen character={activeCharacter} onBack={goHome} />
      ) : (
        <HomeScreen characters={characters} onOpenCharacter={openCharacter} />
      )}
    </div>
  )
}
