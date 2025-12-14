// ===== LANDING PAGE FUNCTIONALITY =====
class LandingPage {
    constructor() {
        this.landingContainer = document.getElementById('landing-page');
        this.mainExperience = document.getElementById('main-experience');
        this.diveBtn = document.getElementById('dive-btn');
        this.video = document.getElementById('ocean-video');

        this.init();
    }

    init() {
        this.setupVideoFallback();
        this.setupDiveButton();
        this.setupScrollIndicator();
        this.setupScrollListener();
        this.animateBubbles();
    }

    setupVideoFallback() {
        // Handle video loading errors
        if (this.video) {
            this.video.addEventListener('error', () => {
                console.log('Video failed to load, using fallback');
                this.video.style.display = 'none';
            });

            // Resume video on user interaction (required by browsers)
            document.addEventListener('click', () => {
                if (this.video && this.video.paused) {
                    this.video.play().catch(() => {
                        // Silently handle autoplay failure
                    });
                }
            }, { once: true });
        }
    }

    setupDiveButton() {
        this.diveBtn.addEventListener('click', () => {
            this.transitionToMainExperience();
        });
    }

    setupScrollIndicator() {
        // Keep scroll indicator visible since it's now clickable
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
        }
    }

    setupScrollListener() {
        console.log('Setting up scroll indicator click listener...');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                console.log('Scroll indicator clicked, transitioning to main experience...');
                this.transitionToMainExperience();
            });

            // Add cursor pointer to indicate it's clickable
            scrollIndicator.style.cursor = 'pointer';

            console.log('Scroll indicator click listener added');
        } else {
            console.error('Scroll indicator element not found!');
        }
    }

    animateBubbles() {
        // Add subtle animation to bubbles
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach((bubble, index) => {
            bubble.style.animationDelay = `${index * 0.5}s`;
        });
    }

    transitionToMainExperience() {
        // Add transition class
        this.landingContainer.classList.add('hidden');

        // Show main experience after transition
        setTimeout(() => {
            this.landingContainer.style.display = 'none';
            this.mainExperience.classList.remove('hidden');
            this.mainExperience.classList.add('active');

            // Initialize main experience
            oceanExplorer.init();
        }, 2000);
    }
}

// ===== OCEAN EXPLORER MAIN APPLICATION =====
class OceanExplorer {
    constructor() {
        this.sections = ["intro", "overview", "gallery", "zones", "deepsea", "quiz", "about"];
        this.currentSectionIndex = 0;
        this.audioSystem = new AudioSystem();
        this.quizSystem = new QuizSystem();
        this.deepSeaSystem = new DeepSeaSystem();
        this.zoneSystem = new ZoneSystem();

        // DOM elements
        this.navDots = document.querySelectorAll('.nav-dot');
        this.enterBtn = document.getElementById('enter-btn');
        this.audioToggle = document.getElementById('audio-toggle');
    }

    init() {
        this.setupNavigation();
        this.setupAudioToggle();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.quizSystem.init();
        this.deepSeaSystem.init();
        this.zoneSystem.init();
        this.updateNavigation();
    }

