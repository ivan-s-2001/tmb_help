export default function HomePage({ characters, onOpenCharacter }) {
  return (
    <main className="home-screen">
      <section className="intro-block home-intro">
        <h1>Выбери героя</h1>
        <p className="lead">Открой нужного персонажа и переходи в его пространство.</p>
      </section>

      <section className="selection-panel" aria-label="Меню выбора персонажа">
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
