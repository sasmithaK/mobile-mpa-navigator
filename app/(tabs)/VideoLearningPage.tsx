// app/tabs/VideoLearningPage.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Modal,
  Image
} from 'react-native';
import { 
  Play,
  X,
  Clock,
  Eye,
  PlayCircle,
  Bookmark,
  Share2,
  ChevronRight,
  Film,
  TrendingUp,
  Award,
  Waves,
  Fish,
  Leaf,
  AlertTriangle,
  Anchor
} from 'lucide-react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');



// TypeScript interfaces
interface Video {
  id: number;
  title: string;
  description: string;
  duration: string;
  views: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface VideoCategory {
  id: number;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  videos: Video[];
}

const VideoLearningPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('videos');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Video[]>([]);
  const scrollY = new Animated.Value(0);

  // Video Categories with actual videos
  const videoCategories: VideoCategory[] = [
    {
      id: 1,
      name: 'Marine Biodiversity',
      icon: Fish,
      color: '#3b82f6',
      videos: [
        {
          id: 1,
          title: 'Discovering Ocean Life: A Journey Through Marine Biodiversity',
          description: 'Explore the incredible diversity of life in our oceans, from tiny plankton to massive whales.',
          duration: '12:45',
          views: '2.3M',
          category: 'Marine Biodiversity',
          thumbnail: 'marine_bio_1.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example1',
          difficulty: 'Beginner'
        },
        {
          id: 2,
          title: 'Coral Reefs: The Rainforests of the Sea',
          description: 'Dive into the vibrant world of coral reefs and understand why they are crucial ecosystems.',
          duration: '15:20',
          views: '1.8M',
          category: 'Marine Biodiversity',
          thumbnail: 'coral_reef.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example2',
          difficulty: 'Beginner'
        },
        {
          id: 3,
          title: 'Deep Sea Creatures: Life in the Abyss',
          description: 'Discover the mysterious creatures that live in the deepest parts of our oceans.',
          duration: '18:30',
          views: '3.1M',
          category: 'Marine Biodiversity',
          thumbnail: 'deep_sea.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example3',
          difficulty: 'Intermediate'
        },
        {
          id: 4,
          title: 'Whales and Dolphins: The Intelligent Giants',
          description: 'Learn about the fascinating behavior and intelligence of marine mammals.',
          duration: '20:15',
          views: '4.2M',
          category: 'Marine Biodiversity',
          thumbnail: 'whales.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example4',
          difficulty: 'Beginner'
        }
      ]
    },
    {
      id: 2,
      name: 'Ocean Conservation',
      icon: Leaf,
      color: '#10b981',
      videos: [
        {
          id: 5,
          title: 'Marine Protected Areas: Why They Matter',
          description: 'Understanding the importance of MPAs in preserving ocean ecosystems for future generations.',
          duration: '10:30',
          views: '1.5M',
          category: 'Ocean Conservation',
          thumbnail: 'mpa.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example5',
          difficulty: 'Beginner'
        },
        {
          id: 6,
          title: 'How to Help Save Our Oceans',
          description: 'Practical steps everyone can take to contribute to ocean conservation efforts.',
          duration: '14:20',
          views: '2.7M',
          category: 'Ocean Conservation',
          thumbnail: 'save_ocean.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example6',
          difficulty: 'Beginner'
        },
        {
          id: 7,
          title: 'Success Stories: Ocean Recovery Projects',
          description: 'Inspiring examples of successful ocean conservation initiatives around the world.',
          duration: '16:45',
          views: '1.9M',
          category: 'Ocean Conservation',
          thumbnail: 'success.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example7',
          difficulty: 'Intermediate'
        }
      ]
    },
    {
      id: 3,
      name: 'Pollution & Climate',
      icon: AlertTriangle,
      color: '#ef4444',
      videos: [
        {
          id: 8,
          title: 'Plastic Ocean: The Pollution Crisis',
          description: 'Understanding the devastating impact of plastic pollution on marine life.',
          duration: '13:15',
          views: '5.2M',
          category: 'Pollution & Climate',
          thumbnail: 'plastic.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example8',
          difficulty: 'Beginner'
        },
        {
          id: 9,
          title: 'Ocean Acidification Explained',
          description: 'How carbon dioxide is changing ocean chemistry and affecting marine ecosystems.',
          duration: '11:40',
          views: '1.3M',
          category: 'Pollution & Climate',
          thumbnail: 'acidification.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example9',
          difficulty: 'Intermediate'
        },
        {
          id: 10,
          title: 'Rising Seas: Climate Change Impact',
          description: 'Exploring how climate change is affecting sea levels and coastal communities.',
          duration: '17:25',
          views: '2.4M',
          category: 'Pollution & Climate',
          thumbnail: 'climate.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example10',
          difficulty: 'Advanced'
        },
        {
          id: 11,
          title: 'Cleaning Up Our Oceans: Innovative Solutions',
          description: 'Cutting-edge technologies and methods being used to remove pollution from our seas.',
          duration: '15:50',
          views: '3.8M',
          category: 'Pollution & Climate',
          thumbnail: 'cleanup.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example11',
          difficulty: 'Intermediate'
        }
      ]
    },
    {
      id: 4,
      name: 'Sustainable Fishing',
      icon: Anchor,
      color: '#f59e0b',
      videos: [
        {
          id: 12,
          title: 'Sustainable Fishing Practices 101',
          description: 'Learn about fishing methods that protect marine ecosystems while providing food.',
          duration: '12:00',
          views: '980K',
          category: 'Sustainable Fishing',
          thumbnail: 'fishing.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example12',
          difficulty: 'Beginner'
        },
        {
          id: 13,
          title: 'Overfishing: A Global Crisis',
          description: 'Understanding the impact of overfishing on ocean ecosystems and food security.',
          duration: '14:35',
          views: '1.6M',
          category: 'Sustainable Fishing',
          thumbnail: 'overfishing.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example13',
          difficulty: 'Intermediate'
        },
        {
          id: 14,
          title: 'Supporting Sustainable Seafood',
          description: 'How to make informed choices when buying seafood to support ocean health.',
          duration: '9:45',
          views: '1.2M',
          category: 'Sustainable Fishing',
          thumbnail: 'seafood.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example14',
          difficulty: 'Beginner'
        }
      ]
    },
    {
      id: 5,
      name: 'Ocean Exploration',
      icon: Waves,
      color: '#06b6d4',
      videos: [
        {
          id: 15,
          title: 'The Last Frontier: Exploring the Deep Ocean',
          description: 'Journey to the least explored places on Earth - the deep ocean floor.',
          duration: '22:10',
          views: '6.5M',
          category: 'Ocean Exploration',
          thumbnail: 'exploration.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example15',
          difficulty: 'Intermediate'
        },
        {
          id: 16,
          title: 'Underwater Robots: The Future of Ocean Research',
          description: 'How advanced technology is helping us explore and understand the ocean depths.',
          duration: '16:20',
          views: '2.1M',
          category: 'Ocean Exploration',
          thumbnail: 'robots.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example16',
          difficulty: 'Advanced'
        },
        {
          id: 17,
          title: 'Discovering New Marine Species',
          description: 'Meet the scientists finding never-before-seen creatures in our oceans.',
          duration: '18:55',
          views: '3.3M',
          category: 'Ocean Exploration',
          thumbnail: 'species.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=example17',
          difficulty: 'Intermediate'
        }
      ]
    }
  ];

