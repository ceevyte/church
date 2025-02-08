let config;
let currentIndex = 0;
let playingAudios = []; // Store all playing audio elements

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
    const totalNodes = config.nodes.length;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > totalNodes - 3) currentIndex = totalNodes - 3;

    document.getElementById("node1").innerText = config.nodes[currentIndex].title;
    document.getElementById("node2").innerText = config.nodes[currentIndex + 1].title;
    document.getElementById("node3").innerText = config.nodes[currentIndex + 2].title;
}

// Handle node click
function handleNodeClick(relativeIndex) {
    let absoluteIndex = currentIndex + relativeIndex;

    // Start fading out all currently playing audio
    fadeOutAllAudio();

    // Play new audio
    const audio = new Audio(config.nodes[absoluteIndex].audio);
    audio.volume = 1;
    audio.play();
    playingAudios.push(audio); // Add to playing list

    // Move up
    if (relativeIndex === 0 && currentIndex > 0) {
        currentIndex--;
        updateNodes();
    }
    // Move down
    else if (relativeIndex === 2 && currentIndex < config.nodes.length - 3) {
        currentIndex++;
        updateNodes();
    }
}

// Fade out all currently playing audio
function fadeOutAllAudio() {
    playingAudios.forEach(audio => {
        let fadeInterval = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume -= 0.05;
            } else {
                clearInterval(fadeInterval);
                audio.pause();
            }
        }, 50);
    });

    // Clear list after fade-out
    playingAudios = [];
}