// List of image URLs
const images = ["assets/landerDemo1.png", "assets/landerDemo2.png"];
let currentIndex = 0;
function rotateImage() {
    // Increment the index and wrap around if it exceeds the number of images
    currentIndex = (currentIndex + 1) % images.length;
    // Change the image source to the next image in the list
    document.getElementById("rotatingImage").src = images[currentIndex];
}
