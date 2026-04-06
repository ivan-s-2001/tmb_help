import HeroPageSections from '../../components/HeroPageSections'

export default function HeroMenuPage({ character, page, pages, onOpenPage }) {
  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">{page.lead ?? `Страницы ${character.name} собраны здесь. Открой нужную и переходи дальше.`}</p>
      </section>

      <HeroPageSections page={page} pages={pages} onOpenPage={onOpenPage} />
    </>
  )
}
