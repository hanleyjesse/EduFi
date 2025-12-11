import imgFinneganNoNameplate from "figma:asset/ca8fc888defe7c130c35b3640351b50793d3ce2f.png";

interface CompanyLogoProps {
  onClick?: () => void;
  size?: "small" | "medium" | "large";
}

export function CompanyLogo({ onClick, size = "medium" }: CompanyLogoProps) {
  const sizeClasses = {
    small: "h-14",
    medium: "h-20 md:h-24",
    large: "h-28 md:h-36"
  };

  const textSizeClasses = {
    small: "text-4xl",
    medium: "text-5xl md:text-6xl",
    large: "text-7xl md:text-8xl"
  };

  const logoSizeClasses = {
    small: "h-10 w-10",
    medium: "h-14 w-14 md:h-16 md:w-16",
    large: "h-20 w-20 md:h-24 md:w-24"
  };

  return (
    <div 
      className={`flex items-center gap-2 bg-[#fff5d6] border-4 border-[#e0af41] rounded-xl p-3 shadow-lg ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span 
          className={`font-black leading-none text-[#45280b] ${textSizeClasses[size]}`}
          style={{ 
            fontFamily: "'Nunito', sans-serif",
            textShadow: 'rgba(0,0,0,0.25) 0px 4px 4px'
          }}
        >
          Edu<span className="text-[#578027]">Fi</span>
        </span>
      </div>
      <div className={`relative flex-shrink-0 ${logoSizeClasses[size]}`}>
        <img 
          alt="EduFi Mascot" 
          className="absolute inset-0 object-cover w-full h-full" 
          src={imgFinneganNoNameplate} 
        />
      </div>
    </div>
  );
}