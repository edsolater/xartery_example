import { groupBy, mapEntry, pickProperty, map } from '@edsolater/fnkit'
import { componentKit, Div, For, Icon, Row, Text } from '@edsolater/uikit'
import { SideMenuEntryItem } from '../configs/sideMenu'
import { useTheme } from '../theme/ThemeProvider'

export const SideMenuBar = componentKit(
  'EntriesBar',
  ({
    activeEntryItem,
    entryItems,
    onChangeItem
  }: {
    activeEntryItem: SideMenuEntryItem
    entryItems: SideMenuEntryItem[]
    onChangeItem?: (entry: SideMenuEntryItem) => void
  }) => {
    const theme = useTheme()
    const tree = parseToTreeStructure(entryItems)
    return (
      <Div>
        <For each={tree} getKey={pickProperty('groupName')}>
          {({ groupName, entries }) => (
            <Div>
              <Div>{groupName}</Div>
              {/*TODO: `<dialog>` */}
              <For each={entries} getKey={pickProperty('name')}>
                {(entry) => (
                  <Row
                    onClick={() => {
                      onChangeItem?.(entry)
                    }}
                  >
                    <Icon
                      src={entry.iconPath}
                      cssColor={activeEntryItem?.name === entry.name ? 'cornflowerblue' : 'dodgerblue'}
                    />
                    <Text>{entry.name}</Text>
                  </Row>
                )}
              </For>
            </Div>
          )}
        </For>
      </Div>
    )
  }
)

function parseToTreeStructure(entries: SideMenuEntryItem[]): { groupName: string; entries: SideMenuEntryItem[] }[] {
  const grouped = groupBy(entries, (e) => e.group)
  return Object.entries(grouped).map(([groupName, entries]) => ({ groupName, entries }))
}
