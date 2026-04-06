function getBlockParagraphs(block) {
  if (Array.isArray(block.paragraphs) && block.paragraphs.length) {
    return block.paragraphs
  }

  if (typeof block.text === 'string' && block.text.trim()) {
    return [block.text]
  }

  return []
}

function buildLegacyBlocks(section) {
  switch (section.layout) {
    case 'pageLinks':
      return [
        {
          type: 'cards',
          source: 'otherPages',
        },
      ]
    case 'checklist':
      return [
        {
          type: 'list',
          items: section.items ?? [],
        },
      ]
    case 'cards':
    default:
      return [
        {
          type: 'cards',
          items: section.cards ?? [],
        },
      ]
  }
}

function getSectionBlocks(section) {
  if (section.blocks?.length) {
    return section.blocks
  }

  return buildLegacyBlocks(section)
}

function renderTextBlock(block) {
  const paragraphs = getBlockParagraphs(block)

  if (!paragraphs.length && !block.title) {
    return null
  }

  return (
    <article className="page-card">
      {block.title ? <strong className="page-card-title">{block.title}</strong> : null}

      {paragraphs.length ? (
        <div className="page-rich-text">
          {paragraphs.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`} className="page-card-text">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function renderListBlock(block) {
  if (!block.items?.length && !block.title) {
    return null
  }

  return (
    <article className="page-card">
      {block.title ? <strong className="page-card-title">{block.title}</strong> : null}

      {block.items?.length ? (
        <ul className="page-checklist">
          {block.items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function renderAccentBlock(block) {
  const paragraphs = getBlockParagraphs(block)

  if (!paragraphs.length && !block.title && !block.eyebrow) {
    return null
  }

  return (
    <article className="page-accent-block">
      {block.eyebrow ? <span className="page-accent-eyebrow">{block.eyebrow}</span> : null}
      {block.title ? <strong className="page-card-title">{block.title}</strong> : null}

      {paragraphs.length ? (
        <div className="page-rich-text">
          {paragraphs.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`} className="page-card-text">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function renderFactBlock(block) {
  if (!block.label || !block.value) {
    return null
  }

  return (
    <article className="page-fact-block">
      <span className="page-fact-label">{block.label}</span>
      <strong className="page-fact-value">{block.value}</strong>
      {block.note ? <span className="page-fact-note">{block.note}</span> : null}
    </article>
  )
}

function renderCardsBlock(block, page, pages, onOpenPage) {
  const items =
    block.source === 'otherPages'
      ? pages
          .filter((item) => item.id !== page.id)
          .map((item) => ({
            title: item.title,
            text: item.description,
            actionPageId: item.id,
            actionLabel: 'Открыть',
          }))
      : block.items ?? []

  if (!items.length) {
    return (
      <div className="page-card-grid">
        <article className="page-card">
          <p className="page-card-text">Здесь пока нет дополнительных блоков этого типа.</p>
        </article>
      </div>
    )
  }

  return (
    <div className="page-card-grid">
      {items.map((item, index) => {
        const actionPageId = item.actionPageId ?? item.action?.pageId

        if (actionPageId) {
          return (
            <button
              key={item.title ?? index}
              type="button"
              className="page-card page-card-action"
              onClick={() => onOpenPage(actionPageId)}
            >
              {item.title ? <strong className="page-card-title">{item.title}</strong> : null}
              {item.text ? <p className="page-card-text">{item.text}</p> : null}
              <span className="page-card-link">{item.actionLabel ?? 'Открыть →'}</span>
            </button>
          )
        }

        return (
          <article key={item.title ?? index} className="page-card">
            {item.title ? <strong className="page-card-title">{item.title}</strong> : null}
            {item.text ? <p className="page-card-text">{item.text}</p> : null}
          </article>
        )
      })}
    </div>
  )
}

function renderBlock(block, page, pages, onOpenPage) {
  switch (block.type) {
    case 'text':
      return renderTextBlock(block)
    case 'list':
      return renderListBlock(block)
    case 'accent':
      return renderAccentBlock(block)
    case 'fact':
      return renderFactBlock(block)
    case 'cards':
      return renderCardsBlock(block, page, pages, onOpenPage)
    default:
      return null
  }
}

export default function HeroPageSections({ page, pages, onOpenPage }) {
  if (!page.sections?.length) {
    return null
  }

  return (
    <div className="page-stack">
      {page.sections.map((section) => {
        const blocks = getSectionBlocks(section)

        return (
          <section key={section.id} id={`section-${page.id}-${section.id}`} className="page-section">
            <div className="page-intro-block">
              <h2 className="page-card-title">{section.title}</h2>
              {section.description ? <p className="page-card-text">{section.description}</p> : null}
            </div>

            <div className="page-block-stack">
              {blocks.map((block, index) => (
                <div key={block.id ?? `${section.id}-${block.type}-${index}`} className="page-block-slot">
                  {renderBlock(block, page, pages, onOpenPage)}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
