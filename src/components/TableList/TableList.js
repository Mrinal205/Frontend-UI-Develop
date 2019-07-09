import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import classnames from 'classnames';

import 'react-table/react-table.css';
import './TableList.scss';

class TableList extends Component {
  static propTypes = {
    noRowLines: PropTypes.bool,
    condensed: PropTypes.bool,
    clickable: PropTypes.bool,
    headerSeparated: PropTypes.bool,
    negativeMargin: PropTypes.bool,
    overflow: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    columns: [],
    showPagination: false,
    sortable: false,
    resizable: false,
    pageSize: 9999,
    minRows: 1
  };

  render() {
    const tlClassName = classnames('TableList', {
      'TableList--clickable': this.props.clickable,
      'TableList--condensed': this.props.condensed,
      'TableList--headerSeparated': this.props.headerSeparated,
      'TableList--negativeMargin': this.props.negativeMargin,
      'TableList--noMargin': this.props.noMargin,
      'TableList--noRowLines': this.props.noRowLines
    });

    const extraProps = {};
    if (this.props.onRowClick) {
      extraProps.getTdProps = (state, rowInfo, column, instance) => {
        return {
          onClick: (e, handleOriginal) => {
            this.props.onRowClick(rowInfo);
            if (handleOriginal) {
              handleOriginal();
            }
          }
        };
      };
    }

    if (this.props.overflow) {
      extraProps.getTbodyProps = extraProps.getTableProps = () => ({
        className: 'rt-overflow'
      });
    }

    return (
      <div className={tlClassName}>
        <ReactTable {...this.props} {...extraProps} />
      </div>
    );
  }
}

export default TableList;
