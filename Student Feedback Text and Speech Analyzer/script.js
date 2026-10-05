const feedbackText = document.getElementById("feedbackText");
const characterCount = document.getElementById("characterCount");

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const micBtn = document.getElementById("micBtn");

const speechStatus = document.getElementById("speechStatus");

const sentimentResult = document.getElementById("sentimentResult");
const sentimentIcon = document.getElementById("sentimentIcon");
const confidenceResult = document.getElementById("confidenceResult");

const wordResult = document.getElementById("wordResult");
const charResult = document.getElementById("charResult");
const keywordResult = document.getElementById("keywordResult");

const keywordsContainer = document.getElementById("keywords");


// --------------------------------------
// Character Counter
// --------------------------------------

feedbackText.addEventListener("input", function () {

    characterCount.textContent = feedbackText.value.length;

});


// --------------------------------------
// Clear Button
// --------------------------------------

clearBtn.addEventListener("click", function () {

    feedbackText.value = "";

    characterCount.textContent = "0";

    sentimentResult.textContent = "Waiting for analysis";
    sentimentIcon.textContent = "😊";
    confidenceResult.textContent = "--%";

    wordResult.textContent = "0";
    charResult.textContent = "0";
    keywordResult.textContent = "0";

    keywordsContainer.innerHTML =
        `<span class="empty-keyword">
            Analyze feedback to see keywords
        </span>`;

    speechStatus.textContent = "";

});


// --------------------------------------
// Analyze Feedback
// --------------------------------------

analyzeBtn.addEventListener("click", function () {

    const text = feedbackText.value.trim();

    if (text === "") {

        alert("Please enter or speak some student feedback.");

        return;
    }

    analyzeFeedback(text);

});


// --------------------------------------
// Sentiment Analysis
// --------------------------------------

function analyzeFeedback(text) {

    const words = text
        .toLowerCase()
        .replace(/[.,!?;:()]/g, "")
        .split(/\s+/)
        .filter(Boolean);


    const positiveWords = [

        "good",
        "great",
        "excellent",
        "amazing",
        "helpful",
        "clear",
        "clearly",
        "enjoy",
        "enjoyed",
        "love",
        "loved",
        "best",
        "nice",
        "easy",
        "interesting",
        "useful",
        "fantastic",
        "wonderful",
        "perfect",
        "satisfied",
        "happy",
        "friendly",
        "supportive",
        "effective",
        "understand",
        "understood",
        "improve"

    ];


    const negativeWords = [

        "bad",
        "poor",
        "worst",
        "boring",
        "difficult",
        "hard",
        "confusing",
        "confused",
        "slow",
        "hate",
        "hated",
        "problem",
        "problems",
        "issue",
        "issues",
        "disappointed",
        "disappointing",
        "unclear",
        "weak",
        "lack",
        "lacking",
        "terrible",
        "waste",
        "late"

    ];


    let positiveScore = 0;
    let negativeScore = 0;


    words.forEach(function (word) {

        if (positiveWords.includes(word)) {

            positiveScore++;

        }

        if (negativeWords.includes(word)) {

            negativeScore++;

        }

    });


    let sentiment;
    let icon;
    let confidence;


    if (positiveScore > negativeScore) {

        sentiment = "Positive";
        icon = "😊";

        confidence = Math.min(
            96,
            70 + (positiveScore * 5)
        );

    }

    else if (negativeScore > positiveScore) {

        sentiment = "Negative";
        icon = "☹️";

        confidence = Math.min(
            96,
            70 + (negativeScore * 5)
        );

    }

    else {

        sentiment = "Neutral";
        icon = "😐";

        confidence = 72;

    }


    // Update sentiment

    sentimentResult.textContent = sentiment;
    sentimentIcon.textContent = icon;
    confidenceResult.textContent = confidence + "%";


    // Statistics

    wordResult.textContent = words.length;

    charResult.textContent = text.length;


    // Keywords

    const keywords = extractKeywords(words);

    keywordResult.textContent = keywords.length;

    displayKeywords(keywords);

}


// --------------------------------------
// Keyword Extraction
// --------------------------------------

function extractKeywords(words) {

    const stopWords = [

        "the",
        "is",
        "a",
        "an",
        "and",
        "or",
        "to",
        "of",
        "in",
        "on",
        "for",
        "with",
        "this",
        "that",
        "was",
        "were",
        "are",
        "am",
        "it",
        "i",
        "we",
        "they",
        "he",
        "she",
        "my",
        "our",
        "very",
        "but",
        "be",
        "have",
        "has",
        "had",
        "from",
        "more",
        "would",
        "could",
        "should",
        "about",
        "as",
        "at",
        "by",
        "not",
        "so",
        "also"

    ];


    const frequency = {};


    words.forEach(function (word) {

        if (
            word.length > 3 &&
            !stopWords.includes(word)
        ) {

            frequency[word] =
                (frequency[word] || 0) + 1;

        }

    });


    return Object.entries(frequency)

        .sort(function (a, b) {

            return b[1] - a[1];

        })

        .slice(0, 8)

        .map(function (item) {

            return item[0];

        });

}


// --------------------------------------
// Display Keywords
// --------------------------------------

function displayKeywords(keywords) {

    keywordsContainer.innerHTML = "";


    if (keywords.length === 0) {

        keywordsContainer.innerHTML =
            `<span class="empty-keyword">
                No important keywords found
            </span>`;

        return;

    }


    keywords.forEach(function (keyword) {

        const span = document.createElement("span");

        span.className = "keyword";

        span.textContent = "#" + keyword;

        keywordsContainer.appendChild(span);

    });

}


// --------------------------------------
// Speech Recognition
// --------------------------------------

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";


    micBtn.addEventListener("click", function () {

        recognition.start();

        speechStatus.textContent =
            "🎙️ Listening... Please speak your feedback.";

        micBtn.textContent = "🔴 Listening";

    });


    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;


        feedbackText.value +=
            (feedbackText.value ? " " : "") +
            transcript;


        characterCount.textContent =
            feedbackText.value.length;


        speechStatus.textContent =
            "✓ Speech converted successfully.";

        micBtn.textContent = "🎤 Speak";

    };


    recognition.onerror = function () {

        speechStatus.textContent =
            "Unable to recognize speech. Please try again.";

        micBtn.textContent = "🎤 Speak";

    };


    recognition.onend = function () {

        micBtn.textContent = "🎤 Speak";

    };

}

else {

    micBtn.disabled = true;

    micBtn.textContent = "Speech Not Supported";

    speechStatus.textContent =
        "Speech recognition is not supported in this browser.";

}