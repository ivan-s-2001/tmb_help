export default function FactBlock({ block }) {
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
