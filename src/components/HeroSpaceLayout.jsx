import HeroSectionMenu from './HeroSectionMenu'

export default function HeroSpaceLayout({
  character,
  pages,
  currentPageId,
  onGoHome,
  onOpenPage,
  children,
}) {
  const currentPage = pages.find((page) => page.id === currentPageId) ?? null

  return (
    <main className="hero-space-screen" style={{ '--accent': character.accent }}>
      {currentPage ? (
        <div className="hero-floating-layer" aria-hidden="false">
          <HeroSectionMenu key={currentPage.id} page={currentPage} />
        </div>
      ) : null}

      <header className="hero-space-header">
        <div className="hero-space-toolbar">
          <button
            type="button"
            className="hero-back-button"
            onClick={onGoHome}
            aria-label="Вернуться к выбору героя"
          >
            <span className="hero-back-arrow">←</span>
            <span>Герои</span>
          </button>
        </div>

        <section className="hero-identity-card" aria-label={`Пространство героя ${character.name}`}>
          <div className="hero-identity-copy">
            <strong className="hero-identity-name">{character.name}</strong>
            <p className="hero-identity-role">{character.tagline}</p>
          </div>

          <div className="hero-identity-visual" aria-hidden="true">
            <div className="hero-identity-halo" />
            <img
              src={character.image}
              alt=""
              className="hero-identity-image"
              loading="eager"
              decoding="async"
            />
          </div>
        </section>

        <nav className="hero-page-nav" aria-label="Страницы героя">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`hero-page-link ${currentPageId === page.id ? 'is-current' : ''}`}
              onClick={() => onOpenPage(page.id)}
              aria-current={currentPageId === page.id ? 'page' : undefined}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero-page-body">{children}</section>
    </main>
  )
}
