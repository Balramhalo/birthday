document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("start-btn");
    const letterSection = document.querySelector(".hidden-content");
    const galleryBtn = document.getElementById("gallery-btn");
    const gallerySection = document.querySelector(".gallery");
    const bgMusic = document.getElementById("bg-music");

    // Play music on button click
    startBtn.addEventListener("click", function() {
        letterSection.style.display = "block";
        startBtn.style.display = "none";
        bgMusic.play();
        startFireworks();
    });

    // Show gallery on button click
    galleryBtn.addEventListener("click", function() {
        gallerySection.style.display = "block";
    });

    // Fireworks Animation
    function startFireworks() {
        const canvas = document.getElementById("fireworks");
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];

        function Particle(x, y, speedX, speedY, color) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.color = color;
            this.alpha = 1;
        }

        Particle.prototype.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
        };

        function createFirework(x, y) {
            for (let i = 0; i < 50; i++) {
                let speedX = (Math.random() - 0.5) * 6;
                let speedY = (Math.random() - 0.5) * 6;
                let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                particles.push(new Particle(x, y, speedX, speedY, color));
            }
        }

        function animateFireworks() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();

                p.update();
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            requestAnimationFrame(animateFireworks);
        }

        canvas.addEventListener("click", function(e) {
            createFirework(e.clientX, e.clientY);
        });

        animateFireworks();
    }
});