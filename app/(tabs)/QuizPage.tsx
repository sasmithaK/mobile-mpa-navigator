// app/tabs/QuizPage.tsx
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
  Modal
} from 'react-native';
import { 
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Fish,
  Leaf,
  Waves,
  Anchor,
  AlertTriangle,
  Trophy,
  RefreshCcw
} from 'lucide-react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');

// TypeScript interfaces
interface QuizCategory {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  questionCount: number;
}

interface Question {
  id: number;
  categoryId: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

const QuizPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const scrollY = new Animated.Value(0);

  // Quiz Categories
  const categories: QuizCategory[] = [
    {
      id: 1,
      name: 'Biodiversity',
      description: 'Test your knowledge about marine species and ecosystems',
      icon: Fish,
      color: '#3b82f6',
      questionCount: 6
    },
    {
      id: 2,
      name: 'Conservation',
      description: 'Learn about marine protection and sustainability',
      icon: Leaf,
      color: '#10b981',
      questionCount: 6
    },
    {
      id: 3,
      name: 'Ocean Pollution',
      description: 'Understand pollution threats and prevention',
      icon: Waves,
      color: '#06b6d4',
      questionCount: 5
    },
    {
      id: 4,
      name: 'Sustainable Fishing',
      description: 'Explore responsible fishing practices',
      icon: Anchor,
      color: '#f59e0b',
      questionCount: 5
    },
    {
      id: 5,
      name: 'Climate Change',
      description: 'Discover climate impacts on oceans',
      icon: AlertTriangle,
      color: '#ef4444',
      questionCount: 5
    }
  ];

