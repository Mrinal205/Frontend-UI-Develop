import React from 'react';

import GridBox from 'components/GridBox/GridBox';
import TableList from 'components/TableList/TableList';
import { Row, Col } from 'components/GridSystem/GridSystem';
import Pagination from 'components/Pagination/Pagination';
import { FormField } from 'components/FormField';
import {
  walletActionsRenderer,
  cryptocurrencyCellRenderer,
  cryptoCoinIconRenderer,
  balanceReservedCellRenderer
} from 'components/TableList/renderers';
import { Order } from '_constants';
import { amountIsCrumb } from '_helpers';

const TableColumns = [
  { Header: 'Coin', accessor: 'coin', Cell: cryptoCoinIconRenderer, minWidth: 80 },
  { Header: 'Name', accessor: 'name', minWidth: 120 },
  {
    Header: 'Exchange',
    accessor: 'exchangeLabel',
    className: 'tl-value__secondary',
    minWidth: 120
  },
  { Header: 'Total Balance', accessor: 'total', Cell: cryptocurrencyCellRenderer, minWidth: 100 },
  { Header: 'Available', accessor: 'available', Cell: cryptocurrencyCellRenderer, minWidth: 100 },
  {
    Header: 'Reserved Balance',
    accessor: 'reserved',
    Cell: balanceReservedCellRenderer,
    minWidth: 100
  },
  { Header: 'BTC Value', accessor: 'btcValue', minWidth: 120 },
  { Header: 'Dollar Value', accessor: 'usdValue', minWidth: 100 },
  { Header: '', accessor: 'coin', Cell: walletActionsRenderer, className: 'rt-overflow rt-right' }
];

const MAX_ROWS = 10;

export class WalletHoldings extends React.Component {
  state = {
    page: 0,
    hideSmall: true
  };

  filterCrumbs = ({ usdValue }) => !amountIsCrumb(usdValue);

  getTableData() {
    const { balance } = this.props;
    const initialHolding = this.state.page * MAX_ROWS;
    const data = balance.slice(initialHolding, initialHolding + MAX_ROWS);

    return {
      columns: TableColumns,
      data: this.state.hideSmall ? data.filter(this.filterCrumbs) : data,
      overflow: true
    };
  }

  getSortingSettings() {
    return {
      sortBy: Order.DESC,
      page: this.state.page
    };
  }

  handlePaginationClick(page) {
    this.setState({ page });
  }

  renderToggle() {
    return (
      <FormField
        type="checkbox"
        input={{
          name: 'holdings_small',
          value: 'HIDE',
          checked: this.state.hideSmall,
          onChange: e => this.setState({ hideSmall: e.target.checked, page: 0 })
        }}
        label="Hide Small Amounts"
      />
    );
  }

  render() {
    const settings = this.getSortingSettings();
    const balance = this.state.hideSmall
      ? this.props.balance.filter(this.filterCrumbs)
      : this.props.balance;
    const totalPages = balance.length ? Math.ceil(balance.length / MAX_ROWS) : 0;
    const Toggle = this.renderToggle();

    return (
      <GridBox name="Holdings" title="Holdings" aside={Toggle}>
        <div className="Wallet__Holdings">
          <TableList
            compact
            noMargin
            {...this.getTableData()}
            noDataText="You don't own any coins yet."
          />
          <div className="Holdings__Footer">
            <Row noMargin>
              <Col grow alignRight size={2} noMargin>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={settings.page}
                    totalPages={totalPages}
                    selectPage={this.handlePaginationClick.bind(this)}
                  />
                )}
              </Col>
            </Row>
          </div>
        </div>
      </GridBox>
    );
  }
}

export default WalletHoldings;
