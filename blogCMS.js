// Fetch JSON data and dynamically generate the grid
console.log("blogCMS.js loaded");
fetch('blog-posts.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load JSON data");
        }
        return response.json();
    })
    .then(data => {
        console.log("JSON Data:", data); // Debugging output to ensure data is loaded
        // Get the blog grid container
        const blogGrid = document.getElementById('blogGrid');

        // Check if blogGrid element exists
        if (!blogGrid) {
            console.error("Error: blogGrid element not found");
            return;
        }

        // Loop over each item in the JSON data
        data.forEach(item => {
            // Create the main container for the grid item
            const gridItem = document.createElement('div');
            gridItem.classList.add('blog-grid-item');

            // Create and set the thumbnail image
            const thumbnail = document.createElement('img');
            thumbnail.classList.add('blog-thumbnail');
            thumbnail.src = item.thumbnail;
            thumbnail.alt = item.title;

            // Create and set the title
            const title = document.createElement('h3');
            title.classList.add('blog-title');
            title.textContent = item.title;

            // Create and set the description
            const description = document.createElement('p');
            description.classList.add('blog-description');
            description.textContent = item.description;

            // Append the thumbnail, title, and description to the grid item
            gridItem.appendChild(thumbnail);
            gridItem.appendChild(title);
            gridItem.appendChild(description);

            // Append the grid item to the blog grid container
            blogGrid.appendChild(gridItem);
        });
    })
    .catch(error => console.error("Error loading blog content:", error));
