import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  MapPin,
  Navigation2,
  FileText,
  AlertTriangle,
  Fish,
  Droplet,
  Image as ImageIcon,
  Ship,
  Save,
  X,
} from 'lucide-react-native';
import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import FormButton from '../../components/FormButton';
import FormPicker from '../../components/FormPicker';

const Reports = () => {
  const [reportType, setReportType] = useState<'hotspot' | 'pollution'>('hotspot');
  const [title, setTitle] = useState('');
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (reportType === 'hotspot' && !species.trim()) {
      newErrors.species = 'Species is required for wildlife hotspot';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!latitude || !longitude) {
      newErrors.location = 'Please select a location';
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Invalid latitude';
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = 'Invalid longitude';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetCurrentLocation = () => {
    // Mock location for demo - in real app, use expo-location
    setLatitude('1.3521');
    setLongitude('103.8198');
    Alert.alert('Location Updated', 'Using Singapore as demo location');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        `${reportType === 'hotspot' ? 'Wildlife hotspot' : 'Pollution'} report submitted successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setTitle('');
              setSpecies('');
              setDescription('');
              setSeverity('medium');
              setLatitude('');
              setLongitude('');
              setImageUrl('');
              setErrors({});
            },
          },
        ]
      );
    }, 1500);
  };

  const handleReset = () => {
    Alert.alert('Reset Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setTitle('');
          setSpecies('');
          setDescription('');
          setSeverity('medium');
          setLatitude('');
          setLongitude('');
          setImageUrl('');
          setErrors({});
        },
      },
    ]);
  };

  const severityOptions = [
    { label: 'Low - Minor concern', value: 'low' },
    { label: 'Medium - Moderate attention needed', value: 'medium' },
    { label: 'High - Significant concern', value: 'high' },
    { label: 'Critical - Immediate action required', value: 'critical' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MapPin size={32} color="#3b82f6" />
        </View>
        <Text style={styles.title}>Submit Marine Report</Text>
        <Text style={styles.subtitle}>
          Help protect our oceans by reporting wildlife sightings or pollution incidents
        </Text>
      </View>

      {/* Report Type Selection */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report Type *</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              reportType === 'hotspot' && styles.typeButtonActive,
            ]}
            onPress={() => setReportType('hotspot')}
            activeOpacity={0.7}
          >
            <Fish
              size={32}
              color={reportType === 'hotspot' ? '#3b82f6' : '#9ca3af'}
            />
            <Text
              style={[
                styles.typeButtonText,
                reportType === 'hotspot' && styles.typeButtonTextActive,
              ]}
            >
              Wildlife Hotspot
            </Text>
            <Text style={styles.typeButtonSubtext}>Marine animal sightings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              reportType === 'pollution' && styles.typeButtonActive,
            ]}
            onPress={() => setReportType('pollution')}
            activeOpacity={0.7}
          >
            <Droplet
              size={32}
              color={reportType === 'pollution' ? '#ef4444' : '#9ca3af'}
            />
            <Text
              style={[
                styles.typeButtonText,
                reportType === 'pollution' && styles.typeButtonTextActive,
              ]}
            >
              Pollution
            </Text>
            <Text style={styles.typeButtonSubtext}>Oil spills, debris, etc.</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report Details</Text>

        <FormInput
          label="Title"
          placeholder="e.g., Whale pod sighting or Oil spill detected"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          icon={<FileText size={20} color="#9ca3af" />}
          required
        />

        {reportType === 'hotspot' && (
          <FormInput
            label="Species"
            placeholder="e.g., Humpback Whale, Dolphin, Sea Turtle"
            value={species}
            onChangeText={setSpecies}
            error={errors.species}
            icon={<Fish size={20} color="#9ca3af" />}
            required
          />
        )}

        <FormTextArea
          label="Description"
          placeholder="Provide detailed information about what you observed..."
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          icon={<FileText size={20} color="#9ca3af" />}
          required
        />

        <FormPicker
          label="Severity Level"
          value={severity}
          onValueChange={setSeverity}
          options={severityOptions}
          icon={<AlertTriangle size={20} color="#9ca3af" />}
          required
        />

        <FormInput
          label="Image URL (optional)"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChangeText={setImageUrl}
          icon={<ImageIcon size={20} color="#9ca3af" />}
          keyboardType="url"
        />
      </View>

      {/* Location Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location *</Text>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleGetCurrentLocation}
          activeOpacity={0.7}
        >
          <Navigation2 size={20} color="#3b82f6" />
          <Text style={styles.locationButtonText}>Use Current Location</Text>
        </TouchableOpacity>

        <View style={styles.coordinatesRow}>
          <View style={styles.coordinateInput}>
            <FormInput
              label="Latitude"
              placeholder="Click to set"
              value={latitude}
              onChangeText={setLatitude}
              error={errors.latitude}
              keyboardType="numeric"
              icon={<MapPin size={20} color="#9ca3af" />}
            />
          </View>

          <View style={styles.coordinateInput}>
            <FormInput
              label="Longitude"
              placeholder="Click to set"
              value={longitude}
              onChangeText={setLongitude}
              error={errors.longitude}
              keyboardType="numeric"
              icon={<MapPin size={20} color="#9ca3af" />}
            />
          </View>
        </View>

        {errors.location && (
          <Text style={styles.errorText}>{errors.location}</Text>
        )}

        {latitude && longitude && !errors.latitude && !errors.longitude && (
          <View style={styles.locationPreview}>
            <MapPin size={20} color="#3b82f6" />
            <View style={styles.locationPreviewText}>
              <Text style={styles.locationPreviewTitle}>Location Selected</Text>
              <Text style={styles.locationPreviewCoords}>
                Lat: {parseFloat(latitude).toFixed(6)}, Lng:{' '}
                {parseFloat(longitude).toFixed(6)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <FormButton
            title={loading ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            loading={loading}
            icon={<Save size={20} color="white" />}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <FormButton
            title="Reset"
            onPress={handleReset}
            variant="secondary"
            size="lg"
            icon={<X size={20} color="white" />}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#1f2937',
  },
  typeButtonSubtext: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginBottom: 16,
    gap: 8,
  },
  locationButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateInput: {
    flex: 1,
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginTop: 8,
    gap: 8,
  },
  locationPreviewText: {
    flex: 1,
  },
  locationPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  locationPreviewCoords: {
    fontSize: 12,
    color: '#3b82f6',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  buttonWrapper: {
    width: '100%',
  },
});

export default Reports;

