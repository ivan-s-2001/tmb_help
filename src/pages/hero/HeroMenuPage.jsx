export default function HeroMenuPage({ character, page, pages, onOpenPage }) {
  const nextPages = pages.filter((item) => item.id !== page.id)

  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">Страницы {character.name} собраны здесь. Открой нужную и переходи дальше.</p>
      </section>

      <div className="page-section-stack">
        {page.sections?.map((section) => {
          if (section.kind === 'pageLinks') {
            return (
              <section key={section.id} className="page-card page-section">
                <div className="page-section-header">
                  <h2 className="page-section-title">{section.title}</h2>
                  {section.text ? <p className="page-section-text">{section.text}</p> : null}
                </div>

                <div className="page-card-grid">
                  {nextPages.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="page-card page-card-action"
                      onClick={() => onOpenPage(item.id)}
                    >
                      <strong className="page-card-title">{item.title}</strong>
                      <p className="page-card-text">{item.description}</p>
                      <span className="page-card-link">Открыть →</span>
                    </button>
                  ))}
                </div>
              </section>
            )
          }

          return (
            <section key={section.id} className="page-card page-section">
              <div className="page-section-header">
                <h2 className="page-section-title">{section.title}</h2>
                {section.text ? <p className="page-section-text">{section.text}</p> : null}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
