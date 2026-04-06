export default function HeroPrepPage({ page }) {
  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">Быстрый вход перед началом партии и спокойная точка старта внутри героя.</p>
      </section>

      <div className="page-section-stack">
        {page.sections?.map((section) => (
          <section key={section.id} className="page-card page-section">
            <div className="page-section-header">
              <h2 className="page-section-title">{section.title}</h2>
              {section.text ? <p className="page-section-text">{section.text}</p> : null}
            </div>

            {section.items?.length ? (
              <ul className="page-checklist">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </>
  )
}
