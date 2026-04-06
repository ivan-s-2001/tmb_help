import { useMemo, useState } from 'react'

const characters = [
  {
    id: 'patches',
    name: 'Patches',
    role: 'гибкий поддерживающий герой',
  },
  {
    id: 'picket',
    name: 'Picket',
    role: 'танк и контроль входящего урона',
  },
  {
    id: 'tantrum',
    name: 'Tantrum',
    role: 'агрессия, ярость и добивание',
  },
  {
    id: 'boomer',
    name: 'Boomer',
    role: 'бомбы, подготовка и точечный урон',
  },
]

export default function App() {
  const [activeCharacterId, setActiveCharacterId] = useState(characters[0].id)

  const activeCharacter = useMemo(
    () => characters.find((character) => character.id === activeCharacterId),
    [activeCharacterId],
  )

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-right" aria-hidden="true" />

      <main className="home-screen">
        <span className="eyebrow">Too Many Bones Helper</span>
        <h1>Выбери героя</h1>
        <p className="lead">
          Первый рабочий этап: только стартовый экран. Чистый новый каркас,
          мобильный интерфейс и крупные кнопки персонажей без лишней логики.
        </p>

        <section className="character-list" aria-label="Список персонажей">
          {characters.map((character) => {
            const isActive = character.id === activeCharacterId

            return (
              <button
                key={character.id}
                type="button"
                className={`character-button ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveCharacterId(character.id)}
              >
                <span className="character-name">{character.name}</span>
                <span className="character-role">{character.role}</span>
              </button>
            )
          })}
        </section>

        <section className="status-card" aria-live="polite">
          <span className="status-label">Сейчас выбран</span>
          <strong>{activeCharacter?.name}</strong>
          <p>
            Следующим безопасным шагом можно будет добавить отдельную страницу
            героя, не ломая стартовый экран.
          </p>
        </section>
      </main>
    </div>
  )
}
