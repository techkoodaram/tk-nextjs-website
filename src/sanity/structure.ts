import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('event')
        .title('Events')
        .child(
          S.documentTypeList('event')
            .title('Events')
            .defaultOrdering([{field: 'eventDate', direction: 'desc'}])
        ),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'event'),
    ])
