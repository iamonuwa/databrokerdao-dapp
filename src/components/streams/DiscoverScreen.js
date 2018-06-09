import React, { Component } from 'react';
import styled from 'styled-components';
import Mixpanel from 'mixpanel-browser';

import Toolbar from '../generic/Toolbar';
import DiscoverMap from './DiscoverMap';
import Sidebar from './Sidebar';

export default class DiscoverScreen extends Component {
  componentDidMount() {
    Mixpanel.track('View streams screen');
  }

  constructor(props) {
    super(props);

    this.state = {
      sidebarWidth: window.innerWidth > 480 ? 320 : 0
    };
  }

  setSidebarWidth(width) {
    this.setState({ sidebarWidth: width });
  }

  render() {
    const StyledContent = styled.div`
      flex: 1;
    `;

    const mapElementsStyle = {
      height: `100%`,
      width: `calc(100% - ${this.state.sidebarWidth}px)`,
      position: 'absolute',
      top: '0',
      left: '320'
    };

    const APIKey = 'AIzaSyBv4e2Uj5ZFp82G8QXKfYv7Ea3YutD4eTg';

    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'stretch' }}>
        <Toolbar showTabs={true} />
        <Sidebar setWidthHandler={width => this.setSidebarWidth(width)} />
        <StyledContent>
          <DiscoverMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=${APIKey}`}
            loadingElement={<div style={mapElementsStyle} />}
            containerElement={<div style={{ mapElementsStyle }} />}
            mapElement={<div style={mapElementsStyle} />}
          />
        </StyledContent>
      </div>
    );
  }
}
