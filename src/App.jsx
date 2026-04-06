import { useMemo, useState } from 'react'
import { gameAssets } from './gameAssets'

export default function App() {
  const { characters } = gameAssets
  const [activeCharacterId, setActiveCharacterId] = useState(characters[0].id)

  const activeCharacter = useMemo(
    () => characters.find((character) => character.id === activeCharacterId),
    [activeCharacterId, characters],
  )

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-right" aria-hidden="true" />

      <main className="home-screen">
        <section className="intro-block">
          <span className="eyebrow">Too Many Bones Helper</span>
          <h1>Выбери героя для партии</h1>
          <p className="lead">
            Быстрый вход в помощник без лишнего шума: выбери персонажа и продолжай с его материалами,
            подсказками и игровыми опорами.
          </p>
        </section>

        <section className="selection-shell" style={{ '--accent': activeCharacter.accent }}>
          <article className="featured-character" aria-label={`Сейчас выбран ${activeCharacter.name}`}>
            <div className="featured-copy">
              <span className="section-kicker">Сейчас в фокусе</span>
              <h2>{activeCharacter.name}</h2>
              <p className="featured-tagline">{activeCharacter.tagline}</p>
              <p className="featured-description">{activeCharacter.description}</p>

              <div className="feature-pills" aria-hidden="true">
                <span className="feature-pill">Базовый герой</span>
                <span className="feature-pill">Готов к выбору</span>
              </div>
            </div>

            <div className="featured-visual">
              <div className="featured-visual-halo" aria-hidden="true" />
              <img
                src={activeCharacter.image}
                alt={activeCharacter.name}
                className="featured-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </article>

          <section className="selector-block" aria-label="Выбор персонажа">
            <div className="selector-header">
              <span className="section-kicker">Базовые герои</span>
              <p>Нажми на карточку, чтобы выбрать персонажа.</p>
            </div>

            <div className="character-grid">
              {characters.map((character) => {
                const isActive = character.id === activeCharacterId

                return (
                  <button
                    key={character.id}
                    type="button"
                    aria-pressed={isActive}
                    className={`character-card ${isActive ? 'is-active' : ''}`}
                    style={{ '--accent': character.accent }}
                    onClick={() => setActiveCharacterId(character.id)}
                  >
                    <div className="character-card-visual">
                      <img
                        src={character.image}
                        alt=""
                        className="character-card-image"
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    <div className="character-card-content">
                      <span className="character-name">{character.name}</span>
                      <span className="character-tagline">{character.tagline}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
