import AssetFigure from './AssetFigure'

export default function ListBlock({ block }) {
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