  // Quiz Questions
  const questions: Question[] = [
    // Biodiversity Questions (Category 1)
    {
      id: 1,
      categoryId: 1,
      question: 'How many species of marine life are estimated to exist in the ocean?',
      options: ['50,000', '250,000', '1 million', 'Over 2 million'],
      correctAnswer: 3,
      explanation: 'Scientists estimate there are over 2 million marine species, though only about 240,000 have been identified and described.'
    },
    {
      id: 2,
      categoryId: 1,
      question: 'Which marine animal has three hearts?',
      options: ['Dolphin', 'Octopus', 'Whale', 'Shark'],
      correctAnswer: 1,
      explanation: 'Octopuses have three hearts: two pump blood to the gills, and one pumps blood to the rest of the body.'
    },
    {
      id: 3,
      categoryId: 1,
      question: 'What percentage of Earth\'s oxygen is produced by ocean phytoplankton?',
      options: ['20%', '50%', '70%', '90%'],
      correctAnswer: 1,
      explanation: 'Ocean phytoplankton produces at least 50% of the planet\'s oxygen, making them crucial for all life on Earth.'
    },
    {
      id: 4,
      categoryId: 1,
      question: 'How long can sea turtles hold their breath underwater?',
      options: ['30 minutes', '2 hours', '5 hours', '10 hours'],
      correctAnswer: 2,
      explanation: 'Sea turtles can hold their breath for up to 5 hours when resting or sleeping, though they typically surface more frequently when active.'
    },
    {
      id: 5,
      categoryId: 1,
      question: 'What is the largest animal on Earth?',
      options: ['Great White Shark', 'Blue Whale', 'Elephant', 'Giant Squid'],
      correctAnswer: 1,
      explanation: 'The Blue Whale is the largest animal on Earth, reaching lengths of up to 100 feet and weighing up to 200 tons.'
    },
    {
      id: 6,
      categoryId: 1,
      question: 'Which ocean zone has the most biodiversity?',
      options: ['Abyssal Zone', 'Sunlight Zone', 'Twilight Zone', 'Midnight Zone'],
      correctAnswer: 1,
      explanation: 'The Sunlight Zone (0-200m) has the most biodiversity due to abundant light for photosynthesis, supporting complex food webs.'
    },

    // Conservation Questions (Category 2)
    {
      id: 7,
      categoryId: 2,
      question: 'What does MPA stand for?',
      options: ['Marine Protection Area', 'Marine Protected Area', 'Marine Preservation Area', 'Marine Public Area'],
      correctAnswer: 1,
      explanation: 'MPA stands for Marine Protected Area - regions where human activity is restricted to protect marine ecosystems.'
    },
    {
      id: 8,
      categoryId: 2,
      question: 'What percentage of the ocean should be protected by 2030 according to international targets?',
      options: ['10%', '20%', '30%', '50%'],
      correctAnswer: 2,
      explanation: 'The international "30x30" target aims to protect 30% of the ocean by 2030 to preserve biodiversity and ecosystem services.'
    },
    {
      id: 9,
      categoryId: 2,
      question: 'Which marine ecosystem is known as the "rainforest of the sea"?',
      options: ['Kelp Forests', 'Seagrass Beds', 'Coral Reefs', 'Mangroves'],
      correctAnswer: 2,
      explanation: 'Coral reefs are called the "rainforest of the sea" because they support 25% of all marine species despite covering less than 1% of the ocean floor.'
    },
    {
      id: 10,
      categoryId: 2,
      question: 'How long does it take for coral reefs to recover from severe damage?',
      options: ['1-2 years', '5-10 years', '10-30 years', '50+ years'],
      correctAnswer: 2,
      explanation: 'Coral reefs typically need 10-30 years to recover from severe damage, and some may never fully recover if conditions remain poor.'
    },
    {
      id: 11,
      categoryId: 2,
      question: 'What is "ghost fishing"?',
      options: ['Fishing at night', 'Abandoned fishing gear catching marine life', 'Deep sea fishing', 'Underwater fishing'],
      correctAnswer: 1,
      explanation: 'Ghost fishing occurs when abandoned or lost fishing gear continues to trap and kill marine animals for years.'
    },
    {
      id: 12,
      categoryId: 2,
      question: 'Which conservation approach involves local communities in management?',
      options: ['Top-down management', 'Community-based conservation', 'Military enforcement', 'Corporate management'],
      correctAnswer: 1,
      explanation: 'Community-based conservation involves local communities in decision-making and management, leading to better outcomes and local support.'
    },

    // Ocean Pollution Questions (Category 3)
    {
      id: 13,
      categoryId: 3,
      question: 'How many tons of plastic enter the ocean every year?',
      options: ['1 million', '5 million', '8 million', '15 million'],
      correctAnswer: 2,
      explanation: 'Approximately 8 million tons of plastic waste enter the ocean annually, equivalent to dumping one garbage truck of plastic every minute.'
    },
    {
      id: 14,
      categoryId: 3,
      question: 'How long does a plastic bottle take to decompose in the ocean?',
      options: ['50 years', '100 years', '450 years', '1000 years'],
      correctAnswer: 2,
      explanation: 'A plastic bottle takes approximately 450 years to decompose in the ocean, breaking down into harmful microplastics.'
    },
    {
      id: 15,
      categoryId: 3,
      question: 'What is the Great Pacific Garbage Patch?',
      options: ['An island made of garbage', 'A floating mass of marine debris', 'A polluted beach', 'An ocean trench full of waste'],
      correctAnswer: 1,
      explanation: 'The Great Pacific Garbage Patch is a massive floating accumulation of marine debris, primarily plastic, between Hawaii and California.'
    },
    {
      id: 16,
      categoryId: 3,
      question: 'What causes ocean dead zones?',
      options: ['Too much salt', 'Excessive nutrients causing oxygen depletion', 'Cold temperatures', 'Deep ocean currents'],
      correctAnswer: 1,
      explanation: 'Dead zones are caused by nutrient pollution (especially nitrogen and phosphorus) that triggers algae blooms, which deplete oxygen when they die.'
    },
    {
      id: 17,
      categoryId: 3,
      question: 'Which everyday item is a major source of microplastic pollution?',
      options: ['Glass bottles', 'Synthetic clothing', 'Paper bags', 'Metal cans'],
      correctAnswer: 1,
      explanation: 'Synthetic clothing releases microplastic fibers when washed, contributing significantly to ocean microplastic pollution.'
    },

    // Sustainable Fishing Questions (Category 4)
    {
      id: 18,
      categoryId: 4,
      question: 'What percentage of global fish stocks are overfished?',
      options: ['10%', '20%', '35%', '50%'],
      correctAnswer: 2,
      explanation: 'Approximately 35% of global fish stocks are overfished, threatening marine ecosystems and food security.'
    },
    {
      id: 19,
      categoryId: 4,
      question: 'What is "bycatch"?',
      options: ['Fish caught by hand', 'Non-target species caught accidentally', 'Fish farming', 'Recreational fishing'],
      correctAnswer: 1,
      explanation: 'Bycatch refers to non-target species (like dolphins, turtles, or juvenile fish) caught unintentionally in fishing operations.'
    },
    {
      id: 20,
      categoryId: 4,
      question: 'What does the MSC certification indicate?',
      options: ['Most Sustainable Catch', 'Marine Stewardship Council - sustainable fishing', 'Maximum Safe Consumption', 'Marine Science Center'],
      correctAnswer: 1,
      explanation: 'The Marine Stewardship Council (MSC) certification indicates that seafood comes from well-managed, sustainable fisheries.'
    },
    {
      id: 21,
      categoryId: 4,
      question: 'What fishing method causes the most habitat damage?',
      options: ['Line fishing', 'Net fishing', 'Bottom trawling', 'Spear fishing'],
      correctAnswer: 2,
      explanation: 'Bottom trawling drags heavy nets across the seafloor, destroying habitats like coral reefs and damaging marine ecosystems.'
    },
    {
      id: 22,
      categoryId: 4,
      question: 'What is the purpose of fishing quotas?',
      options: ['Increase profits', 'Prevent overfishing and allow stock recovery', 'Reduce competition', 'Tax collection'],
      correctAnswer: 1,
      explanation: 'Fishing quotas limit catch amounts to prevent overfishing, allowing fish populations to recover and maintain healthy stocks.'
    },

    // Climate Change Questions (Category 5)
    {
      id: 23,
      categoryId: 5,
      question: 'What is ocean acidification?',
      options: ['Pollution making water dirty', 'Increased ocean pH from CO2 absorption', 'Decreased ocean pH from CO2 absorption', 'Salt concentration changes'],
      correctAnswer: 2,
      explanation: 'Ocean acidification is the decrease in ocean pH caused by absorption of atmospheric CO2, making it harder for marine organisms to build shells.'
    },
    {
      id: 24,
      categoryId: 5,
      question: 'How much has global sea level risen since 1880?',
      options: ['5-10 cm', '21-24 cm', '50-60 cm', '1 meter'],
      correctAnswer: 1,
      explanation: 'Global sea levels have risen 21-24 centimeters since 1880, with the rate of rise accelerating in recent decades.'
    },
    {
      id: 25,
      categoryId: 5,
      question: 'What are "blue carbon" ecosystems?',
      options: ['Deep ocean zones', 'Coastal ecosystems that store carbon', 'Arctic ice regions', 'Cold water currents'],
      correctAnswer: 1,
      explanation: 'Blue carbon ecosystems (mangroves, seagrass, salt marshes) store carbon in coastal sediments at rates 10x higher than terrestrial forests.'
    },
    {
      id: 26,
      categoryId: 5,
      question: 'What causes coral bleaching?',
      options: ['Too much sunlight', 'Water temperature stress', 'Lack of food', 'Ocean currents'],
      correctAnswer: 1,
      explanation: 'Coral bleaching occurs when water temperatures rise, causing corals to expel their symbiotic algae and turn white, often leading to death.'
    },
    {
      id: 27,
      categoryId: 5,
      question: 'How much CO2 has the ocean absorbed from human activities?',
      options: ['10%', '20%', '30%', '50%'],
      correctAnswer: 2,
      explanation: 'The ocean has absorbed about 30% of human-produced CO2, helping to slow climate change but causing ocean acidification.'
    }
  ];

