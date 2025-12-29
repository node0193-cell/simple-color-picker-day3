const upload = document.getElementById('upload');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const hexVal = document.getElementById('hex-val');
const rgbaVal = document.getElementById('rgba-val');
const preview = document.getElementById('preview');
const statusMsg = document.getElementById('status-msg');

// Load Image to Canvas
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Detect Color Data
function getPixelColor(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1).toUpperCase();
    const rgba = `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${(p[3] / 255).toFixed(2)})`;

    return { hex, rgba };
}

// Update UI on Hover
canvas.addEventListener('mousemove', (e) => {
    const color = getPixelColor(e);
    preview.style.backgroundColor = color.rgba;
    hexVal.innerText = `HEX: ${color.hex}`;
    rgbaVal.innerText = `RGBA: ${color.rgba}`;
});

// Copy to Clipboard on Click
canvas.addEventListener('click', (e) => {
    const color = getPixelColor(e);
    navigator.clipboard.writeText(color.hex).then(() => {
        const originalText = statusMsg.innerText;
        statusMsg.innerText = `✅ Copied ${color.hex}!`;
        statusMsg.style.color = "#2ecc71";
        
        setTimeout(() => {
            statusMsg.innerText = originalText;
            statusMsg.style.color = "#777";
        }, 2000);
    });
});
