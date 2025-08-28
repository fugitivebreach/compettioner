// Global variables
let testWords = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let startTime = null;
let endTime = null;
let testMode = 'words';
let testDuration = 1;
let wordCount = 25;
let timerInterval = null;
let testActive = false;
let errors = 0;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
let wordsCompleted = 0;

// CPS Test variables
let cpsActive = false;
let cpsStartTime = null;
let cpsEndTime = null;
let cpsClicks = 0;
let cpsDuration = 5;
let cpsTimerInterval = null;

// Spacebar Test variables
let spacebarActive = false;
let spacebarStartTime = null;
let spacebarEndTime = null;
let spacebarPresses = 0;
let spacebarDuration = 5;
let spacebarTimerInterval = null;

// Common words for typing test
const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will',
    'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
    'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
    'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
    'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
    'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
    'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
    'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'water', 'long',
    'find', 'here', 'thing', 'great', 'man', 'world', 'life', 'still', 'hand', 'high',
    'right', 'move', 'try', 'kind', 'need', 'three', 'house', 'put', 'end', 'why',
    'let', 'head', 'start', 'keep', 'show', 'large', 'turn', 'ask', 'might', 'next',
    'hard', 'open', 'example', 'begin', 'those', 'both', 'important', 'while', 'look', 'government',
    'nothing', 'place', 'case', 'seem', 'call', 'made', 'come', 'system', 'number', 'part',
    'group', 'problem', 'fact', 'hand', 'high', 'point', 'week', 'company', 'where', 'every',
    'right', 'around', 'something', 'house', 'point', 'during', 'work', 'play', 'small', 'against',
    'say', 'level', 'too', 'old', 'same', 'tell', 'boy', 'follow', 'came', 'want',
    'show', 'also', 'around', 'form', 'three', 'small', 'set', 'put', 'end', 'why'
];

// Navigation functions
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to corresponding nav tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners...');
    
    // Navigation tab listeners
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            console.log('Tab clicked:', this.dataset.tab);
            switchTab(this.dataset.tab);
        });
    });
    
    // Test mode radio listeners
    document.querySelectorAll('input[name="testMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            testMode = this.value;
            updateConfigVisibility();
        });
    });
    
    // Typing input listener
    const typingInput = document.getElementById('typing-input');
    if (typingInput) {
        typingInput.addEventListener('input', handleTyping);
        typingInput.addEventListener('keydown', handleKeyDown);
    }
    
    // CPS Test listeners
    const clickZone = document.getElementById('click-zone');
    if (clickZone) {
        clickZone.addEventListener('click', handleCPSClick);
    }
    
    // Spacebar Test listeners
    document.addEventListener('keydown', handleSpacebarPress);
    
    // Initialize config visibility
    updateConfigVisibility();
    
    console.log('Event listeners set up successfully');
});

function updateConfigVisibility() {
    const wordConfig = document.getElementById('word-count-config');
    const timeConfig = document.getElementById('time-config');
    
    if (testMode === 'words') {
        wordConfig.classList.remove('hidden');
        timeConfig.classList.add('hidden');
    } else {
        wordConfig.classList.add('hidden');
        timeConfig.classList.remove('hidden');
    }
}

// Generate random words for test
function generateWords(count) {
    const words = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * commonWords.length);
        words.push(commonWords[randomIndex]);
    }
    return words;
}

// Start typing test
function startTest() {
    console.log('startTest() called');
    
    try {
        // Get configuration
        testMode = document.querySelector('input[name="testMode"]:checked').value;
        console.log('Test mode:', testMode);
        
        if (testMode === 'words') {
            wordCount = parseInt(document.getElementById('wordCount').value);
            testWords = generateWords(wordCount);
            console.log('Generated', wordCount, 'words');
        } else {
            testDuration = parseInt(document.getElementById('testTime').value);
            testWords = generateWords(200); // Generate enough words for timed test
            console.log('Generated words for', testDuration, 'minute test');
        }
        
        // Reset variables
        currentWordIndex = 0;
        currentCharIndex = 0;
        errors = 0;
        totalCharsTyped = 0;
        correctCharsTyped = 0;
        wordsCompleted = 0;
        testActive = true;
        startTime = new Date();
        
        // Show test area and hide setup
        const testSetup = document.getElementById('test-setup');
        const testArea = document.getElementById('test-area');
        
        if (testSetup && testArea) {
            testSetup.classList.add('hidden');
            testArea.classList.remove('hidden');
            console.log('Switched to test area');
        } else {
            console.error('Could not find test-setup or test-area elements');
        }
        
        // Display text and start timer
        displayText();
        startTimer();
        
        // Focus on input
        const typingInput = document.getElementById('typing-input');
        if (typingInput) {
            typingInput.focus();
            console.log('Focused on typing input');
        }
        
    } catch (error) {
        console.error('Error in startTest():', error);
    }
}

