import React, { useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface MapPickerProps {
  onPositionSelected: (position: [number, number]) => void
}

const MapPicker: React.FC<MapPickerProps> = ({ onPositionSelected }) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null)

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setSelectedPosition([lat, lng])
        onPositionSelected([lat, lng]) // Üst bileşene gönder
      }
    })
    return null
  }

  return (
    <div>
      <MapContainer
        center={[41.0082, 28.9784]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}>
        {/*<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapEvents />
        {selectedPosition && <Marker position={selectedPosition} />}
      </MapContainer>
    </div>
  )
}

export default MapPicker
