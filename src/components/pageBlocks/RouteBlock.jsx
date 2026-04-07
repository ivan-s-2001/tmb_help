import { useState } from 'react'
import AssetFigure from './AssetFigure'

export default function RouteBlock({ block }) {
  const steps = block.steps ?? []
  const [doneSteps, setDoneSteps] = useState(() => steps.map((step) => Boolean(step.done)))
  const doneCount = doneSteps.filter(Boolean).length

  if (!steps.length && !block.title) {
    return null
  }

  const toggleStep = (index) => {
    setDoneSteps((previous) => previous.map((value, stepIndex) => (stepIndex === index ? !value : value)))
  }

  return (
    <article className="page-route-block">
      <div className="page-block-head">
        {block.title ? <strong className="page-card-title">{block.title}</strong> : <span />}
        {steps.length ? <span className="page-block-meta">{doneCount}/{steps.length}</span> : null}
      </div>

      {steps.length ? (
        <ol className="page-route-list">
          {steps.map((step, index) => {
            const isDone = doneSteps[index]

            return (
              <li key={`${step.label}-${index}`} className="page-route-list-item">
                <button
                  type="button"
                  className={`page-route-step ${isDone ? 'is-done' : ''}`}
                  onClick={() => toggleStep(index)}
                  aria-pressed={isDone}
                >
                  <span className="page-route-index" aria-hidden="true">
                    {isDone ? '✓' : index + 1}
                  </span>

                  <span className="page-route-copy">
                    {step.imageAsset ? (
                      <AssetFigure asset={step.imageAsset} className="page-inline-asset" alt={step.label ?? ''} />
                    ) : null}
                    <strong className="page-route-label">{step.label}</strong>
                    {step.note ? <span className="page-card-text">{step.note}</span> : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      ) : null}
    </article>
  )
}
