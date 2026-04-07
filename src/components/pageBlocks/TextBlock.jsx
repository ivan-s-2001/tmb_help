import AssetFigure from './AssetFigure'
import { getBlockParagraphs } from './blockHelpers'

export default function TextBlock({ block }) {
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
