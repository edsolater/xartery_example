import { pickProperty } from '@edsolater/fnkit'
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
    return (
      <Div>
        <For each={entryItems} getKey={pickProperty('name')}>
          {(entry) => (
            <Row>
              <Icon
                src={entry.iconPath}
                cssColor={activeEntryItem?.name === entry.name ? 'cornflowerblue' : 'dodgerblue'}
                onClick={() => {
                  onChangeItem?.(entry)
                }}
              />
              <Text>{entry.name}</Text>
            </Row>
          )}
        </For>
      </Div>
    )
  }
)
