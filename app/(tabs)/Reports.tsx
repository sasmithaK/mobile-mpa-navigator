import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (reportType === 'hotspot' && !species.trim()) newErrors.species = 'Species is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!latitude || !longitude) newErrors.location = 'Please select a location';

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = 'Invalid latitude';
    if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = 'Invalid longitude';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetCurrentLocation = () => {
    setLatitude('1.3521');
    setLongitude('103.8198');
    Alert.alert('Location Updated', 'Using current location');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Report submitted successfully!', [
        { text: 'OK', onPress: () => {
            setTitle(''); setSpecies(''); setDescription('');
            setSeverity('medium'); setLatitude(''); setLongitude('');
            setImageUrl(''); setErrors({});
          }
        },
      ]);
    }, 1500);
  };

  const handleReset = () => {
    Alert.alert('Reset Form', 'Clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
          setTitle(''); setSpecies(''); setDescription('');
          setSeverity('medium'); setLatitude(''); setLongitude('');
          setImageUrl(''); setErrors({});
        }
      },
    ]);
  };

  const severityOptions = [
    { label: 'Low', value: 'low', color: '#10b981' },
    { label: 'Medium', value: 'medium', color: '#f59e0b' },
    { label: 'High', value: 'high', color: '#ef4444' },
    { label: 'Critical', value: 'critical', color: '#dc2626' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a1929', '#1a365d', '#0f172a']} style={styles.gradient} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MapPin size={32} color="#06bfdb" />
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
              style={[styles.typeButton, reportType === 'hotspot' && styles.typeButtonActive]}
              onPress={() => setReportType('hotspot')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={reportType === 'hotspot' ? ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.typeButtonGradient}
              >
                <Fish size={32} color={reportType === 'hotspot' ? '#3b82f6' : 'rgba(255,255,255,0.4)'} />
                <Text style={[styles.typeButtonText, reportType === 'hotspot' && styles.typeButtonTextActive]}>
                  Wildlife Hotspot
                </Text>
                <Text style={styles.typeButtonSubtext}>Marine animal sightings</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, reportType === 'pollution' && styles.typeButtonActive]}
              onPress={() => setReportType('pollution')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={reportType === 'pollution' ? ['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.1)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.typeButtonGradient}
              >
                <Droplet size={32} color={reportType === 'pollution' ? '#ef4444' : 'rgba(255,255,255,0.4)'} />
                <Text style={[styles.typeButtonText, reportType === 'pollution' && styles.typeButtonTextActive]}>
                  Pollution
                </Text>
                <Text style={styles.typeButtonSubtext}>Oil spills, debris, etc.</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Report Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Whale pod sighting"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={title}
              onChangeText={setTitle}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {reportType === 'hotspot' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Species *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Humpback Whale"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={species}
                onChangeText={setSpecies}
              />
              {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Provide detailed information..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Severity Level *</Text>
            <View style={styles.severityButtons}>
              {severityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.severityButton,
                    severity === option.value && { borderColor: option.color, backgroundColor: option.color + '20' }
                  ]}
                  onPress={() => setSeverity(option.value)}
                >
                  <Text style={[styles.severityText, severity === option.value && { color: option.color }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location *</Text>

          <TouchableOpacity style={styles.locationButton} onPress={handleGetCurrentLocation}>
            <Navigation2 size={20} color="#06bfdb" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>

          <View style={styles.coordinatesRow}>
            <View style={styles.coordinateInput}>
              <Text style={styles.inputLabel}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0000"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.coordinateInput}>
              <Text style={styles.inputLabel}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0000"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>

          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#06bfdb', '#0891b2']}
              style={styles.buttonGradient}
            >
              <Save size={20} color="white" />
              <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleReset}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.buttonGradient}
            >
              <X size={20} color="white" />
              <Text style={styles.buttonText}>Reset</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
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
    backgroundColor: 'rgba(6,191,219,0.2)',
    borderWidth: 2,
    borderColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  typeButtonActive: {
    borderColor: 'rgba(6,191,219,0.5)',
  },
  typeButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  typeButtonSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  severityText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,191,219,0.15)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#06bfdb',
    marginBottom: 16,
    gap: 8,
  },
  locationButtonText: {
    color: '#06bfdb',
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
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  primaryButton: {
    borderColor: 'rgba(6,191,219,0.3)',
  },
  secondaryButton: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Reports;