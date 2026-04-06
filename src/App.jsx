import { gameAssets } from './gameAssets'

export default function App() {
  const { characters } = gameAssets

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-right" aria-hidden="true" />

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
    </div>
  )
}
