const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.75 ? '#ff0033' : '#555';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    resize();
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
    particles = Array.from({ length: count }, () => new Particle());
}

function connect() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 0, 51, ${0.15 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    animationId = requestAnimationFrame(animate);
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initParticles, 250);
});

initParticles();
animate();

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});


const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

if (terminalInput && terminalOutput) {
    const commands = {
        help: () => `Available commands:<br><span class="highlight">about</span> - Learn about Siroos<br><span class="highlight">skills</span> - See tech stack<br><span class="highlight">games</span> - Game dev info<br><span class="highlight">contact</span> - Get in touch<br><span class="highlight">clear</span> - Clear the screen<br><span class="highlight">sudo</span> - Try it... ;)`,
        about: () => `Hey, I'm <span class="highlight">Siroos</span>! A developer passionate about games, apps, and creative experiences.`,
        skills: () => `Languages: C#, HTML5, CSS3, JavaScript<br>Tools: Unity, Windows Forms, Android, Git, GitHub`,
        games: () => `🎮 I love building interactive worlds and gameplay experiences!<br>Every game starts with an idea... and lots of bugs. 😄`,
        contact: () => `📫 Want to collaborate?<br>📧 Siroos503@gmail.com<br>📸 <a href="https://instagram.com/siroos0001" target="_blank" class="highlight">@siroos0001</a>`,
        sudo: () => `<span class="highlight">⚡ Nice try! But this terminal is already yours.</span>`,
        clear: () => { terminalOutput.innerHTML = ''; return null; }
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim().toLowerCase();
            if (!cmd) return;

            const userLine = document.createElement('p');
            userLine.innerHTML = `<span class="prompt">➜</span> <span class="user-cmd">${cmd}</span>`;
            terminalOutput.appendChild(userLine);

            const response = commands[cmd];
            if (response) {
                const result = response();
                if (result !== null) {
                    const outputLine = document.createElement('p');
                    outputLine.className = 'output';
                    outputLine.innerHTML = result;
                    terminalOutput.appendChild(outputLine);
                }
            } else {
                const errorLine = document.createElement('p');
                errorLine.className = 'output';
                errorLine.innerHTML = `Command not found: <span class="highlight">${cmd}</span>. Type <span class="highlight">help</span> for available commands.`;
                terminalOutput.appendChild(errorLine);
            }

            terminalInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    const playground = document.querySelector('#playground .terminal');
    if (playground) {
        playground.addEventListener('click', () => terminalInput.focus());
    }
}


(function() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];

    let konamiIndex = 0;
    let konamiActive = false;

    function activateKonami() {
        if (konamiActive) return;
        konamiActive = true;

        console.log('🎮 KONAMI CODE ACTIVATED!');
        document.body.classList.add('konami-active');

        const msg = document.createElement('div');
        msg.className = 'easter-egg-msg';
        msg.innerHTML = `
            <div class="easter-icon">🎮</div>
            <h2>SECRET UNLOCKED!</h2>
            <p>You found the Konami Code! A true gamer. 🕹️</p>
            <p class="easter-sub">↑ ↑ ↓ ↓ ← → ← → B A</p>
        `;
        document.body.appendChild(msg);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => msg.classList.add('show'));
        });

        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => {
                msg.remove();
                document.body.classList.remove('konami-active');
                konamiActive = false;
            }, 500);
        }, 5000);
    }

    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            return;
        }

        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

        if (key === konamiCode[konamiIndex]) {
            konamiIndex++;
            console.log(`Konami progress: ${konamiIndex}/${konamiCode.length}`);

            if (konamiIndex === konamiCode.length) {
                activateKonami();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = (key === konamiCode[0]) ? 1 : 0;
        }
    });

    console.log('🎮 Konami code active. Try: ↑ ↑ ↓ ↓ ← → ← → B A');
})();


const backToTop = document.getElementById('back-to-top');
const scrollProgress = document.getElementById('scroll-progress');

if (backToTop && scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        
        
        scrollProgress.style.width = progress + '%';
        
        
        if (scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}