import { useState } from 'react'

function getBlockParagraphs(block) {
  if (Array.isArray(block.paragraphs) && block.paragraphs.length) {
    return block.paragraphs
  }

  if (typeof block.text === 'string' && block.text.trim()) {
    return [block.text]
  }

  return []
}

function normalizeItem(item) {
  if (typeof item === 'string') {
    return {
      label: item,
    }
  }

  return item ?? {}
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

function getAccentMeta(tone = 'important') {
  switch (tone) {
    case 'tip':
      return {
        icon: '✓',
        label: 'Совет',
      }
    case 'warning':
      return {
        icon: '!',
        label: 'Внимание',
      }
    case 'danger':
      return {
        icon: '×',
        label: 'Ошибка',
      }
    case 'important':
    default:
      return {
        icon: '•',
        label: 'Важно',
      }
  }
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
          {block.items.map((item, index) => {
            const normalizedItem = normalizeItem(item)

            return <li key={`${normalizedItem.label}-${index}`}>{normalizedItem.label}</li>
          })}
        </ul>
      ) : null}
    </article>
  )
}

function renderAccentBlock(block) {
  const paragraphs = getBlockParagraphs(block)
  const tone = block.tone ?? 'important'
  const accentMeta = getAccentMeta(tone)

  if (!paragraphs.length && !block.title && !block.eyebrow) {
    return null
  }

  return (
    <article className={`page-accent-block is-${tone}`}>
      <div className="page-accent-head">
        <span className="page-accent-icon" aria-hidden="true">
          {accentMeta.icon}
        </span>
        <span className="page-accent-eyebrow">{block.eyebrow ?? accentMeta.label}</span>
      </div>

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

function ChecklistBlock({ block }) {
  const items = (block.items ?? []).map((item) => normalizeItem(item))
  const [checkedItems, setCheckedItems] = useState(() =>
    items.map((item) => Boolean(item.checked)),
  )

  if (!items.length && !block.title) {
    return null
  }

  const checkedCount = checkedItems.filter(Boolean).length

  const toggleItem = (index) => {
    setCheckedItems((currentItems) =>
      currentItems.map((item, currentIndex) =>
        currentIndex === index ? !item : currentItems[currentIndex],
      ),
    )
  }

  const resetChecklist = () => {
    setCheckedItems(items.map((item) => Boolean(item.checked)))
  }

  return (
    <article className="page-card page-checklist-block">
      <div className="page-checklist-header">
        {block.title ? <strong className="page-card-title">{block.title}</strong> : <span />}
        <span className="page-checklist-progress">
          {checkedCount} / {items.length}
        </span>
      </div>

      <div className="page-checklist-interactive">
        {items.map((item, index) => {
          const isChecked = checkedItems[index]

          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              className={`page-check-item ${isChecked ? 'is-checked' : ''}`}
              onClick={() => toggleItem(index)}
              aria-pressed={isChecked}
            >
              <span className="page-check-marker" aria-hidden="true">
                {isChecked ? '✓' : ''}
              </span>

              <span className="page-check-copy">
                <span className="page-check-label">{item.label}</span>
                {item.note ? <span className="page-check-note">{item.note}</span> : null}
              </span>
            </button>
          )
        })}
      </div>

      <div className="page-inline-actions">
        <button type="button" className="page-inline-action" onClick={resetChecklist}>
          Сбросить
        </button>
      </div>
    </article>
  )
}

function RouteBlock({ block }) {
  const steps = (block.steps ?? []).map((step) => normalizeItem(step))
  const paragraphs = getBlockParagraphs(block)

  if (!steps.length && !block.title) {
    return null
  }

  return (
    <article className="page-card page-route-block">
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

      {steps.length ? (
        <ol className="page-route-list">
          {steps.map((step, index) => (
            <li key={`${step.label}-${index}`} className="page-route-step">
              <span className="page-route-index" aria-hidden="true">
                {index + 1}
              </span>

              <div className="page-route-copy">
                <strong className="page-route-title">{step.label}</strong>
                {step.note ? <p className="page-route-note">{step.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  )
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function TrackerBlock({ block }) {
  const min = Number.isFinite(Number(block.min)) ? Number(block.min) : 0
  const max = Number.isFinite(Number(block.max)) ? Number(block.max) : min + 4
  const step = Number.isFinite(Number(block.step)) && Number(block.step) > 0 ? Number(block.step) : 1
  const initialValue = Number.isFinite(Number(block.initialValue))
    ? clampValue(Number(block.initialValue), min, max)
    : min

  const [value, setValue] = useState(initialValue)

  const progressPercent = max > min ? ((value - min) / (max - min)) * 100 : 0

  const increment = () => {
    setValue((currentValue) => clampValue(currentValue + step, min, max))
  }

  const decrement = () => {
    setValue((currentValue) => clampValue(currentValue - step, min, max))
  }

  const reset = () => {
    setValue(initialValue)
  }

  return (
    <article className="page-card page-tracker-block">
      <div className="page-tracker-head">
        <div className="page-tracker-copy">
          {block.title ? <strong className="page-card-title">{block.title}</strong> : null}
          {block.note ? <p className="page-card-text">{block.note}</p> : null}
        </div>

        <div className="page-tracker-value-wrap">
          <strong className="page-tracker-value">{value}</strong>
          <span className="page-tracker-range">
            {min}–{max}
          </span>
        </div>
      </div>

      <div className="page-tracker-bar" aria-hidden="true">
        <span className="page-tracker-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="page-tracker-controls">
        <button
          type="button"
          className="page-inline-action"
          onClick={decrement}
          disabled={value <= min}
        >
          −
        </button>

        <button type="button" className="page-inline-action" onClick={reset}>
          Сбросить
        </button>

        <button
          type="button"
          className="page-inline-action"
          onClick={increment}
          disabled={value >= max}
        >
          +
        </button>
      </div>
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
    case 'checklist':
      return <ChecklistBlock block={block} />
    case 'route':
      return <RouteBlock block={block} />
    case 'tracker':
      return <TrackerBlock block={block} />
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
