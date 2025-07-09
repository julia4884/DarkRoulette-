const canvas = document.getElementById("smoke");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.size = Math.random() * 20 + 20;
    this.speedY = Math.random() * -1.5 - 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.y += this.speedY;
    if (this.alpha > 0.005) this.alpha -= 0.001;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 20, 147, ${this.alpha})`; // чёрно-малиновый дым
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particlesArray.length < 100) {
    particlesArray.push(new Particle());
  }
  particlesArray.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particlesArray.splice(index, 1);
    }
  });
}

function animate() {
  handleParticles();
  requestAnimationFrame(animate);
}

animate();
