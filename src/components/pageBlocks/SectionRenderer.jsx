import BlockRenderer from './BlockRenderer'

export default function SectionRenderer({ section, page, pages, onOpenPage }) {
  const blocks = Array.isArray(section.blocks) ? section.blocks : []

  return (
    <section
      id={`section-${page.id}-${section.id}`}
      className="page-section"
    >
      <div className="page-intro-block">
        <h2 className="page-card-title">{section.title}</h2>
        {section.description ? <p className="page-card-text">{section.description}</p> : null}
      </div>

      <div className="page-block-stack">
        {blocks.map((block, index) => (
          <BlockRenderer
            key={block.id ?? `${section.id}-${block.type}-${index}`}
            block={block}
            page={page}
            pages={pages}
            onOpenPage={onOpenPage}
            sectionId={section.id}
          />
        ))}
      </div>
    </section>
  )
}