  const handleBackPress = (): void => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setShowResult(false);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      console.log('Navigate back');
    }
  };

  const handleCategorySelect = (categoryId: number): void => {
    setSelectedCategory(categoryId);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const getCurrentQuestions = (): Question[] => {
    if (!selectedCategory) return [];
    return questions.filter(q => q.categoryId === selectedCategory);
  };

  const handleAnswerSelect = (optionIndex: number): void => {
    if (hasAnswered) return;

    const currentQuestions = getCurrentQuestions();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;

    setSelectedOption(optionIndex);
    setHasAnswered(true);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
      isCorrect
    };

    setAnswers([...answers, newAnswer]);
  };

  const handleNextQuestion = (): void => {
    const currentQuestions = getCurrentQuestions();
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setShowCompletionModal(true);
    }
  };

  const handleRestartQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setHasAnswered(false);
    setShowCompletionModal(false);
  };

  const getScore = (): { correct: number; total: number; percentage: number } => {
    const correct = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  const currentQuestions = getCurrentQuestions();
  const currentQuestion = selectedCategory ? currentQuestions[currentQuestionIndex] : null;
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.headerContainer}>
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#1f2937" />
          <Text style={styles.backText}>
            {selectedCategory ? 'Back to Categories' : 'Back'}
          </Text>
        </TouchableOpacity>

        {/* Category Selection */}
        {!selectedCategory && (
          <>
            <View style={styles.heroContainer}>
              <Award size={48} color="#3b82f6" />
              <Text style={styles.heroTitle}>Marine Knowledge Quiz</Text>
              <Text style={styles.heroSubtitle}>
                Test your knowledge and learn about marine conservation
              </Text>
            </View>

            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Choose a Category</Text>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategorySelect(category.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <category.icon size={32} color={category.color} />
                  </View>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                    <Text style={styles.questionCount}>
                      {category.questionCount} Questions
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Quiz Questions */}
        {selectedCategory && currentQuestion && (
          <View style={styles.quizContainer}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
                      backgroundColor: selectedCategoryData?.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </Text>
            </View>

            {/* Question Card */}
            <View style={styles.questionCard}>
              <View style={[styles.questionHeader, { backgroundColor: selectedCategoryData?.color + '10' }]}>
                <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
              </View>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = hasAnswered && isCorrect;
                  const showWrong = hasAnswered && isSelected && !isCorrect;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionSelected,
                        showCorrect && styles.optionCorrect,
                        showWrong && styles.optionWrong
                      ]}
                      onPress={() => handleAnswerSelect(index)}
                      disabled={hasAnswered}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        showCorrect && styles.optionTextCorrect,
                        showWrong && styles.optionTextWrong
                      ]}>
                        {option}
                      </Text>
                      {showCorrect && <CheckCircle2 size={24} color="#10b981" />}
                      {showWrong && <XCircle size={24} color="#ef4444" />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Answer Feedback */}
              {hasAnswered && (
                <View style={[
                  styles.feedbackContainer,
                  selectedOption === currentQuestion.correctAnswer 
                    ? styles.feedbackCorrect 
                    : styles.feedbackWrong
                ]}>
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle2 size={28} color="#10b981" />
                      <View style={styles.feedbackContent}>
                        <Text style={styles.feedbackTitle}>Good Job! 🎉</Text>
                        <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <XCircle size={28} color="#ef4444" />
                      <View style={styles.feedbackContent}>
                        <Text style={styles.feedbackTitle}>Not Quite Right</Text>
                        <Text style={styles.feedbackText}>
                          The correct answer is: {currentQuestion.options[currentQuestion.correctAnswer]}
                        </Text>
                        <Text style={styles.feedbackExplanation}>{currentQuestion.explanation}</Text>
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Next Button */}
              {hasAnswered && (
                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: selectedCategoryData?.color }]}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <Footer />
      </Animated.ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Trophy size={64} color="#f59e0b" />
            <Text style={styles.modalTitle}>Quiz Complete! 🎊</Text>
            <Text style={styles.modalScore}>
              You scored {getScore().correct} out of {getScore().total}
            </Text>
            <Text style={styles.modalPercentage}>{getScore().percentage}%</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleRestartQuiz}
              >
                <RefreshCcw size={20} color="white" />
                <Text style={styles.modalButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowCompletionModal(false);
                  setSelectedCategory(null);
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Choose Another Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
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
  heroContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  questionCount: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  quizContainer: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    overflow: 'hidden',
  },
  questionHeader: {
    padding: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    padding: 20,
    paddingTop: 12,
    lineHeight: 26,
  },
  optionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  optionWrong: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  optionTextSelected: {
    color: '#1f2937',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#065f46',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#991b1b',
    fontWeight: '600',
  },
  feedbackContainer: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  feedbackCorrect: {
    backgroundColor: '#d1fae5',
  },
  feedbackWrong: {
    backgroundColor: '#fee2e2',
  },
  feedbackContent: {
    flex: 1,
    marginLeft: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  feedbackExplanation: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 8,
  },
  nextButton: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: width * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  modalScore: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  modalPercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#3b82f6',
    marginTop: 8,
  },
  modalButtons: {
    width: '100%',
    marginTop: 24,
  },
  modalButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalButtonSecondary: {
    backgroundColor: '#f3f4f6',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalButtonTextSecondary: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizPage;