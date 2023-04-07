import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';

import PopupContainer from './PopupContainer';
import { toiletPropTypes } from '../toilet/Toilet';

const toiletIcon = new Icon({
  iconUrl: '/toilet.svg',
  iconSize: [60, 60],
});

const makersIcon = new Icon({
  iconUrl: '/makers.svg',
  iconSize: [60, 60],
});

function Map({ toilets }) {
  const [center] = useState(['51.52351', '-0.0839073']);

  return (
    <MapContainer
      center={center}
      zoom={16}
      scrollWheelZoom
      className="h-full min-h-[60vh] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={makersIcon}>
        <Popup>We are now here!</Popup>
      </Marker>
      {toilets.map((toilet) => (
        <Marker
          key={toilet._id}
          position={[
            toilet.address.geolocation[0],
            toilet.address.geolocation[1],
          ]}
          icon={toiletIcon}
        >
          <Popup>
            <PopupContainer toilet={toilet} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

Map.propTypes = {
  toilets: toiletPropTypes.isRequired,
};

export default Map;
