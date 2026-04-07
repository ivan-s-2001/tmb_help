export default function AssetFigure({ asset, className, alt = '' }) {
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