  const handleVideoPress = (video: Video): void => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = (): void => {
    setShowVideoModal(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const toggleFavorite = (video: Video): void => {
  const isFavorited = favorites.some(fav => fav.id === video.id);
  if (isFavorited) {
    setFavorites(prev => prev.filter(fav => fav.id !== video.id));
  } else {
    setFavorites(prev => [...prev, video]);
  }
};

  return (
    <View style={styles.container}>
      <Animated.View style={styles.headerContainer}>
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Film size={48} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>Ocean Learning Hub</Text>
            <Text style={styles.heroSubtitle}>
              Watch. Learn. Protect. Explore our collection of educational videos
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <PlayCircle size={20} color="#10b981" />
                <Text style={styles.heroStatText}>17 Videos</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <TrendingUp size={20} color="#f59e0b" />
                <Text style={styles.heroStatText}>42M+ Views</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Video Categories */}
        {videoCategories.map((category, categoryIndex) => (
          <View key={category.id} style={styles.categorySection}>
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleRow}>
                <View style={[styles.categoryIconBox, { backgroundColor: category.color + '20' }]}>
                  <category.icon size={20} color={category.color} />
                </View>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <View style={styles.videoCountBadge}>
                  <Text style={styles.videoCountText}>{category.videos.length}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Horizontal Scrolling Video Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.videoScrollContainer}
            >
              {category.videos.map((video, index) => (
                <TouchableOpacity
                  key={video.id}
                  style={[
                    styles.videoCard,
                    index === 0 && styles.firstVideoCard
                  ]}
                  onPress={() => handleVideoPress(video)}
                  activeOpacity={0.9}
                >
                  {/* Thumbnail */}
                  <View style={styles.thumbnailContainer}>
                    {/* Placeholder - Replace with actual image */}
                    <View style={[styles.thumbnailPlaceholder, { 
                      backgroundColor: category.color + '30' 
                    }]}>
                      <PlayCircle size={48} color="#fff" opacity={0.8} />
                    </View>
                    
                    {/* Duration Badge */}
                    <View style={styles.durationBadge}>
                      <Clock size={12} color="#fff" />
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>

                    {/* Play Overlay */}
                    <View style={styles.playOverlay}>
                      <View style={styles.playButton}>
                        <Play size={24} color="#fff" />
                      </View>
                    </View>
                  </View>

                  {/* Video Info */}
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoDescription} numberOfLines={2}>
                      {video.description}
                    </Text>
                    
                    {/* Video Meta */}
                    <View style={styles.videoMeta}>
                      <View style={styles.metaItem}>
                        <Eye size={14} color="#9ca3af" />
                        <Text style={styles.metaText}>{video.views}</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { 
                        backgroundColor: getDifficultyColor(video.difficulty) + '20',
                        borderColor: getDifficultyColor(video.difficulty)
                      }]}>
                        <Text style={[styles.difficultyText, { 
                          color: getDifficultyColor(video.difficulty) 
                        }]}>
                          {video.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        <Footer />
      </Animated.ScrollView>

      {/* Video Player Modal */}
      <Modal
        visible={showVideoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeVideoModal}>
              <X size={24} color="#fff" />
            </TouchableOpacity>

            {selectedVideo && (
              <>
                {/* Video Player Placeholder */}
                <View style={styles.videoPlayerContainer}>
                  {selectedVideo?.videoUrl && (
  <WebView
    source={{ uri: selectedVideo.videoUrl }}
    style={styles.videoPlayerWebView}
    allowsInlineMediaPlayback
    mediaPlaybackRequiresUserAction={false}
    javaScriptEnabled
    domStorageEnabled
  />
)}
                </View>

                {/* Video Details */}
                <View style={styles.modalVideoDetails}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedVideo.title}</Text>
                    <View style={styles.modalActions}>
                      <TouchableOpacity 
  style={styles.actionButton} 
  onPress={() => selectedVideo && toggleFavorite(selectedVideo)}
>
  <Bookmark 
    size={20} 
    color={favorites.some(fav => fav.id === selectedVideo?.id) ? '#10b981' : '#fff'} 
    fill={favorites.some(fav => fav.id === selectedVideo?.id) ? '#10b981' : 'none'}
  />
</TouchableOpacity>

                      <TouchableOpacity style={styles.actionButton}>
                        <Share2 size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.modalMetaRow}>
                    <View style={styles.modalMetaItem}>
                      <Eye size={16} color="#9ca3af" />
                      <Text style={styles.modalMetaText}>{selectedVideo.views} views</Text>
                    </View>
                    <View style={styles.modalMetaDivider} />
                    <View style={styles.modalMetaItem}>
                      <Clock size={16} color="#9ca3af" />
                      <Text style={styles.modalMetaText}>{selectedVideo.duration}</Text>
                    </View>
                    <View style={styles.modalMetaDivider} />
                    <View style={[styles.modalDifficultyBadge, {
                      backgroundColor: getDifficultyColor(selectedVideo.difficulty) + '20',
                      borderColor: getDifficultyColor(selectedVideo.difficulty)
                    }]}>
                      <Text style={[styles.modalDifficultyText, {
                        color: getDifficultyColor(selectedVideo.difficulty)
                      }]}>
                        {selectedVideo.difficulty}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalDescription}>
                    {selectedVideo.description}
                  </Text>

                  <View style={styles.modalCategoryTag}>
                    <Text style={styles.modalCategoryText}>
                      Category: {selectedVideo.category}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark Netflix-style background
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 40,
  },

  // Hero Banner
  heroBanner: {
    height: 280,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.9) 100%)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  heroStatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  heroDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },

  // Category Section
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
  },
  videoCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoCountText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },

  // Video Cards
  videoScrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  videoCard: {
    width: width * 0.75,
    marginRight: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  firstVideoCard: {
    // Special styling for first card if needed
  },
  thumbnailContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 22,
  },
  videoDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#9ca3af',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  videoPlayerContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    marginTop: 100,
  },
  videoPlayerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  videoPlayerSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalVideoDetails: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 30,
    marginRight: 12,
  },
  modalActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  videoPlayerWebView: {
  width: '100%',
  height: 250,
  backgroundColor: '#000',
},
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalMetaText: {
    color: '#9ca3af',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  modalMetaDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },
  modalDifficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalDifficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalDescription: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  modalCategoryText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VideoLearningPage;