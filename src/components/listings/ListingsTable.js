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

import { LISTING_ACTIONS } from '../../redux/listings/actions';

class ListingsTable extends Component {
  componentDidMount() {
    if (this.props.token) this.props.fetchListings();
  }

  onViewListingDetails(key) {
    this.props.history.push(`/stream/${key}`);
  }

  render() {
    const LeftTableColumn = styled(TableColumn)`
      padding-left: 0 !important;
    `;

    const StyledTableRow = styled(TableRow)`
      cursor: pointer;
    `;

    if (this.props.fetchingListings) {
      return <p>Loading...</p>;
    } else if (this.props.listings.length === 0) {
      return (
        <p>
          Earn money by selling access to the data of your stream via DataBroker
          DAO. Start by enlisting a stream.
        </p>
      );
    } else
      return (
        <DataTable baseId="purchases-table" plain>
          <TableHeader>
            <TableRow>
              <LeftTableColumn grow>Name</LeftTableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Frequency</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.props.listings.map(listing => (
              <StyledTableRow
                key={listing.key}
                onClick={() => this.onViewListingDetails(listing.key)}
              >
                <LeftTableColumn>{listing.name}</LeftTableColumn>
                <TableColumn>{listing.type}</TableColumn>
                <TableColumn>
                  {listing.updateinterval === 86400000
                    ? 'daily'
                    : `${listing.updateinterval / 1000}''`}
                </TableColumn>
              </StyledTableRow>
            ))}
          </TableBody>
        </DataTable>
      );
  }
}

const mapStateToProps = state => ({
  listings: state.listings.listings,
  fetchingListings: state.listings.fetchingListings,
  token: state.auth.token //Used to verify if a user is signed in, if not we don't have to get purchases from API
});

function mapDispatchToProps(dispatch) {
  return {
    fetchListings: () => dispatch(LISTING_ACTIONS.fetchListings())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ListingsTable)
);
