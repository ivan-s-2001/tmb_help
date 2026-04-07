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

function AssetFigure({ asset, className, alt = '' }) {
  if (!asset?.src) {
    return null
  }

  return (
    <div className={className}>
      <img
        src={asset.src}
        alt={alt || asset.alt || ''}
        className={`${className}-image`}
        loading="lazy"
        decoding="async"
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

function buildFaceEntries(block, die) {
  if (!die?.faces?.length) {
    return []
  }

  const requestedFaceIndices = Array.isArray(block.faceIndices) && block.faceIndices.length
    ? block.faceIndices
    : die.faces.map((_, index) => index)

  return requestedFaceIndices
    .map((faceIndex) => ({
      faceIndex,
      face: die.faces[faceIndex],
    }))
    .filter(({ face }) => Boolean(face))
}

function getFaceDetail(block, faceIndex, fallbackFace) {
  const faceDetails = Array.isArray(block.faceDetails) ? block.faceDetails : []
  const indexedDetail = faceDetails.find((detail) => detail?.index === faceIndex)
  const arrayDetail = indexedDetail ?? faceDetails[faceIndex] ?? null

  return {
    title: arrayDetail?.title ?? fallbackFace?.name ?? `Грань ${faceIndex + 1}`,
    description: arrayDetail?.description ?? fallbackFace?.meaning ?? '',
    note: arrayDetail?.note ?? '',
  }
}

function DieBlock({ block }) {
  const die = block.die

  if (!die) {
    return null
  }

  const faceEntries = buildFaceEntries(block, die)
  const requestedFeaturedIndex = Number.isInteger(block.featuredFaceIndex) ? block.featuredFaceIndex : null
  const featuredEntry = requestedFeaturedIndex !== null
    ? faceEntries.find((entry) => entry.faceIndex === requestedFeaturedIndex) ?? faceEntries[0]
    : faceEntries[0]

  const featuredDetail = featuredEntry
    ? getFaceDetail(block, featuredEntry.faceIndex, featuredEntry.face)
    : null

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

      {featuredEntry ? (
        <div className="page-die-main">
          <AssetFigure asset={featuredEntry.face.visualAsset} className="page-die-asset" alt={featuredDetail?.title ?? die.name} />

          <div className="page-die-summary">
            <span className="page-accent-eyebrow">Главная грань</span>
            <strong className="page-route-label">{die.name}</strong>
            <strong className="page-die-face-name">{featuredDetail?.title}</strong>
            {featuredDetail?.description ? (
              <p className="page-card-text">{featuredDetail.description}</p>
            ) : null}
            {featuredDetail?.note ? (
              <span className="page-die-face-meaning">{featuredDetail.note}</span>
            ) : null}
            {block.caption ? <p className="page-card-text">{block.caption}</p> : null}
          </div>
        </div>
      ) : null}

      {faceEntries.length ? (
        <div className="page-die-faces-grid">
          {faceEntries.map(({ face, faceIndex }) => {
            const faceDetail = getFaceDetail(block, faceIndex, face)

            return (
              <article key={face.id} className="page-die-face">
                <AssetFigure asset={face.visualAsset} className="page-die-face-asset" alt={faceDetail.title} />
                <div className="page-die-face-copy">
                  <strong className="page-die-face-name">{faceDetail.title}</strong>
                  {faceDetail.description ? (
                    <span className="page-die-face-meaning">{faceDetail.description}</span>
                  ) : null}
                  {faceDetail.note ? (
                    <span className="page-card-text">{faceDetail.note}</span>
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
