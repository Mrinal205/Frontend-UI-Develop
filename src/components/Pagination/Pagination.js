import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import './Pagination.scss';

export class Pagination extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    maxVisibleItems: PropTypes.number,
    selectPage: PropTypes.func
  };

  static defaultProps = {
    maxVisibleItems: 3,
    selectPage: noop
  };

  constructor(props) {
    super(props);

    const { currentPage, totalPages, maxVisibleItems } = props;
    // Try to center the initial selected Item
    // in case it's not 0
    let startItem = Math.max(currentPage - Math.floor(maxVisibleItems / 2), 0);
    if (startItem + maxVisibleItems >= totalPages) {
      startItem = Math.max(totalPages - maxVisibleItems, 0);
    }
    this.state = { startItem };
  }

  handleClick(direction) {
    const { startItem } = this.state;
    const { currentPage, maxVisibleItems, totalPages, selectPage } = this.props;

    if (direction === 'prev') {
      this.setState({ startItem: Math.max(startItem - 1, 0) });
      selectPage(currentPage - 1);
    } else if (direction === 'next') {
      let newStartItem = Math.min(totalPages - maxVisibleItems, startItem + 1);
      newStartItem = newStartItem >= 0 ? newStartItem : 0;

      this.setState({ startItem: newStartItem });
      selectPage(currentPage + 1);
    }
  }

  renderPages() {
    const { maxVisibleItems, totalPages, currentPage, selectPage } = this.props;
    const { startItem } = this.state;

    const maxItem = Math.min(startItem + maxVisibleItems, totalPages);
    const items = [];
    for (let i = startItem; i < maxItem; i++) {
      items.push(
        <span
          key={i}
          className={classnames('Pagination__Button', {
            selected: i === currentPage
          })}
          onClick={selectPage.bind(null, i)}
        >
          {i + 1}
        </span>
      );
    }
    return items;
  }

  render() {
    const { currentPage, totalPages } = this.props;

    const { startItem } = this.state;

    const prevDisabled = currentPage <= 0;
    const nextDisabled = currentPage + 1 >= totalPages;

    return (
      <div className="Pagination">
        <span
          onClick={prevDisabled ? noop : this.handleClick.bind(this, 'prev')}
          className={classnames('Pagination__Button', 'prev', { disabled: prevDisabled })}
        >
          {'<'}
        </span>
        {this.renderPages(startItem)}
        <span
          onClick={nextDisabled ? noop : this.handleClick.bind(this, 'next')}
          className={classnames('Pagination__Button', 'next', { disabled: nextDisabled })}
        >
          {'>'}
        </span>
      </div>
    );
  }
}

export default Pagination;
