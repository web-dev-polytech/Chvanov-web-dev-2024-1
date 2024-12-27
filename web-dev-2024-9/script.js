const windowElement = document.getElementById('custom-window');
const openBtn = document.getElementById('open-btn');
const titleBar = document.querySelector('.title-bar');

let isDragging = false;
let offsetX, offsetY;

// Function to open the window
function openWindow() {
  windowElement.style.display = 'flex';
}

// Function to close the window
function closeWindow() {
  windowElement.style.display = 'none';
}

// Mouse down event to start dragging
titleBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - windowElement.offsetLeft;
  offsetY = e.clientY - windowElement.offsetTop;
  document.addEventListener('mousemove', moveWindow);
  document.addEventListener('mouseup', stopDragging);
});

// Function to move the window
function moveWindow(e) {
  if (isDragging) {
    windowElement.style.left = `${e.clientX - offsetX}px`;
    windowElement.style.top = `${e.clientY - offsetY}px`;
  }
}

// Function to stop dragging
function stopDragging() {
  isDragging = false;
  document.removeEventListener('mousemove', moveWindow);
  document.removeEventListener('mouseup', stopDragging);
}
