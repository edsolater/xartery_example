import { componentKit, Div, DivChildNode } from '@edsolater/uikit'

export const MainContentArea = componentKit(
  'MainContentArea',
  ({ renderContentComponent }: { renderContentComponent: () => DivChildNode }) => {
    return <Div>{renderContentComponent()}</Div>
  }
)
