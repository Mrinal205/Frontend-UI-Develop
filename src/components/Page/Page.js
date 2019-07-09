import React from 'react';
import Helmet from 'react-helmet';

export class Page extends React.Component {
  render() {
    const { title = 'Moon Assist' } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <title>{`${title} - Moon Assist`}</title>
        </Helmet>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default Page;
