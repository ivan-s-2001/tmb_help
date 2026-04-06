import HeroPageSections from '../../components/HeroPageSections'
import HeroSectionMenu from '../../components/HeroSectionMenu'

export default function HeroOverviewPage({ page, pages, onOpenPage }) {
  return (
    <>
      <HeroSectionMenu page={page} />

      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">{page.lead ?? page.description}</p>
      </section>

      <HeroPageSections page={page} pages={pages} onOpenPage={onOpenPage} />
    </>
  )
}
