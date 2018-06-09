import React, { Component } from 'react';
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn
} from 'react-md';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faQuestionCircle from '@fortawesome/fontawesome-free-regular/faQuestionCircle';
import DeliveryExplainerDialog from './DeliveryExplainerDialog';

import { PURCHASES_ACTIONS } from '../../redux/purchases/actions';

class PurchasesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DeliveryExplainerVisible: false
    };
  }

  componentDidMount() {
    if (this.props.token) this.props.fetchPurchases();
  }

  onViewPurchaseDetails(purchase) {
    this.props.history.push(
      `/${purchase.sensortype === 'DATASET' ? 'dataset' : 'stream'}/${
        purchase.key
      }`
    );
  }

  toggleDeliveryExplainer() {
    this.setState({
      DeliveryExplainerVisible: !this.state.DeliveryExplainerVisible
    });
  }

  render() {
    const LeftTableColumn = styled(TableColumn)`
      padding-left: 0 !important;
    `;

    const StyledTableRow = styled(TableRow)`
      cursor: pointer;
    `;

    if (this.props.fetchingPurchases && this.props.purchases.length === 0) {
      return <p>Loading...</p>;
    }

    if (this.props.purchases.length === 0) {
      return (
        <p>When you purchase access to a stream, it will be listed here.</p>
      );
    }

    return (
      <DataTable baseId="purchases-table" plain>
        <TableHeader>
          <TableRow>
            <LeftTableColumn>Sensor</LeftTableColumn>
            <TableColumn grow>Name</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Frequency</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.props.purchases.map(purchase => (
            <StyledTableRow key={purchase.key}>
              <LeftTableColumn>
                {purchase.sensortype.toLowerCase()}
                {purchase.sensortype === 'STREAM' && (
                  <span
                    className="clickable"
                    onClick={event => this.toggleDeliveryExplainer()}
                  >
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      style={{ marginLeft: '4px' }}
                    />
                  </span>
                )}
              </LeftTableColumn>
              <TableColumn onClick={() => this.onViewPurchaseDetails(purchase)}>
                {purchase.name}
              </TableColumn>
              <TableColumn onClick={() => this.onViewPurchaseDetails(purchase)}>
                {purchase.type}
              </TableColumn>
              <TableColumn onClick={() => this.onViewPurchaseDetails(purchase)}>
                {purchase.updateinterval
                  ? purchase.updateinterval === 86400000
                    ? 'daily'
                    : `${purchase.updateinterval / 1000}''`
                  : ''}
              </TableColumn>
            </StyledTableRow>
          ))}
        </TableBody>
        <DeliveryExplainerDialog
          visible={this.state.DeliveryExplainerVisible}
          hideEventHandler={() => this.toggleDeliveryExplainer()}
        />
      </DataTable>
    );
  }
}

const mapStateToProps = state => ({
  purchases: state.purchases.purchases,
  fetchingPurchases: state.purchases.fetchingPurchases,
  token: state.auth.token //Used to verify if a user is signed in, if not we don't have to get purchases from API
});

function mapDispatchToProps(dispatch) {
  return {
    fetchPurchases: () => dispatch(PURCHASES_ACTIONS.fetchPurchases())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(PurchasesTable)
);
