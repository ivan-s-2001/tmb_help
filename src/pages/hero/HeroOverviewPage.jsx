import HeroPageSections from '../../components/HeroPageSections'

export default function HeroOverviewPage({ page, pages, onOpenPage }) {
  return (
    <>
      <section className="page-intro-block">
        <h1>{page.title}</h1>
        <p className="page-lead">{page.lead ?? page.description}</p>
      </section>

      <HeroPageSections page={page} pages={pages} onOpenPage={onOpenPage} />
    </>
  )
}
