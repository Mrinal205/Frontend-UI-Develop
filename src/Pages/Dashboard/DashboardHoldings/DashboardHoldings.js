import React from 'react';

import { Row, Col } from 'components/GridSystem/GridSystem';
import GridBox from 'components/GridBox/GridBox';
import TableList from 'components/TableList/TableList';
import {
  walletActionsRenderer,
  cryptocurrencyCellRenderer,
  cryptoCoinIconRenderer
} from 'components/TableList/renderers';
import Pagination from 'components/Pagination/Pagination';
import { Order } from '_constants';
import { FormField } from 'components/FormField';
import { amountIsCrumb } from '_helpers';

const TableColumns = [
  { Header: 'Coin', accessor: 'coin', Cell: cryptoCoinIconRenderer, minWidth: 60 },
  { Header: 'Exchange', accessor: 'exchangeLabel', className: 'tl-value__secondary', minWidth: 80 },
  { Header: 'Total Balance', accessor: 'total', minWidth: 70, Cell: cryptocurrencyCellRenderer },
  { Header: 'BTC Value', accessor: 'btcValue', minWidth: 90 },
  { Header: 'Dollar Value', accessor: 'usdValue', minWidth: 65 },
  {
    Header: '',
    accessor: 'coin',
    Cell: walletActionsRenderer,
    className: 'rt-overflow rt-right',
    minWidth: 80
  }
];

const MAX_ROWS = 5;

export class DashboardHoldings extends React.Component {
  state = {
    page: 0,
    hideSmall: true,
    holdings: []
  };

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

  render() {
    const { loading } = this.props;
    const settings = this.getSortingSettings();
    const balance = this.state.hideSmall
      ? this.props.balance.filter(this.filterCrumbs)
      : this.props.balance;
    const totalPages = balance.length ? Math.ceil(balance.length / MAX_ROWS) : 0;

    return (
      <GridBox loading={loading} name="Holdings" aside={this.renderToggle()} title="Holdings">
        <div className="Dashboard__Holdings">
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

export default DashboardHoldings;
