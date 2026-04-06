export default function HeroOverviewPage({ character }) {
  return (
    <>
      <section className="page-intro-block">
        <span className="section-kicker">Самостоятельная страница</span>
        <h1>Профиль {character.name}</h1>
        <p className="page-lead">
          Этот экран уже живёт как отдельная страница внутри пространства героя, а не как блок в
          длинном полотне.
        </p>
      </section>

      <div className="page-stack">
        <article className="page-card">
          <span className="page-card-kicker">Роль героя</span>
          <strong className="page-card-title">{character.tagline}</strong>
          <p className="page-card-text">{character.description}</p>
        </article>

        <article className="page-card">
          <span className="page-card-kicker">Как это читать сейчас</span>
          <p className="page-card-text">
            Это устойчивый экран-профиль. Следующими этапами сюда можно будет спокойно добавлять
            более глубокие материалы героя без поломки навигации.
          </p>
        </article>
      </div>
    </>
  )
}
