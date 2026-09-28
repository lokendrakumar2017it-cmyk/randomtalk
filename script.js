const statusText = document.querySelector(".status");
const startButton = document.querySelector(".primary-btn");
const chatBox = document.querySelector(".chat-box");

let connected = false;

function addMessage(text) {
  if (!chatBox) return;

  const message = document.createElement("div");
  message.className = "message";
  message.textContent = text;

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

if (startButton) {
  startButton.addEventListener("click", () => {
    connected = !connected;

    if (connected) {
      startButton.textContent = "Stop";
      if (statusText) {
        statusText.textContent = "Searching for a chat partner...";
      }

      addMessage("Waiting for another user...");
    } else {
      startButton.textContent = "Start Chat";
      if (statusText) {
        statusText.textContent = "Disconnected";
      }
    }
  });
}
