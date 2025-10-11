import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RoutePoint {
  latitude: number;
  longitude: number;
  name?: string;
}

interface Vessel {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  destination: string;
  route?: RoutePoint[];
  currentRouteIndex?: number;
  mmsi?: string;
  flag?: string;
  status: 'underway' | 'anchored' | 'stopped';
}

interface SensitiveZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  restrictions: string;
  authority: string;
}

interface Hotspot {
  id: string;
  name: string;
  description: string;
  category: keyof typeof HOTSPOT_CATEGORIES;
  severity: 'critical' | 'high' | 'medium' | 'low';
  latitude: number;
  longitude: number;
  radius: number;
  timestamp: number;
}

const HOTSPOT_CATEGORIES = {
  INCIDENT: {
    name: 'Incident',
    color: '#dc3545',
    icon: '⚠️',
    description: 'Accident or emergency location'
  },
  HAZARD: {
    name: 'Navigation Hazard',
    color: '#fd7e14',
    icon: '⚡',
    description: 'Dangerous navigation area'
  },
  ANCHORAGE: {
    name: 'Anchorage Point',
    color: '#17a2b8',
    icon: '⚓',
    description: 'Safe anchorage location'
  },
  WILDLIFE: {
    name: 'Wildlife Area',
    color: '#28a745',
    icon: '🐋',
    description: 'Marine wildlife concentration'
  },
  WEATHER: {
    name: 'Weather Event',
    color: '#6f42c1',
    icon: '🌪️',
    description: 'Severe weather location'
  },
  FISHING: {
    name: 'Fishing Ground',
    color: '#20c997',
    icon: '🎣',
    description: 'Active fishing area'
  },
  CUSTOM: {
    name: 'Custom Point',
    color: '#6c757d',
    icon: '📍',
    description: 'User-defined location'
  }
};

interface MapComponentProps {
  region: any;
  vessels: Vessel[];
  sensitiveZones: SensitiveZone[];
  zonesVisible: boolean;
  hotspots: Hotspot[];
  isMarkingMode: boolean;
  onVesselPress: (vessel: Vessel) => void;
  onZonePress?: (zone: SensitiveZone) => void;
  onMapPress?: (event: any) => void;
  onRegionChange: (region: any) => void;
  getShipIcon: (type: string) => string;
  getZoneColor: (severity: SensitiveZone['severity']) => string;
  hotspotCategories: typeof HOTSPOT_CATEGORIES;
}

