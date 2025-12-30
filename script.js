document.addEventListener('DOMContentLoaded', () => {
    const blowButton = document.getElementById('blow-candles-btn');
    const flames = document.querySelectorAll('.flame');
    const song = document.getElementById('birthday-song');
    const wishMessage = document.getElementById('wish-message');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    let confettiParticles = [];
    const colors = ['#f7d354', '#f6a744', '#f28346', '#e76f51', '#e9c46a', '#2a9d8f', '#264653'];

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // --- Confetti Logic ---
    class ConfettiParticle {
        constructor(x, y, color, vx, vy) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 3.5 + 2;
            this.vx = vx;
            this.vy = vy;
            this.gravity = 0.2;
            this.friction = 0.99;
            this.opacity = 1;
            this.life = 150; // frames
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            this.vy += this.gravity;
            this.vx *= this.friction;
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            if (this.life < 40) {
                this.opacity = Math.max(0, this.life / 40);
            }
            this.draw();
        }
    }

    function createConfettiBurst() {
        const particleCount = 300; // More particles for a fuller effect
        
        for (let i = 0; i < particleCount; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            let startX, vx;

            // Randomly choose left or right side
            if (Math.random() < 0.5) {
                // Left side
                startX = Math.random() * 20 - 20;
                vx = Math.random() * 8 + 2; // Move right
            } else {
                // Right side
                startX = canvas.width + Math.random() * 20;
                vx = -(Math.random() * 8 + 2); // Move left
            }

            const startY = Math.random() * canvas.height;
            const vy = Math.random() * -10 - 5; // Initial upward velocity

            confettiParticles.push(new ConfettiParticle(startX, startY, color, vx, vy));
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles = confettiParticles.filter(p => p.life > 0);
        
        if (confettiParticles.length === 0) {
            return; // Stop animation if no particles left
        }

        confettiParticles.forEach(p => p.update());
        requestAnimationFrame(animateConfetti);
    }

    // --- Button Click Logic ---
    blowButton.addEventListener('click', () => {
        // Play song - user interaction is required for autoplay in most browsers
        song.play().catch(error => {
            console.log("Autoplay was prevented. User needs to interact with the page first.");
        });

        // Add 'blown-out' class to flames
        flames.forEach(flame => {
            flame.classList.add('blown-out');
        });

        // Hide the button
        blowButton.style.display = 'none';

        // Trigger confetti after a short delay
        setTimeout(() => {
            createConfettiBurst();
            animateConfetti();
            
            // Show the final wish message
            wishMessage.classList.remove('hidden');
        }, 500); // 500ms delay to sync with candle animation
    });
});
