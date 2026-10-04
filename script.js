let recognition;
let listening = false;

function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        document.getElementById("status").innerText =
            "Speech recognition is not supported in this browser.";
        return;
    }

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        listening = true;
        document.getElementById("status").innerText =
            "🎤 Listening... Please speak your feedback.";
        document.getElementById("startBtn").innerText =
            "🎙 Listening...";
    };

    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("feedback").value = transcript;

        document.getElementById("status").innerText =
            "Voice converted to text successfully.";

        document.getElementById("startBtn").innerText =
            "🎤 Start Voice";

        listening = false;
    };

    recognition.onerror = function (event) {

        document.getElementById("status").innerText =
            "Error: " + event.error;

        document.getElementById("startBtn").innerText =
            "🎤 Start Voice";

        listening = false;
    };

    recognition.onend = function () {

        document.getElementById("startBtn").innerText =
            "🎤 Start Voice";

        listening = false;
    };

    recognition.start();
}


async function analyzeSentiment() {

    const feedback =
        document.getElementById("feedback").value.trim();

    if (!feedback) {

        alert("Please enter or speak customer feedback.");

        return;
    }

    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: feedback
            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        document.getElementById("result").classList.remove("hidden");

        document.getElementById("resultText").innerText =
            data.text;

        document.getElementById("sentiment").innerText =
            data.sentiment;

        document.getElementById("polarity").innerText =
            data.polarity;

        document.getElementById("subjectivity").innerText =
            data.subjectivity;

    } catch (error) {

        alert("Something went wrong. Please try again.");

        console.error(error);
    }
}


function clearText() {

    document.getElementById("feedback").value = "";

    document.getElementById("result").classList.add("hidden");

    document.getElementById("status").innerText = "";

    document.getElementById("startBtn").innerText =
        "🎤 Start Voice";
}