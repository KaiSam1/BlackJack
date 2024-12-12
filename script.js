let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function deal() {
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = dealerScore;
    document.getElementById('player-cards').textContent = displayCards(playerHand);
    document.getElementById('dealer-cards').textContent = displayCards(dealerHand.slice(0, 1)) + ' ?';

    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    document.getElementById('deal').disabled = true;

    gameOver = false;
    document.getElementById('result').textContent = '';
}

function displayCards(hand) {
    return hand.map(card => `${card.value}${card.suit}`).join(' ');
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else if (card.value === 'A') {
            score += 11;
            aceCount++;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

function hit() {
    if (gameOver) return;
    
    playerHand.push(deck.pop());
    playerScore = calculateScore(playerHand);

    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('player-cards').textContent = displayCards(playerHand);

    if (playerScore > 21) {
        gameOver = true;
        document.getElementById('result').textContent = 'Player busts! Dealer wins!';
        endGame();
    }
}

function stand() {
    if (gameOver) return;

    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
    }

    document.getElementById('dealer-cards').textContent = displayCards(dealerHand);
    document.getElementById('dealer-score').textContent = dealerScore;

    if (dealerScore > 21) {
        gameOver = true;
        document.getElementById('result').textContent = 'Dealer busts! Player wins!';
    } else if (playerScore > dealerScore) {
        gameOver = true;
        document.getElementById('result').textContent = 'Player wins!';
    } else if (playerScore < dealerScore) {
        gameOver = true;
        document.getElementById('result').textContent = 'Dealer wins!';
    } else {
        gameOver = true;
        document.getElementById('result').textContent = 'It\'s a tie!';
    }
    endGame();
}

function endGame() {
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    document.getElementById('deal').disabled = false;
}
