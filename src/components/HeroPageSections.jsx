function renderCards(cards = []) {
  if (!cards.length) {
    return null
  }

  return (
    <div className="page-card-grid">
      {cards.map((card, index) => (
        <article key={card.title ?? index} className="page-card">
          {card.title ? <strong className="page-card-title">{card.title}</strong> : null}
          {card.text ? <p className="page-card-text">{card.text}</p> : null}
        </article>
      ))}
    </div>
  )
}

function renderChecklist(items = []) {
  if (!items.length) {
    return null
  }

  return (
    <div className="page-stack">
      <article className="page-card">
        <ul className="page-checklist">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  )
}

function renderPageLinks(page, pages = [], onOpenPage) {
  const nextPages = pages.filter((item) => item.id !== page.id)

  if (!nextPages.length) {
    return (
      <div className="page-stack">
        <article className="page-card">
          <p className="page-card-text">Здесь пока нет дополнительных страниц.</p>
        </article>
      </div>
    )
  }

  return (
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
  )
}

function renderSectionBody(section, page, pages, onOpenPage) {
  switch (section.layout) {
    case 'pageLinks':
      return renderPageLinks(page, pages, onOpenPage)
    case 'checklist':
      return renderChecklist(section.items)
    case 'cards':
    default:
      return renderCards(section.cards)
  }
}

export default function HeroPageSections({ page, pages, onOpenPage }) {
  if (!page.sections?.length) {
    return null
  }

  return (
    <div className="page-stack">
      {page.sections.map((section) => (
        <section key={section.id} id={`section-${page.id}-${section.id}`} className="page-section">
          <div className="page-intro-block">
            <h2 className="page-card-title">{section.title}</h2>
            {section.description ? <p className="page-card-text">{section.description}</p> : null}
          </div>

          {renderSectionBody(section, page, pages, onOpenPage)}
        </section>
      ))}
    </div>
  )
}
