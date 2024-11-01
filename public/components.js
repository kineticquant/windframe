// loading components for the side bar
fetch('/components.json')
  .then(response => response.json())
  .then(data => renderSidebar(data));

function renderSidebar(components) {
  const sidebar = document.getElementById('components-list');
  components.forEach(component => {
    const componentElem = document.createElement('div');
    componentElem.innerHTML = component.preview;
    // Adds a surrounding white border frame around each component but does not look the best
    // componentElem.className = 'p-2 border rounded my-2 bg-white cursor-pointer';
    componentElem.className = 'p-2 border cursor-pointer';
    componentElem.draggable = true;
    componentElem.ondragstart = (ev) => drag(ev, component.html);
    sidebar.appendChild(componentElem);
  });
}