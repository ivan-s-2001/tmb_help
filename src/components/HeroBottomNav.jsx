function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="4.5" width="5" height="5" rx="1.2" />
      <rect x="14.5" y="4.5" width="5" height="5" rx="1.2" />
      <rect x="4.5" y="14.5" width="5" height="5" rx="1.2" />
      <rect x="14.5" y="14.5" width="5" height="5" rx="1.2" />
    </svg>
  )
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.2a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4Z" />
      <path d="M5.2 19.2a7.4 7.4 0 0 1 13.6 0" />
    </svg>
  )
}

function PrepIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6.5h8" />
      <path d="M8 11.5h8" />
      <path d="M8 16.5h5" />
      <path d="M5 6.5h.01" />
      <path d="M5 11.5h.01" />
      <path d="M5 16.5h.01" />
    </svg>
  )
}

function BlocksIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="5.5" width="15" height="3.5" rx="1.2" />
      <rect x="4.5" y="10.25" width="15" height="3.5" rx="1.2" />
      <rect x="4.5" y="15" width="15" height="3.5" rx="1.2" />
    </svg>
  )
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  )
}

function getPageIcon(pageId) {
  switch (pageId) {
    case 'menu':
      return <MenuIcon />
    case 'overview':
      return <OverviewIcon />
    case 'prep':
      return <PrepIcon />
    case 'blocks':
      return <BlocksIcon />
    default:
      return <DefaultIcon />
  }
}

export default function HeroBottomNav({ pages, currentPageId, onOpenPage }) {
  if (!pages?.length) {
    return null
  }

  return (
    <nav className="hero-bottom-nav" aria-label="Страницы героя">
      {pages.map((page) => {
        const isCurrent = currentPageId === page.id
        const label = page.tabLabel ?? page.label

        return (
          <button
            key={page.id}
            type="button"
            className={`hero-bottom-tab ${isCurrent ? 'is-current' : ''}`}
            onClick={() => onOpenPage(page.id)}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={page.title}
          >
            <span className="hero-bottom-tab-icon">{getPageIcon(page.id)}</span>
            <span className="hero-bottom-tab-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}