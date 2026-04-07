import AssetFigure from './AssetFigure'
import { buildFaceEntries, getFaceDetail } from './blockHelpers'

export default function DieBlock({ block }) {
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
          <AssetFigure
            asset={featuredEntry.face.visualAsset}
            className="page-die-asset"
            alt={featuredDetail?.title ?? die.name}
          />

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
