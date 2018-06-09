import React, { Component } from 'react';
import styled from 'styled-components';

import Icon from '../generic/Icon';

export default class ClosedDiscoverMapMarker extends Component {
  render() {
    const StyledIconContainer = styled.div`
      padding:10px;
      display:flex;
      align-items:center;
    `;

      return (
          <StyledIconContainer>
            <Icon icon={this.props.stream.type} style={{color:"white"}}/>
          </StyledIconContainer>
      );
  }
}