// Display text for typing
function displayText() {
    const textDisplay = document.getElementById('text-display');
    let html = '';
    
    for (let i = 0; i < testWords.length; i++) {
        const word = testWords[i];
        let wordHtml = '';
        
        for (let j = 0; j < word.length; j++) {
            let charClass = '';
            
            if (i < currentWordIndex || (i === currentWordIndex && j < currentCharIndex)) {
                charClass = 'correct';
            } else if (i === currentWordIndex && j === currentCharIndex) {
                charClass = 'current';
            }
            
            wordHtml += `<span class="${charClass}">${word[j]}</span>`;
        }
        
        html += wordHtml;
        if (i < testWords.length - 1) {
            html += ' ';
        }
    }
    
    textDisplay.innerHTML = html;
}

// Handle typing input
function handleTyping(event) {
    if (!testActive) return;
    
    const input = event.target.value;
    const currentWord = testWords[currentWordIndex];
    
    // Check if word is completed
    if (input.endsWith(' ')) {
        const typedWord = input.slice(0, -1);
        
        // Count this as a completed word
        wordsCompleted++;
        
        // Check accuracy character by character
        let wordErrors = 0;
        for (let i = 0; i < Math.max(typedWord.length, currentWord.length); i++) {
            if (i < typedWord.length && i < currentWord.length) {
                if (typedWord[i] === currentWord[i]) {
                    correctCharsTyped++;
                } else {
                    wordErrors++;
                }
                totalCharsTyped++;
            } else if (i < typedWord.length) {
                // Extra characters typed
                wordErrors++;
                totalCharsTyped++;
            } else {
                // Missing characters
                wordErrors++;
                totalCharsTyped++;
            }
        }
        
        errors += wordErrors;
        totalCharsTyped++; // Count the space
        if (wordErrors === 0) {
            correctCharsTyped++; // Count space as correct if word was perfect
        }
        
        currentWordIndex++;
        currentCharIndex = 0;
        event.target.value = '';
        
        // Check if test is complete
        if (testMode === 'words' && currentWordIndex >= testWords.length) {
            endTest();
            return;
        }
    } else {
        currentCharIndex = input.length;
    }
    
    displayText();
    updateProgress();
}

function handleKeyDown(event) {
    if (!testActive) return;
    
    // Prevent backspace beyond current word
    if (event.key === 'Backspace' && event.target.value === '') {
        event.preventDefault();
    }
}

// Timer functions
function startTimer() {
    const timerElement = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        
        if (testMode === 'time') {
            const remaining = testDuration * 60 - elapsed;
            if (remaining <= 0) {
                endTest();
                return;
            }
            timerElement.textContent = `Time: ${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`;
        } else {
            timerElement.textContent = `Time: ${elapsed}s`;
        }
    }, 1000);
}

function updateProgress() {
    const progressElement = document.getElementById('progress');
    let progress = 0;
    
    if (testMode === 'words') {
        progress = Math.floor((currentWordIndex / testWords.length) * 100);
    } else {
        const elapsed = (new Date() - startTime) / 1000;
        progress = Math.floor((elapsed / (testDuration * 60)) * 100);
    }
    
    progressElement.textContent = `Progress: ${Math.min(progress, 100)}%`;
}

