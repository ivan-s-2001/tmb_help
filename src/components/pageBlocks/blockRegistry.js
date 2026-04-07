import AccentBlock from './AccentBlock'
import CardsBlock from './CardsBlock'
import ChecklistBlock from './ChecklistBlock'
import DieBlock from './DieBlock'
import FactBlock from './FactBlock'
import ListBlock from './ListBlock'
import RouteBlock from './RouteBlock'
import TextBlock from './TextBlock'
import TrackerBlock from './TrackerBlock'

export const blockRegistry = {
  text: TextBlock,
  list: ListBlock,
  accent: AccentBlock,
  fact: FactBlock,
  die: DieBlock,
  route: RouteBlock,
  checklist: ChecklistBlock,
  tracker: TrackerBlock,
  cards: CardsBlock,
}
