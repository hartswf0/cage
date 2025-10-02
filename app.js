// Audio Context for sound generation
let audioContext;
let isPlaying = false;
let currentOscillator = null;

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePhoneticLab();
    initializeColorExperiment();
    initializeLoomDiagram();
    initializeCanvasAnimations();
    initializeScrollAnimations();
});

// Smooth scrolling navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Phonetic Lab Audio Generation
function initializePhoneticLab() {
    const audioBtns = document.querySelectorAll('.audio-btn');
    const frequencyCanvas = document.getElementById('frequencyCanvas');
    const ctx = frequencyCanvas.getContext('2d');
    
    audioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudioContext();
            const frequency = parseInt(btn.dataset.frequency);
            const size = btn.dataset.size;
            
            playTone(frequency, btn);
            visualizeFrequency(frequency, ctx);
            animateSizeIndicator(btn, size);
        });
    });
}

function playTone(frequency, button) {
    // Stop any currently playing sound
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }
    
    // Create new oscillator
    currentOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator
    currentOscillator.type = 'sine';
    currentOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Configure gain (volume)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    
    // Connect nodes
    currentOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and stop
    currentOscillator.start();
    currentOscillator.stop(audioContext.currentTime + 1);
    
    // Add visual feedback
    button.classList.add('playing');
    setTimeout(() => {
        button.classList.remove('playing');
        currentOscillator = null;
    }, 1000);
}

function visualizeFrequency(frequency, ctx) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();
    ctx.fillRect(0, 0, width, height);
    
    // Draw frequency bar
    const maxFreq = 1200;
    const barHeight = (frequency / maxFreq) * height;
    const barWidth = 40;
    const x = (width - barWidth) / 2;
    const y = height - barHeight;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#1FB8CD');
    gradient.addColorStop(1, '#FFC185');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Add frequency label
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim();
    ctx.font = '14px var(--font-family-base)';
    ctx.textAlign = 'center';
    ctx.fillText(`${frequency} Hz`, width / 2, height - 10);
    
    // Add waveform visualization
    ctx.strokeStyle = '#1FB8CD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
        const angle = (x / width) * frequency * 0.05;
        const y = height / 2 + Math.sin(angle) * 30;
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

function animateSizeIndicator(button, size) {
    const indicator = button.querySelector('.size-indicator');
    indicator.style.transform = 'scale(1.5)';
    
    setTimeout(() => {
        indicator.style.transform = 'scale(1)';
    }, 300);
}

// Color Experiment Functions
function initializeColorExperiment() {
    const languageSelect = document.getElementById('languageSelect');
    const boundaryMarker = document.getElementById('boundaryMarker');
    const interactiveGradient = document.getElementById('interactiveGradient');
    const userResult = document.getElementById('userResult');
    
    languageSelect.addEventListener('change', (e) => {
        const language = e.target.value;
        updateColorBoundary(language, boundaryMarker);
    });
    
    interactiveGradient.addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        
        displayUserColorResult(percentage, userResult);
    });
}

function updateColorBoundary(language, marker) {
    if (language === 'english') {
        // English speakers show systematic bias around 60% mark
        marker.style.left = '60%';
        marker.style.background = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim();
        marker.style.width = '3px';
    } else {
        // Tarahumara speakers show random distribution
        marker.style.left = '50%';
        marker.style.background = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim();
        marker.style.width = '1px';
    }
}

