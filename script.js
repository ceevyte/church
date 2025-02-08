let config;
let currentAudio = null;
let currentIndex = 0;

// Load configuration file
fetch("config.json")
    .then(response => response.json())
    .then(data => {
        config = data;
        currentIndex = config.startIndex || 0;
        updateNodes();
    })
    .catch(error => console.error("Error loading config:", error));

// Update visible nodes dynamically
function updateNodes() {
    const container = document.getElementById("node-container");
    const totalNodes = config.nodes.length;

    // Ensure index is within bounds
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > totalNodes - 3) currentIndex = totalNodes - 3;

    // Update node elements
    document.getElementById("node1").innerText = config.nodes[currentIndex].title;
    document.getElementById("node2").innerText = config.nodes[currentIndex + 1].title;
    document.getElementById("node3").innerText = config.nodes[currentIndex + 2].title;
}

// Handle node click
function handleNodeClick(relativeIndex) {
    let absoluteIndex = currentIndex + relativeIndex;

    if (currentAudio) fadeOutAudio(currentAudio);

    const audio = new Audio(config.nodes[absoluteIndex].audio);
    audio.volume = 1;
    audio.play();
    currentAudio = audio;

    // Move up (first node clicked)
    if (relativeIndex === 0 && currentIndex > 0) {
        currentIndex--;
        updateNodes();
    }
    // Move down (last node clicked)
    else if (relativeIndex === 2 && currentIndex < config.nodes.length - 3) {
        currentIndex++;
        updateNodes();
    }
}

// Fade out previous audio
function fadeOutAudio(audio) {
    let fadeOutInterval = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume -= 0.05;
        } else {
            clearInterval(fadeOutInterval);
            audio.pause();
        }
    }, 50);
}
