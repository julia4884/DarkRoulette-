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

function startChat() {
  // PeerJS, socket.io, etc.
  console.log("Chat started.");
}