// End test and show results
function endTest() {
    testActive = false;
    endTime = new Date();
    clearInterval(timerInterval);
    
    // Handle partial word at end
    const input = document.getElementById('typing-input').value;
    if (input.trim().length > 0 && currentWordIndex < testWords.length) {
        const currentWord = testWords[currentWordIndex];
        let wordErrors = 0;
        
        for (let i = 0; i < Math.max(input.length, currentWord.length); i++) {
            if (i < input.length && i < currentWord.length) {
                if (input[i] === currentWord[i]) {
                    correctCharsTyped++;
                } else {
                    wordErrors++;
                }
                totalCharsTyped++;
            } else if (i < input.length) {
                wordErrors++;
                totalCharsTyped++;
            } else {
                wordErrors++;
                totalCharsTyped++;
            }
        }
        
        errors += wordErrors;
        wordsCompleted += input.length / currentWord.length; // Partial word credit
    }
    
    // Calculate results
    const timeElapsed = (endTime - startTime) / 1000 / 60; // in minutes
    
    // More accurate WPM calculation
    let wpm;
    if (testMode === 'words') {
        // For word-based tests, use actual words completed
        wpm = Math.round(wordsCompleted / timeElapsed);
    } else {
        // For time-based tests, use standard 5-char-per-word method but with correct chars only
        wpm = Math.round((correctCharsTyped / 5) / timeElapsed);
    }
    
    // More accurate accuracy calculation
    const accuracy = totalCharsTyped > 0 ? Math.round((correctCharsTyped / totalCharsTyped) * 100) : 0;
    
    console.log('Test Results:', {
        timeElapsed: timeElapsed.toFixed(2),
        wordsCompleted,
        totalCharsTyped,
        correctCharsTyped,
        errors,
        wpm,
        accuracy
    });
    
    // Display results
    document.getElementById('final-wpm').textContent = wpm;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-time').textContent = `${Math.floor(timeElapsed * 60)}s`;
    document.getElementById('final-errors').textContent = errors;
    
    // Switch to results tab
    switchTab('results');
}

// Reset test
function resetTest() {
    testActive = false;
    clearInterval(timerInterval);
    
    // Reset variables
    currentWordIndex = 0;
    currentCharIndex = 0;
    errors = 0;
    totalCharsTyped = 0;
    correctCharsTyped = 0;
    wordsCompleted = 0;
    
    // Clear input
    document.getElementById('typing-input').value = '';
    
    // Show setup and hide test area
    document.getElementById('test-setup').classList.remove('hidden');
    document.getElementById('test-area').classList.add('hidden');
}

// Retake test
function retakeTest() {
    resetTest();
    switchTab('wpm-test');
}

// CPS Test Functions
function startCPSTest() {
    console.log('Starting CPS test');
    
    // Get configuration
    cpsDuration = parseInt(document.getElementById('cpsTime').value);
    
    // Reset variables
    cpsClicks = 0;
    cpsActive = true;
    cpsStartTime = performance.now(); // Use high-precision timing
    
    // Show test area and hide setup
    document.getElementById('cps-setup').classList.add('hidden');
    document.getElementById('cps-area').classList.remove('hidden');
    
    // Start timer
    startCPSTimer();
    
    console.log('CPS test started for', cpsDuration, 'seconds');
}

function handleCPSClick(event) {
    if (!cpsActive) return;
    
    // Prevent double-clicks and ensure single registration
    event.preventDefault();
    
    cpsClicks++;
    document.getElementById('click-counter').textContent = `Clicks: ${cpsClicks}`;
    
    // Visual feedback with faster animation
    const clickZone = document.getElementById('click-zone');
    clickZone.style.transform = 'scale(0.98)';
    clickZone.style.transition = 'transform 0.05s ease';
    setTimeout(() => {
        clickZone.style.transform = 'scale(1)';
    }, 50);
}

function startCPSTimer() {
    const timerElement = document.getElementById('cps-timer');
    let startTime = performance.now();
    
    cpsTimerInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const remaining = Math.max(0, cpsDuration - elapsed);
        
        timerElement.textContent = `Time: ${remaining.toFixed(1)}s`;
        
        if (remaining <= 0) {
            endCPSTest();
        }
    }, 100); // Update every 100ms for smoother countdown
}

