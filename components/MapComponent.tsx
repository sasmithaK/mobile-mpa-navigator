import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Type definitions
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
}

interface SensitiveZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface MapComponentProps {
  region: any;
  vessels: Vessel[];
  sensitiveZones: SensitiveZone[];
  zonesVisible: boolean;
  onVesselPress: (vessel: Vessel) => void;
  onRegionChange: (region: any) => void;
  onZonePress?: (zone: SensitiveZone) => void;
  getShipIcon: (type: string) => string;
  getZoneColor: (severity: SensitiveZone['severity']) => string;
}

// Web-specific map component with route visualization (NO WAYPOINTS)
const WebMapComponent: React.FC<MapComponentProps> = ({
  vessels,
  sensitiveZones,
  zonesVisible,
  onVesselPress,
  onZonePress,
  getShipIcon,
  getZoneColor
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

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMap}>
        <Text style={styles.webMapTitle}>Interactive Maritime Map</Text>
        <Text style={styles.webMapSubtitle}>
          Real-time vessel tracking with route navigation
        </Text>
        
        {/* Mock map background */}
        <View style={styles.mockOcean} onLayout={handleMapLayout}>
          {mapDimensions.width > 0 && (
            <>
              {/* Draw route lines ONLY (no waypoints) */}
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
              
              {/* Mock sensitive zones - NOW CLICKABLE */}
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
              
              {/* Mock vessels */}
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
            📊 {vessels.length} vessels • 🛡️ {sensitiveZones.length} zones • 🗺️ Routes displayed
          </Text>
          <Text style={styles.infoSubtext}>
            Click Play to start simulation and watch ships navigate
          </Text>
        </View>
      </View>
    </View>
  );
};

// Native Map Component with Polylines for routes (NO WAYPOINTS)
const NativeMapComponent: React.FC<MapComponentProps> = (props) => {
  const { vessels, sensitiveZones, zonesVisible, onVesselPress, onZonePress, getShipIcon, getZoneColor, region, onRegionChange } = props;
  
  // Dynamically import react-native-maps for native platforms
  const MapView = require('react-native-maps').default;
  const { Marker, Circle, Polyline } = require('react-native-maps');
  
  return (
    <MapView
      style={styles.map}
      region={region}
      onRegionChangeComplete={onRegionChange}
    >
      {/* Draw routes ONLY (no waypoint markers) */}
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

      {/* Draw sensitive zones - NOW CLICKABLE */}
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
          {/* Invisible marker for zone click handling */}
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

      {/* Draw vessels */}
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

// Main MapComponent that chooses the right implementation
const MapComponent: React.FC<MapComponentProps> = (props) => {
  if (Platform.OS === 'web') {
    return <WebMapComponent {...props} />;
  }
  
  // For native platforms, use the native map with routes
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