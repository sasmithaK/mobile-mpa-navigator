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
}: MapComponentProps) => {
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

// Main MapComponent - Use web version for all platforms
// NOTE: Native maps (react-native-maps) require Expo development build with custom native configuration
// For now, we use a cross-platform web-friendly implementation
const MapComponent: React.FC<MapComponentProps> = (props: MapComponentProps) => {
  return <WebMapComponent {...props} />;
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