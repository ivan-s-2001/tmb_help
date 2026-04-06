import { useMemo, useState } from 'react'
import { gameAssets } from './gameAssets'

export default function App() {
  const { characters, materials } = gameAssets
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
        <span className="eyebrow">Too Many Bones Helper</span>
        <h1>Выбери героя</h1>
        <p className="lead">
          Стартовый экран теперь опирается на твои реальные игровые ресурсы. Никаких случайных внешних
          картинок — только твоя визуальная база и чистый каркас для следующего этапа.
        </p>

        <section className="character-list" aria-label="Список персонажей">
          {characters.map((character) => {
            const isActive = character.id === activeCharacterId

            return (
              <button
                key={character.id}
                type="button"
                className={`character-card ${isActive ? 'is-active' : ''}`}
                style={{ '--accent': character.accent }}
                onClick={() => setActiveCharacterId(character.id)}
              >
                <div className="character-visual">
                  <div className="character-visual-glow" aria-hidden="true" />
                  <img
                    src={character.image}
                    alt={character.name}
                    className="character-image"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div className="character-content">
                  <div className="character-topline">
                    <span className="character-name">{character.name}</span>
                    {isActive ? <span className="character-state">выбран</span> : null}
                  </div>

                  <span className="character-tagline">{character.tagline}</span>
                  <p className="character-description">{character.description}</p>
                </div>
              </button>
            )
          })}
        </section>

        <section className="status-card" aria-live="polite" style={{ '--accent': activeCharacter.accent }}>
          <span className="status-label">Сейчас выбран</span>
          <strong>{activeCharacter.name}</strong>
          <p>
            Визуальный слой уже подключён на твоих ресурсах. Кубики пока не встраиваются, но место под
            игровые материалы в структуре проекта уже предусмотрено: <code>characters</code> активны, а
            <code>dice</code>, <code>tokens</code> и <code>references</code> оставлены как следующий шаг.
          </p>
          <div className="status-tags" aria-hidden="true">
            {Object.entries(materials).map(([key, value]) => (
              <span key={key} className={`status-tag status-tag-${value}`}>
                {key}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
