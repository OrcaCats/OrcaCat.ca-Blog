// timelineGenerator.js

// Function to generate timeline items from JSON data
async function generateTimeline() {
    try {
      // Fetch the JSON data
      const response = await fetch('timelineData.json');
      const data = await response.json();
  
      // Get the timeline container
      const timeline = document.querySelector('.timeline');
  
      // Loop over the data
      data.forEach((item, index) => {
        // Create the timeline item element
        const timelineItem = document.createElement('div');
  
        // Alternate sides
        if (index % 2 === 0) {
          timelineItem.className = 'timeline-item left';
        } else {
          timelineItem.className = 'timeline-item right';
        }
  
        // Handle the last item on the left
        if (index === data.length - 1 && index % 2 === 0) {
          timelineItem.className += ' leftLast';
        }
  
        // Create the image element
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'Event Image';
  
        // Create the content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
  
        // Create the date div
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = item.date;
  
        // Create the title h3
        const titleH3 = document.createElement('h3');
        titleH3.textContent = item.title;
  
        // Create the description p
        const descriptionP = document.createElement('p');
        descriptionP.textContent = item.description;
  
        // Append elements to contentDiv
        contentDiv.appendChild(dateDiv);
        contentDiv.appendChild(titleH3);
        contentDiv.appendChild(descriptionP);
  
        // Append img and contentDiv to timelineItem
        timelineItem.appendChild(img);
        timelineItem.appendChild(contentDiv);
  
        // Append timelineItem to timeline
        timeline.appendChild(timelineItem);
      });
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    }
  }
  
  // Call the function to generate the timeline after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', generateTimeline);
  