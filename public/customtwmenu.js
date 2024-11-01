const contextMenu = document.createElement("div");
contextMenu.className = "context-menu hidden"; // use Tailwind to hide it by default
contextMenu.innerHTML = `
  <button id="customTW" class="text-sm px-4 py-2 hover:bg-gray-200">Enter Custom Tailwind</button>
  <button id="deleteComponent" class="text-sm px-4 py-2 hover:bg-gray-200">Delete</button>
`;
document.body.appendChild(contextMenu);

function showContextMenu(event, element) {
  event.preventDefault();
  contextMenu.classList.remove("hidden");
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.top = `${event.clientY}px`;

  document.getElementById("customTW").onclick = () => customizeTW(element);
  document.getElementById("deleteComponent").onclick = () => deleteComponent(element);
}

function customizeTW(element) {
  const newbgCls = prompt("Modify with custom Tailwind. Example: Enter a new color (e.g., bg-red-500):");
  if (newbgCls) {
    // Remove existing bg classes
    element.classList.remove(...Array.from(element.classList).filter(cls => cls.startsWith('bg-')));
    // Add the new bg class
    element.classList.add(newbgCls);
  }
  hideContextMenu();
}

// delete component
function deleteComponent(element) {
  element.remove();
  hideContextMenu();
}

function hideContextMenu() {
  contextMenu.classList.add("hidden");
}

//hide context menu when clicking outside of it or on canvas
document.addEventListener("click", hideContextMenu);