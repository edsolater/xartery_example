import { componentKit, Div, DivChildNode } from '@edsolater/uikit'

export const MainContentArea = componentKit(
  'ConcentSection',
  ({ renderContentComponent }: { renderContentComponent: () => DivChildNode }) => {
    return <Div>{renderContentComponent()}</Div>
  }
)
