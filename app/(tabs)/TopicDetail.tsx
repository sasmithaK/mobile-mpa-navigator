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
  Image
} from 'react-native';
import { 
  ArrowLeft,
  Play,
  ExternalLink,
  Clock,
  Eye,
  Share,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Shield,
  Fish,
  Anchor,
  Waves,
  FileText,
  Globe
} from 'lucide-react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Video } from 'expo-av';



const { width, height } = Dimensions.get('window');

// TypeScript interfaces
interface TopicDetailProps {
  route?: {
    params?: {
      topic?: {
        id: number;
        title: string;
        subtitle: string;
        color: string;
        description: string;
        readTime: string;
      };
    };
  };
  // For navigation if you're using React Navigation
  navigation?: any;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ route, navigation }) => {
  const [activeSection, setActiveSection] = useState<string>('education');
  const scrollY = new Animated.Value(0);

  // Mock data - replace with actual route params in real implementation
  const topic = route?.params?.topic || {
    id: 1,
    title: 'Marine Protected Areas',
    subtitle: 'Understanding conservation zones',
    color: '#10b981',
    description: 'Learn about different types of MPAs, their boundaries, and protection levels.',
    readTime: '5 min read'
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Get icon based on topic ID
  const getTopicIcon = (id: number) => {
    const icons = {
      1: Shield,
      2: Fish,
      3: Anchor,
      4: Waves,
      5: FileText,
      6: Globe
    };
    return icons[id as keyof typeof icons] || Shield;
  };

  // Get detailed content based on topic
  const getDetailedContent = (id: number): string => {
    const contents = {
      1: `Marine Protected Areas (MPAs) are clearly defined geographical spaces, recognized, dedicated and managed, through legal or other effective means, to achieve the long-term conservation of nature with associated ecosystem services and cultural values.

Types of Marine Protected Areas:

No-Take Zones:

These are areas where no extractive activities are allowed. They serve as reference sites and breeding grounds for marine life. Research shows that no-take zones can increase fish biomass by 446% and fish density by 166% compared to unprotected areas.

Multiple-Use Areas: 

These zones allow some human activities while restricting others. They might permit recreational fishing but prohibit commercial trawling. This balanced approach helps maintain both conservation goals and local community needs.

Seasonal Closures:

Temporary restrictions during critical periods like breeding seasons or migration routes. These dynamic protections adapt to the natural rhythms of marine ecosystems.

Special Management Zones:

Areas with specific rules tailored to unique ecological or cultural features. For example, coral reef protection zones with restrictions on boat anchoring and diving activities.

Benefits of MPAs:

Marine Protected Areas provide numerous ecological, economic, and social benefits. They serve as nurseries for commercial fish species, with studies showing spillover effects that benefit adjacent fishing areas. MPAs also protect critical habitats like coral reefs, seagrass beds, and mangrove forests.

Global Impact:

Currently, only about 8% of the world's oceans are protected, far below the international target of 30% by 2030. Effective MPAs require proper enforcement, community support, and adequate funding to achieve their conservation goals.

Implementation Challenges:

Creating effective MPAs involves balancing conservation needs with local community interests, ensuring adequate enforcement resources, and establishing clear management objectives. Successful MPAs often involve local communities in planning and management processes.`,

      2: `Marine wildlife faces unprecedented threats in the 21st century, from climate change and pollution to overfishing and habitat destruction. Understanding and protecting marine biodiversity is crucial for maintaining healthy ocean ecosystems.

**Endangered Marine Species:**

**Sea Turtles:** All seven species are threatened or endangered. They face threats from plastic pollution, coastal development, and climate change affecting nesting beaches. Sea turtle conservation involves protecting nesting sites, reducing bycatch in fishing operations, and community education programs.

**Marine Mammals:** Whales, dolphins, and seals face various threats including ship strikes, entanglement in fishing gear, and noise pollution. The North Atlantic right whale population has declined to approximately 340 individuals, making it one of the world's most endangered marine mammals.

**Sharks and Rays:** Over 30% of shark and ray species are threatened with extinction. These apex predators play crucial roles in maintaining marine ecosystem balance. Their decline can trigger cascading effects throughout the food web.

**Coral Reef Species:** Rising ocean temperatures cause coral bleaching, affecting entire reef ecosystems. Over 50% of coral reefs have been lost due to climate change, pollution, and destructive fishing practices.

**Conservation Strategies:**

**Habitat Protection:** Establishing marine protected areas and critical habitat designations to preserve essential breeding, feeding, and migration areas.

**Reducing Human Impact:** Implementing fishing regulations, reducing plastic pollution, and managing coastal development to minimize human impacts on marine wildlife.

**Research and Monitoring:** Conducting population assessments, tracking migration patterns, and studying ecosystem interactions to inform conservation decisions.

**International Cooperation:** Many marine species migrate across international boundaries, requiring coordinated conservation efforts between nations.

**Community Engagement:** Working with local communities, fishermen, and indigenous peoples who depend on marine resources to develop sustainable practices.

**Success Stories:**

The recovery of humpback whale populations demonstrates that marine wildlife conservation can succeed with dedicated effort and international cooperation.`,

      3: `Sustainable fishing practices are essential for maintaining healthy marine ecosystems while supporting the livelihoods of millions of people worldwide who depend on fishing for food and income.

**Current Fishing Challenges:**

**Overfishing:** Approximately 90% of global fish stocks are either fully exploited or overexploited. Major commercial species like bluefin tuna, cod, and swordfish have experienced dramatic population declines.

**Destructive Fishing Methods:** Bottom trawling destroys seafloor habitats, while dynamite fishing and cyanide fishing damage coral reefs. These methods have long-term ecological consequences that far exceed short-term fishing gains.

**Bycatch Issues:** Non-target species caught incidentally in fishing operations include dolphins, sea turtles, and seabirds. Ghost fishing from abandoned gear continues to trap marine life for years.

**Sustainable Fishing Solutions:**

**Selective Fishing Gear:** Using circle hooks reduces sea turtle bycatch by 90%, while turtle excluder devices (TEDs) in shrimp nets allow turtles to escape. Modified fishing nets with larger mesh sizes allow juvenile fish to escape, ensuring future populations.

**Fishing Quotas and Seasons:** Science-based catch limits and seasonal closures during spawning periods allow fish populations to recover and reproduce. Iceland's cod fishery recovery demonstrates the effectiveness of strict quota systems.

**Marine Stewardship Council (MSC) Certification:** This program certifies sustainable fisheries based on stock health, ecosystem impact, and effective management. MSC-certified products help consumers make responsible choices.

**Traditional Fishing Methods:** Indigenous and traditional fishing practices often incorporate sustainable principles developed over generations. These methods frequently use selective gear and seasonal restrictions that align with natural cycles.

**Aquaculture Development:** Responsible fish farming can reduce pressure on wild stocks while providing protein for growing populations. Integrated multi-trophic aquaculture systems can even improve water quality.

**Economic Benefits:**

Sustainable fishing practices ensure long-term economic viability for fishing communities. Short-term restrictions lead to healthier fish stocks and higher catches in the long run.

**Technology Solutions:**

GPS tracking, satellite monitoring, and electronic logbooks help enforce fishing regulations and reduce illegal fishing activities.`,

      4: `Ocean pollution threatens marine ecosystems, human health, and the global economy. Understanding pollution sources and implementing prevention strategies is crucial for protecting our blue planet.

Types of Ocean Pollution:

**Plastic Pollution:** Over 8 million tons of plastic enter the oceans annually. Microplastics are found in marine food webs from plankton to whales. The Great Pacific Garbage Patch covers an area twice the size of Texas.

**Chemical Pollution:** Industrial chemicals, pesticides, and heavy metals accumulate in marine organisms. Persistent organic pollutants (POPs) can bioaccumulate in top predators, affecting reproduction and immune systems.

**Oil Pollution:** While major spills capture headlines, chronic oil pollution from shipping and land-based sources causes more widespread damage. Oil affects marine life at all levels, from microscopic organisms to marine mammals.

**Nutrient Pollution:** Excess nitrogen and phosphorus from agriculture and wastewater create dead zones where oxygen levels are too low to support marine life. The Gulf of Mexico dead zone can be larger than the state of Connecticut.

**Noise Pollution:** Underwater noise from shipping, sonar, and offshore construction disrupts marine animal communication, navigation, and feeding behaviors.

**Prevention Strategies:**

**Source Reduction:** Reducing single-use plastics, improving waste management systems, and implementing extended producer responsibility programs. Several countries have banned single-use plastic bags, resulting in significant reductions in marine plastic debris.

**Wastewater Treatment:** Advanced treatment technologies can remove nutrients, pharmaceuticals, and microplastics before water enters the ocean. Green infrastructure like constructed wetlands provides natural filtration.

**Industrial Regulations:** Strict enforcement of discharge standards and regular monitoring of industrial facilities. The London Protocol regulates ocean dumping of industrial waste.

**International Cooperation:** MARPOL (International Convention for the Prevention of Pollution from Ships) regulates ship-based pollution sources. Regional agreements address specific pollution challenges.

**Cleanup Technologies:** Ocean cleanup projects use innovative technologies to remove existing pollution. However, prevention remains more effective than cleanup.

**Individual Actions:**

Citizens can reduce ocean pollution by choosing reusable products, properly disposing of waste, using environmentally friendly products, and supporting businesses with sustainable practices.

**Economic Impact:**

Ocean pollution costs the global economy billions of dollars annually through lost fisheries, tourism revenue, and human health impacts.`,

      5: `Maritime compliance regulations form the legal framework for protecting marine environments while enabling sustainable use of ocean resources. Understanding these regulations is essential for all ocean users.

**International Maritime Law:**

**UNCLOS (United Nations Convention on the Law of the Sea):** Often called the "Constitution for the Oceans," UNCLOS establishes rights and responsibilities of nations regarding ocean use. It defines territorial waters, exclusive economic zones, and the high seas.

**MARPOL Convention:** The International Convention for the Prevention of Pollution from Ships regulates operational and accidental pollution from ships. Its six annexes cover oil, chemicals, harmful substances in packaged form, sewage, garbage, and air pollution.

**CITES (Convention on International Trade in Endangered Species):** Regulates trade in endangered marine species like sea turtles, sharks, and marine mammals. Permits are required for import/export of listed species.

**Regional Fisheries Management Organizations (RFMOs):** These international bodies manage fish stocks that migrate across national boundaries. They set catch limits, regulate fishing methods, and coordinate conservation measures.

**National Regulations:**

**Marine Protected Area Legislation:** Countries establish legal frameworks for creating and managing MPAs. Regulations specify allowed activities, enforcement procedures, and penalties for violations.

**Fishing Licenses and Permits:** Commercial and recreational fishing require appropriate licenses. Regulations specify gear restrictions, seasonal closures, and reporting requirements.

**Environmental Impact Assessments:** Major marine development projects must assess potential environmental impacts and propose mitigation measures.

**Compliance Enforcement:**

**Coast Guard Operations:** National coast guards patrol waters, inspect vessels, and investigate violations. Modern enforcement uses satellite monitoring, aerial surveillance, and vessel tracking systems.

**Port State Control:** Ships entering foreign ports are subject to inspection for compliance with international standards. Non-compliant vessels can be detained until violations are corrected.

**Observer Programs:** Independent observers on fishing vessels monitor compliance with regulations and collect scientific data. Observer coverage is required for many commercial fisheries.

**Penalties and Sanctions:**

Violations can result in fines, license suspension, vessel seizure, and criminal charges. Repeat offenders face escalating penalties and may be banned from certain activities.

**Emerging Regulations:**

**Blue Economy:** New regulations address emerging ocean industries like offshore renewable energy, deep-sea mining, and marine biotechnology.

**Climate Change Adaptations:** Regulations are evolving to address climate change impacts, including sea-level rise, ocean acidification, and shifting species distributions.

**Technology Integration:** Electronic monitoring, blockchain tracking, and artificial intelligence are being integrated into compliance systems to improve effectiveness and reduce costs.`,

      6: `Climate change represents the greatest long-term threat to marine ecosystems, fundamentally altering ocean chemistry, temperature, and circulation patterns with cascading effects throughout marine food webs.

**Ocean Warming:**

Global ocean temperatures have increased by 0.6°C since 1969, with the most dramatic warming in surface waters. Marine species are shifting their ranges poleward at an average rate of 70 kilometers per decade, disrupting established ecosystems and fishing communities.

**Thermal Stratification:** Warming creates stronger temperature layers in the ocean, reducing mixing between surface and deep waters. This limits nutrient availability for marine primary producers and reduces ocean productivity.

**Marine Heatwaves:** Extreme temperature events are becoming more frequent and intense. The 2016 marine heatwave caused massive coral bleaching across the Great Barrier Reef, killing over 50% of shallow-water corals in northern sections.

**Ocean Acidification:**

The ocean has absorbed about 30% of human-produced CO2, lowering ocean pH by 0.1 units since pre-industrial times. This represents a 26% increase in acidity, earning ocean acidification the nickname "the other CO2 problem."

**Shell Formation:** Acidification makes it difficult for shell-forming organisms like corals, mollusks, and some plankton to build and maintain their calcium carbonate structures. Laboratory studies show 10-50% reductions in shell formation rates under projected future conditions.

**Food Web Impacts:** Changes in plankton communities affect entire marine food webs. Pteropods (sea butterflies), important food for salmon and whales, show shell dissolution in acidified waters.

**Sea Level Rise:**

Global sea levels have risen 21-24 centimeters since 1880, with the rate of rise accelerating in recent decades. Thermal expansion and melting ice sheets contribute to rising seas.

**Coastal Impacts:** Sea level rise threatens coastal wetlands, mangrove forests, and low-lying islands that serve as critical marine habitats. Many small island nations face complete submersion within this century.

**Saltwater Intrusion:** Rising seas push saltwater into coastal freshwater systems, affecting estuarine ecosystems that serve as nurseries for many marine species.

**Extreme Weather Events:**

**Hurricanes and Storms:** Warmer oceans fuel more intense storms that can destroy coral reefs, seagrass beds, and coastal habitats. Recovery times are often longer than the intervals between major storms.

**Changing Precipitation:** Altered rainfall patterns affect freshwater input to coastal areas, changing salinity levels and nutrient delivery to marine ecosystems.

**Adaptation and Mitigation:**

**Ecosystem-Based Adaptation:** Protecting and restoring natural coastal defenses like coral reefs, mangroves, and salt marshes provides climate resilience while supporting biodiversity.

**Assisted Migration:** Scientists are experimenting with relocating species to more suitable habitats as their current ranges become uninhabitable.

**Genetic Rescue:** Breeding programs aim to enhance genetic diversity and stress tolerance in threatened marine species.

**Carbon Sequestration:** Blue carbon ecosystems like mangroves and seagrass beds can sequester carbon at rates 10 times higher than terrestrial forests.

**International Cooperation:** The Paris Agreement and other international frameworks address climate change mitigation, while adaptation strategies help marine ecosystems cope with unavoidable changes.

**Future Projections:**

Under current emission trajectories, ocean temperatures could rise 1-4°C by 2100, with potentially catastrophic impacts on marine ecosystems. Immediate action on emissions reduction is essential to prevent the worst-case scenarios.`
    };
    return contents[id as keyof typeof contents] || contents[1];
  };

  const handleBackPress = (): void => {
    if (navigation) {
      navigation.goBack();
    } else {
      console.log('Navigate back to EcoComplianceHub');
    }
  };

  const handleTakeAction = (): void => {
    if (navigation) {
      navigation.navigate('AwarenessTips');
    } else {
      console.log('Navigate to AwarenessTips page');
    }
  };

  const handleVideoPress = (): void => {
    console.log('Play main topic video');
  };

  const handleMoreInfoVideo = (): void => {
    console.log('Open external video link');
  };

  const IconComponent = getTopicIcon(topic.id);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
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
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#1f2937" />
          <Text style={styles.backText}>Back to Hub</Text>
        </TouchableOpacity>

        {/* Hero Section with Video */}
        <View style={styles.heroContainer}>
          <View style={[styles.heroGradient, { backgroundColor: topic.color }]} />
          
          {/* Video Container */}
          <View style={styles.videoContainer}>
            <TouchableOpacity style={styles.videoOverlay} onPress={handleVideoPress}>
              {/*<Play size={48} color="white" />*/}
            </TouchableOpacity>

            <Video
    source={require('../../assets/videos/videofish.mp4')} 
    style={styles.videoPlayer}
    isLooping
    isMuted
    shouldPlay
  />

  <View style={styles.videoOverlay} />
            
          </View>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.topicHeader}>
              <View style={[styles.topicIconContainer, { backgroundColor: topic.color + '20' }]}>
                <IconComponent size={32} color={topic.color} />
              </View>
              <View style={styles.topicTitleContainer}>
                <Text style={styles.heroTitle}>{topic.title}</Text>
                <Text style={styles.heroSubtitle}>{topic.subtitle}</Text>
              </View>
            </View>

            {/* Topic Stats */}
            <View style={styles.topicStats}>
              <View style={styles.statItem}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.statText}>{topic.readTime}</Text>
              </View>
              <View style={styles.statItem}>
                <Eye size={16} color="#6b7280" />
                <Text style={styles.statText}>2.3k views</Text>
              </View>
              <TouchableOpacity style={styles.shareButton}>
                <Share size={16} color="#6b7280" />
                <Text style={styles.statText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Topic Section */}
        <View style={styles.topicSection}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#1f2937" />
            <Text style={styles.sectionTitle}>Topic Overview</Text>
          </View>
          <Text style={styles.topicOverview}>
            {topic.description} This comprehensive guide covers essential information, 
            best practices, and actionable insights to help you understand and contribute 
            to marine conservation efforts.
          </Text>
        </View>

        {/* Detailed Description */}
        <View style={styles.detailedSection}>
          <Text style={styles.detailedTitle}>Comprehensive Guide</Text>
          <Text style={styles.detailedContent}>
            {getDetailedContent(topic.id)}
          </Text>
        </View>

        {/* Video Link Section */}
        <View style={styles.videoLinkSection}>
          <TouchableOpacity style={styles.videoLinkCard} onPress={handleMoreInfoVideo}>
            <View style={styles.videoLinkContent}>
              <View style={styles.videoLinkIcon}>
                <ExternalLink size={24} color="#3b82f6" />
              </View>
              <View style={styles.videoLinkText}>
                <Text style={styles.videoLinkTitle}>Watch Detailed Documentary</Text>
                <Text style={styles.videoLinkSubtitle}>
                  Explore more insights with expert interviews and real-world examples
                </Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        <Footer />
      </Animated.ScrollView>

      {/* Take Action Button - Bottom Right */}
      <TouchableOpacity style={styles.takeActionButton} onPress={handleTakeAction}>
        <AlertCircle size={20} color="white" />
        <Text style={styles.takeActionText}>Take Action</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingBottom: 100, // Space for take action button
  },

  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Hero Section
  heroContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  videoContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#000',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  videoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  heroContent: {
    padding: 24,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  topicIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicTitleContainer: {
    flex: 1,
  },
  videoPlayer: {
  width: '100%',
  height: 200,
  borderRadius: 16,
  zIndex: 0,
},

  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  topicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Topic Section
  topicSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  topicOverview: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },

  // Detailed Section
  detailedSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  detailedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  detailedContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'justify',
  },

  // Video Link Section
  videoLinkSection: {
    margin: 16,
    marginTop: 8,
  },
  videoLinkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  videoLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  videoLinkIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f620',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  videoLinkText: {
    flex: 1,
  },
  videoLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  videoLinkSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },

  // Take Action Button
  takeActionButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  takeActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TopicDetail;