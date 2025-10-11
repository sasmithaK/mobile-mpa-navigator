import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
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

// Mock data for demonstration
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
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return severity;
    }
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
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All ({reports.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'hotspot' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('hotspot')}
        >
          <Fish
            size={16}
            color={filter === 'hotspot' ? '#3b82f6' : '#6b7280'}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === 'hotspot' && styles.filterTabTextActive,
            ]}
          >
            Hotspots
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'pollution' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('pollution')}
        >
          <Droplet
            size={16}
            color={filter === 'pollution' ? '#3b82f6' : '#6b7280'}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === 'pollution' && styles.filterTabTextActive,
            ]}
          >
            Pollution
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptySubtitle}>
              Submit your first report from the Reports tab
            </Text>
          </View>
        ) : (
          filteredReports.map((report) => (
            <View key={report._id} style={styles.reportCard}>
              {/* Report Header */}
              <View style={styles.reportHeader}>
                <View style={styles.reportTypeIcon}>
                  {report.type === 'hotspot' ? (
                    <Fish size={20} color="#3b82f6" />
                  ) : (
                    <Droplet size={20} color="#ef4444" />
                  )}
                </View>
                <View style={styles.reportHeaderText}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <View style={styles.reportMeta}>
                    <Calendar size={14} color="#6b7280" />
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
                  <MapPin size={14} color="#6b7280" />
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
                  <Eye size={18} color="#3b82f6" />
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Trash2 size={18} color="#ef4444" />
                  <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#dbeafe',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: '#3b82f6',
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
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reportTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
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
    color: '#1f2937',
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  speciesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
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
    color: '#4b5563',
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
    borderTopColor: '#f3f4f6',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
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
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
});

export default MyReports;

