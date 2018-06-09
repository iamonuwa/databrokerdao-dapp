import React, { Component } from 'react';
import { Autocomplete } from 'react-md';
import { connect } from 'react-redux'

import { STREAMS_ACTIONS } from '../../redux/streams/actions';

class LocationAutocomplete extends Component {
  constructor(props){
    super(props);

    this.state = {
      data:[]
    };
  }

  onChangeHandler(value,event){
    //Store current input in redux (because it's a controlled component - value is stored in redux because discovermap can also provide new value)
    this.props.setFilterAddress(value);

    //Get places from google api
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    if(value){
      autocompleteService.getPlacePredictions({ input: value }, function(predictions, status){
        this.setState({data:predictions});
      }.bind(this));
    }
    else{
      this.setState({data:[]});
    }
  }

  onAutocompleteHandler(suggestion,suggestionIndex,matches){
    const selection = this.state.data[suggestionIndex];

    //Now get coordinates and move map over there
    const geocoderService = new window.google.maps.Geocoder();
    geocoderService.geocode({'address':selection.description},function(results,status){
      if(status === "OK"){
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();

        this.props.updateMap({
          ...this.props.map,
          distance: 0,
          lat: lat,
          lng: lng
        });
      }
    }.bind(this));
  }

  render(){
    return(
      <Autocomplete
        id="location"
        label=""
        placeholder=""
        data={this.state.data}
        dataLabel={"description"}
        filter={Autocomplete.caseInsensitiveFilter}
        onChange={this.onChangeHandler.bind(this)}
        onAutocomplete={this.onAutocompleteHandler.bind(this)}
        value={this.props.filterAddress}
      />
    );
  }
}

const mapStateToProps = state => ({
  map: state.streams.map,
  filterAddress: state.streams.filterAddress
})

function mapDispatchToProps(dispatch) {
  return {
    updateMap: (map) => dispatch(STREAMS_ACTIONS.updateMap(map)),
    setFilterAddress: (filterAddress) => dispatch(STREAMS_ACTIONS.setFilterAddress(filterAddress))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationAutocomplete);
