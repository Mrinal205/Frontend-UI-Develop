import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Button from 'components/Button/Button';
import { getMarketUrl } from '_helpers/links';

import './TradeButton.scss';

class TradeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
    this.openSelect = this.openSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeSelect);
  }

  openSelect(e) {
    if (!this.state.selected) {
      this.setState({ selected: true });
      setTimeout(() => {
        window.addEventListener('click', this.closeSelect);
      }, 0);
    }
  }

  closeSelect() {
    this.setState({ selected: false });
    window.removeEventListener('click', this.closeSelect);
  }

  redirectToTrading() {}

  render() {
    const { coin, quotes, exchange } = this.props;
    const { selected } = this.state;

    return (
      <span
        className={classnames('TradeButton', {
          'TradeButton--selected': selected
        })}
      >
        <Button hollow={!Boolean(selected)} tiny neutral onClick={this.openSelect}>
          TRADE
        </Button>
        {selected && (
          <ul className="TradeButton__list">
            {quotes.map(quote => (
              <li className="TradeButton__list-item" key={quote}>
                <Link to={getMarketUrl(exchange, `${coin}/${quote}`)}>
                  {coin}/{quote}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </span>
    );
  }
}

export default TradeButton;
