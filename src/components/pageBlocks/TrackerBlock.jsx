import { useState } from 'react'
import { buildTrackPoints, clampNumber } from './blockHelpers'

export default function TrackerBlock({ block }) {
  const min = Number.isFinite(block.min) ? block.min : 0
  const max = Number.isFinite(block.max) ? block.max : min
  const step = Number.isFinite(block.step) && block.step > 0 ? block.step : 1
  const initialValue = clampNumber(
    Number.isFinite(block.initialValue) ? block.initialValue : min,
    min,
    max,
  )

  const [value, setValue] = useState(initialValue)
  const points = buildTrackPoints(min, max, step)

  const updateValue = (nextValue) => {
    setValue(clampNumber(nextValue, min, max))
  }

  if (!points.length && !block.title) {
    return null
  }

  return (
    <article className="page-tracker-block">
      <div className="page-block-head">
        {block.title ? <strong className="page-card-title">{block.title}</strong> : <span />}
        <span className="page-block-meta page-block-meta--value">{value}</span>
      </div>

      {block.note ? <p className="page-card-text">{block.note}</p> : null}

      <div className="page-tracker-controls">
        <button
          type="button"
          className="page-tracker-button"
          onClick={() => updateValue(value - step)}
          aria-label="Уменьшить счётчик"
        >
          −
        </button>

        <div className="page-tracker-scale" aria-label={`Шкала от ${min} до ${max}`}>
          {points.map((point) => {
            const isFilled = point <= value
            const isCurrent = point === value

            return (
              <button
                key={point}
                type="button"
                className={`page-tracker-step ${isFilled ? 'is-filled' : ''} ${isCurrent ? 'is-current' : ''}`}
                onClick={() => updateValue(point)}
                aria-pressed={isCurrent}
                aria-label={`Установить значение ${point}`}
              >
                <span className="page-tracker-dot" aria-hidden="true" />
                <span className="page-tracker-value">{point}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="page-tracker-button"
          onClick={() => updateValue(value + step)}
          aria-label="Увеличить счётчик"
        >
          +
        </button>
      </div>
    </article>
  )
}
