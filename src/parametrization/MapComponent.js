import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 45.8154,
  lng: 15.9666
};

function MapComponent() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBkYzWQveM275eq6EZZaCi8_pSKi7-jjh4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {/* Child components, such as markers, info windows, etc. */}
      </GoogleMap>
    </LoadScript>
  )
}

export default MapComponent;
