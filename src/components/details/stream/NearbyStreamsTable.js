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

class NearbyStreamsTable extends Component {
  onViewStreamDetails(key) {
    this.props.history.push(`/stream/${key}`);
  }

  render() {
    if (this.props.fetchingNearbyStreams) return <p>Loading...</p>;

    if (this.props.streams.length === 0) return <p>No nearby streams</p>;

    const LeftTableColumn = styled(TableColumn)`
      padding-left: 0 !important;
    `;

    const StyledTableRow = styled(TableRow)`
      cursor: pointer;
    `;

    return (
      <DataTable baseId="streams-nearby-table" plain>
        <TableHeader>
          <TableRow>
            <LeftTableColumn grow>Name</LeftTableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Frequency</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.props.streams.map(stream => (
            <StyledTableRow
              key={stream.key}
              onClick={() => this.onViewStreamDetails(stream.key)}
            >
              <LeftTableColumn>{stream.name}</LeftTableColumn>
              <TableColumn>{stream.type}</TableColumn>
              <TableColumn>
                {stream.updateinterval === 86400000
                  ? 'daily'
                  : `${stream.updateinterval / 1000}''`}
              </TableColumn>
            </StyledTableRow>
          ))}
        </TableBody>
      </DataTable>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchingNearbyStreams: state.streams.fetchingNearbyStreams
  };
}

export default connect(mapStateToProps, null)(withRouter(NearbyStreamsTable));
