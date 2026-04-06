import { useRef } from 'react'

export default function HeroSectionMenu({ page }) {
  const menuRef = useRef(null)
  const sections = page.sections ?? []

  if (sections.length < 2) {
    return null
  }

  const openSection = (sectionId) => {
    const target = document.getElementById(`section-${page.id}-${sectionId}`)

    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })

    if (menuRef.current) {
      menuRef.current.open = false
    }
  }

  return (
    <details ref={menuRef} className="hero-section-menu">
      <summary
        className="hero-section-menu-trigger"
        aria-label={`Открыть секции страницы ${page.title}`}
      >
        <span className="sr-only">Открыть секции страницы {page.title}</span>

        <span className="hero-section-menu-burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>

      <nav className="hero-section-menu-panel" aria-label={`Секции страницы ${page.title}`}>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="hero-section-menu-item"
            onClick={() => openSection(section.id)}
          >
            <span>{section.title}</span>
          </button>
        ))}
      </nav>
    </details>
  )
}
