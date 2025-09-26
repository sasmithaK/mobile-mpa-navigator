import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';

// Type definitions
interface Vessel {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  destination: string;
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
  getShipIcon: (type: string) => string;
  getZoneColor: (severity: SensitiveZone['severity']) => string;
}

// Web-specific map component
const WebMapComponent: React.FC<MapComponentProps> = ({
  region,
  vessels,
  sensitiveZones,
  zonesVisible,
  onVesselPress,
  getShipIcon,
  getZoneColor
}) => {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMap}>
        <Text style={styles.webMapTitle}>Interactive Map</Text>
        <Text style={styles.webMapSubtitle}>
          Map view is optimized for mobile devices
        </Text>
        
        {/* Mock map background */}
        <View style={styles.mockOcean}>
          {/* Mock sensitive zones */}
          {zonesVisible && sensitiveZones.map(zone => (
            <View
              key={zone.id}
              style={[
                styles.mockZone,
                {
                  left: `${((zone.longitude + 180) / 360) * 100}%`,
                  top: `${((90 - zone.latitude) / 180) * 100}%`,
                  backgroundColor: getZoneColor(zone.severity) + '40',
                  borderColor: getZoneColor(zone.severity),
                }
              ]}
            >
              <Text style={styles.zoneLabel}>{zone.name}</Text>
            </View>
          ))}
          
          {/* Mock vessels */}
          {vessels.map(vessel => (
            <View
              key={vessel.id}
              style={[
                styles.mockVessel,
                {
                  left: `${((vessel.longitude + 180) / 360) * 100}%`,
                  top: `${((90 - vessel.latitude) / 180) * 100}%`,
                }
              ]}
            >
              <TouchableOpacity 
                onPress={() => onVesselPress(vessel)}
                style={styles.vesselButton}
              >
                <Text style={styles.vesselIcon}>{getShipIcon(vessel.type)}</Text>
                <Text style={styles.vesselName}>{vessel.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.webMapInfo}>
          <Text style={styles.infoText}>
            {vessels.length} vessels displayed • {sensitiveZones.length} protected zones
          </Text>
        </View>
      </View>
    </View>
  );
};

// Create a proper lazy component for native maps
const createNativeMapComponent = (): React.LazyExoticComponent<React.FC<MapComponentProps>> => {
  // For web platform, return a lazy component that resolves to a dummy component
  if (Platform.OS === 'web') {
    return React.lazy(async () => ({
      default: () => null
    }));
  }

  // For native platforms, return the actual map component
  return React.lazy(async () => {
    const Maps = await import('react-native-maps');
    const { default: MapView, Marker, Circle } = Maps;
    
    const NativeMap: React.FC<MapComponentProps> = ({
      region,
      vessels,
      sensitiveZones,
      zonesVisible,
      onVesselPress,
      onRegionChange,
      getShipIcon,
      getZoneColor
    }) => (
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
      >
        {zonesVisible && sensitiveZones.map(zone => (
          <Circle
            key={zone.id}
            center={{
              latitude: zone.latitude,
              longitude: zone.longitude
            }}
            radius={zone.radius}
            strokeColor={getZoneColor(zone.severity)}
            fillColor={getZoneColor(zone.severity) + '20'}
            strokeWidth={2}
          />
        ))}

        {vessels.map(vessel => (
          <Marker
            key={vessel.id}
            coordinate={{
              latitude: vessel.latitude,
              longitude: vessel.longitude
            }}
            title={vessel.name}
            description={`Speed: ${vessel.speed} knots`}
            onPress={() => onVesselPress(vessel)}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.shipIcon}>{getShipIcon(vessel.type)}</Text>
              <Text style={styles.shipName}>{vessel.name}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    );
    
    return { default: NativeMap };
  });
};

// Create the native map component instance
const LazyNativeMapComponent = createNativeMapComponent();

// Main MapComponent that chooses the right implementation
const MapComponent: React.FC<MapComponentProps> = (props) => {
  if (Platform.OS === 'web') {
    return <WebMapComponent {...props} />;
  }
  
  return (
    <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading map...</Text></View>}>
      <LazyNativeMapComponent {...props} />
    </React.Suspense>
  );
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  webMapSubtitle: {
    fontSize: 16,
    color: '#666',
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
  },
  mockZone: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  zoneLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  mockVessel: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  vesselButton: {
    alignItems: 'center',
    padding: 4,
  },
  vesselIcon: {
    fontSize: 20,
  },
  vesselName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  webMapInfo: {
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  markerContainer: {
    alignItems: 'center',
  },
  shipIcon: {
    fontSize: 24,
  },
  shipName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
});

export default MapComponent;