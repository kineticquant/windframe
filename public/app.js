// enabling drop functionality
function allowDrop(event) {
  event.preventDefault();
}

// drag from sidebar
function drag(event, componentHtml) {
  event.dataTransfer.setData("text/html", componentHtml);
}

// drop to canvas
function drop(event) {
  event.preventDefault();

  const componentHtml = event.dataTransfer.getData("text/html");
  const crtComponent = document.createElement("div");
  crtComponent.innerHTML = componentHtml;

  // styling
  crtComponent.style.position = "absolute";
  crtComponent.style.left = `${event.clientX - event.target.offsetLeft}px`;
  crtComponent.style.top = `${event.clientY - event.target.offsetTop}px`;
  crtComponent.setAttribute("draggable", "true");

  // repositioning
  crtComponent.addEventListener("dragstart", dragMoveStart);
  crtComponent.addEventListener("dragend", dragMoveEnd);

  document.getElementById("canvas").appendChild(crtComponent);
}

function dragMoveStart(event) {
  // track initial position
  event.dataTransfer.setData("text/plain", null); //for Firefox
  event.target.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  this.offsetX = event.clientX - event.target.offsetLeft;
  this.offsetY = event.clientY - event.target.offsetTop;
}

// moving element on Canvas
function dragMoveEnd(event) {
  event.preventDefault();
  
  // updating position
  event.target.style.left = `${event.clientX - this.offsetX}px`;
  event.target.style.top = `${event.clientY - this.offsetY}px`;
  event.target.classList.remove("dragging");
}

