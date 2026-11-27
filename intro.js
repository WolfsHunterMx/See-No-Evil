
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
            transition: opacity 2s ease;
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

    let started = false;
    let closed = false;

    function scrollTerminal() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    async function type(text, speed = 35) {
        for (const character of text) {
            if (closed) return;
            output.textContent += character;
            scrollTerminal();
            await wait(speed * (0.5 + Math.random()));
        }

        output.textContent += "\n";
        scrollTerminal();
    }

    function closeIntro() {
        if (closed) return;
        closed = true;
        intro.style.opacity = "0";

        setTimeout(() => {
            intro.remove();
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", keyboard);
        }, 1500);
    }

    function keyboard(event) {
        if (event.key === "Escape") {
            closeIntro();
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            start();
        }
    }

    async function start() {
        if (started || closed) return;
        started = true;
        intro.style.cursor = "default";

        await wait(500);

        await type("root@bastion:~$ ./sne_gateway --connect", 48);
        await wait(400);

        await type("[SYSTEM] Locating Dimension 001...", 18);
        await type("[SYSTEM] Remote host detected.", 15);
        await wait(350);

        await type("root@bastion:~$ initialize public_archive", 42);
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

        for (let i = 0; i < 120; i++) {
            if (closed) return;

            const hex = Array.from({ length: 8 }, () =>
                Math.floor(Math.random() * 256)
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

        await type("[ OK ] SECURE CONNECTION ESTABLISHED.", 15);
        await type("[ OK ] PUBLIC ARCHIVE UNLOCKED.", 15);

        await wait(500);
        await type("ACCESS GRANTED.", 65);

        await wait(600);
        await type("Welcome, visitor.", 55);
        await type("You are now behind the veil.", 55);

        await wait(1200);

        if (closed) return;

        cursor.style.display = "none";
        reveal.style.opacity = "1";

        await wait(4500);

        closeIntro();
    }

     let clickCount = 0; let lastClick = 0;  intro.addEventListener("click", () => {     if (closed) return;      const now = performance.now();      if (now - lastClick <= 1000) {         clickCount++;     } else {         clickCount = 1;     }      lastClick = now;      if (clickCount >= 3) {         intro.style.transition = "none";         closeIntro();         intro.remove();         document.body.style.overflow = previousOverflow;         return;     }      start(); });
    document.addEventListener("keydown", keyboard);

    intro.focus({ preventScroll: true });
})();