function endCPSTest() {
    cpsActive = false;
    cpsEndTime = performance.now();
    clearInterval(cpsTimerInterval);
    
    // Calculate precise results using actual elapsed time
    const actualDuration = (cpsEndTime - cpsStartTime) / 1000;
    const cps = (cpsClicks / actualDuration).toFixed(3);
    
    console.log('CPS Test Results:', {
        clicks: cpsClicks,
        actualDuration: actualDuration.toFixed(3),
        targetDuration: cpsDuration,
        cps: cps
    });
    
    // Display results
    document.getElementById('final-cps').textContent = cps;
    document.getElementById('final-total-clicks').textContent = cpsClicks;
    document.getElementById('final-cps-time').textContent = `${actualDuration.toFixed(2)}s`;
    
    // Switch to results
    switchTab('cps-results');
}

function resetCPSTest() {
    cpsActive = false;
    clearInterval(cpsTimerInterval);
    cpsClicks = 0;
    
    // Show setup and hide test area
    document.getElementById('cps-setup').classList.remove('hidden');
    document.getElementById('cps-area').classList.add('hidden');
    
    // Reset display
    document.getElementById('click-counter').textContent = 'Clicks: 0';
}

function retakeCPSTest() {
    resetCPSTest();
    switchTab('cps-test');
}

// Spacebar Test Functions
function startSpacebarTest() {
    console.log('Starting Spacebar test');
    
    // Get configuration
    spacebarDuration = parseInt(document.getElementById('spacebarTime').value);
    
    // Reset variables
    spacebarPresses = 0;
    spacebarActive = true;
    spacebarStartTime = performance.now(); // Use high-precision timing
    
    // Show test area and hide setup
    document.getElementById('spacebar-setup').classList.add('hidden');
    document.getElementById('spacebar-area').classList.remove('hidden');
    
    // Start timer
    startSpacebarTimer();
    
    // Focus on the spacebar zone
    document.getElementById('spacebar-zone').focus();
    
    console.log('Spacebar test started for', spacebarDuration, 'seconds');
}

function handleSpacebarPress(event) {
    if (!spacebarActive || event.code !== 'Space') return;
    
    event.preventDefault(); // Prevent page scroll
    
    spacebarPresses++;
    document.getElementById('space-counter').textContent = `Presses: ${spacebarPresses}`;
    
    // Visual feedback
    const spacebarKey = document.getElementById('spacebar-visual').querySelector('.spacebar-key');
    spacebarKey.classList.add('pressed');
    setTimeout(() => {
        spacebarKey.classList.remove('pressed');
    }, 100);
}

function startSpacebarTimer() {
    const timerElement = document.getElementById('spacebar-timer');
    let startTime = performance.now();
    
    spacebarTimerInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const remaining = Math.max(0, spacebarDuration - elapsed);
        
        timerElement.textContent = `Time: ${remaining.toFixed(1)}s`;
        
        if (remaining <= 0) {
            endSpacebarTest();
        }
    }, 100); // Update every 100ms for smoother countdown
}

function endSpacebarTest() {
    spacebarActive = false;
    spacebarEndTime = performance.now();
    clearInterval(spacebarTimerInterval);
    
    // Calculate precise results using actual elapsed time
    const actualDuration = (spacebarEndTime - spacebarStartTime) / 1000;
    const sps = (spacebarPresses / actualDuration).toFixed(3);
    
    console.log('Spacebar Test Results:', {
        presses: spacebarPresses,
        actualDuration: actualDuration.toFixed(3),
        targetDuration: spacebarDuration,
        sps: sps
    });
    
    // Display results
    document.getElementById('final-sps').textContent = sps;
    document.getElementById('final-total-presses').textContent = spacebarPresses;
    document.getElementById('final-spacebar-time').textContent = `${actualDuration.toFixed(2)}s`;
    
    // Switch to results
    switchTab('spacebar-results');
}

function resetSpacebarTest() {
    spacebarActive = false;
    clearInterval(spacebarTimerInterval);
    spacebarPresses = 0;
    
    // Show setup and hide test area
    document.getElementById('spacebar-setup').classList.remove('hidden');
    document.getElementById('spacebar-area').classList.add('hidden');
    
    // Reset display
    document.getElementById('space-counter').textContent = 'Presses: 0';
}

function retakeSpacebarTest() {
    resetSpacebarTest();
    switchTab('spacebar-test');
}
