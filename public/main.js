let localEmail = localStorage.getItem("userEmail");
const room = window.location.pathname.includes("intimate") ? "intimate" : "default";
let timerInterval;

function updateTimerDisplay(seconds) {
  const timerDisplay = document.getElementById("timer");
  if (!timerDisplay) return;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function showVIPPrompt() {
  const prompt = document.createElement("div");
  prompt.innerHTML = `
    <div class="vip-overlay">
      <div class="vip-box">
        <h2>Time's up!</h2>
        <p>Your free time is over. Upgrade to VIP for unlimited access.</p>
        <a href="/shop.html" class="vip-button">Go VIP</a>
      </div>
    </div>`;
  document.body.appendChild(prompt);
}

function startTimer(duration) {
  let remaining = duration;
  updateTimerDisplay(remaining);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      showVIPPrompt();
    }

    fetch(`/api/timer/save?email=${encodeURIComponent(localEmail)}&room=${room}&seconds=${remaining}`);
  }, 1000);
}

function fetchAndStartTimer() {
  fetch(`/api/timer/load?email=${encodeURIComponent(localEmail)}&room=${room}`)
    .then(res => res.json())
    .then(data => {
      const defaultTime = room === "intimate" ? 15 * 60 : 2 * 60 * 60;
      const timeToUse = data.seconds !== undefined ? data.seconds : defaultTime;
      startTimer(timeToUse);
    });
}

window.addEventListener("load", () => {
  if (!localEmail) {
    const stored = prompt("Enter your email to continue:");
    if (stored) {
      localStorage.setItem("userEmail", stored);
      localEmail = stored;
    } else {
      alert("Email is required.");
      return;
    }
  }

  fetch(`/api/check?email=${encodeURIComponent(localEmail)}`)
    .then(res => res.json())
    .then(data => {
      const userLabel = document.getElementById("user-label");
      if (userLabel) {
        userLabel.textContent = localEmail;
      }

      if (data.status === "VIP") {
        const container = document.getElementById("video-container");
        if (container) {
          container.classList.add("vip-frame");
        }
        const badge = document.createElement("div");
        badge.className = "vip-badge";
        badge.textContent = `VIP - ${data.type}`;
        document.body.appendChild(badge);
      } else {
        fetchAndStartTimer();
      }
    });
});
