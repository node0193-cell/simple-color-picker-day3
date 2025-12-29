
const upload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const hexText = document.getElementById('hexValue');
const rgbText = document.getElementById('rgbValue');
const preview = document.getElementById('colorPreview');
const copyBtn = document.getElementById('copyBtn');

let isLocked = false; // State to remember if a color was clicked

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const maxWidth = 500;
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            isLocked = false; // Reset lock when new image is loaded
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Logic to get color from coordinates
function getColorAt(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;
    
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`.toUpperCase();
    const rgb = `rgb(${r}, ${g}, ${b})`;
    
    return { hex, rgb };
}

// Update UI display
function updateDisplay(colorObj) {
    preview.style.backgroundColor = colorObj.hex;
    hexText.textContent = colorObj.hex;
    rgbText.textContent = colorObj.rgb;
}

// Mouse Move: Only update if NOT locked
canvas.addEventListener('mousemove', (e) => {
    if (!isLocked) {
        const color = getColorAt(e);
        updateDisplay(color);
    }
});

// Click: Update the color and LOCK it
canvas.addEventListener('click', (e) => {
    isLocked = true; // Lock the color so mousemove stops changing it
    const color = getColorAt(e);
    updateDisplay(color);
    
    // Visual feedback that the color is selected
    canvas.style.outline = "3px solid " + color.hex;
});

// Reset lock if user wants to pick again (Optional: click preview to unlock)
preview.addEventListener('click', () => {
    isLocked = false;
    canvas.style.outline = "none";
});

// Copy Button: Now uses the "remembered" text
copyBtn.addEventListener('click', () => {
    const color = hexText.textContent;
    navigator.clipboard.writeText(color).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
});
