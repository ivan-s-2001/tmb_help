import { useState } from 'react'
import AssetFigure from './AssetFigure'

export default function ChecklistBlock({ block }) {
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