function displayUserColorResult(percentage, resultDiv) {
    const isEnglishLike = percentage > 55 && percentage < 65;
    
    resultDiv.innerHTML = `
        <strong>Your boundary: ${Math.round(percentage)}%</strong><br>
        ${isEnglishLike 
            ? 'Your perception aligns with typical English speakers - you show the blue-green boundary effect!'
            : 'Your perception is more like Tarahumara speakers - less influenced by linguistic boundaries.'
        }
    `;
    
    // Add visual marker
    const gradient = document.getElementById('interactiveGradient');
    const existingMarkers = gradient.querySelectorAll('.user-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    const marker = document.createElement('div');
    marker.className = 'user-marker';
    marker.style.position = 'absolute';
    marker.style.left = `${percentage}%`;
    marker.style.top = '0';
    marker.style.bottom = '0';
    marker.style.width = '2px';
    marker.style.background = '#ff0000';
    marker.style.transform = 'translateX(-50%)';
    
    gradient.style.position = 'relative';
    gradient.appendChild(marker);
}

// Loom Diagram Interactions
function initializeLoomDiagram() {
    const loomComponents = document.querySelectorAll('.loom-component');
    const infoPanel = document.getElementById('loomInfoPanel');
    const infoPanelTitle = document.getElementById('infoPanelTitle');
    const infoPanelContent = document.getElementById('infoPanelContent');
    
    const componentInfo = {
        phonemic: {
            title: 'Phonemic Threaders',
            content: 'These components categorize continuous sound waves into discrete phonemic units specific to your language. They can make you "hear" sounds that aren\'t there and ignore sounds that are present, as Sapir discovered.'
        },
        lexical: {
            title: 'Lexical Threaders',
            content: 'These filters highlight and separate specific distinctions from the sensory flux based on your vocabulary. For example, having separate words for "blue" and "green" creates a perceptual boundary in the continuous color spectrum.'
        },
        grammatical: {
            title: 'Grammatical Weavers',
            content: 'These structural guides arrange selected sensory threads into meaningful patterns. Languages with subjunctive mood make counterfactual thinking easier and more frequent than languages without this grammatical structure.'
        },
        oral: {
            title: 'Oral Resonance Chamber',
            content: 'This special component processes sounds that bypass semantic meaning to create direct cultural and social functions. Trobriand magic formulas work through this chamber, creating community bonds regardless of literal meaning.'
        }
    };
    
    loomComponents.forEach(component => {
        component.addEventListener('click', () => {
            const infoType = component.dataset.info;
            const info = componentInfo[infoType];
            
            if (info) {
                infoPanelTitle.textContent = info.title;
                infoPanelContent.textContent = info.content;
                
                // Highlight selected component
                loomComponents.forEach(c => c.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-card-border').trim());
                component.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
            }
        });
    });
}

// Canvas Animations
function initializeCanvasAnimations() {
    animateFluxWaves();
    animateFabricPattern();
}

function animateFluxWaves() {
    const canvas = document.getElementById('fluxCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let time = 0;
    
    function drawWaves() {
        // Clear canvas
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();
        ctx.fillRect(0, 0, width, height);
        
        // Draw multiple wave layers
        const waves = [
            { amplitude: 20, frequency: 0.02, phase: 0, color: '#1FB8CD' },
            { amplitude: 15, frequency: 0.03, phase: Math.PI/4, color: '#FFC185' },
            { amplitude: 25, frequency: 0.015, phase: Math.PI/2, color: '#B4413C' }
        ];
        
        waves.forEach(wave => {
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            
            for (let x = 0; x < width; x++) {
                const y = height/2 + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
        time += 0.05;
        requestAnimationFrame(drawWaves);
    }
    
    drawWaves();
}

function animateFabricPattern() {
    const canvas = document.getElementById('fabricCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let time = 0;
    
    function drawFabric() {
        // Clear canvas
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();
        ctx.fillRect(0, 0, width, height);
        
        // Draw woven pattern
        const gridSize = 20;
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'];
        
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                const colorIndex = Math.floor((x + y + time * 10) / gridSize) % colors.length;
                const alpha = 0.3 + 0.3 * Math.sin(time + x * 0.01 + y * 0.01);
                
                ctx.fillStyle = colors[colorIndex];
                ctx.globalAlpha = alpha;
                ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
            }
        }
        
        ctx.globalAlpha = 1;
        
        // Add thread-like lines
        ctx.strokeStyle = '#1FB8CD';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        for (let i = 0; i < 10; i++) {
            const y = (height / 10) * i + Math.sin(time + i) * 5;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        time += 0.02;
        requestAnimationFrame(drawFabric);
    }
    
    drawFabric();
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special animations for specific elements
                if (entry.target.classList.contains('morphism-card')) {
                    animateMorphismCard(entry.target);
                }
                
                if (entry.target.classList.contains('law-card')) {
                    animateLawCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe cards and components
    const animatedElements = document.querySelectorAll('.morphism-card, .law-card, .result-item, .spell-component, .flow-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

function animateMorphismCard(card) {
    const arrow = card.querySelector('.morph-arrow');
    if (arrow) {
        arrow.style.animation = 'pulse-glow 2s ease-in-out infinite';
    }
}

function animateLawCard(card) {
    const number = card.querySelector('.law-number');
    if (number) {
        number.style.animation = 'number-glow 3s ease-in-out infinite';
    }
}

// Add CSS animations via JavaScript
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-glow {
            0%, 100% {
                text-shadow: 0 0 5px var(--color-primary);
                transform: scale(1);
            }
            50% {
                text-shadow: 0 0 20px var(--color-primary);
                transform: scale(1.1);
            }
        }
        
        @keyframes number-glow {
            0%, 100% {
                opacity: 0.3;
                transform: scale(1);
            }
            50% {
                opacity: 0.6;
                transform: scale(1.05);
            }
        }
        
        .interactive-gradient {
            position: relative;
        }
        
        .user-marker {
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .playing {
            animation: button-pulse 1s ease-in-out;
        }
        
        @keyframes button-pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(31, 184, 205, 0.7);
            }
            50% {
                box-shadow: 0 0 0 10px rgba(31, 184, 205, 0);
            }
        }
        
        .loom-component.active {
            transform: scale(1.02);
            box-shadow: var(--shadow-lg);
        }
    `;
    document.head.appendChild(style);
}

// Vowel size association demonstration
function demonstratePhoneticSymbolism() {
    const vowelSymbols = document.querySelectorAll('.vowel-symbol');
    
    vowelSymbols.forEach(symbol => {
        const parent = symbol.closest('.audio-btn');
        const size = parent.dataset.size;
        
        // Add hover effects that show size relationship
        parent.addEventListener('mouseenter', () => {
            symbol.style.fontSize = getSizeBasedFontSize(size);
            symbol.style.transition = 'font-size 0.3s ease';
        });
        
        parent.addEventListener('mouseleave', () => {
            symbol.style.fontSize = 'var(--font-size-3xl)';
        });
    });
}

function getSizeBasedFontSize(size) {
    const sizeMap = {
        'small': 'var(--font-size-2xl)',
        'medium-small': 'var(--font-size-3xl)', 
        'medium-large': 'var(--font-size-4xl)',
        'large': '3rem'
    };
    
    return sizeMap[size] || 'var(--font-size-3xl)';
}

// Interactive color boundary demonstration
function enhanceColorExperiment() {
    const colorGradient = document.getElementById('colorGradient');
    
    if (colorGradient) {
        colorGradient.addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            
            // Update cursor to show current position
            e.target.style.cursor = `crosshair`;
            e.target.title = `${Math.round(percentage)}% - Click to test boundary perception`;
        });
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addDynamicStyles();
    demonstratePhoneticSymbolism();
    enhanceColorExperiment();
    
    // Add click handlers for scroll-to-top functionality
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Handle audio context for mobile devices
function handleMobileAudio() {
    document.addEventListener('touchstart', initAudioContext, { once: true });
    document.addEventListener('click', initAudioContext, { once: true });
}

// Initialize mobile support
handleMobileAudio();

// Error handling for audio
window.addEventListener('error', (e) => {
    console.warn('Audio error detected, falling back to visual feedback only:', e.error);
});

// Performance optimization: throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttled scroll handler for navbar transparency
const throttledScrollHandler = throttle(() => {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(19, 52, 59, 0.98)';
    } else {
        nav.style.background = 'rgba(19, 52, 59, 0.95)';
    }
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Allow space bar to activate audio buttons
    if (e.code === 'Space' && e.target.classList.contains('audio-btn')) {
        e.preventDefault();
        e.target.click();
    }
    
    // Allow Enter key to activate loom components
    if (e.code === 'Enter' && e.target.classList.contains('loom-component')) {
        e.preventDefault();
        e.target.click();
    }
});

// Add focus indicators for better keyboard navigation
const focusableElements = document.querySelectorAll('.audio-btn, .loom-component, .nav-links a');
focusableElements.forEach(el => {
    el.addEventListener('focus', () => {
        el.style.outline = '2px solid var(--color-primary)';
        el.style.outlineOffset = '2px';
    });
    
    el.addEventListener('blur', () => {
        el.style.outline = 'none';
    });
});

// Prefers reduced motion handling
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable auto-playing animations
    const style = document.createElement('style');
    style.textContent = `
        .wave, .rotating-spool, .component-visual.oral::after {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
}

console.log('🎵 Auditory-Linguistic Perceptual Loom initialized successfully!');