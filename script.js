
const upload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const hexText = document.getElementById('hexValue');
const rgbText = document.getElementById('rgbValue');
const preview = document.getElementById('colorPreview');
const copyBtn = document.getElementById('copyBtn');

// Load and render image to canvas
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Keep image within a reasonable view size while maintaining aspect ratio
            const maxWidth = 500;
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Extract color on mouse move or click
const pickColor = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Retrieve pixel data (R, G, B, A) at specific coordinate
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;

    // Convert to HEX format
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;

    // Update UI elements
    preview.style.backgroundColor = hex;
    hexText.textContent = hex.toUpperCase();
    rgbText.textContent = rgb;
};

// Event Listeners for Interaction
canvas.addEventListener('mousemove', pickColor);
canvas.addEventListener('click', pickColor);

// Modern Clipboard API for Copy Button
copyBtn.addEventListener('click', () => {
    const color = hexText.textContent;
    navigator.clipboard.writeText(color).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
});
