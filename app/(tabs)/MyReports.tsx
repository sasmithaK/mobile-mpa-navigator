import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  MapPin,
  Calendar,
  Fish,
  Droplet,
  AlertTriangle,
  Trash2,
  Eye,
} from 'lucide-react-native';

const MOCK_REPORTS = [
  {
    _id: '1',
    type: 'hotspot',
    title: 'Whale pod sighting',
    species: 'Humpback Whale',
    description: 'Spotted a pod of 5-6 humpback whales migrating south',
    severity: 'medium',
    latitude: 1.3521,
    longitude: 103.8198,
    createdAt: '2024-01-15T10:30:00Z',
    isActive: true,
  },
  {
    _id: '2',
    type: 'pollution',
    title: 'Oil spill detected',
    description: 'Small oil slick observed near shipping lane',
    severity: 'high',
    latitude: 1.2897,
    longitude: 103.8559,
    createdAt: '2024-01-14T14:20:00Z',
    isActive: true,
  },
  {
    _id: '3',
    type: 'hotspot',
    title: 'Sea turtle nesting site',
    species: 'Green Sea Turtle',
    description: 'Multiple turtles spotted near beach, possible nesting site',
    severity: 'low',
    latitude: 1.4655,
    longitude: 103.7578,
    createdAt: '2024-01-13T09:15:00Z',
    isActive: true,
  },
];

const MyReports = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'hotspot' | 'pollution'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityLabel = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredReports = reports.filter((report) =>
    filter === 'all' ? true : report.type === filter
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a1929', '#1a365d', '#0f172a']} style={styles.gradient} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <LinearGradient
            colors={filter === 'all' ? ['rgba(6,191,219,0.3)', 'rgba(6,191,219,0.15)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
            style={styles.filterTabGradient}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All ({reports.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'hotspot' && styles.filterTabActive]}
          onPress={() => setFilter('hotspot')}
        >
          <LinearGradient
            colors={filter === 'hotspot' ? ['rgba(6,191,219,0.3)', 'rgba(6,191,219,0.15)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
            style={styles.filterTabGradient}
          >
            <Fish size={16} color={filter === 'hotspot' ? '#06bfdb' : 'rgba(255,255,255,0.5)'} />
            <Text style={[styles.filterTabText, filter === 'hotspot' && styles.filterTabTextActive]}>
              Hotspots
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'pollution' && styles.filterTabActive]}
          onPress={() => setFilter('pollution')}
        >
          <LinearGradient
            colors={filter === 'pollution' ? ['rgba(6,191,219,0.3)', 'rgba(6,191,219,0.15)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
            style={styles.filterTabGradient}
          >
            <Droplet size={16} color={filter === 'pollution' ? '#06bfdb' : 'rgba(255,255,255,0.5)'} />
            <Text style={[styles.filterTabText, filter === 'pollution' && styles.filterTabTextActive]}>
              Pollution
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06bfdb" />
        }
      >
        {filteredReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={64} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptySubtitle}>
              Submit your first report from the Reports tab
            </Text>
          </View>
        ) : (
          filteredReports.map((report) => (
            <View key={report._id} style={styles.reportCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                style={styles.cardGradient}
              >
                {/* Report Header */}
                <View style={styles.reportHeader}>
                  <View style={[styles.reportTypeIcon, {
                    backgroundColor: report.type === 'hotspot' ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)'
                  }]}>
                    {report.type === 'hotspot' ? (
                      <Fish size={20} color="#3b82f6" />
                    ) : (
                      <Droplet size={20} color="#ef4444" />
                    )}
                  </View>
                  <View style={styles.reportHeaderText}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <View style={styles.reportMeta}>
                      <Calendar size={14} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.reportDate}>
                        {formatDate(report.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Species (for hotspot) */}
                {report.type === 'hotspot' && report.species && (
                  <View style={styles.speciesTag}>
                    <Fish size={14} color="#3b82f6" />
                    <Text style={styles.speciesText}>{report.species}</Text>
                  </View>
                )}

                {/* Description */}
                <Text style={styles.reportDescription} numberOfLines={2}>
                  {report.description}
                </Text>

                {/* Location and Severity */}
                <View style={styles.reportFooter}>
                  <View style={styles.locationTag}>
                    <MapPin size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.locationText}>
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(report.severity) + '20' },
                    ]}
                  >
                    <AlertTriangle
                      size={14}
                      color={getSeverityColor(report.severity)}
                    />
                    <Text
                      style={[
                        styles.severityText,
                        { color: getSeverityColor(report.severity) },
                      ]}
                    >
                      {getSeverityLabel(report.severity)}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Eye size={18} color="#06bfdb" />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Trash2 size={18} color="#ef4444" />
                    <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'transparent',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  filterTab: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterTabActive: {
    borderColor: 'rgba(6,191,219,0.5)',
  },
  filterTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  filterTabTextActive: {
    color: '#06bfdb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  reportCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardGradient: {
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reportTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportHeaderText: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  speciesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59,130,246,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  speciesText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
  },
  reportDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#06bfdb',
  },
});

export default MyReports;
