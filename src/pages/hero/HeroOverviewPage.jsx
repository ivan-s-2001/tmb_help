export default function HeroOverviewPage({ character, page }) {
  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">Короткий ориентир по роли героя и общему стилю игры за него.</p>
      </section>

      <div className="page-section-stack">
        {page.sections?.map((section) => (
          <section key={section.id} className="page-card page-section">
            <div className="page-section-header">
              <h2 className="page-section-title">{section.title}</h2>
              <p className="page-section-text">{character[section.source] ?? section.text}</p>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
