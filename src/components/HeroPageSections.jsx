import { useState } from 'react'

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function buildTrackPoints(min, max, step) {
  const points = []

  for (let value = min; value <= max; value += step) {
    points.push(value)
  }

  if (!points.length || points[points.length - 1] !== max) {
    points.push(max)
  }

  return points
}

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

function AssetFigure({ asset, className, alt = '', style }) {
  if (!asset?.src) {
    return null
  }

  return (
    <div className={className} style={style}>
      <img
        src={asset.src}
        alt={alt || asset.alt || ''}
        className={`${className}-image`}
        loading="lazy"
        decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }}
      />
    </div>
  )
}

function TextBlock({ block }) {
  const paragraphs = getBlockParagraphs(block)

  if (!paragraphs.length && !block.title && !block.mediaAsset) {
    return null
  }

  return (
    <article className="page-text-block">
      {block.title ? <strong className="page-card-title">{block.title}</strong> : null}
      <AssetFigure asset={block.mediaAsset} className="page-block-media" alt={block.title ?? ''} />

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

function ListBlock({ block }) {
  if (!block.items?.length && !block.title && !block.mediaAsset) {
    return null
  }

  return (
    <article className="page-list-block">
      {block.title ? <strong className="page-card-title">{block.title}</strong> : null}
      <AssetFigure asset={block.mediaAsset} className="page-block-media" alt={block.title ?? ''} />

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

function AccentBlock({ block }) {
  const paragraphs = getBlockParagraphs(block)

  if (!paragraphs.length && !block.title && !block.eyebrow && !block.mediaAsset) {
    return null
  }

  return (
    <article className={`page-accent-block ${block.tone ? `page-accent-block--${block.tone}` : ''}`}>
      {block.eyebrow ? <span className="page-accent-eyebrow">{block.eyebrow}</span> : null}
      {block.title ? <strong className="page-card-title">{block.title}</strong> : null}
      <AssetFigure asset={block.mediaAsset} className="page-block-media" alt={block.title ?? ''} />

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

function FactBlock({ block }) {
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

function getFaceDetail(block, faceIndex) {
  if (!Array.isArray(block.faceDetails)) {
    return null
  }

  const directDetail = block.faceDetails[faceIndex]

  if (directDetail) {
    return directDetail
  }

  return block.faceDetails.find((detail) => detail?.faceIndex === faceIndex) ?? null
}

function getResolvedFaceEntries(block, die) {
  const sourceFaces = die?.faces ?? []

  if (!sourceFaces.length) {
    return []
  }

  const explicitIndices =
    Array.isArray(block.faceIndices) && block.faceIndices.length
      ? block.faceIndices
      : sourceFaces.map((_, index) => index)

  return explicitIndices
    .map((rawIndex) => Number(rawIndex))
    .filter((index) => Number.isInteger(index) && index >= 0 && index < sourceFaces.length)
    .map((index) => {
      const face = sourceFaces[index]
      const detail = getFaceDetail(block, index)

      return {
        index,
        asset: face.visualAsset,
        fallbackName: face.name,
        fallbackMeaning: face.meaning,
        title: detail?.title ?? face.name ?? `Грань ${index + 1}`,
        description: detail?.description ?? detail?.text ?? face.meaning ?? '',
        note: detail?.note ?? '',
      }
    })
}

function DieBlock({ block }) {
  const die = block.die
  const faceEntries = getResolvedFaceEntries(block, die)

  if (!die || !faceEntries.length) {
    return null
  }

  const fallbackFeaturedIndex = faceEntries[0]?.index ?? 0
  const featuredFaceIndex = Number.isInteger(block.featuredFaceIndex)
    ? block.featuredFaceIndex
    : fallbackFeaturedIndex

  const featuredEntry =
    faceEntries.find((entry) => entry.index === featuredFaceIndex)
    ?? faceEntries[0]

  const showFeaturedFace = block.showFeaturedFace !== false
  const showAllFaces = block.showAllFaces !== false

  return (
    <article className="page-die-block">
      <div className="page-block-head">
        <div className="page-die-head">
          {block.eyebrow ? <span className="page-accent-eyebrow">{block.eyebrow}</span> : null}
          {block.title ? <strong className="page-card-title">{block.title}</strong> : null}
          {block.text ? <p className="page-card-text">{block.text}</p> : null}
        </div>

        <span className="page-block-meta page-block-meta--value">{die.code}</span>
      </div>

      {showFeaturedFace && featuredEntry ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 5.75rem) minmax(0, 1fr)',
            gap: '0.85rem',
            alignItems: 'center',
            padding: '0.82rem',
            borderRadius: '1rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <AssetFigure
            asset={featuredEntry.asset}
            className="page-die-featured-asset"
            alt={`${block.title ?? die.name} — ${featuredEntry.title}`}
            style={{
              width: '5.75rem',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />

          <div style={{ display: 'grid', gap: '0.22rem', minWidth: 0 }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#cdd7f5',
              }}
            >
              {block.featuredFaceLabel ?? `Главная грань · ${featuredEntry.index + 1}`}
            </span>
            <strong style={{ fontSize: '1.1rem', lineHeight: 1.05 }}>{block.title ?? die.name}</strong>
            <strong style={{ fontSize: '0.98rem', lineHeight: 1.18 }}>{featuredEntry.title}</strong>
            {featuredEntry.description ? (
              <p className="page-card-text">{featuredEntry.description}</p>
            ) : null}
            {featuredEntry.note ? (
              <p
                style={{
                  color: '#dbe4fb',
                  fontSize: '0.84rem',
                  lineHeight: 1.28,
                }}
              >
                {featuredEntry.note}
              </p>
            ) : null}
            {block.caption ? (
              <p
                style={{
                  color: '#9fb0d9',
                  fontSize: '0.82rem',
                  lineHeight: 1.28,
                }}
              >
                {block.caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {showAllFaces ? (
        <div className="page-die-faces-grid">
          {faceEntries.map((entry) => {
            const isFeatured = featuredEntry?.index === entry.index

            return (
              <article
                key={`${die.id}-${entry.index}`}
                className={`page-die-face ${isFeatured ? 'is-featured' : ''}`}
                style={isFeatured ? { borderColor: 'color-mix(in srgb, var(--accent) 30%, rgba(255,255,255,0.12))' } : undefined}
              >
                <AssetFigure
                  asset={entry.asset}
                  className="page-die-face-asset"
                  alt={`${block.title ?? die.name} — ${entry.title}`}
                />

                <div className="page-die-face-copy">
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#c5d0ef',
                    }}
                  >
                    Грань {entry.index + 1}
                  </span>
                  <strong className="page-die-face-name">{entry.title}</strong>
                  {entry.description ? (
                    <span className="page-die-face-meaning">{entry.description}</span>
                  ) : null}
                  {entry.note ? (
                    <span
                      style={{
                        color: '#dbe4fb',
                        fontSize: '0.78rem',
                        lineHeight: 1.25,
                      }}
                    >
                      {entry.note}
                    </span>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </article>
  )
}

function CardsBlock({ block, page, pages, onOpenPage }) {
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

  const isRouteCards =
    block.source === 'otherPages'
    || items.some((item) => item.actionPageId || item.action?.pageId)

  if (!items.length) {
    return (
      <div className={`page-cards-block ${isRouteCards ? 'page-cards-block--routes' : 'page-cards-block--content'}`}>
        <div className={`page-card-grid ${isRouteCards ? 'page-card-grid--routes' : 'page-card-grid--content'}`}>
          <article className="page-card">
            <p className="page-card-text">Здесь пока нет дополнительных блоков этого типа.</p>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className={`page-cards-block ${isRouteCards ? 'page-cards-block--routes' : 'page-cards-block--content'}`}>
      <div className={`page-card-grid ${isRouteCards ? 'page-card-grid--routes' : 'page-card-grid--content'}`}>
        {items.map((item, index) => {
          const actionPageId = item.actionPageId ?? item.action?.pageId
          const cardMedia = item.imageAsset

          if (actionPageId) {
            return (
              <button
                key={item.title ?? index}
                type="button"
                className="page-card page-card-action page-card--route"
                onClick={() => onOpenPage(actionPageId)}
              >
                <AssetFigure asset={cardMedia} className="page-card-media" alt={item.title ?? ''} />
                {item.title ? <strong className="page-card-title">{item.title}</strong> : null}
                {item.text ? <p className="page-card-text">{item.text}</p> : null}
                <span className="page-card-link">{item.actionLabel ?? 'Открыть →'}</span>
              </button>
            )
          }

          return (
            <article key={item.title ?? index} className="page-card page-card--content">
              <AssetFigure asset={cardMedia} className="page-card-media" alt={item.title ?? ''} />
              {item.title ? <strong className="page-card-title">{item.title}</strong> : null}
              {item.text ? <p className="page-card-text">{item.text}</p> : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function RouteBlock({ block }) {
  const steps = block.steps ?? []
  const [doneSteps, setDoneSteps] = useState(() => steps.map((step) => Boolean(step.done)))
  const doneCount = doneSteps.filter(Boolean).length

  if (!steps.length && !block.title) {
    return null
  }

  const toggleStep = (index) => {
    setDoneSteps((previous) => previous.map((value, stepIndex) => (stepIndex === index ? !value : value)))
  }

  return (
    <article className="page-route-block">
      <div className="page-block-head">
        {block.title ? <strong className="page-card-title">{block.title}</strong> : <span />}
        {steps.length ? <span className="page-block-meta">{doneCount}/{steps.length}</span> : null}
      </div>

      {steps.length ? (
        <ol className="page-route-list">
          {steps.map((step, index) => {
            const isDone = doneSteps[index]

            return (
              <li key={`${step.label}-${index}`} className="page-route-list-item">
                <button
                  type="button"
                  className={`page-route-step ${isDone ? 'is-done' : ''}`}
                  onClick={() => toggleStep(index)}
                  aria-pressed={isDone}
                >
                  <span className="page-route-index" aria-hidden="true">
                    {isDone ? '✓' : index + 1}
                  </span>

                  <span className="page-route-copy">
                    {step.imageAsset ? (
                      <AssetFigure asset={step.imageAsset} className="page-inline-asset" alt={step.label ?? ''} />
                    ) : null}
                    <strong className="page-route-label">{step.label}</strong>
                    {step.note ? <span className="page-card-text">{step.note}</span> : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      ) : null}
    </article>
  )
}

function ChecklistBlock({ block }) {
  const items = block.items ?? []
  const [checkedItems, setCheckedItems] = useState(() => items.map((item) => Boolean(item.checked)))
  const doneCount = checkedItems.filter(Boolean).length

  if (!items.length && !block.title) {
    return null
  }

  const toggleItem = (index) => {
    setCheckedItems((previous) => previous.map((value, itemIndex) => (itemIndex === index ? !value : value)))
  }

  return (
    <article className="page-checklist-block">
      <div className="page-block-head">
        {block.title ? <strong className="page-card-title">{block.title}</strong> : <span />}
        {items.length ? <span className="page-block-meta">{doneCount}/{items.length}</span> : null}
      </div>

      {items.length ? (
        <div className="page-checklist-rows">
          {items.map((item, index) => {
            const isChecked = checkedItems[index]

            return (
              <button
                key={`${item.label}-${index}`}
                type="button"
                className={`page-checklist-row ${isChecked ? 'is-done' : ''}`}
                onClick={() => toggleItem(index)}
                aria-pressed={isChecked}
              >
                <span className="page-checklist-mark" aria-hidden="true">
                  {isChecked ? '✓' : ''}
                </span>

                <span className="page-checklist-copy">
                  {item.imageAsset ? (
                    <AssetFigure asset={item.imageAsset} className="page-inline-asset" alt={item.label ?? ''} />
                  ) : null}
                  <strong className="page-checklist-label">{item.label}</strong>
                  {item.note ? <span className="page-card-text">{item.note}</span> : null}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </article>
  )
}

function TrackerBlock({ block }) {
  const min = Number.isFinite(block.min) ? block.min : 0
  const max = Number.isFinite(block.max) ? block.max : min
  const step = Number.isFinite(block.step) && block.step > 0 ? block.step : 1
  const initialValue = clampNumber(
    Number.isFinite(block.initialValue) ? block.initialValue : min,
    min,
    max,
  )

  const [value, setValue] = useState(initialValue)
  const points = buildTrackPoints(min, max, step)

  const updateValue = (nextValue) => {
    setValue(clampNumber(nextValue, min, max))
  }

  if (!points.length && !block.title) {
    return null
  }

  return (
    <article className="page-tracker-block">
      <div className="page-block-head">
        {block.title ? <strong className="page-card-title">{block.title}</strong> : <span />}
        <span className="page-block-meta page-block-meta--value">{value}</span>
      </div>

      {block.note ? <p className="page-card-text">{block.note}</p> : null}

      <div className="page-tracker-controls">
        <button
          type="button"
          className="page-tracker-button"
          onClick={() => updateValue(value - step)}
          aria-label="Уменьшить счётчик"
        >
          −
        </button>

        <div className="page-tracker-scale" aria-label={`Шкала от ${min} до ${max}`}>
          {points.map((point) => {
            const isFilled = point <= value
            const isCurrent = point === value

            return (
              <button
                key={point}
                type="button"
                className={`page-tracker-step ${isFilled ? 'is-filled' : ''} ${isCurrent ? 'is-current' : ''}`}
                onClick={() => updateValue(point)}
                aria-pressed={isCurrent}
                aria-label={`Установить значение ${point}`}
              >
                <span className="page-tracker-dot" aria-hidden="true" />
                <span className="page-tracker-value">{point}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="page-tracker-button"
          onClick={() => updateValue(value + step)}
          aria-label="Увеличить счётчик"
        >
          +
        </button>
      </div>
    </article>
  )
}

function renderBlock(block, page, pages, onOpenPage) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />
    case 'list':
      return <ListBlock block={block} />
    case 'accent':
      return <AccentBlock block={block} />
    case 'fact':
      return <FactBlock block={block} />
    case 'die':
      return <DieBlock block={block} />
    case 'route':
      return <RouteBlock block={block} />
    case 'checklist':
      return <ChecklistBlock block={block} />
    case 'tracker':
      return <TrackerBlock block={block} />
    case 'cards':
      return <CardsBlock block={block} page={page} pages={pages} onOpenPage={onOpenPage} />
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
                <div
                  key={block.id ?? `${section.id}-${block.type}-${index}`}
                  className={`page-block-slot page-block-slot--${block.type}`}
                >
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
