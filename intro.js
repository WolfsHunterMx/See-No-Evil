
(() => {
    const style = document.createElement("style");

    style.textContent = `
        #sne-intro {
            position: fixed;
            inset: 0;
            z-index: 999999;
            background: #000;
            color: #39ff65;
            font: 14px/1.6 "Courier New", monospace;
            cursor: pointer;
            overflow: hidden;
            transition: opacity 1.5s ease;
        }

        #sne-terminal {
            position: absolute;
            bottom: 24px;
            left: 24px;
            right: 24px;
            max-height: calc(100% - 48px);
            overflow: hidden;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            text-shadow: 0 0 6px #169b39;
        }

        #sne-cursor {
            display: inline-block;
            width: 9px;
            height: 16px;
            background: #39ff65;
            vertical-align: middle;
            animation: sne-blink 0.85s steps(1) infinite;
        }

        @keyframes sne-blink {
            50% { opacity: 0; }
        }

        #sne-reveal {
            position: absolute;
            inset: 0;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            opacity: 0;
            pointer-events: none;
        }

        #sne-reveal img {
            width: 160px;
            height: 160px;
            object-fit: contain;
            margin-bottom: 30px;
        }

        #sne-title {
            display: flex;
            justify-content: center;
            gap: clamp(18px, 4vw, 45px);
            color: #eee;
            font-size: clamp(22px, 5vw, 48px);
            letter-spacing: 6px;
        }

        #sne-subtitle {
            color: #888;
            font-size: 11px;
            letter-spacing: 3px;
            margin: 20px;
        }

        #sne-motto {
            color: #ddd;
            letter-spacing: 7px;
            margin-top: 35px;
        }

        #sne-static {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            image-rendering: pixelated;
            pointer-events: none;
        }

        @media (max-width: 600px) {
            #sne-terminal {
                font-size: 10px;
                left: 12px;
                right: 12px;
                bottom: 15px;
            }

            #sne-title {
                letter-spacing: 3px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #sne-cursor {
                animation: none;
            }

            #sne-intro {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);

    const intro = document.createElement("div");

    intro.id = "sne-intro";
    intro.tabIndex = 0;
    intro.setAttribute("role", "button");
    intro.setAttribute("aria-label", "Initialize connection");

    intro.innerHTML = `
        <div id="sne-terminal">
            <span id="sne-output"></span><span id="sne-cursor"></span>
        </div>

        <div id="sne-reveal">
            <img src="./emblem.webp" alt="See No Evil">

            <div id="sne-title">
                <span>SEE</span>
                <span>NO</span>
                <span>EVIL</span>
            </div>

            <p>[ ACCESS GRANTED ]</p>

            <div id="sne-subtitle">
                INTERDIMENSIONAL INTELLIGENCE NETWORK
            </div>

            <div id="sne-motto">POST VELL</div>
        </div>
    `;

    document.body.appendChild(intro);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const terminal = document.getElementById("sne-terminal");
    const output = document.getElementById("sne-output");
    const cursor = document.getElementById("sne-cursor");
    const reveal = document.getElementById("sne-reveal");

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let started = false;
    let closed = false;
    let clickCount = 0;
    let lastClick = 0;
    let closeTimer = null;

    // TERMINAL SCROLL

    function scrollTerminal() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    // HUMAN TYPING SIMULATION

    async function type(text, speed = 35) {
        for (const character of text) {
            if (closed) return;

            output.textContent += character;
            scrollTerminal();

            await wait(speed * (0.5 + Math.random()));
        }

        if (closed) return;

        output.textContent += "\n";
        scrollTerminal();
    }

    // CLOSE INTRODUCTION

    function cleanup() {
        intro.remove();
        style.remove();

        document.body.style.overflow = previousOverflow;

        document.removeEventListener("keydown", keyboard);
    }

    function closeIntro(instant = false) {
        if (closed && !instant) return;

        closed = true;

        if (instant || reducedMotion) {
            clearTimeout(closeTimer);
            cleanup();
            return;
        }

        intro.style.opacity = "0";

        closeTimer = setTimeout(cleanup, 1500);
    }

    // KEYBOARD CONTROLS

    function keyboard(event) {
        if (event.key === "Escape") {
            closeIntro(true);
        } else if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            start();
        }
    }

    // ANALOG SIGNAL INTERRUPTION

    async function signalInterruption() {
        if (closed) return;

        cursor.style.display = "none";

        const noise = document.createElement("canvas");

        noise.id = "sne-static";
        noise.width = 480;
        noise.height = 270;

        const ctx = noise.getContext("2d");

        if (ctx && !reducedMotion) {
            intro.appendChild(noise);

            const pixels = ctx.createImageData(
                noise.width,
                noise.height
            );

            for (let frame = 0; frame < 14; frame++) {
                if (closed) {
                    noise.remove();
                    return;
                }

                // Television static

                for (
                    let i = 0;
                    i < pixels.data.length;
                    i += 4
                ) {
                    const shade = Math.random() * 150;

                    pixels.data[i] = shade;
                    pixels.data[i + 1] = shade;
                    pixels.data[i + 2] = shade;
                    pixels.data[i + 3] = 255;
                }

                ctx.putImageData(pixels, 0, 0);

                // Horizontal signal distortion

                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";

                for (let band = 0; band < 5; band++) {
                    ctx.fillRect(
                        0,
                        Math.random() * noise.height,
                        noise.width,
                        2 + Math.random() * 12
                    );
                }

                // Replace terminal with SNE insignia

                if (frame === 8) {
                    terminal.style.visibility = "hidden";
                    reveal.style.opacity = "1";
                    noise.style.opacity = "0.45";
                }

                await wait(55);
            }

            noise.remove();
        }

        if (closed) return;

        terminal.style.visibility = "hidden";
        reveal.style.opacity = "1";
    }

    // INITIALIZATION SEQUENCE

    async function start() {
        if (started || closed) return;

        started = true;
        intro.style.cursor = "default";

        await wait(500);

        await type(
            "root@bastion:~$ ./sne_gateway --connect",
            48
        );

        await wait(400);

        await type(
            "[SYSTEM] Locating Dimension 001...",
            18
        );

        await type(
            "[SYSTEM] Remote host detected.",
            15
        );

        await wait(350);

        await type(
            "root@bastion:~$ initialize public_archive",
            42
        );

        await wait(250);

        const modules = [
            "DIMENSIONAL_INTERFACE",
            "PERSONNEL_DATABASE",
            "VEIL_PROTOCOL",
            "ARCHIVE_INDEX",
            "BASTION_RELAY",
            "RIFT_MONITOR",
            "NETWORK_INTEGRITY",
            "PUBLIC_GATEWAY"
        ];

        // CODE CASCADE

        for (let i = 0; i < 120; i++) {
            if (closed) return;

            const hex = Array.from(
                { length: 8 },
                () => Math.floor(Math.random() * 256)
                    .toString(16)
                    .padStart(2, "0")
            ).join(" ").toUpperCase();

            const address = (4096 + i * 16)
                .toString(16)
                .toUpperCase();

            output.textContent +=
                `[0x${address}] ${hex} :: ${modules[i % modules.length]} [OK]\n`;

            scrollTerminal();

            await wait(12 + Math.random() * 20);
        }

        await wait(300);

        await type(
            "[ OK ] SECURE CONNECTION ESTABLISHED.",
            15
        );

        await type(
            "[ OK ] PUBLIC ARCHIVE UNLOCKED.",
            15
        );

        await wait(500);

        await type("ACCESS GRANTED.", 65);

        await wait(600);

        await type("Welcome, visitor.", 55);

        await type(
            "You are now behind the veil.",
            55
        );

        // SIGNAL INTERRUPTION

        await wait(350);

        if (closed) return;

        await signalInterruption();

        if (closed) return;

        // SNE INSIGNIA PRESENTATION

        await wait(3500);

        closeIntro();
    }

    // SECRET TRIPLE-CLICK BYPASS

    intro.addEventListener("click", () => {
        const now = performance.now();

        if (now - lastClick <= 1000) {
            clickCount++;
        } else {
            clickCount = 1;
        }

        lastClick = now;

        if (clickCount >= 3) {
            closeIntro(true);
            return;
        }

        start();
    });

    document.addEventListener("keydown", keyboard);

    intro.focus({ preventScroll: true });
})();
