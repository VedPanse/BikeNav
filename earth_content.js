function addRainGIF() {
    // Create an image element
    var img = document.createElement('img');
    
    // Set attributes for the image element
    img.src = chrome.runtime.getURL('media/transparent_rainy.gif'); // Load the GIF file from the extension's local files
    img.style.position = 'fixed';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.zIndex = 300;
    img.style.top = '0';
    img.style.left = '0';
    img.style.pointerEvents = 'none';
    img.style.zIndex = '-1';
    img.style.opacity = '0.5'; // Adjust the opacity as needed
    
    // Append the image element to the body
    document.body.appendChild(img);
}

// Call the function to add the rain GIF
addRainGIF();
