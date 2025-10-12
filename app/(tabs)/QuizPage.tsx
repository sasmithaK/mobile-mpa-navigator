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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ADD THIS
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
  RefreshCcw,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
  correctAnswer: number;
  explanation: string;
}

interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

const QuizPage: React.FC = () => { // Remove props
  const router = useRouter(); // ADD THIS
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const scrollY = new Animated.Value(0);

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

  const questions: Question[] = [
    {
      id: 1,
      categoryId: 1,
      question: 'How many species of marine life are estimated to exist in the ocean?',
      options: ['50,000', '250,000', '1 million', 'Over 2 million'],
      correctAnswer: 3,
      explanation: 'Scientists estimate there are over 2 million marine species, though only about 240,000 have been identified and described.'
    },
    // Add more questions here...
  ];

  // UPDATE THIS FUNCTION
  const handleBackPress = (): void => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      router.push('/(tabs)/EcoComplianceHub'); // CHANGED
    }
  };

  const handleCategorySelect = (categoryId: number): void => {
    setSelectedCategory(categoryId);
    setCurrentQuestionIndex(0);
    setAnswers([]);
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
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a1929', '#1a365d', '#0f172a']} style={styles.gradient} />

      {/* ADD FIXED BACK BUTTON */}
      <TouchableOpacity style={styles.backButtonFixed} onPress={handleBackPress}>
        <View style={styles.backButtonContent}>
          <ArrowLeft size={24} color="#fff" />
          <Text style={styles.backText}>
            {selectedCategory ? 'Back to Categories' : 'Back to Hub'}
          </Text>
        </View>
      </TouchableOpacity>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!selectedCategory && (
          <>
            <LinearGradient
              colors={['rgba(6,191,219,0.2)', 'rgba(34,211,238,0.1)']}
              style={styles.heroContainer}
            >
              <View style={styles.heroGlow} />
              <View style={styles.heroIconContainer}>
                <Award size={48} color="#06bfdb" />
              </View>
              <Text style={styles.heroTitle}>Marine Knowledge Quiz</Text>
              <Text style={styles.heroSubtitle}>
                Test your knowledge and learn about marine conservation
              </Text>
            </LinearGradient>

            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Choose a Category</Text>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategorySelect(category.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                    style={styles.categoryGradient}
                  >
                    <View style={[styles.categoryIcon, { 
                      backgroundColor: category.color + '20',
                      borderColor: category.color + '40'
                    }]}>
                      <category.icon size={32} color={category.color} />
                    </View>
                    <View style={styles.categoryContent}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                      <Text style={styles.questionCount}>
                        {category.questionCount} Questions
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {selectedCategory && currentQuestion && (
          <View style={styles.quizContainer}>
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

            <View style={styles.questionCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                style={styles.questionGradient}
              >
                <View style={[styles.questionHeader, { backgroundColor: selectedCategoryData?.color + '20' }]}>
                  <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
                </View>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>

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
                          (isSelected || showCorrect || showWrong) && styles.optionTextActive
                        ]}>
                          {option}
                        </Text>
                        {showCorrect && <CheckCircle2 size={24} color="#10b981" />}
                        {showWrong && <XCircle size={24} color="#ef4444" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {hasAnswered && (
                  <View style={[
                    styles.feedbackContainer,
                    { backgroundColor: selectedOption === currentQuestion.correctAnswer 
                      ? 'rgba(16,185,129,0.2)' 
                      : 'rgba(239,68,68,0.2)'
                    }
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

                {hasAnswered && (
                  <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: selectedCategoryData?.color }]}
                    onPress={handleNextQuestion}
                  >
                    <LinearGradient
                      colors={[selectedCategoryData?.color || '#06bfdb', '#0891b2']}
                      style={styles.nextButtonGradient}
                    >
                      <Text style={styles.nextButtonText}>
                        {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          </View>
        )}
      </Animated.ScrollView>

      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['rgba(6,191,219,0.2)', 'rgba(34,211,238,0.1)']}
            style={styles.modalContent}
          >
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
                <LinearGradient
                  colors={['#06bfdb', '#0891b2']}
                  style={styles.modalButtonGradient}
                >
                  <RefreshCcw size={20} color="white" />
                  <Text style={styles.modalButtonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => {
                  setShowCompletionModal(false);
                  setSelectedCategory(null);
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Choose Another Category</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
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
  // ADD THESE STYLES
  backButtonFixed: {
    position: 'absolute',
    top: StatusBar.currentHeight || 40,
    left: 16,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // CHANGED from 60 to 100
    paddingBottom: 40,
  },
  heroContainer: {
    margin: 16,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6,191,219,0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(6,191,219,0.1)',
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(6,191,219,0.2)',
    borderWidth: 2,
    borderColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    textAlign: 'center',
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  categoryCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  questionCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  questionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  questionGradient: {
    padding: 0,
  },
  questionHeader: {
    padding: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionSelected: {
    borderColor: '#06bfdb',
    backgroundColor: 'rgba(6,191,219,0.1)',
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16,185,129,0.1)',
  },
  optionWrong: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  optionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  feedbackContainer: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  feedbackContent: {
    flex: 1,
    marginLeft: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 4,
  },
  feedbackExplanation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
    marginTop: 8,
  },
  nextButton: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 24,
    padding: 32,
    width: width * 0.85,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6,191,219,0.3)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  modalScore: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
    textAlign: 'center',
  },
  modalPercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#06bfdb',
    marginTop: 8,
  },
  modalButtons: {
    width: '100%',
    marginTop: 24,
  },
  modalButton: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalButtonTextSecondary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizPage;