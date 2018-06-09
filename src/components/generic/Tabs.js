import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';

import DiscoverIcon from '../../assets/discover-icon.svg';
import PurchasesIcon from '../../assets/purchases-icon.svg';
import ListingsIcon from '../../assets/listings-icon.svg';
import DatasetsIcon from '../../assets/datasets-icon.svg';

export default withRouter(
  class Tabs extends Component {
    render() {
      const breakpoint = '1024px';

      const StyledTabBarContainer = styled.div`
        width: 100%;
        max-width: 650px;
        display: flex;
        justify-content: space-between;

        @media (max-width: ${breakpoint}) {
          max-width: 170px;
        }
      `;

      const StyledTabBarItem = styled(Link)`
        margin-right: 46px;
        color: white;
        font-weight: 600;
        font-family: 'Titillium Web', sans-serif;
        text-decoration: none;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        opacity: 0.7;
        transition: all 0.5s ease;
        &:hover {
          opacity: 0.9;
        }
        &:last-child {
          margin-right: 0;
        }
        &.active,
        &.active:hover {
          opacity: 1;
        }

        @media (max-width: ${breakpoint}) {
          margin-right: 24px;
        }
      `;

      const StyledTabBarItemIcon = styled.img`
        height: 30px;
        padding-top: 0;
      `;

      const StyledTabBarItemContent = styled.div`
        text-transform: uppercase;
        font-size: 22px;
        margin-left: 14px;

        @media (max-width: ${breakpoint}) {
          display: none;
        }
      `;

      return (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <StyledTabBarContainer>
            <StyledTabBarItem
              to="/streams"
              className={
                this.props.location.pathname === '/streams' ? 'active' : ''
              }
            >
              <StyledTabBarItemIcon src={DiscoverIcon} alt="Streams" />
              <StyledTabBarItemContent>Streams</StyledTabBarItemContent>
            </StyledTabBarItem>

            <StyledTabBarItem
              to="/datasets"
              className={
                this.props.location.pathname === '/datasets' ? 'active' : ''
              }
            >
              <StyledTabBarItemIcon src={DatasetsIcon} alt="Datasets" />
              <StyledTabBarItemContent>Datasets</StyledTabBarItemContent>
            </StyledTabBarItem>

            <StyledTabBarItem
              to="/purchases"
              className={
                this.props.location.pathname === '/purchases' ? 'active' : ''
              }
            >
              <StyledTabBarItemIcon src={PurchasesIcon} alt="Purchases" />
              <StyledTabBarItemContent>Purchases</StyledTabBarItemContent>
            </StyledTabBarItem>

            <StyledTabBarItem
              to="/listings"
              className={
                this.props.location.pathname === '/listings' ? 'active' : ''
              }
            >
              <StyledTabBarItemIcon src={ListingsIcon} alt="Add stream" />
              <StyledTabBarItemContent>Listings</StyledTabBarItemContent>
            </StyledTabBarItem>
          </StyledTabBarContainer>
        </div>
      );
    }
  }
);
