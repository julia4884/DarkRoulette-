document.getElementById("agree-btn").onclick = () => {
  document.getElementById("age-check").style.display = "none";
  document.getElementById("camera-check").style.display = "block";
  startVideo();
};

async function startVideo() {
  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  // Simulated age verification
  setTimeout(() => {
    document.getElementById("camera-check").style.display = "none";
    document.getElementById("chat-interface").style.display = "block";
    startChat();
  }, 3000);
}

async function saveVIP(email, type) {
  try {
    const res = await fetch("https://darkroulette.onrender.com/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type })
    });

    if (res.ok) {
      console.log("VIP saved");
    } else {
      console.error("Failed to save VIP");
    }
  } catch (err) {
    console.error("Network error:", err);
  }
}

async function checkVIP(email) {
  try {
    const res = await fetch(`https://darkroulette.onrender.com/api/check?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    if (data.status === "VIP") {
      console.log("User is VIP:", data.type);
    } else {
      console.log("User is FREE");
    }
  } catch (err) {
    console.error("Check failed:", err);
  }
}
function startChat() {
  // PeerJS, socket.io, etc.
  console.log("Chat started.");
}
