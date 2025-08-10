import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { motion } from "framer-motion";

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function ColorInfo({ color }) {
  const { r, g, b } = hexToRgb(color);
  const rgba = `rgba(${r}, ${g}, ${b}, 1)`;
  const tailwindColor = `bg-[${color}]`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 grid grid-cols-2 gap-4 w-[60%]"
    >
      <InfoItem label="HEX" value={color} />
      <InfoItem label="RGB" value={`rgb(${r}, ${g}, ${b})`} />
      <InfoItem label="RGBA" value={rgba} />
      <InfoItem label="Tailwind" value={tailwindColor} />
    </motion.div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="font-mono text-lg">{value}</span>
    </div>
  );
}

function ColorPreview({ color }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-10"
    >
      <div
        className="w-36 h-36 rounded-xl"
        style={{ background: color }}
      ></div>
    </motion.div>
  );
}

export default function App() {
  const [color, setColor] = useState("#3498db");

  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen bg-neutral-900 text-white p-2">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-neutral-800 border-neutral-500 rounded-2xl p-8 flex flex-col items-center"
      >
        <HexColorPicker color={color} onChange={setColor} style={{ width: 1000, height: 400 }} />
        <div className="w-full flex justify-between">
          <ColorInfo color={color} />
          <ColorPreview color={color} />
        </div>
      </motion.div>
    </div>
  );
}
