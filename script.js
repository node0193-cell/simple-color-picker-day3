const pickBtn = document.getElementById('pick-btn');
const resultContainer = document.getElementById('result-container');
const previewBox = document.getElementById('preview-box');
const hexDisplay = document.getElementById('hex-val');
const rgbDisplay = document.getElementById('rgb-val');
const hslDisplay = document.getElementById('hsl-val');
const cmykDisplay = document.getElementById('cmyk-val');
const errorMsg = document.getElementById('error-msg');

pickBtn.addEventListener('click', async () => {
    // 1. Check for browser support (Chromium-based like Chrome/Edge)
    if (!window.EyeDropper) {
        errorMsg.textContent = "Your browser doesn't support the EyeDropper API. Try Chrome or Edge.";
        return;
    }

    const eyeDropper = new EyeDropper();
    try {
        // 2. Open dropper and get HEX result
        const { sRGBHex } = await eyeDropper.open();
        updateUI(sRGBHex);
    } catch (err) {
        console.log("Selection canceled");
    }
});

function updateUI(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    previewBox.style.backgroundColor = hex;
    hexDisplay.textContent = hex.toUpperCase();
    rgbDisplay.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    hslDisplay.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    cmykDisplay.textContent = `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`;
    
    resultContainer.classList.remove('hidden');
}

// --- CONVERSION UTILS ---

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h = Math.round(h * 60);
    }
    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c, m, y, k };
}

document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(hexDisplay.textContent);
    alert("HEX code copied!");
});
