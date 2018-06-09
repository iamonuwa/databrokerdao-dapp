import React, { Component } from 'react';
import { TablePagination } from 'react-md';
import styled from 'styled-components';

import {
  Avatar,
  DataTable,
  TableBody,
  TableRow,
  TableColumn,
  TableHeader,
  Grid,
  Cell,
  DatePicker,
  SelectField
} from 'react-md';
import { connect } from 'react-redux';
import moment from 'moment';
import Identicon from 'identicon.js';
import { TRANSACTIONS_ACTIONS } from '../../redux/transactions/actions';

class TransactionsTable extends Component {
  componentWillMount() {
    this.props.fetchTransactions();
    this.props.fetchTransactionTypes();
  }

  handleFilter = (key, value) => {
    if (key === 'type' && value === 'All') value = '';

    this.props.fetchTransactions({
      ...this.props.filter,
      [key]: value
    });
  };

  handlePagination = (start, limit) => {
    this.props.fetchTransactions({
      ...this.props.filter,
      start,
      limit
    });
  };

  createRow = transaction => {
    const transactionBaseUrl =
      process.env.ENVIRONMENT === 'production'
        ? 'https://explorer.mintnet.settlemint.com/'
        : 'https://explorer.minttestnet.settlemint.com/';

    return (
      <TableRow
        key={transaction.key}
        style={{ cursor: 'pointer' }}
        onClick={e =>
          window.open(
            `${transactionBaseUrl}transaction/${transaction.transactionHash}`,
            '_blank'
          )
        }
      >
        <TableColumn style={{ padding: '10px' }}>
          <Avatar
            src={`data:image/svg+xml;base64,${new Identicon(
              transaction.originContractAddress,
              {
                margin: 0.2,
                format: 'svg'
              }
            ).toString()}`}
            role="presentation"
          />
        </TableColumn>
        <TableColumn>{transaction.event}</TableColumn>
        <TableColumn>{`${moment
          .unix(transaction.blockTime)
          .toNow(true)} ago`}</TableColumn>
        <TableColumn>
          {`${cropAddressOrTx(transaction.transactionHash, 8, 8)}`}
        </TableColumn>
      </TableRow>
    );
  };

  render() {
    const { transactions, filter, total } = this.props;

    const LeftTableColumn = styled(TableColumn)`
      padding-left: 0 !important;
    `;

    const StyledEmpty = styled.p`
      text-align: center;
      margin-top: 20px;
    `;

    return (
      <div>
        <Grid style={{ margin: 0, padding: 0 }}>
          <Cell size={4}>
            <SelectField
              id="eventtypes"
              type="text"
              fieldname="eventtypes"
              label="Transaction type"
              menuItems={this.props.transactionTypes}
              onChange={value => this.handleFilter('type', value)}
              onBlur={value => this.handleFilter('type', value)}
              className="md-cell md-cell--12"
              itemLabel="name"
              itemValue="name"
              value={filter.type}
            />
          </Cell>
          <Cell size={4}>
            <DatePicker
              id="appointment-date-auto"
              label="Start date"
              onChange={value =>
                this.handleFilter('startDate', convertStringToDate(value))
              }
              className="md-cell md-cell--12"
              defaultValue={filter.startDate}
            />
          </Cell>
          <Cell size={4}>
            <DatePicker
              id="appointment-date-auto"
              label="End date"
              className="md-cell md-cell--12"
              onChange={value =>
                this.handleFilter('endDate', convertStringToDate(value))
              }
              defaultValue={filter.endDate}
            />
          </Cell>
        </Grid>

        {total === 0 ? (
          <StyledEmpty>No transactions</StyledEmpty>
        ) : (
          <DataTable
            baseId="transactions-table"
            plain
            style={{ marginTop: '20px' }}
          >
            <TableHeader>
              <TableRow>
                <LeftTableColumn />
                <TableColumn>Type</TableColumn>
                <TableColumn>Time</TableColumn>
                <TableColumn>Transaction hash</TableColumn>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions
                .filter(event => !event.event.includes('CacheInvalidated'))
                .map(this.createRow)}
            </TableBody>

            <TablePagination
              onPagination={this.handlePagination}
              defaultRowsPerPage={filter.limit}
              rows={total}
            />
          </DataTable>
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTransactionTypes: () =>
      dispatch(TRANSACTIONS_ACTIONS.fetchTransactionTypes()),
    fetchTransactions: filter =>
      dispatch(TRANSACTIONS_ACTIONS.fetchTransactions(filter))
  };
}

const mapStateToProps = state => ({
  transactions: state.transactions.transactions,
  transactionTypes: state.transactions.transactionTypes,
  filter: state.transactions.filter,
  total: state.transactions.total,
  token: state.auth.token
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsTable);

function cropAddressOrTx(value, beginAmount, endAmount) {
  var result = value;
  if (value.length > beginAmount + endAmount + 3) {
    var front = value.substr(0, beginAmount);
    var mid = '…';
    var end = value.substr(-endAmount);
    result = front + mid + end;
  }
  return result;
}

function convertStringToDate(dateString) {
  const from = dateString.split('/');
  return new Date(from[2], from[1] - 1, from[0]);
}