    setupNavigation() {
        // Enter button
        this.enterBtn.addEventListener('click', () => {
            this.showSection("overview");
            this.currentSectionIndex = 1;
            this.updateNavigation();
        });

  // Nav dot clicks
        this.navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
                this.navigateToSection(this.sections[index]);
    });
  });
    }

    setupAudioToggle() {
        if (this.audioToggle) {
            this.audioToggle.addEventListener('click', () => {
                if (this.audioSystem.masterVolume > 0) {
                    this.audioSystem.masterVolume = 0;
                    this.audioToggle.textContent = '🔇';
                    this.audioToggle.classList.add('muted');
                    this.audioToggle.title = 'Audio Off';
                } else {
                    this.audioSystem.masterVolume = 0.2;
                    this.audioToggle.textContent = '🔊';
                    this.audioToggle.classList.remove('muted');
                    this.audioToggle.title = 'Audio On';
                }
            });
        }
    }

    setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
                if (this.currentSectionIndex < this.sections.length - 1) {
                    this.currentSectionIndex++;
                    this.showSection(this.sections[this.currentSectionIndex]);
                    this.updateNavigation();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
                if (this.currentSectionIndex > 0) {
                    this.currentSectionIndex--;
                    this.showSection(this.sections[this.currentSectionIndex]);
                    this.updateNavigation();
      }
    }
  });
    }

    setupTouchNavigation() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
  });

        this.handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - go to previous section
                        if (this.currentSectionIndex > 0) {
                            this.currentSectionIndex--;
                            this.showSection(this.sections[this.currentSectionIndex]);
                            this.updateNavigation();
          }
        } else {
          // Swipe left - go to next section
                        if (this.currentSectionIndex < this.sections.length - 1) {
                            this.currentSectionIndex++;
                            this.showSection(this.sections[this.currentSectionIndex]);
                            this.updateNavigation();
                        }
                    }
                }
            }
        };
    }

    showSection(id, direction = 'next') {
        // Hide all sections first
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (sectionId !== 'intro') {
                section.classList.add("hidden");
                section.style.opacity = 0;
            }
        });

        // Show the target section with animation
        const targetSection = document.getElementById(id);
        targetSection.classList.remove("hidden");

        setTimeout(() => {
            targetSection.style.opacity = 1;
            targetSection.style.transform = 'translateY(0)';
        }, 100);

        // Play transition sound
        this.audioSystem.playTransitionSound();
    }

    updateNavigation() {
        // Update nav dots
        this.navDots.forEach((dot, index) => {
            if (index === this.currentSectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    navigateToSection(sectionName) {
        const sectionIndex = this.sections.indexOf(sectionName);
        if (sectionIndex !== -1) {
            this.currentSectionIndex = sectionIndex;
            this.showSection(sectionName);
            this.updateNavigation();
        }
    }
}

// ===== AUDIO SYSTEM =====

// ===== AUDIO SYSTEM =====
class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.isEnabled = false;
    this.masterVolume = 0.2;
    this.init();
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isEnabled = true;
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  createOscillator(frequency, type = 'sine', duration = 0.5) {
    if (!this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playBubbleSound() {
    this.createOscillator(600 + Math.random() * 600, 'sine', 0.15);
  }

  playCreatureSound() {
    const freq = 300 + Math.random() * 200;
    this.createOscillator(freq, 'triangle', 0.4);
  }

  playTransitionSound() {
    this.createOscillator(200, 'sine', 0.8);
    setTimeout(() => this.createOscillator(300, 'sine', 0.6), 150);
  }

  playDeepSeaSound() {
    this.createOscillator(80 + Math.random() * 40, 'sawtooth', 1.5);
  }
}

// ===== QUIZ SYSTEM =====
class QuizSystem {
    constructor() {
        this.questions = [
  {
    question: "Which marine mammal is critically endangered with fewer than 10 individuals remaining?",
    answers: ["Blue Whale", "Vaquita", "Great White Shark", "Giant Pacific Octopus"],
    correct: 1,
    explanation: "The vaquita is the world's most endangered marine mammal, with only about 10 individuals left due to gillnet fishing."
  },
  {
    question: "Which creature can change color in less than 1 second?",
    answers: ["Great White Shark", "Giant Pacific Octopus", "Blue Whale", "Hawksbill Sea Turtle"],
    correct: 1,
    explanation: "The giant Pacific octopus can change color instantly to camouflage itself from predators and prey."
  },
  {
    question: "What is the largest animal ever known to exist?",
    answers: ["Giant Squid", "Great White Shark", "Blue Whale", "Giant Pacific Octopus"],
    correct: 2,
    explanation: "The blue whale is the largest animal ever known to exist, weighing up to 190 tons and measuring up to 30 meters."
  },
  {
    question: "Which sea turtle species is critically endangered due to illegal trade in its shell?",
    answers: ["All sea turtles", "Hawksbill Sea Turtle", "Green Sea Turtle", "Loggerhead Sea Turtle"],
    correct: 1,
    explanation: "Hawksbill sea turtles are critically endangered because their beautiful shell (bekko) is highly valued in jewelry making."
  },
  {
    question: "Which creature has eyes that are the largest in the animal kingdom?",
    answers: ["Great White Shark", "Giant Squid", "Blue Whale", "Vaquita"],
    correct: 1,
    explanation: "Giant squids have eyes up to 25cm in diameter - the largest eyes of any animal, adapted for detecting bioluminescent prey in the deep ocean."
  },
  {
    question: "Which ocean zone is known as the 'midnight zone' with no sunlight?",
    answers: ["Epipelagic", "Mesopelagic", "Bathypelagic", "Abyssopelagic"],
    correct: 2,
    explanation: "The bathypelagic zone (1,000-4,000m) is called the midnight zone because no sunlight penetrates this deep."
  },
  {
    question: "How many hearts does an octopus have?",
    answers: ["1", "2", "3", "4"],
    correct: 2,
    explanation: "Octopuses have three hearts - two pump blood through the gills, and one pumps blood through the rest of the body."
  },
  {
    question: "Which creature can detect blood in water from 5km away?",
    answers: ["Giant Squid", "Great White Shark", "Blue Whale", "Vaquita"],
    correct: 1,
    explanation: "Great white sharks have an incredible sense of smell and can detect a single drop of blood in 25 gallons of water from up to 5km away."
  },
  {
    question: "What zone of the ocean do most familiar sea creatures live in?",
    answers: ["Abyssopelagic", "Bathypelagic", "Mesopelagic", "Epipelagic"],
    correct: 3,
    explanation: "The epipelagic zone (0-200m) is where most familiar sea creatures live, as it receives enough sunlight for photosynthesis and marine life."
  },
  {
    question: "Which marine mammal can dive deeper than 1,000 meters?",
    answers: ["Vaquita", "Blue Whale", "Great White Shark", "Hawksbill Sea Turtle"],
    correct: 1,
    explanation: "Blue whales can dive to depths of over 500 meters, and some individuals have been recorded diving as deep as 1,000+ meters."
  }
];

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizActive = false;
    }

    init() {
        const startQuizBtn = document.getElementById('start-quiz');
        const nextQuestionBtn = document.getElementById('next-question');
        const restartQuizBtn = document.getElementById('restart-quiz');

        startQuizBtn.addEventListener('click', () => this.startQuiz());
        nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        restartQuizBtn.addEventListener('click', () => this.restartQuiz());

  // Audio context resume on first interaction
  document.addEventListener('click', () => {
            if (oceanExplorer.audioSystem.audioContext && oceanExplorer.audioSystem.audioContext.state === 'suspended') {
                oceanExplorer.audioSystem.audioContext.resume();
            }
        });
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizActive = true;
        this.showQuestion();

  const startQuizBtn = document.getElementById('start-quiz');
  const quizScore = document.getElementById('quiz-score');
    startQuizBtn.style.display = 'none';
    quizScore.style.display = 'none';
  }

    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const questionText = document.getElementById('question-text');
        const quizAnswers = document.getElementById('quiz-answers');

    questionText.textContent = question.question;

    quizAnswers.innerHTML = '';
    question.answers.forEach((answer, index) => {
      const answerDiv = document.createElement('div');
      answerDiv.className = 'quiz-answer';
      answerDiv.textContent = answer;
      answerDiv.dataset.index = index;
            answerDiv.addEventListener('click', (e) => this.selectAnswer(e));
      quizAnswers.appendChild(answerDiv);
    });

        const nextQuestionBtn = document.getElementById('next-question');
    nextQuestionBtn.style.display = 'none';
  }

    selectAnswer(e) {
        if (!this.quizActive) return;

    const selectedIndex = parseInt(e.target.dataset.index);
        const question = this.questions[this.currentQuestionIndex];
    const answers = document.querySelectorAll('.quiz-answer');

        this.quizActive = false;

    // Show correct/incorrect
    answers.forEach((answer, index) => {
      if (index === question.correct) {
        answer.classList.add('correct');
      } else if (index === selectedIndex && index !== question.correct) {
        answer.classList.add('incorrect');
      }
    });

    if (selectedIndex === question.correct) {
            this.score++;
    }

    // Show explanation
    setTimeout(() => {
            const questionText = document.getElementById('question-text');
            const nextQuestionBtn = document.getElementById('next-question');
      questionText.innerHTML = `<strong>Answer:</strong> ${question.answers[question.correct]}<br><br><em>${question.explanation}</em>`;
      nextQuestionBtn.style.display = 'inline-block';
    }, 1500);
  }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion();
            this.quizActive = true;
    } else {
            this.showQuizResults();
        }
    }

    showQuizResults() {
        const quizQuestion = document.getElementById('quiz-question');
        const quizAnswers = document.getElementById('quiz-answers');
        const nextQuestionBtn = document.getElementById('next-question');
        const quizScore = document.getElementById('quiz-score');
        const restartQuizBtn = document.getElementById('restart-quiz');
        const scoreValue = document.getElementById('score-value');
        const scoreFeedback = document.getElementById('score-feedback');

    quizQuestion.style.display = 'none';
    quizAnswers.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    quizScore.style.display = 'block';
    restartQuizBtn.style.display = 'inline-block';

        scoreValue.textContent = `${this.score}/${this.questions.length}`;

    let feedback = '';
        if (this.score >= 9) {
      feedback = '🏆 Excellent! You\'re a marine life expert!';
        } else if (this.score >= 7) {
      feedback = '🌊 Great job! You know your sea creatures well!';
        } else if (this.score >= 5) {
      feedback = '🐠 Good effort! Keep learning about ocean life!';
    } else {
      feedback = '🐟 Keep exploring! There\'s so much more to learn about marine life!';
    }
    scoreFeedback.textContent = feedback;
  }

    restartQuiz() {
        const quizQuestion = document.getElementById('quiz-question');
        const quizAnswers = document.getElementById('quiz-answers');
        const quizScore = document.getElementById('quiz-score');
        const restartQuizBtn = document.getElementById('restart-quiz');
        const startQuizBtn = document.getElementById('start-quiz');

    quizQuestion.style.display = 'block';
    quizAnswers.style.display = 'grid';
    quizScore.style.display = 'none';
    restartQuizBtn.style.display = 'none';
    startQuizBtn.style.display = 'inline-block';
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizActive = false;
    }
}

// ===== DEEP SEA SYSTEM =====
class DeepSeaSystem {
    constructor() {
        this.deepSeaActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.clickWaves = [];
        this.depthLevel = 0;
        this.particles = [];
        this.svg = null;
    }

    init() {
        const deepSeaSection = document.getElementById('deepsea');
        if (deepSeaSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.deepSeaActive = entry.isIntersecting;
                });
            });
            observer.observe(deepSeaSection);

            // Initialize D3 visualization
            this.initDeepSea();
        }
    }

    initDeepSea() {
        this.svg = d3.select("#deepCanvas");
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.svg.attr("width", width).attr("height", height);

        // Different particle types
        const particleTypes = {
            bubbles: {
                count: 30,
                size: [2, 8],
                speed: [-0.3, -0.8],
                colors: ["#00ffff", "#1e90ff", "#87ceeb"],
                opacity: [0.4, 0.8]
            },
            bioluminescent: {
                count: 15,
                size: [1, 4],
                speed: [-0.1, -0.3],
                colors: ["#00ff00", "#ffff00", "#ff00ff", "#00ffff"],
                opacity: [0.6, 1],
                glow: true
            },
            debris: {
                count: 20,
                size: [1, 3],
                speed: [-0.2, -0.5],
                colors: ["#8b4513", "#654321", "#2f1b14"],
                opacity: [0.3, 0.6]
            }
        };

        // Create particles
        Object.keys(particleTypes).forEach(type => {
            const config = particleTypes[type];
            for (let i = 0; i < config.count; i++) {
                const particle = {
                    type: type,
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * (config.size[1] - config.size[0]) + config.size[0],
                    color: config.colors[Math.floor(Math.random() * config.colors.length)],
                    vy: Math.random() * (config.speed[1] - config.speed[0]) + config.speed[0],
                    vx: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * (config.opacity[1] - config.opacity[0]) + config.opacity[0],
                    glow: config.glow || false,
                    phase: Math.random() * Math.PI * 2
                };
                this.particles.push(particle);
            }
        });

        // Add glow filter
        const defs = this.svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Mouse tracking
        const deepSeaSection = document.getElementById('deepsea');
        deepSeaSection.addEventListener('mousemove', (e) => {
            const rect = deepSeaSection.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        deepSeaSection.addEventListener('click', (e) => {
            const rect = deepSeaSection.getBoundingClientRect();
            this.clickWaves.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                age: 0
            });
            if (oceanExplorer.audioSystem.masterVolume > 0) {
                oceanExplorer.audioSystem.playBubbleSound();
            }
        });

        // Start animation
        d3.timer(() => this.update());
    }

    update() {
        if (!this.deepSeaActive) return;

        const currentTime = Date.now();
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update particles
        this.particles.forEach(p => {
            // Basic movement
            p.y += p.vy;
            p.x += p.vx;

            // Mouse attraction for bioluminescent particles
            if (p.type === 'bioluminescent') {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    p.x += dx * 0.01;
                    p.y += dy * 0.01;
                }
            }

            // Sine wave motion for bubbles
            if (p.type === 'bubbles') {
                p.x += Math.sin(p.phase + currentTime * 0.001) * 0.5;
            }

            // Reset particles that go off screen
            if (p.y < -20) {
                p.y = height + 20;
                p.x = Math.random() * width;
            }
            if (p.x < -20 || p.x > width + 20) {
                p.x = Math.random() * width;
            }

            // Animate bioluminescent glow
            if (p.glow) {
                p.opacity = 0.6 + Math.sin(currentTime * 0.003 + p.phase) * 0.4;
            }
        });

        // Update click waves
        this.clickWaves = this.clickWaves.filter(wave => {
            wave.age++;
            wave.radius += 2;
            return wave.age < 100;
        });

        // Update depth
        this.depthLevel = Math.sin(currentTime * 0.0005) * 500 + 1000;
        const depthElement = document.getElementById('current-depth');
        if (depthElement) {
            depthElement.textContent = Math.round(Math.abs(this.depthLevel));
        }

        this.draw();
    }

    draw() {
        const circles = this.svg.selectAll("circle.particle").data(this.particles);

        circles.enter()
            .append("circle")
            .attr("class", "particle")
            .merge(circles)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", d => d.color)
            .attr("opacity", d => d.opacity)
            .attr("filter", d => d.glow ? "url(#glow)" : "none");

        circles.exit().remove();

        // Draw click waves
        const waves = this.svg.selectAll(".wave").data(this.clickWaves);

        waves.enter()
            .append("circle")
            .attr("class", "wave")
            .merge(waves)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.radius)
            .attr("fill", "none")
            .attr("stroke", "#00ffff")
            .attr("stroke-width", 2)
            .attr("opacity", d => Math.max(0, 1 - d.age / 100));

        waves.exit().remove();
    }
}

