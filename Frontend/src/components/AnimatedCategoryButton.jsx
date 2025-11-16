export default function AnimatedCategoryButton({ label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center w-[130px] h-[40px] font-[Lato] font-medium tracking-[1px] text-gray-600 cursor-pointer overflow-hidden transition-all duration-300 bg-[linear-gradient(0deg,rgba(255,255,255,0.287),rgb(209,210,210)_100%)] backdrop-blur-[20px] shadow-[inset_2px_2px_2px_rgba(255,255,255,0.5),7px_7px_20px_rgba(0,0,0,0.1),4px_4px_5px_rgba(0,0,0,0.1)] ${className}`}>
      <span className="relative z-10">{label}</span>
      <span
        className="absolute inset-0 before:absolute before:right-0 before:top-0 before:w-[2px] before:h-0 before:bg-gray-600 before:transition-all before:duration-300 after:absolute after:right-0 after:top-0 after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all after:duration-300
        group-hover:before:h-full group-hover:after:w-full"
      ></span>
      <span
        className="absolute inset-0 before:absolute before:left-0 before:bottom-0 before:w-[2px] before:h-0 before:bg-gray-600 before:transition-all before:duration-300 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all after:duration-300
        group-hover:before:h-full group-hover:after:w-full"
      ></span>
    </button>
  );
}
