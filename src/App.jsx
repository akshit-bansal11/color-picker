import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";

// HEXA to RGBA
function hexToRgba(hex) {
  let hexValue = hex.replace("#", "");
  if (hexValue.length === 6) hexValue += "ff";
  const r = parseInt(hexValue.slice(0, 2), 16);
  const g = parseInt(hexValue.slice(2, 4), 16);
  const b = parseInt(hexValue.slice(4, 6), 16);
  const a = parseInt(hexValue.slice(6, 8), 16) / 255;
  return { r, g, b, a };
}

// RGBA to HSLA
function rgbaToHsla(r, g, b, a) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: a
  };
}

// RGBA to CMYK
function rgbaToCmyk(r, g, b) {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, m, y);
  c = ((c - k) / (1 - k)) * 100;
  m = ((m - k) / (1 - k)) * 100;
  y = ((y - k) / (1 - k)) * 100;
  k = k * 100;
  return {
    c: Math.round(c),
    m: Math.round(m),
    y: Math.round(y),
    k: Math.round(k)
  };
}

// Calculate brightness for tailwind brightness coding
function getBrightness(r, g, b) {
  // Perceived brightness formula
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Map brightness to Tailwind brightness utility
function getTailwindBrightness(r, g, b) {
  const brightness = getBrightness(r, g, b);
  if (brightness > 240) return "brightness-200";
  if (brightness > 200) return "brightness-150";
  if (brightness > 160) return "brightness-125";
  if (brightness > 120) return "brightness-100";
  if (brightness > 80) return "brightness-75";
  if (brightness > 40) return "brightness-50";
  return "brightness-0";
}

function ColorInfo({ color }) {
  const { r, g, b, a } = hexToRgba(color);
  const hex = color.slice(0, 7);
  const hexa = color;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  const { h, s, l } = rgbaToHsla(r, g, b, a);
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  const hsla = `hsla(${h}, ${s}%, ${l}%, ${a.toFixed(2)})`;
  const tailwindColor = `bg-[${color}]`;
  const tailwindColorHex = `bg-[${hex}]`;
  const { c, m, y, k } = rgbaToCmyk(r, g, b);
  const cmyk = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
  const tailwindBrightness = getTailwindBrightness(r, g, b);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-[80%]"
    >
      <InfoItem label="HEX" value={hex} />
      <InfoItem label="HEXA" value={hexa} />
      <InfoItem label="RGB" value={rgb} />
      <InfoItem label="RGBA" value={rgba} />
      <InfoItem label="HSL" value={hsl} />
      <InfoItem label="HSLA" value={hsla} />
      <InfoItem label="Tailwind" value={tailwindColorHex} />
      <InfoItem label="Tailwind-A" value={tailwindColor} />
      <InfoItem label="CMYK" value={cmyk} />
    </motion.div>
  );
}

function InfoItem({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex justify-between items-center w-[80%] bg-neutral-700 rounded-xl px-3 py-1 font-mono text-lg relative group">
        <span className="truncate text-sm">{value}</span>
        <button
          onClick={handleCopy}
          className="flex gap-2 text-gray-400 hover:text-white transition-colors"
          title="Copy"
          tabIndex={-1}
        >
          {copied && (
            <span className="text-green-400 text-xs">
              Copied!
            </span>
          )}
          <FiCopy size={18} />
        </button>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function ColorPreview({ color }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex items-center justify-center"
    >
      <div
        className="relative flex items-center justify-center lg:w-36 md:w-28 w-20 lg:h-36 md:h-28 h-20"
      >
        <div 
          className="absolute w-[90%] h-[90%] gap-4 p-2 grid grid-cols-2"
        >
          <div
            className="rounded-lg bg-white"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          />
          <div
            className="rounded-lg bg-white/60"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          />
          <div
            className="rounded-lg bg-white/20"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          />
          <div
            className="rounded-lg bg-black"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          />
        </div>
        {/* Color preview on top */}
        <div
          className="relative rounded-xl"
          style={{
            background: color,
            width: "100%", // slightly smaller than the white circle
            height: "100%",
            zIndex: 1,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function App() {
  const [color, setColor] = useState("#3498dbff");

  return (
    <div className="flex m-0 min-h-screen bg-neutral-900 text-white lg:p-6 md:p-3 p-1.5">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-[100%] gap-4 bg-neutral-800 border-neutral-500 rounded-2xl lg:p-8 md:p-4 p-2 flex flex-col items-center"
      >
        <HexAlphaColorPicker color={color} onChange={setColor} style={{ width: "100%", height: 400 }} />
        <div className="w-full flex gap-2 justify-between items-start">
          <ColorInfo color={color} />
          <ColorPreview color={color} />
        </div>
      </motion.div>
    </div>
  );
}