// ===== ZONE SYSTEM =====
class ZoneSystem {
    constructor() {
        this.zoneData = {
            epipelagic: {
                name: "Epipelagic Zone (Sunlit Zone)",
                depth: "0-200 meters",
                description: "The uppermost layer of the ocean where sunlight penetrates. This zone supports the highest concentration of marine life and is home to most familiar sea creatures. It receives enough sunlight for photosynthesis.",
                characteristics: "Warm water, high oxygen, abundant light, diverse marine life",
                creatures: ["Great White Shark", "Hawksbill Sea Turtle", "Giant Pacific Octopus", "Vaquita"]
            },
            mesopelagic: {
                name: "Mesopelagic Zone (Twilight Zone)",
                depth: "200-1,000 meters",
                description: "The 'twilight zone' where only faint light penetrates. This mysterious realm is home to many bioluminescent creatures and giant deep-sea dwellers. Pressure increases significantly here.",
                characteristics: "Dim light, increasing pressure, bioluminescent organisms, lower temperatures",
                creatures: ["Giant Squid", "Blue Whale"]
            },
            bathypelagic: {
                name: "Bathypelagic Zone (Midnight Zone)",
                depth: "1,000-4,000 meters",
                description: "The 'midnight zone' where no sunlight reaches. Creatures here have adapted to extreme pressure, darkness, and cold temperatures. Many species are bioluminescent or have developed unique hunting strategies.",
                characteristics: "Complete darkness, extreme pressure (up to 400 atm), near freezing temperatures",
                creatures: []
            },
            abyssopelagic: {
                name: "Abyssopelagic Zone (Abyssal Zone)",
                depth: "4,000-6,000 meters",
                description: "The deep ocean floor where only the hardiest creatures survive. This zone covers most of the ocean floor and experiences extreme pressure and cold. Life here is scarce but fascinating.",
                characteristics: "Extreme pressure (600+ atm), near freezing water, complete darkness, sparse food availability",
                creatures: []
            }
        };
    }

