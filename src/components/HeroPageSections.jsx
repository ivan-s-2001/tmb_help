import SectionRenderer from './pageBlocks/SectionRenderer'

export default function HeroPageSections({ page, pages, onOpenPage }) {
  if (!page.sections?.length) {
    return null
  }

  return (
    <div className="page-stack">
      {page.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          page={page}
          pages={pages}
          onOpenPage={onOpenPage}
        />
      ))}
    </div>
  )
}
