"use client";

import { useState } from "react";

/* ─── Beam Deflection ─────────────────────────────────────── */

function BeamDeflectionTool() {
  const [load, setLoad] = useState("1000");
  const [span, setSpan] = useState("2");
  const [modulus, setModulus] = useState("200");
  const [section, setSection] = useState<"rect" | "circle" | "hollow">("rect");
  const [width, setWidth] = useState("0.05");
  const [height, setHeight] = useState("0.1");
  const [diameter, setDiameter] = useState("0.1");
  const [outerD, setOuterD] = useState("0.1");
  const [innerD, setInnerD] = useState("0.08");

  const P = parseFloat(load) || 0;
  const L = parseFloat(span) || 0;
  const E = (parseFloat(modulus) || 200) * 1e9;

  let I = 0;
  if (section === "rect") {
    const b = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    I = (b * Math.pow(h, 3)) / 12;
  } else if (section === "circle") {
    const d = parseFloat(diameter) || 0;
    I = (Math.PI * Math.pow(d, 4)) / 64;
  } else {
    const do_ = parseFloat(outerD) || 0;
    const di = parseFloat(innerD) || 0;
    I = (Math.PI * (Math.pow(do_, 4) - Math.pow(di, 4))) / 64;
  }

  const deflection = I > 0 && E > 0 ? (P * Math.pow(L, 3)) / (48 * E * I) : 0;
  const maxMoment = (P * L) / 4;
  const reaction = P / 2;

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors";
  const labelClass = "block text-xs text-zinc-400 mb-1";

  return (
    <div className="space-y-5">
      <p className="text-xs text-zinc-500">
        Simply supported beam with a central point load.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Point Load P (N)</label>
          <input className={inputClass} type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Span L (m)</label>
          <input className={inputClass} type="number" value={span} onChange={(e) => setSpan(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Elastic Modulus E (GPa)</label>
          <input className={inputClass} type="number" value={modulus} onChange={(e) => setModulus(e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Cross Section</label>
        <div className="flex gap-2">
          {(["rect", "circle", "hollow"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                section === s
                  ? "border-zinc-400 text-white bg-zinc-700"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {s === "rect" ? "Rectangle" : s === "circle" ? "Circle" : "Hollow Circle"}
            </button>
          ))}
        </div>
      </div>

      {section === "rect" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Width b (m)</label>
            <input className={inputClass} type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Height h (m)</label>
            <input className={inputClass} type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>
      )}
      {section === "circle" && (
        <div>
          <label className={labelClass}>Diameter d (m)</label>
          <input className={inputClass} type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
        </div>
      )}
      {section === "hollow" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Outer Diameter D (m)</label>
            <input className={inputClass} type="number" value={outerD} onChange={(e) => setOuterD(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Inner Diameter d (m)</label>
            <input className={inputClass} type="number" value={innerD} onChange={(e) => setInnerD(e.target.value)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Result label="Max Deflection" value={`${(deflection * 1000).toFixed(4)} mm`} highlight />
        <Result label="Max Moment" value={`${maxMoment.toFixed(1)} N·m`} />
        <Result label="Reactions (each)" value={`${reaction.toFixed(1)} N`} />
      </div>
      {I > 0 && (
        <p className="text-xs text-zinc-600 font-mono">
          I = {I.toExponential(3)} m⁴ &nbsp;|&nbsp; Formula: δ = PL³ / (48EI)
        </p>
      )}
    </div>
  );
}

/* ─── Unit Converter ─────────────────────────────────────── */

const converters: Record<string, { units: string[]; toBase: Record<string, number>; label: string; convert?: (v: number, from: string, to: string) => number }> = {
  length: {
    label: "Length",
    units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
    toBase: { mm: 1e-3, cm: 1e-2, m: 1, km: 1e3, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  },
  force: {
    label: "Force",
    units: ["N", "kN", "MN", "lbf", "kgf"],
    toBase: { N: 1, kN: 1e3, MN: 1e6, lbf: 4.44822, kgf: 9.80665 },
  },
  pressure: {
    label: "Pressure",
    units: ["Pa", "kPa", "MPa", "GPa", "psi", "ksi", "bar", "atm"],
    toBase: { Pa: 1, kPa: 1e3, MPa: 1e6, GPa: 1e9, psi: 6894.76, ksi: 6894760, bar: 1e5, atm: 101325 },
  },
  temperature: {
    label: "Temperature",
    units: ["°C", "°F", "K"],
    toBase: {},
    convert: (v, from, to) => {
      let celsius: number;
      if (from === "°C") celsius = v;
      else if (from === "°F") celsius = (v - 32) * 5 / 9;
      else celsius = v - 273.15;
      if (to === "°C") return celsius;
      if (to === "°F") return celsius * 9 / 5 + 32;
      return celsius + 273.15;
    },
  },
  torque: {
    label: "Torque",
    units: ["N·m", "kN·m", "lbf·ft", "lbf·in", "kgf·m"],
    toBase: { "N·m": 1, "kN·m": 1e3, "lbf·ft": 1.35582, "lbf·in": 0.113, "kgf·m": 9.80665 },
  },
};

function UnitConverterTool() {
  const [category, setCategory] = useState("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const conv = converters[category];

  function handleCategory(cat: string) {
    setCategory(cat);
    setFrom(converters[cat].units[0]);
    setTo(converters[cat].units[1]);
  }

  function compute(): string {
    const v = parseFloat(value);
    if (isNaN(v)) return "—";
    if (conv.convert) {
      return conv.convert(v, from, to).toPrecision(6).replace(/\.?0+$/, "");
    }
    const base = v * (conv.toBase[from] ?? 1);
    const result = base / (conv.toBase[to] ?? 1);
    if (Math.abs(result) >= 1e6 || (Math.abs(result) < 1e-4 && result !== 0)) {
      return result.toExponential(5);
    }
    return parseFloat(result.toPrecision(7)).toString();
  }

  const inputClass =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors";
  const selectClass = inputClass + " cursor-pointer";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {Object.entries(converters).map(([key, c]) => (
          <button
            key={key}
            onClick={() => handleCategory(key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              category === key
                ? "border-zinc-400 text-white bg-zinc-700"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[2fr_auto_1fr_auto_1fr] items-center gap-3">
        <input
          className={inputClass + " w-full"}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <select className={selectClass} value={from} onChange={(e) => setFrom(e.target.value)}>
          {conv.units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <span className="text-zinc-500 text-sm text-center hidden sm:block">=</span>
        <div className="col-span-3 sm:col-span-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono text-right sm:text-left">
          {compute()}
        </div>
        <select className={selectClass} value={to} onChange={(e) => setTo(e.target.value)}>
          {conv.units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ─── Gear Ratio ─────────────────────────────────────────── */

function GearRatioTool() {
  const [driverTeeth, setDriverTeeth] = useState("20");
  const [drivenTeeth, setDrivenTeeth] = useState("40");
  const [inputRpm, setInputRpm] = useState("1500");
  const [inputTorque, setInputTorque] = useState("10");

  const N1 = parseFloat(driverTeeth) || 0;
  const N2 = parseFloat(drivenTeeth) || 0;
  const rpm1 = parseFloat(inputRpm) || 0;
  const T1 = parseFloat(inputTorque) || 0;

  const ratio = N1 > 0 ? N2 / N1 : 0;
  const outputRpm = ratio > 0 ? rpm1 / ratio : 0;
  const outputTorque = ratio * T1;
  const type = ratio > 1 ? "Speed reduction" : ratio < 1 ? "Speed increase" : "1:1";

  const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors";
  const labelClass = "block text-xs text-zinc-400 mb-1";

  return (
    <div className="space-y-5">
      <p className="text-xs text-zinc-500">
        Two-gear system. Assumes 100% efficiency (no friction loss).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Driver Teeth (N₁)</label>
          <input className={inputClass} type="number" value={driverTeeth} onChange={(e) => setDriverTeeth(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Driven Teeth (N₂)</label>
          <input className={inputClass} type="number" value={drivenTeeth} onChange={(e) => setDrivenTeeth(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Input Speed (RPM)</label>
          <input className={inputClass} type="number" value={inputRpm} onChange={(e) => setInputRpm(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Input Torque (N·m)</label>
          <input className={inputClass} type="number" value={inputTorque} onChange={(e) => setInputTorque(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <Result label="Gear Ratio" value={`${ratio.toFixed(3)} : 1`} highlight />
        <Result label="Type" value={type} />
        <Result label="Output Speed" value={`${outputRpm.toFixed(1)} RPM`} />
        <Result label="Output Torque" value={`${outputTorque.toFixed(2)} N·m`} />
      </div>
    </div>
  );
}

/* ─── Shared Result Card ─────────────────────────────────── */

function Result({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border ${highlight ? "border-blue-500/30 bg-blue-500/5" : "border-zinc-800 bg-zinc-900/40"}`}>
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-sm font-mono font-semibold ${highlight ? "text-blue-400" : "text-white"}`}>{value}</p>
    </div>
  );
}

/* ─── Tab Container ──────────────────────────────────────── */

const tools = [
  { id: "beam", label: "Beam Deflection", component: <BeamDeflectionTool /> },
  { id: "units", label: "Unit Converter", component: <UnitConverterTool /> },
  { id: "gear", label: "Gear Ratio", component: <GearRatioTool /> },
];

export default function ToolsClient() {
  const [active, setActive] = useState("beam");
  const current = tools.find((t) => t.id === active);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active === t.id
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tool content */}
      <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
        {current?.component}
      </div>

      <p className="mt-4 text-xs text-zinc-600">
        Results are for reference only. Always verify calculations for engineering applications.
      </p>
    </div>
  );
}
