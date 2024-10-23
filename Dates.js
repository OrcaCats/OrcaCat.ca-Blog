// dateFormatter.js
export function formatDate() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const today = new Date();
    return today.toLocaleDateString('en-US', options);
  }
  
  export function updateDateText(elementId) {
    const dateText = formatDate();
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = dateText;
    } else {
      console.warn(`Element with ID '${elementId}' not found.`);
    }
  }
  