// import React, { useRef } from "react";

// export default function OTPInputBox({ value, onChange }) {
//   const inputRefs = useRef([]);

//   const handleChange = (idx, e) => {
//     const val = e.target.value.replace(/\D/g, "").slice(0, 1);
//     const otpArr = value.split("");

//     otpArr[idx] = val;
//     onChange(otpArr.join(""));

//     if (val && idx < 5) inputRefs.current[idx + 1].focus();
//   };

//   const handleKeyDown = (idx, e) => {
//     if (e.key === "Backspace" && !value[idx] && idx > 0) {
//       inputRefs.current[idx - 1].focus();
//     }
//   };

//   return (
//     <div className="group flex items-center gap-2">
//       {/* LEFT 3 SLOTS */}
//       <div className="flex">
//         {[0, 1, 2].map((i) => (
//           <Slot
//             key={i}
//             index={i}
//             value={value[i] || ""}
//             inputRefs={inputRefs}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             isActive={!value[i]}
//           />
//         ))}
//       </div>

//       {/* DASH IN MIDDLE */}
//       <FakeDash />

//       {/* RIGHT 3 SLOTS */}
//       <div className="flex">
//         {[3, 4, 5].map((i) => (
//           <Slot
//             key={i}
//             index={i}
//             value={value[i] || ""}
//             inputRefs={inputRefs}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             isActive={!value[i]}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function Slot({
//   index,
//   value,
//   inputRefs,
//   onChange,
//   onKeyDown,
//   isActive,
// }) {
//   return (
//     <div
//       className={`relative w-10 h-14 text-2xl
//       flex items-center justify-center
//       transition-all duration-300
//       border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md
//       group-hover:border-green-400/40 group-focus-within:border-green-500/40
//       ou  tline outline-0 outline-green-500/20
//       ${isActive ? "outline-4 outline-green-500" : ""}
//     `}
//     >
//       <input
//         ref={(el) => (inputRefs.current[index] = el)}
//         value={value}
//         maxLength={1}
//         onChange={(e) => onChange(index, e)}
//         onKeyDown={(e) => onKeyDown(index, e)}
//         className="w-full h-full text-center bg-transparent outline-none"
//       />

//       {/* FAKE CARET */}
//       {value === "" && <FakeCaret />}
//     </div>
//   );
// }

// function FakeCaret() {
//   return (
//     <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
//       <div className="w-px h-8 bg-white" />
//     </div>
//   );
// }

// function FakeDash() {
//   return (
//     <div className="flex w-10 justify-center items-center">
//       <div className="w-3 h-1 rounded-full bg-border" />
//     </div>
//   );
// }
