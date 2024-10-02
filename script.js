// Global Variables
let level = 1;
let score = 0;
let gridSize = 2;
let rounds = 5;
let roundCount = 0;
let variation = 9;
let correctTile = null;
let tiles = [];
let gameInProgress = false;
let restartCount = 0;
let currentMode = null;
let highscore = 0;
let continueUsed = false;

// DOM Elements
const levelNumber = document.getElementById('level-number');
const scoreNumber = document.getElementById('score-number');
const gridContainer = document.getElementById('grid-container');
const startButton = document.querySelector('.start-button');
const modeSelection = document.querySelector('.mode-selection');
const gameOverScreen = document.querySelector('.game-over');
const gameOverMessage = document.getElementById('game-over-message');
const gameOverTitle = document.getElementById('game-over-title');
const highscoreNumber = document.getElementById('highscore-number');
const darkThemeLabel = document.getElementById('dark-theme-label');
const attributionText = document.getElementById('attribution-text');
const timerElement = document.getElementById('timer');

// High Scores
let highscoreEndless = localStorage.getItem('highscoreEndless') || 0;
let highscoreChallenge = localStorage.getItem('highscoreChallenge') || 0;

// Show Mode Selection
function showModeSelection() {
    startButton.style.display = 'none';
    modeSelection.style.display = 'block';
}

// Start Endless Mode
function startEndlessMode() {
    currentMode = 'endless';
    modeSelection.style.display = 'none';
    gridContainer.style.display = 'grid';
    scoreNumber.style.display = 'block';
    highscoreNumber.textContent = highscoreEndless;
    startGame();
}

// Start Challenge Mode
function startChallengeMode() {
    currentMode = 'challenge';
    modeSelection.style.display = 'none';
    gridContainer.style.display = 'grid';
    scoreNumber.style.display = 'block';
    highscoreNumber.textContent = highscoreChallenge;
    document.getElementById('level-display').style.display = 'block';
    startGame();
}

// Start the Game
function startGame() {
    gameInProgress = true; // Ensure game is in progress
    roundCount = 0;
    level = 1;
    rounds = 5;
    gridSize = 2;
    continueUsed = false;
    score = 0;
    generateGrid();
}

// Generate the Grid and Tiles
function generateGrid() {
    if (!gameInProgress) return; // Prevent grid generation if game is not active

    // Adjust grid based on current mode
    if (currentMode === 'endless') {
        adjustGridForEndless();
    } else if (currentMode === 'challenge') {
        adjustGridForChallenge();
    }

    // Generate tiles and assign colors
    const tileSize = Math.min(80, 320 / gridSize); // Adjust tile size
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${tileSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, ${tileSize}px)`;
    gridContainer.innerHTML = ''; // Clear the previous grid
    roundCount++;

    const baseColor = getRandomColor();
    correctTile = Math.floor(Math.random() * gridSize * gridSize);
    tiles = Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.borderRadius = '5px';
        tile.style.backgroundColor = index === correctTile ? adjustColor(baseColor, variation) : baseColor;
        tile.addEventListener('click', () => onTileClick(index));
        gridContainer.appendChild(tile);
        return tile;
    });

    updateLevelAndScore();
}

// Adjust Grid for Endless Mode
function adjustGridForEndless() {
    // Grid size and rounds progression logic for endless mode
    if (roundCount >= rounds) {
        gridSize = Math.min(7, gridSize + 1);
        rounds = gridSize === 2 ? 9 :
                 gridSize === 3 ? 18 :
                 gridSize === 4 ? 27 :
                 gridSize === 5 ? 36 :
                 gridSize === 6 ? 45 : rounds + 1;
        roundCount = 0;
    }
}

// Adjust Grid for Challenge Mode
function adjustGridForChallenge() {
    // Standard grid progression logic for challenge mode
    if (roundCount >= rounds) {
        level++;
        if (level <= 3) {
            gridSize = level + 1;
            rounds = 5;
        } else {
            gridSize = Math.min(9, gridSize + 1);
            rounds = (level === 4) ? 7 : (level * 2 - 1);
        }
        roundCount = 0;
    }
}

// Handle Tile Click
function onTileClick(index) {
    if (!gameInProgress) return;
    if (index === correctTile) {
        score += 1;
        updateScoreColor();
        animateCorrectTile(tiles[index]);
        if (score >= 150 && currentMode === 'challenge') {
            displayWinMessage();
        } else {
            setTimeout(generateGrid, 500); // Generate a new grid after a short delay
        }
    } else {
        gameOver();
    }
}

// Display Win Message
function displayWinMessage() {
    gameInProgress = false;
    gameOverScreen.classList.add('active');
    gameOverTitle.textContent = "🪩🎇 You Did It! 😮🎉";
    gameOverMessage.textContent = `You reached the maximum score of 150! Share your achievement and restart!`;
}

// Handle Game Over
function gameOver() {
    gameInProgress = false;
    gameOverScreen.classList.add('active');
    if (!continueUsed) {
        document.querySelector('.continue-button').style.display = 'inline-block';
    } else {
        document.querySelector('.continue-button').style.display = 'none';
    }

    gameOverMessage.textContent = "You selected the wrong tile. Try again or continue!";
    if (restartCount > 9) {
        alert("😣 Uh-huh! Try relaxing your eyes for 10 minutes! 😌");
    }
}

// Continue Game Logic
function continueGame() {
    continueUsed = true;
    gameOverScreen.classList.remove('active');
    generateGrid(); // Resumes from the current round
}

// Update Level and Score Display
function updateLevelAndScore() {
    levelNumber.textContent = level;
    scoreNumber.textContent = score;
}

// Update Score Color
function updateScoreColor() {
    if (currentMode === 'endless') {
        scoreNumber.style.color = tiles[correctTile].style.backgroundColor; // Match score color with tile color
    } else {
        const maxScore = 150;
        const colorGradient = [
            'rgb(255,0,0)', 'rgb(255,128,0)', 'rgb(255,255,0)',
            'rgb(128,255,0)', 'rgb(0,255,0)'
        ];
        const colorIndex = Math.min(Math.floor((score / maxScore) * colorGradient.length), colorGradient.length - 1);
        scoreNumber.style.color = colorGradient[colorIndex];
    }
}

// Animate Correct Tile
function animateCorrectTile(tile) {
    tile.classList.add('correct');
    setTimeout(() => tile.classList.remove('correct'), 500);
}

// Share Game Function
function shareGame() {
    const shareData = {
        title: 'ColorTest',
        text: `I scored ${score} points on ColorTest! Can you beat my score?`,
        url: window.location.href
    };
    navigator.share(shareData).catch(console.error);
}

// Restart Game
function restartGame() {
    restartCount++;
    gameOverScreen.classList.remove('active');
    startGame();
}

// Toggle Light/Dark Mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
    darkThemeLabel.style.color = body.classList.contains('light-mode') ? '#333' : '#fff'; // Change text color on theme toggle
    attributionText.style.color = body.classList.contains('light-mode') ? '#333' : '#fff'; // Change attribution color on theme toggle
}

// Function to generate a random color
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

// Function to adjust color based on variation
function adjustColor(color, variation) {
    let rgb = color.match(/\d+/g);
    rgb = rgb.map(channel => Math.max(0, Math.min(255, channel * (1 - variation / 100))));
    return `rgb(${rgb.join(',')})`;
}

// Ensure the switch starts correctly based on dark mode
document.getElementById('mode-switch').checked = document.body.classList.contains('dark-mode');
