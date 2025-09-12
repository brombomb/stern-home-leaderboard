// Embedded game titles data (from Stern API: https://cms.prd.sternpinball.io/api/v1/portal/game_titles/)
const GAME_TITLES = [
    { "name": "Star Wars Home Edition", "code": "SWH", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-SW-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-SW-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-SW-Home.format-webp.webp", "gradient_start": "#4B0000", "gradient_stop": "#FF0000" },
    { "name": "King Kong", "code": "SKK", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-KingKong-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-KingKong-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-KingKong.format-webp.webp", "gradient_start": "#AA21FF", "gradient_stop": "#F7D721" },
    { "name": "Dungeons & Dragons", "code": "DND", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-DD-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-DD-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-DD.format-webp.webp", "gradient_start": "#F93131", "gradient_stop": "#4F0000" },
    { "name": "Metallica", "code": "MET", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Metallica202Metallica20244-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Metallica2024-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-Metallica_2024.format-webp.webp", "gradient_start": "#84B0AB", "gradient_stop": "#006B33" },
    { "name": "The Uncanny X-Men", "code": "XM2", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/SquareLogo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Uncanny_X-Men-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-Uncanny_X-Men.format-webp.webp", "gradient_start": "#136ACC", "gradient_stop": "#03F0FC" },
    { "name": "Jurassic Park Home Edition", "code": "JPP", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo_JurassicParkHome_Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo_JurassicParkHome_VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/PrimaryBackground_JurassicParkHome.format-webp.webp", "gradient_start": "#121D7D", "gradient_stop": "#84BDDD" },
    { "name": "John Wick", "code": "WCK", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo_JohnWick_Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo_JohnWick_VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-JohnWick.format-webp.webp", "gradient_start": "#B164FF", "gradient_stop": "#FF6B00" },
    { "name": "Jaws", "code": "JWS", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Jaws-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-JAws-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Jaws_Primary_Background.format-webp.webp", "gradient_start": "#00A3FF", "gradient_stop": "#E00200" },
    { "name": "Venom", "code": "VEN", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Venom-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Venom-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-Venom.format-webp.webp", "gradient_start": "#0066FF", "gradient_stop": "#3E008C" },
    { "name": "Foo Fighters", "code": "FOO", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-FF-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-FF-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-Foo.format-webp.webp", "gradient_start": "#00ED89", "gradient_stop": "#008A9D" },
    { "name": "James Bond 007 60th Anniversary", "code": "JBV", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/James_Bond_60th_Logo_Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/James_Bond_60th_Logo_Variable.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/James_Bond_007_Primary_Background.format-webp.webp", "gradient_start": "#4098D8", "gradient_stop": "#B9E2FF" },
    { "name": "James Bond 007", "code": "BND", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-JamesBond-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-JamesBond-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner.format-webp.webp", "gradient_start": "#D73400", "gradient_stop": "#FFC700" },
    { "name": "Rush", "code": "RSH", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Rush-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-Rush-VariableWidth.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Banner-3_1-Rush.format-webp.webp", "gradient_start": "#7EB2FF", "gradient_stop": "#4200FF" },
    { "name": "Godzilla", "code": "ZIL", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/god-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/god-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/god-primary-background.format-webp.webp", "gradient_start": "#014700", "gradient_stop": "#EAFC1A" },
    { "name": "The Mandalorian", "code": "MAN", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/man-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/man-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/man-primary-background.format-webp.webp", "gradient_start": "#FAE84D", "gradient_stop": "#A33A00" },
    { "name": "Led Zeppelin", "code": "ZEP", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/led-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/led-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/led-primary-background.format-webp.webp", "gradient_start": "#B7EFF5", "gradient_stop": "#3C66F9" },
    { "name": "Avengers: Infinity Quest", "code": "AIQ", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/aiq-square-logo_u2jWgzh.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/aiq-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/aiq-primary-background_OGjSsKO.format-webp.webp", "gradient_start": "#9C00D2", "gradient_stop": "#0F44FF" },
    { "name": "Teenage Mutant Ninja Turtles", "code": "TUR", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/tur-square-logo_LqsGKBw.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/tur-variable-logo_ZAVBT1f.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/tur-primary-background_5CUCjNF.format-webp.webp", "gradient_start": "#164705", "gradient_stop": "#89FC02" },
    { "name": "Stranger Things", "code": "STR", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/str-square-logo_6uskyWD.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/str-variable-logo_waQF46K.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/str-primary-background_wavzZnh.format-webp.webp", "gradient_start": "#AB0250", "gradient_stop": "#48F5FB" },
    { "name": "Jurassic Park", "code": "JRP", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/jrp-square-logo_YRpIaDw.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/jrp-variable-logo_gy3lofv.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/jrp-primary-background_PejcQpl.format-webp.webp", "gradient_start": "#103200", "gradient_stop": "#FFE90F" },
    { "name": "Deadpool", "code": "DED", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/ded-square-logo_TQfdEoc.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/ded-variable-logo_QYQg6jl.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/ded-primary-background_8gi7h78.format-webp.webp", "gradient_start": "#33025E", "gradient_stop": "#FF0C00" },
    { "name": "The Beatles", "code": "BBB", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/beat-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/beat-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/beat-primary-background.format-webp.webp", "gradient_start": "#C889FF", "gradient_stop": "#00FFB2" },
    { "name": "Batman '66", "code": "BAT", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/Logo-BAT-Square.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/bat-variable-logo_9iEOdHX.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/bat-primary-background_zxLEqM1.format-webp.webp", "gradient_start": "#720C55", "gradient_stop": "#FC6B1A" },
    { "name": "Black Knight: Sword of Rage", "code": "SOR", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/bk-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/bk-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/bk-primary-background.format-webp.webp", "gradient_start": "#D00032", "gradient_stop": "#4100CA" },
    { "name": "Aerosmith", "code": "ARS", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/aerosmith-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/aerosmith-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/aerosmith-primary-background.format-webp.webp", "gradient_start": "#6A27DB", "gradient_stop": "#6BE4FF" },
    { "name": "Elvira's House of Horrors", "code": "EHH", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/elv-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/elv-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/elv-primary-background.format-webp.webp", "gradient_start": "#220140", "gradient_stop": "#9E00FF" },
    { "name": "Iron Maiden", "code": "MDN", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/im-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/im-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/im-primary-background.format-webp.webp", "gradient_start": "#FCD904", "gradient_stop": "#0F7DE6" },
    { "name": "Guardians of the Galaxy", "code": "GRD", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/gotg-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/gotg-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/gotg-primary-background.format-webp.webp", "gradient_start": "#33025E", "gradient_stop": "#FF00C7" },
    { "name": "Star Wars", "code": "SW", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/sw-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/sw-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/sw-primary-background.format-webp.webp", "gradient_start": "#4B0000", "gradient_stop": "#FF0000" },
    { "name": "The Munsters", "code": "MUN", "square_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/mun-square-logo.format-webp.webp", "variable_width_logo": "https://stern-wagtail-1.s3.amazonaws.com/media/images/mun-variable-logo.format-webp.webp", "primary_background": "https://stern-wagtail-1.s3.amazonaws.com/media/images/mun-primary-background.format-webp.webp", "gradient_start": "#C6FF0D", "gradient_stop": "#023D03" }
];

// Standardized high scores for demo (same for all games for simplicity)
const STANDARD_HIGH_SCORES = [
    { "score": "1000000000", "user": { "initials": "TOP", "username": "TOPGUN" } },
    { "score": "500000000", "user": { "initials": "ACE", "username": "ACEFLYER" } },
    { "score": "100000000", "user": { "initials": "PRO", "username": "PROPLAY" } },
    { "score": "75000000", "user": { "initials": "VET", "username": "VETERAN" } },
    { "score": "50000000", "user": { "initials": "ROK", "username": "ROOKIE" } }
];

// Generate high scores data for all games using the standardized scores
const SAMPLE_HIGH_SCORES = {};
GAME_TITLES.forEach(game => {
    SAMPLE_HIGH_SCORES[game.code] = {
        success: true,
        machine: { name: game.name, game_model: { type: "pro" } },
        high_score: STANDARD_HIGH_SCORES
    };
});

let currentHighlightedRow = null;

// Initialize the demo
function init() {
    populateGameSelector();
    selectRandomGame();

    // Add event listeners
    document.getElementById('gameSelect').addEventListener('change', function () {
        const selectedCode = this.value;
        if (selectedCode) {
            displayGameData(selectedCode);
        }
    });

    document.getElementById('newHighScoreBtn').addEventListener('click', addNewHighScore);
}

function populateGameSelector() {
    const select = document.getElementById('gameSelect');
    select.innerHTML = '<option value="">Choose a game...</option>';

    GAME_TITLES.forEach(game => {
        const option = document.createElement('option');
        option.value = game.code;
        option.textContent = game.name;
        select.appendChild(option);
    });
}

function selectRandomGame() {
    const randomIndex = Math.floor(Math.random() * GAME_TITLES.length);
    const randomGame = GAME_TITLES[randomIndex];

    const select = document.getElementById('gameSelect');
    select.value = randomGame.code;

    displayGameData(randomGame.code);
}

function displayGameData(gameCode) {
    const game = GAME_TITLES.find(g => g.code === gameCode);
    const highScoreData = SAMPLE_HIGH_SCORES[gameCode];

    if (!game || !highScoreData) return;

    // Update machine card styling
    const machineCard = document.getElementById('machineCard');
    const gameLogo = document.getElementById('gameLogo');

    // Apply gradient styling
    if (game.gradient_start && game.gradient_stop) {
        machineCard.style.borderImage = `linear-gradient(45deg, ${game.gradient_start}, ${game.gradient_stop}) 1`;
        machineCard.style.boxShadow = `0 0 20px ${game.gradient_start}40`;
    }

    // Apply background image
    if (game.primary_background) {
        machineCard.style.backgroundImage = `url(${game.primary_background})`;
        machineCard.classList.add('with-background');
    } else {
        machineCard.style.backgroundImage = 'none';
        machineCard.classList.remove('with-background');
    }

    // Update game logo
    if (game.square_logo) {
        gameLogo.src = game.variable_width_logo || game.square_logo;
        gameLogo.style.display = 'block';
        gameLogo.alt = game.name + ' Logo';
    }

    // Update high scores table
    updateHighScoresTable(highScoreData.high_score, game.name);
}

function updateHighScoresTable(scores, gameName) {
    const tbody = document.getElementById('scoresTableBody');
    tbody.innerHTML = '';

    scores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';

        row.innerHTML = `
            <td class="table-cell rank-cell">${index + 1}</td>
            <td class="table-cell">
                <div class="player-info">
                    <div class="player-avatar">${score.user.initials}</div>
                    <div class="player-name">${score.user.username}</div>
                </div>
            </td>
            <td class="table-cell score-cell">${formatScore(score.score)}</td>
        `;

        tbody.appendChild(row);
    });
}

function formatScore(score) {
    return parseInt(score).toLocaleString();
}

function addNewHighScore() {
    const selectedGameCode = document.getElementById('gameSelect').value;
    if (!selectedGameCode) {
        showToast('⚠️ Please select a game first!');
        return;
    }

    // Generate a random new high score
    const minScore = 50000000;
    const maxScore = 2000000000;
    const newScore = Math.floor(Math.random() * (maxScore - minScore) + minScore);

    const newHighScore = {
        score: newScore.toString(),
        user: { initials: "NEW", username: "PLAYER" }
    };

    // Add to the scores
    const currentScores = SAMPLE_HIGH_SCORES[selectedGameCode].high_score;
    currentScores.unshift(newHighScore);
    currentScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));

    // Keep only top 5
    if (currentScores.length > 5) {
        currentScores.pop();
    }

    // Update display
    const game = GAME_TITLES.find(g => g.code === selectedGameCode);
    updateHighScoresTable(currentScores, game.name);

    // Highlight the new score
    highlightNewScore();

    // Show celebration
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    showToast('🎉 New High Score Achieved!');
}

function highlightNewScore() {
    const rows = document.querySelectorAll('#scoresTableBody .table-row');
    if (rows.length > 0) {
        const newRow = rows[0];
        newRow.classList.add('new-score');

        if (currentHighlightedRow) {
            currentHighlightedRow.classList.remove('new-score');
        }
        currentHighlightedRow = newRow;

        setTimeout(() => {
            newRow.classList.remove('new-score');
            currentHighlightedRow = null;
        }, 5000);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const messageEl = toast.querySelector('.toast-message');
    messageEl.textContent = message;

    toast.classList.remove('hidden');

    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('hidden');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
