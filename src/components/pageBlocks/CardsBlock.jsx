import AssetFigure from './AssetFigure'

export default function CardsBlock({ block, page, pages, onOpenPage }) {
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
