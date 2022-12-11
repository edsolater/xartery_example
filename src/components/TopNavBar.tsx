import { Button, componentKit, Div, Grid, Motion, Row, Switch } from '@edsolater/uikit';
import { WrappedBy } from '@edsolater/uikit/plugins';
import { useState } from 'react';
import { defaultTheme } from '../theme/defaultTheme';
import { lightTheme } from '../theme/lightTheme';
import { useTheme } from '../theme/ThemeProvider';


export const TopNavBar = componentKit('TopNavBar', () => {
  const { value: theme, set: setTheme } = useTheme();
  const [flag] = useState(false);
  return (
    <Row icss={{ backgroundColor: theme?.colors.navBarBg, justifyContent: 'end', gap: 16 }}>
      <Row>
        <Div>Default Theme</Div>
        <Switch defaultCheck={flag} onToggle={(open) => (open ? setTheme(defaultTheme) : setTheme(lightTheme))} />
      </Row>
      <Grid icss={{ width: 200, border: '1px solid black', justifyContent: flag ? 'end' : 'start' }}>
        <Div plugins={WrappedBy(Motion)} icss={{ width: 40, height: 40, background: 'dodgerblue' }}></Div>
      </Grid>
      <Button onClick={() => setTheme?.(lightTheme)}>Light Theme</Button>
      <Button onClick={() => setTheme?.(defaultTheme)}>Default Theme</Button>
    </Row>
  );
});
