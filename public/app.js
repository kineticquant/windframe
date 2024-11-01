// Enabling drop + drag
function allowDrop(event) {
  event.preventDefault();
}
function drag(event, componentHtml) {
  event.dataTransfer.setData("text/html", componentHtml);
  // Also set the ID of the dragged element if it's an existing component
  const elementId = event.target.id; // Assuming the draggable element has an ID
  event.dataTransfer.setData("text/plain", elementId);
}

// Drop to canvas
function drop(event) {
  event.preventDefault();

  const componentHtml = event.dataTransfer.getData("text/html");
  const canvas = document.getElementById("canvas");

  // Checks if  dropping new component from the components list otherwise its existing canvas element
  if (componentHtml) {
    const crtComponent = document.createElement("div");

    crtComponent.innerHTML = componentHtml;
    crtComponent.style.position = "absolute";
    crtComponent.style.left = `${event.clientX - canvas.offsetLeft}px`;
    crtComponent.style.top = `${event.clientY - canvas.offsetTop}px`;
    crtComponent.className = "border border-gray-400 p-4 relative"; // sample Tailwind
    crtComponent.setAttribute("draggable", "true");
    // assigns uniqueid for future canvas reference if we want to reposition
    crtComponent.id = `component-${Date.now()}`; // unique id is based on timestamp to ensure uniqueness

    // event listeners
    attachEventListeners(crtComponent);
    addResizeHandles(crtComponent);
    canvas.appendChild(crtComponent);
  } else {
    // if dragging an existing element
    const id = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);

    if (draggedElement && canvas.contains(draggedElement)) {
      const canvasRect = canvas.getBoundingClientRect();
      // calculate new position
      const newLeft = event.clientX - canvasRect.left - (draggedElement.offsetWidth / 2);
      const newTop = event.clientY - canvasRect.top - (draggedElement.offsetHeight / 2);
      // update the position of the element
      draggedElement.style.left = `${newLeft}px`;
      draggedElement.style.top = `${newTop}px`;
      // force visibility of Tailwind element
      draggedElement.style.opacity = "1"; // Ensure it's fully visible
      draggedElement.style.display = "block"; // Make sure it's displayed
    }
  }
}

function attachEventListeners(element) {
  element.addEventListener("dragstart", dragMoveStart);
  element.addEventListener("dragend", dragMoveEnd);
  element.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("resize-handle")) {
      dragMoveStart(e); // Start dragging if not clicking on a resize handle 
                        // otherwise resize handles overlap and prevent reposition of existing elements on canvas
    }
  });
  element.addEventListener("click", (e) => {
    e.stopPropagation(); // prevents event bubbling to canvas
    reselectElem(element);
  });
}

function dragMoveStart(event) {
  event.dataTransfer.setData("text/plain", null); // for Firefox
  event.target.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  this.offsetX = event.clientX - event.target.offsetLeft;
  this.offsetY = event.clientY - event.target.offsetTop;
}

function dragMoveEnd(event) {
  event.preventDefault();

  const target = event.target;
  if (target.classList.contains("dragging")) {
    target.style.left = `${event.clientX - this.offsetX}px`;
    target.style.top = `${event.clientY - this.offsetY}px`;
    target.classList.remove("dragging");
  }
}

// defining resize handles at corners
function addResizeHandles(element) {
  const corners = [
    { top: 0, left: 0, cursor: "nwse-resize" },  // Top-left corner
    { top: 0, right: 0, cursor: "nesw-resize" }, // Top-right corner
    { bottom: 0, left: 0, cursor: "nesw-resize" }, // Bottom-left corner
    { bottom: 0, right: 0, cursor: "nwse-resize" }  // Bottom-right corner
  ];

  corners.forEach(corner => {
    const resizeHandle = document.createElement("div");
    //forcing stylign here also defined in style.css
    resizeHandle.style.width = "10px";
    resizeHandle.style.height = "10px";
    resizeHandle.style.background = "transparent";
    resizeHandle.style.border = "1px solid #4A5568";
    resizeHandle.style.position = "absolute";
    resizeHandle.className = "resize-handle";
    resizeHandle.style.cursor = corner.cursor;

    //force handle position to corners
    resizeHandle.style[corner.top !== undefined ? 'top' : 'bottom'] = "-5px"; //offset
    resizeHandle.style[corner.left !== undefined ? 'left' : 'right'] = "-5px"; //

    // attach handles to component
    element.appendChild(resizeHandle);
    resizeHandle.addEventListener("mousedown", initResize);
    resizeHandle.addEventListener("mousedown", (e) => e.stopPropagation());

    function initResize(e) {
      e.preventDefault();
      window.addEventListener("mousemove", resizeElement);
      window.addEventListener("mouseup", stopResize);
    }

    function resizeElement(e) {
      const rect = element.getBoundingClientRect();
      const newWidth = Math.max(e.clientX - rect.left, 50); // minimum width
      const newHeight = Math.max(e.clientY - rect.top, 50); // minimum height

      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    }

    function stopResize() {
      window.removeEventListener("mousemove", resizeElement);
      window.removeEventListener("mouseup", stopResize);
    }
  });
}

function reselectElem(element) {
  const allElements = document.querySelectorAll("#canvas > div");

  allElements.forEach(el => {
    const handles = el.querySelectorAll(".resize-handle");
    handles.forEach(handle => {
      handle.style.display = "none";
    });
    el.style.border = "none";
  });

  const resizeHandles = element.querySelectorAll(".resize-handle");
  resizeHandles.forEach(handle => handle.style.display = "block");
  element.style.border = "1px solid #4A5568";
}

document.getElementById("canvas").addEventListener("click", () => {
  const allElements = document.querySelectorAll("#canvas > div");

  allElements.forEach(el => {
    const handles = el.querySelectorAll(".resize-handle");
    handles.forEach(handle => {
      handle.style.display = "none";
    });
    el.style.border = "none";
  });
});
