document.addEventListener('DOMContentLoaded', function() {
    // Get canvas
    const canvas = document.getElementById('bonds-canvas');
    if (!canvas) {
        console.error('Canvas element with ID "bonds-canvas" not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get 2D context for canvas!');
        return;
    }

    let particlesArray = [];
    let width, height;
    let isMouseOverText = false;

    // Set canvas size
    function setCanvasSize() {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;
        console.log('Canvas resized to:', width, height);
    }
    setCanvasSize();

    // Particle constructor
    function Particle() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width || this.x < 0) this.speedX *= -1;
        if (this.y > height || this.y < 0) this.speedY *= -1;

        if (mouse.x !== null && mouse.y !== null && !isMouseOverText) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let forceX = (dx / distance) * force * 0.5;
                let forceY = (dy / distance) * force * 0.5;
                this.speedX -= forceX;
                this.speedY -= forceY;
            }
        }
    };

    Particle.prototype.draw = function() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    // Initialize particles
    function init() {
        particlesArray = [];
        for (let i = 0; i < 80; i++) {
            particlesArray.push(new Particle());
        }
        console.log('Initialized', particlesArray.length, 'particles');
    }

    // Draw particles and bonds
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            for (let j = i + 1; j < particlesArray.length; j++) {
                let dx = particlesArray[i].x - particlesArray[j].x;
                let dy = particlesArray[i].y - particlesArray[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(144, 238, 144, ' + (1 - distance / 150) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    // Handle mouse interaction
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    canvas.addEventListener('mousemove', function(event) {
        if (!isMouseOverText) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            console.log('Mouse moved:', mouse.x, mouse.y);
        }
    });

    canvas.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
        console.log('Mouse left canvas');
    });

    // Detect mouse over text elements
    const textElements = document.querySelectorAll('#home-section h1, #home-section p, #home-section button');
    if (textElements.length === 0) {
        console.warn('No text elements found in #home-section! Check selectors.');
    } else {
        console.log('Found', textElements.length, 'text elements');
    }
    textElements.forEach(element => {
        element.addEventListener('mouseover', function() {
            isMouseOverText = true;
            mouse.x = null;
            mouse.y = null;
            console.log('Mouse over text');
        });
        element.addEventListener('mouseout', function(event) {
            isMouseOverText = false;
            if (canvas === event.relatedTarget || canvas.contains(event.relatedTarget)) {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
                console.log('Mouse returned to canvas:', mouse.x, mouse.y);
            }
            console.log('Mouse left text');
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        setCanvasSize();
        init();
    });

    // Start animation
    init();
    animate();
});