const WebMapComponent: React.FC<MapComponentProps> = ({
  vessels,
  sensitiveZones,
  zonesVisible,
  hotspots,
  isMarkingMode,
  onVesselPress,
  onZonePress,
  onMapPress,
  getShipIcon,
  getZoneColor,
  hotspotCategories
}) => {
  const [mapDimensions, setMapDimensions] = React.useState({ width: 0, height: 0 });

  const convertToMapPosition = (lat: number, lon: number) => {
    if (mapDimensions.width === 0) return { left: 0, top: 0 };
    
    const leftPercent = ((lon + 180) / 360);
    const topPercent = ((90 - lat) / 180);
    
    return {
      left: leftPercent * mapDimensions.width,
      top: topPercent * mapDimensions.height,
    };
  };

  const handleMapLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

  const handleMapClick = (event: any) => {
    if (!isMarkingMode || !onMapPress) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const lat = 90 - (locationY / mapDimensions.height) * 180;
    const lon = (locationX / mapDimensions.width) * 360 - 180;
    
    onMapPress({
      nativeEvent: {
        coordinate: { latitude: lat, longitude: lon }
      }
    });
  };

  return (
    <View style={styles.webMapContainer}>
      <View 
        style={[
          styles.webMap,
          isMarkingMode && styles.markingMode
        ] as any} 
        onLayout={handleMapLayout}
        // @ts-ignore - onClick is web-specific
        onClick={handleMapClick}
      >
        <Text style={styles.webMapTitle}>Interactive Maritime Map</Text>
        <Text style={styles.webMapSubtitle}>
          Real-time vessel tracking with hotspot marking
          {isMarkingMode && ' - Tap to mark hotspot'}
        </Text>
        
        <View style={styles.mockOcean}>
          {mapDimensions.width > 0 && (
            <>
              {vessels.map(vessel => {
                if (!vessel.route || vessel.route.length === 0) return null;
                
                return (
                  <View key={`route-${vessel.id}`} style={styles.routeContainer}>
                    {vessel.route.map((point, index) => {
                      if (index === 0) return null;
                      const prevPoint = vessel.route![index - 1];
                      const startPos = convertToMapPosition(prevPoint.latitude, prevPoint.longitude);
                      const endPos = convertToMapPosition(point.latitude, point.longitude);
                      
                      const dx = endPos.left - startPos.left;
                      const dy = endPos.top - startPos.top;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                      
                      return (
                        <View
                          key={`segment-${vessel.id}-${index}`}
                          style={[
                            styles.routeLine,
                            {
                              left: startPos.left,
                              top: startPos.top,
                              width: length,
                              transform: [{ rotate: `${angle}deg` }],
                            }
                          ]}
                        />
                      );
                    })}
                  </View>
                );
              })}
              
              {zonesVisible && sensitiveZones.map(zone => {
                const position = convertToMapPosition(zone.latitude, zone.longitude);
                const zoneColor = getZoneColor(zone.severity);
                return (
                  <TouchableOpacity
                    key={zone.id}
                    style={[
                      styles.mockZone,
                      {
                        left: position.left,
                        top: position.top,
                        backgroundColor: zoneColor + '40',
                        borderColor: zoneColor,
                      }
                    ]}
                    onPress={() => onZonePress && onZonePress(zone)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.zoneLabel}>{zone.name}</Text>
                  </TouchableOpacity>
                );
              })}
              
              {hotspots.map(hotspot => {
                const position = convertToMapPosition(hotspot.latitude, hotspot.longitude);
                const config = hotspotCategories[hotspot.category];
                return (
                  <View
                    key={hotspot.id}
                    style={[
                      styles.hotspotMarker,
                      {
                        left: position.left,
                        top: position.top,
                        backgroundColor: config.color,
                      }
                    ]}
                  >
                    <Text style={styles.hotspotIcon}>{config.icon}</Text>
                    <Text style={styles.hotspotName}>{hotspot.name}</Text>
                  </View>
                );
              })}
              
              {vessels.map(vessel => {
                const position = convertToMapPosition(vessel.latitude, vessel.longitude);
                return (
                  <View
                    key={vessel.id}
                    style={[
                      styles.mockVessel,
                      {
                        left: position.left,
                        top: position.top,
                      }
                    ]}
                  >
                    <TouchableOpacity 
                      onPress={() => onVesselPress(vessel)}
                      style={styles.vesselButton}
                    >
                      <View style={[styles.vesselHeading, { transform: [{ rotate: `${vessel.heading}deg` }] }]}>
                        <Text style={styles.headingArrow}>▲</Text>
                      </View>
                      <Text style={styles.vesselIcon}>{getShipIcon(vessel.type)}</Text>
                      <Text style={styles.vesselName}>{vessel.name}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}
        </View>
        
        <View style={styles.webMapInfo}>
          <Text style={styles.infoText}>
            📊 {vessels.length} vessels • 🛡️ {sensitiveZones.length} zones • 📍 {hotspots.length} hotspots
          </Text>
          <Text style={styles.infoSubtext}>
            {isMarkingMode ? 'Tap on the map to mark a hotspot' : 'Click Play to start simulation'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const NativeMapComponent: React.FC<MapComponentProps> = (props) => {
  const { 
    vessels, 
    sensitiveZones, 
    zonesVisible, 
    hotspots, 
    isMarkingMode,
    onVesselPress, 
    onZonePress, 
    onMapPress,
    getShipIcon, 
    getZoneColor, 
    hotspotCategories,
    region, 
    onRegionChange 
  } = props;
  
  const MapView = require('react-native-maps').default;
  const { Marker, Circle, Polyline } = require('react-native-maps');
  
  return (
    <MapView
      style={styles.map}
      region={region}
      onRegionChangeComplete={onRegionChange}
      onPress={isMarkingMode ? onMapPress : undefined}
    >
      {vessels.map(vessel => {
        if (!vessel.route || vessel.route.length === 0) return null;
        
        const coordinates = vessel.route.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude
        }));
        
        return (
          <Polyline
            key={`route-${vessel.id}`}
            coordinates={coordinates}
            strokeColor="#3b82f6"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        );
      })}

      {zonesVisible && sensitiveZones.map(zone => (
        <React.Fragment key={zone.id}>
          <Circle
            center={{
              latitude: zone.latitude,
              longitude: zone.longitude
            }}
            radius={zone.radius}
            strokeColor={getZoneColor(zone.severity)}
            fillColor={getZoneColor(zone.severity) + '20'}
            strokeWidth={2}
          />
          <Marker
            coordinate={{
              latitude: zone.latitude,
              longitude: zone.longitude
            }}
            title={zone.name}
            description={`${zone.severity.toUpperCase()} Priority Zone`}
            onPress={() => onZonePress && onZonePress(zone)}
            opacity={0}
          />
        </React.Fragment>
      ))}

      {hotspots.map(hotspot => {
        const config = hotspotCategories[hotspot.category];
        return (
          <React.Fragment key={hotspot.id}>
            <Circle
              center={{
                latitude: hotspot.latitude,
                longitude: hotspot.longitude
              }}
              radius={hotspot.radius}
              strokeColor={config.color}
              fillColor={config.color + '20'}
              strokeWidth={2}
            />
            <Marker
              coordinate={{
                latitude: hotspot.latitude,
                longitude: hotspot.longitude
              }}
              title={hotspot.name}
              description={hotspot.description}
            >
              <View style={[
                styles.hotspotMarkerNative,
                { backgroundColor: config.color }
              ]}>
                <Text style={styles.hotspotIconNative}>{config.icon}</Text>
              </View>
            </Marker>
          </React.Fragment>
        );
      })}

      {vessels.map(vessel => (
        <Marker
          key={vessel.id}
          coordinate={{
            latitude: vessel.latitude,
            longitude: vessel.longitude
          }}
          title={vessel.name}
          description={`Speed: ${vessel.speed} knots | Heading: ${Math.round(vessel.heading)}°`}
          onPress={() => onVesselPress(vessel)}
          rotation={vessel.heading}
        >
          <View style={styles.markerContainer}>
            <Text style={styles.shipIcon}>{getShipIcon(vessel.type)}</Text>
            <Text style={styles.shipName}>{vessel.name}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const MapComponent: React.FC<MapComponentProps> = (props) => {
  if (Platform.OS === 'web') {
    return <WebMapComponent {...props} />;
  }
  
  return <NativeMapComponent {...props} />;
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  webMapContainer: {
    flex: 1,
    padding: 16,
  },
  webMap: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  markingMode: {
    borderColor: '#007bff',
    borderWidth: 3,
  },
  webMapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  webMapSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  mockOcean: {
    width: '100%',
    height: '70%',
    backgroundColor: '#87CEEB',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#4682B4',
    marginBottom: 16,
    overflow: 'hidden',
  },
  routeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  routeLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#3b82f6',
    opacity: 0.6,
    transformOrigin: 'left center',
  },
  mockZone: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -40,
    marginTop: -40,
  },
  zoneLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    borderRadius: 4,
  },
  hotspotMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
    marginTop: -20,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hotspotIcon: {
    fontSize: 16,
    color: 'white',
  },
  hotspotName: {
    position: 'absolute',
    top: 42,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 2,
    borderRadius: 4,
    minWidth: 60,
    textAlign: 'center',
  },
  hotspotMarkerNative: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hotspotIconNative: {
    fontSize: 14,
    color: 'white',
  },
  mockVessel: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -25,
    marginTop: -25,
    zIndex: 100,
  },
  vesselButton: {
    alignItems: 'center',
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 50,
  },
  vesselHeading: {
    position: 'absolute',
    top: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingArrow: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  vesselIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  vesselName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  webMapInfo: {
    alignItems: 'center',
    paddingTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  shipIcon: {
    fontSize: 24,
  },
  shipName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
});

export default MapComponent;