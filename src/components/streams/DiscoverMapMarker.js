import React, { Component } from 'react';

import MapMarker from '../generic/MapMarker';
import ClosedDiscoverMapMarker from './ClosedDiscoverMapMarker';
import OpenDiscoverMapMarker from './OpenDiscoverMapMarker';

export default class DiscoverMapMarker extends Component {
  render() {
    return (
      <MapMarker position={this.props.position}>
          <div style={{cursor:"pointer"}} onClick={() => this.props.onClick(this.props.stream.key)}>
            {!(this.props.openedMapMarker === this.props.stream.key) &&
              <ClosedDiscoverMapMarker stream={this.props.stream}/>
            }
            {(this.props.openedMapMarker === this.props.stream.key) &&
              <OpenDiscoverMapMarker stream={this.props.stream}/>
            }
          </div>
      </MapMarker>
    );
  }
}