    init() {
        const zones = document.querySelectorAll('.zone');
        const zoneDescription = document.getElementById('zone-description');

        zones.forEach(zone => {
            zone.addEventListener('click', () => {
                // Remove active class from all zones
                zones.forEach(z => z.classList.remove('active'));

                // Add active class to clicked zone
                zone.classList.add('active');

                // Update zone information
                const zoneName = zone.dataset.zone;
                const data = this.zoneData[zoneName];

                if (data && zoneDescription) {
                    zoneDescription.innerHTML = `
                        <strong>${data.name}</strong><br>
                        <em>Depth: ${data.depth}</em><br><br>
                        ${data.description}<br><br>
                        <strong>Characteristics:</strong> ${data.characteristics}<br><br>
                        <strong>Marine Life:</strong> ${data.creatures.length > 0 ? data.creatures.join(', ') : 'Limited due to extreme conditions'}
                    `;
                }
            });

            // Zone creature click handlers
            const zoneCreatures = zone.querySelectorAll('.zone-creature');
            zoneCreatures.forEach(creature => {
                creature.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent zone click
                    const creatureName = creature.dataset.creature;
                    // Find and click the corresponding creature in gallery
                    const galleryCreatures = document.querySelectorAll('.creature');
                    galleryCreatures.forEach(galleryCreature => {
                        if (galleryCreature.dataset.name === creatureName) {
                            // Navigate to gallery section
                            oceanExplorer.navigateToSection('gallery');
                        }
                    });
                });
            });
        });
    }
}

// ===== INITIALIZE APPLICATION =====
const landingPage = new LandingPage();
const oceanExplorer = new OceanExplorer();
window.oceanExplorer = oceanExplorer; // Make it globally accessible

// Start with landing page
document.addEventListener('DOMContentLoaded', () => {
    // Landing page is already initialized in the constructor
    console.log('Ocean Explorer initialized');
    
    // Initialize ocean explorer
    if (oceanExplorer) {
        oceanExplorer.init();
    }
    
    // DOM is ready
    setTimeout(() => {
        // Debug: Check if creatures are found
        const creatures = document.querySelectorAll('.creature-item');
        console.log('Found creature-items:', creatures.length);
            creatures.forEach(c => {
                console.log('Creature:', c.dataset.name);
            });
        }
    }, 500);
});