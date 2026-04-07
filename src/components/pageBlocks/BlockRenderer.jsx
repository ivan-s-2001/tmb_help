import { blockRegistry } from './blockRegistry'

export default function BlockRenderer({ block, page, pages, onOpenPage, sectionId }) {
  const BlockComponent = blockRegistry[block.type]

  if (!BlockComponent) {
    return null
  }

  return (
    <div
      className={`page-block-slot page-block-slot--${block.type}`}
      data-section={sectionId}
      data-block-type={block.type}
    >
      <BlockComponent
        block={block}
        page={page}
        pages={pages}
        onOpenPage={onOpenPage}
      />
    </div>
  )
}
