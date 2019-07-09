import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Overview from './Overview/Overview';
import EditPassword from './Password';

export class Settings extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/edit/password`} component={EditPassword} />
        <Route path="*" component={Overview} />
      </Switch>
    );
  }
}
export default Settings;
