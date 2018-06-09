import React, { Component } from 'react';
import Mixpanel from 'mixpanel-browser';

import Toolbar from '../generic/Toolbar';
import Sidebar from './Sidebar';
import DatasetsList from './DatasetsList';

class DatasetsScreen extends Component {
  componentDidMount() {
    Mixpanel.track('View datasets screen');
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
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'stretch' }}>
        <Toolbar showTabs={true} />
        <Sidebar setWidthHandler={width => this.setSidebarWidth(width)} />
        <div style={{ height: '100vh', overflowY: 'auto' }}>
          <DatasetsList />
        </div>
      </div>
    );
  }
}

module.exports = DatasetsScreen;
