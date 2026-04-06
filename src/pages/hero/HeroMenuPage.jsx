export default function HeroMenuPage({ character, onOpenPage }) {
  return (
    <>
      <section className="page-intro-block">
        <span className="section-kicker">Старт внутри героя</span>
        <h1>Меню {character.name}</h1>
        <p className="page-lead">
          Это отдельное пространство героя. Отсюда можно открыть его самостоятельные внутренние
          страницы.
        </p>
      </section>

      <div className="page-card-grid">
        <button type="button" className="page-card page-card-action" onClick={() => onOpenPage('overview')}>
          <span className="page-card-kicker">Следующий экран</span>
          <strong className="page-card-title">Профиль героя</strong>
          <p className="page-card-text">
            Короткий самостоятельный экран с ролью героя и общим ощущением игры за него.
          </p>
          <span className="page-card-link">Открыть страницу →</span>
        </button>

        <button type="button" className="page-card page-card-action" onClick={() => onOpenPage('prep')}>
          <span className="page-card-kicker">Следующий экран</span>
          <strong className="page-card-title">Перед партией</strong>
          <p className="page-card-text">
            Отдельный спокойный экран героя перед началом партии, без перегруза и лишнего шума.
          </p>
          <span className="page-card-link">Открыть страницу →</span>
        </button>
      </div>
    </>
  )
}
