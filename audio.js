document.addEventListener("DOMContentLoaded", () => {
    const music = document.querySelector("#backgroundMusic");
    const startButton = document.querySelector("#clickButton");

    if (!music || !startButton) {
        return;
    }

    music.loop = true;
    music.volume = 0.35;

    let musicStarted = false;

    async function startMusic() {
        if (musicStarted) {
            return;
        }

        try {
            await music.play();
            musicStarted = true;
        } catch (error) {
            console.warn("Não foi possível iniciar a música:", error);
        }
    }

    startButton.addEventListener("click", startMusic);
});