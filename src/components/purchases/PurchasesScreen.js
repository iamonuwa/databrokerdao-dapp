import React, { Component } from 'react';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import faQuestionCircle from '@fortawesome/fontawesome-free-regular/faQuestionCircle';

import Toolbar from '../generic/Toolbar';
import CenteredCard from '../generic/CenteredCard';
import CardContent from '../generic/CardContent';
import ToolbarSpacer from '../generic/ToolbarSpacer';
import PurchasesTable from './PurchasesTable';
// import DeliveryExplainerDialog from './DeliveryExplainerDialog';

export default class PurchasesScreen extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     DeliveryExplainerVisible: false
  //   };
  // }

  // toggleDeliveryExplainer() {
  //   this.setState({
  //     DeliveryExplainerVisible: !this.state.DeliveryExplainerVisible
  //   });
  // }

  render() {
    return (
      <div>
        <Toolbar showTabs={true} />
        <ToolbarSpacer />
        <CenteredCard>
          <CardContent>
            <h1>
              Purchases{' '}
              {/*<span
                className="clickable"
                onClick={event => this.toggleDeliveryExplainer()}
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  style={{ marginLeft: '4px' }}
                />
              </span>*/}
            </h1>
            <PurchasesTable />
          </CardContent>
        </CenteredCard>
        {/*<DeliveryExplainerDialog
          visible={this.state.DeliveryExplainerVisible}
          hideEventHandler={() => this.toggleDeliveryExplainer()}
        />*/}
      </div>
    );
  }
}
