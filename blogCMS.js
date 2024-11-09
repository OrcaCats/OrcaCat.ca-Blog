// Load the JSON content and update the blog grid items
fetch('blog-posts.json')
    .then(response => response.json())
    .then(data => {
        // Select all blog grid items
        const blogGridItems = document.querySelectorAll('.blog-grid-item');

        // Loop over each grid item and apply JSON data
        blogGridItems.forEach((item, index) => {
            if (data[index]) {
                // Set the thumbnail, title, and description
                item.querySelector('.blog-thumbnail').src = data[index].thumbnail;
                item.querySelector('.blog-title').textContent = data[index].title;
                item.querySelector('.blog-description').textContent = data[index].description;
            }
        });
    })
    .catch(error => console.error("Error loading blog content:", error));
