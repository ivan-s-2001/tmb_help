export default function HeroPrepPage({ character, page }) {
  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">Быстрый вход перед началом партии и спокойная точка старта внутри героя.</p>
      </section>

      <div className="page-stack">
        <article className="page-card">
          <strong className="page-card-title">{character.name}</strong>
          <ul className="page-checklist">
            <li>Проверь роль героя и состав партии.</li>
            <li>Открой нужную страницу героя перед ходом.</li>
            <li>Держи это пространство под рукой во время игры.</li>
          </ul>
        </article>
      </div>
    </>
  )
}
