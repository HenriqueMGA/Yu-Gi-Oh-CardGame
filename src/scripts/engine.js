const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites: {
        avatar: document.getElementById('card_image'),
        name: document.getElementById('card_name'),
        type: document.getElementById('card_type')
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.getElementById('player-cards'),
        computer: "computer-cards",
        computerBOX: document.getElementById('computer-cards')
    },
    actions: {
        button: document.getElementById('next-duel')
    }
}

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: './src/assets/icons/dragon.png',
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: './src/assets/icons/magician.png',
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: './src/assets/icons/exodia.png',
        WinOf: [0],
        LoseOf: [1]
    }
]



async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(idCard)
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }

    

    return cardImage
}

async function drawButton(text) {
    state.actions.button.style.display = "block"
    state.actions.button.innerText = text.toUpperCase()
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw"
    let playerCard = cardData[playerCardId]

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win"
        await playAudio(duelResults)
        state.score.playerScore++
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose"
        await playAudio(duelResults)
        state.score.computerScore++
    }

    return duelResults
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides

    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = ""
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
}

async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    const computerCardId = await getRandomCardId()

    showHiddenCardFieldsImages(true)

    await hiddenCardDetails()

    drawCardsInField(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore();
    await drawButton(duelResults);
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    
    showHiddenCardFieldsImages(false)

    init()
}

function init() {
    const bgm = document.getElementById("bgm")
    bgm.play()

    showHiddenCardFieldsImages(false)

    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)
}

init()