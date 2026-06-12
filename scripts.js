document.addEventListener("DOMContentLoaded", () => {
    initializeIntroAnimation();
    initializePageNavigation();
    initializeEnvelope();
    initializeHeartBackground();
});

/* ==========================================
   Animação inicial
========================================== */

function initializeIntroAnimation() {
    const clickButton = document.querySelector("#clickButton");
    const intro = document.querySelector("#intro");

    const heartTransition = document.querySelector(
        "#heartTransition"
    );

    const memories = document.querySelector("#memories");

    if (
        !clickButton ||
        !intro ||
        !heartTransition ||
        !memories
    ) {
        return;
    }

    let animationStarted = false;

    clickButton.addEventListener("click", () => {
        if (animationStarted) {
            return;
        }

        animationStarted = true;
        clickButton.disabled = true;

        heartTransition.classList.add("expand");

        window.setTimeout(() => {
            memories.classList.add("visible");

            memories.setAttribute(
                "aria-hidden",
                "false"
            );

            intro.classList.add("hidden");
        }, 850);

        window.setTimeout(() => {
            heartTransition.style.display = "none";
        }, 1450);
    });
}

/* ==========================================
   Navegação entre fotos e carta
========================================== */

function initializePageNavigation() {
    const pagesTrack = document.querySelector("#pagesTrack");

    const nextPageButton = document.querySelector(
        "#nextPageButton"
    );

    const backButton = document.querySelector(
        "#backButton"
    );

    if (
        !pagesTrack ||
        !nextPageButton ||
        !backButton
    ) {
        return;
    }

    nextPageButton.addEventListener("click", () => {
        pagesTrack.classList.add("show-letter-page");
    });

    backButton.addEventListener("click", () => {
        pagesTrack.classList.remove("show-letter-page");
    });
}

/* ==========================================
   Envelope e popup
========================================== */

function initializeEnvelope() {
    const envelope = document.querySelector("#envelope");
    const letterModal = document.querySelector("#letterModal");

    const closeLetterButton = document.querySelector(
        "#closeLetterButton"
    );

    const letterOverlay = document.querySelector(
        "#letterOverlay"
    );

    if (
        !envelope ||
        !letterModal ||
        !closeLetterButton ||
        !letterOverlay
    ) {
        return;
    }

    let envelopeOpening = false;

    function openLetter() {
        if (envelopeOpening) {
            return;
        }

        envelopeOpening = true;

        envelope.classList.add("open");

        envelope.setAttribute(
            "aria-expanded",
            "true"
        );

        /*
         * Espera o envelope abrir antes
         * de mostrar a carta ampliada.
         */
        window.setTimeout(() => {
            letterModal.classList.add("visible");

            letterModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow = "hidden";

            closeLetterButton.focus();
        }, 850);
    }

    function closeLetter() {
        letterModal.classList.remove("visible");

        letterModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        window.setTimeout(() => {
            envelope.classList.remove("open");

            envelope.setAttribute(
                "aria-expanded",
                "false"
            );

            envelopeOpening = false;
            envelope.focus();
        }, 350);
    }

    envelope.addEventListener("click", openLetter);

    closeLetterButton.addEventListener(
        "click",
        closeLetter
    );

    letterOverlay.addEventListener(
        "click",
        closeLetter
    );

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            letterModal.classList.contains("visible")
        ) {
            closeLetter();
        }
    });
}

/* ==========================================
   Fundo de corações
========================================== */

function initializeHeartBackground() {
    const heartsBackground = document.querySelector(
        "#heartsBackground"
    );

    if (!heartsBackground) {
        return;
    }

    const columnSpacing = 155;
    const heartsPerColumn = 9;
    const baseSpeed = 32;

    let columns = [];
    let animationFrameId = null;
    let lastAnimationTime = performance.now();

    function createHeartColumn(index) {
        const columnElement =
            document.createElement("div");

        columnElement.className = "heart-column";

        const initialX = index * columnSpacing;

        const speed =
            baseSpeed + Math.random() * 6;

        const verticalOffset =
            -25 + Math.random() * 50;

        columnElement.style.top =
            `${verticalOffset}px`;

        for (
            let heartIndex = 0;
            heartIndex < heartsPerColumn;
            heartIndex++
        ) {
            const heartElement =
                document.createElement("span");

            heartElement.className = "bg-heart";
            heartElement.textContent = "♡";

            const heartSize =
                36 + Math.random() * 20;

            heartElement.style.fontSize =
                `${heartSize}px`;

            columnElement.appendChild(heartElement);
        }

        heartsBackground.appendChild(columnElement);

        return {
            element: columnElement,
            x: initialX,
            speed
        };
    }

    function buildHeartColumns() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        heartsBackground.innerHTML = "";
        columns = [];

        const containerWidth =
            heartsBackground
                .getBoundingClientRect()
                .width;

        const totalColumns =
            Math.ceil(
                containerWidth / columnSpacing
            ) + 3;

        for (
            let columnIndex = 0;
            columnIndex < totalColumns;
            columnIndex++
        ) {
            columns.push(
                createHeartColumn(columnIndex)
            );
        }

        lastAnimationTime = performance.now();

        animationFrameId =
            requestAnimationFrame(
                animateHeartColumns
            );
    }

    function animateHeartColumns(currentTime) {
        const deltaTime = Math.min(
            (
                currentTime -
                lastAnimationTime
            ) / 1000,
            0.05
        );

        lastAnimationTime = currentTime;

        let rightmostX = Math.max(
            ...columns.map(
                (column) => column.x
            )
        );

        columns.forEach((column) => {
            column.x -= column.speed * deltaTime;

            if (column.x < -columnSpacing) {
                column.x =
                    rightmostX + columnSpacing;

                rightmostX = column.x;
            }

            column.element.style.transform =
                `translate3d(${column.x}px, 0, 0)`;
        });

        animationFrameId =
            requestAnimationFrame(
                animateHeartColumns
            );
    }

    buildHeartColumns();

    let resizeTimer = null;

    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(() => {
            buildHeartColumns();
        }, 150);
    });
}