import React from 'react'

import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import StarRatings from 'react-star-ratings'

import PinsContainer from '../Containers/PinsContainer'


import { connect } from 'react-redux'

const placesURL = 'http://localhost:3000/api/v1/places'
const pinsURL ='http://localhost:3000/api/v1/pinned_locations'
const reviewsURL = 'http://localhost:3000/api/v1/reviews'
const searchUrl = 'http://localhost:3000/api/v1/yelp'

const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [18, 30],
});
let blueIcon = new L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png',
  iconSize: [18, 30], // size of the icon
});
let greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [18, 30],
});
let yellowIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [18, 30],
});

class MapDisplay extends React.Component {

  state = {
    showAllPins: true,
  }

  componentDidMount() {
    fetch(pinsURL)
    .then(resp => resp.json())
    .then(obj => {
      this.props.setAllPins(obj)
      this.props.setShowPins(obj)
    })
    .then(() => {
      fetch(reviewsURL)
      .then(resp => resp.json())
      .then(obj => {
        this.props.setAllReviews(obj)
      })
    })
  }

  handleOnChange = (event) => {
    this.props.setSearchTerm(event.target.value)
    if (this.props.searchTerm === "") {
      this.props.setResults([])
    }
  }

  fetchResults = () => {
    console.log(this.props.searchTerm);
    fetch(searchUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        searchTerm: this.props.searchTerm,
        searchLocation: this.props.currentList.location_area
      })
    })
    .then(response => response.json())
    .then(obj => {
      console.log(obj);
      this.props.setResults(obj)
    })
  }

  showCurrentMarker = (location) => {
    if (this.props.currentList) {
      this.props.setSearchTerm(location.place.name)
      this.fetchResults()
    } else {
    this.props.showMarkerDisplay()
    this.props.setMarker(location)
    }
  }

  hideCurrentMarker = () => {
    this.props.hideMarkerDisplay()
    this.props.setMarker(null)
    this.props.setSearchTerm("")
  }

  renderAllPinnedLocations = () => {
      return this.props.showPins.map(pin => {
        const position = [pin.place.latitude, pin.place.longitude]
        return (
          <div>
            <Marker
              key={pin.id}
              onClick={() => this.showCurrentMarker(pin)}
              onMouseOver={(e) => e.target.openPopup()}
              onMouseOut={(e) => e.target.closePopup()}
              position={position}
              icon={pin.user.id === this.props.currentUser ? greenIcon : redIcon }>
              <Popup>
                {pin.place.img_url ? <img className="locationImage" src={ pin.place.img_url}/> : null}
                <br/>
                <h3>{pin.place.name}</h3>
                <p>{pin.place.address}<br/>
                {pin.place.city}, {pin.place.state} {pin.place.zip_code}</p>
                <StarRatings
                 rating={pin.place.yelp_rating}
                 starRatedColor="orange"
                 numberOfStars={5}
                 starDimension="12px"
                 starSpacing="1px"
                 name='rating'
               />
              <br/>
              </Popup>
            </Marker>
          </div>
        )
      })
  }

  renderSearchPins = () => {
    return this.props.searchResults.map(location => {
      const position = [location.coordinates.latitude, location.coordinates.longitude]
      return (
        <div>
          <Marker
            onClick={null}
            onMouseOver={(e) => e.target.openPopup()}
            onMouseOut={(e) => e.target.closePopup()}
            key={location.id}
            position={position}
            icon={this.props.currentListPins.filter(pin => pin.place.yelp_id === location.id).length === 0 ? blueIcon : greenIcon}>
            <Popup >
              <img className="locationImage" src={location.image_url}/>
              <br/>
              <h3>{location.name}</h3>
              <p>{location.location.address1}<br/>
              {location.location.city}, {location.location.state} {location.location.zip_code}</p>
              <StarRatings
               rating={location.rating}
               starRatedColor="orange"
               numberOfStars={5}
               starDimension="12px"
               starSpacing="1px"
               name='rating'
              />
              <br/>
            </Popup>
          </Marker>
        </div>
      )
    })
  }

  showCurrentListPins = () => {
    if(this.props.currentList) {
      let greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        iconSize: [18, 30],
      });
      return this.props.currentListPins.map(pin => {
        const position = [pin.place.latitude, pin.place.longitude]
        return (
          <div>
            <Marker
              onClick={() => this.showCurrentMarker(pin)}
              onMouseOver={(e) => e.target.openPopup()}
              onMouseOut={(e) => e.target.closePopup()}
              key={pin.id}
              position={position}
              icon={greenIcon}>
              <Popup >
                <img className="locationImage" src={pin.place.img_url}/>
                <br/>
                <h3>{pin.place.name}</h3>
                <p>{pin.place.address}<br/>
                {pin.place.city}, {pin.place.state} {pin.place.zip_code}</p>
                <StarRatings
                 rating={pin.place.yelp_rating}
                 starRatedColor="orange"
                 numberOfStars={5}
                 starDimension="12px"
                 starSpacing="1px"
                 name='rating'
               />
                <br/>
              </Popup>
            </Marker>
          </div>
        )
      })
    }
  }

   render() {
     return (
        <div>
          <div className="pinsContainer">
            {this.props.currentMarker && !this.props.currentList ? <PinsContainer/> : null}
          </div>
           <Map
            onClick={this.hideCurrentMarker}
            className='map'
            style={{marginTop: '65px', height: '91vh', width: '100%'}} center={this.props.mapLocation} zoom={this.props.mapZoom}
            zoomControl={false}>
             <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
               url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
             />
             {this.renderAllPinnedLocations()}
             {this.props.searchTerm === "" ? null : this.renderSearchPins()}
             {this.showCurrentListPins()}
             <ZoomControl position="topright"/>
           </Map>
         </div>
     )
   }

}

function mapStateToProps(state) {
  return {
    searchResults: state.searchResults,
    searchTerm: state.searchTerm,
    currentList: state.currentList,
    currentMarker: state.currentMarker,
    currentListPins: state.currentListPins,
    currentUser: state.currentUser,
    open: state.openNewReviewForm,
    openPinForm: state.openNewPinForm,
    mapLocation: state.mapLocation,
    mapZoom: state.mapZoom,
    allPins: state.allPins,
    allReviews: state.allReviews,
    showPins: state.showPins,
    markerDetailsDisplay: state.markerDetailsDisplay
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setMarker: (payload) => {
      dispatch({type:"CURRENT_MARKER", payload: payload})
    },
    setAllPins: (payload) => {
      dispatch({type:"SET_ALL_PINS", payload: payload})
    },
    setShowPins: (payload) => {
      dispatch({type:"SET_SHOW_PINS", payload: payload})
    },
    setAllReviews: (payload) => {
      dispatch({type:"SET_ALL_REVIEWS", payload: payload})
    },
    showMarkerDisplay: () => {
      dispatch({type: "DISPLAY_MARKER_ON"})
    },
    hideMarkerDisplay: () => {
      dispatch({type: "DISPLAY_MARKER_OFF"})
    },
    setResults: (payload) => {
      dispatch({type: 'CURRENT_SEARCH_RESULTS', payload: payload})
    },
    setSearchTerm: (payload) => {
      dispatch({type: 'SET_SEARCH_TERM', payload: payload})
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapDisplay);
