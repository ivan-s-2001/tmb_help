export default function HeroPrepPage({ character }) {
  return (
    <>
      <section className="page-intro-block">
        <span className="section-kicker">Самостоятельная страница</span>
        <h1>{character.name} перед партией</h1>
        <p className="page-lead">
          Это отдельный стартовый экран героя перед игрой. Он уже ощущается как внутренняя
          продуктовая страница, а не как временный визуальный блок.
        </p>
      </section>

      <div className="page-stack">
        <article className="page-card">
          <span className="page-card-kicker">Кого открыли</span>
          <strong className="page-card-title">{character.name}</strong>
          <p className="page-card-text">
            Держи этот экран как тихую точку входа перед партией и переходи дальше по пространству
            героя.
          </p>
        </article>

        <article className="page-card">
          <span className="page-card-kicker">Текущее назначение</span>
          <p className="page-card-text">
            Здесь позже лягут стартовые материалы, но уже сейчас это отдельная страница героя с
            собственным адресом и устойчивой навигацией.
          </p>
        </article>
      </div>
    </>
  )
}
