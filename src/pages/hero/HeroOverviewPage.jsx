export default function HeroOverviewPage({ character, page }) {
  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">Короткий ориентир по роли героя и общему стилю игры за него.</p>
      </section>

      <div className="page-stack">
        <article className="page-card">
          <strong className="page-card-title">{character.tagline}</strong>
          <p className="page-card-text">{character.description}</p>
        </article>
      </div>
    </>
  )
}
