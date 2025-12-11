import svgPaths from "./svg-1a1w92kgcz";
import imgScalableLogo from "figma:asset/ca8fc888defe7c130c35b3640351b50793d3ce2f.png";
import imgDebt from "figma:asset/1f362b7d5283746d618e76ee1e7a87054ea9b237.png";
import imgMoneyBox from "figma:asset/3beedc6a2b5b0ab8710bd62bd84bc5a538ae9e21.png";
import imgGrowingMoney from "figma:asset/d73d77c9d04594d08b437f0b151466c26e155000.png";
import imgStocksGrowth from "figma:asset/5c2cdff7d6d1cbb885aea97538a4f78fe3887ba3.png";
import imgGoldBars from "figma:asset/a8c9883af72580edd7745e2ee9bd39e631830d35.png";
import imgGraduationCap from "figma:asset/db20eca64d7eb7a165441a5bcc680c4aafb0b8b1.png";
import imgMortgageInterest from "figma:asset/f29ee1e0937a2b2e0e33c46af247aeb54a10c65f.png";
import imgLowPrice from "figma:asset/b11206eea1cad73140e505d0a83e202a694d1485.png";
import { Header } from "../components/Header";

interface PersonalFinanceRoadmapProps {
  onStepClick?: (stepId: number) => void;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

function ScalableLogo({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="relative w-16 h-16 md:w-[105.926px] md:h-[105.926px] cursor-pointer hover:opacity-80 transition-opacity"
      data-name="Scalable logo"
      onClick={onClick}
    >
      <img
        alt="Logo"
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        src={imgScalableLogo}
      />
    </div>
  );
}

function Menu({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="relative w-12 h-12 md:w-[78.945px] md:h-[78.945px] cursor-pointer hover:opacity-80 transition-opacity"
      data-name="Menu"
      onClick={onClick}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79 79">
        <g id="Menu">
          <path d={svgPaths.p16886d80} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99722" />
        </g>
      </svg>
    </div>
  );
}

function Shield() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[80px] md:size-[122.915px]" data-name="Shield">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123 123">
        <g id="Shield">
          <path d={svgPaths.p2f47d480} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99722" />
        </g>
      </svg>
    </div>
  );
}

function Shield1() {
  return (
    <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Shield">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g id="Shield">
          <path d={svgPaths.p22e88000} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99722" />
        </g>
      </svg>
    </div>
  );
}

function Plus() {
  return (
    <div className="[grid-area:1_/_1] ml-[25px] md:ml-[37.97px] mt-[25px] md:mt-[37.97px] relative size-[30px] md:size-[47.967px]" data-name="Plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Plus">
          <path d={svgPaths.p38748ec0} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99722" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-0 place-items-start relative">
      <Shield />
      <Shield1 />
      <Plus />
    </div>
  );
}

function Group1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <Group />
    </div>
  );
}

function Group11({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
    >
      <Group1 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Deductibles Covered</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g id="Frame">
          <path d={svgPaths.p3b98fa00} fill="var(--fill-0, black)" id="Vector (Stroke)" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99861" />
          <path d={svgPaths.p211e9940} fill="var(--fill-0, black)" id="Vector (Stroke)_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99861" />
          <path d={svgPaths.p1fd05c80} fill="var(--fill-0, black)" id="Vector (Stroke)_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99861" />
          <path d={svgPaths.p39c5200} fill="var(--fill-0, black)" id="Vector (Stroke)_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99861" />
          <path d={svgPaths.p188dfe00} fill="var(--fill-0, black)" id="Vector (Stroke)_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99861" />
          <path d={svgPaths.p24c8b280} fill="var(--fill-0, black)" id="Vector (Stroke)_6" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99861" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <Frame />
    </div>
  );
}

function Group12({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group2 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Employer Match</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Debt">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgDebt} />
      </div>
    </div>
  );
}

function Group13({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group4 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">High-Interest Debt</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Money Box">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgMoneyBox} />
      </div>
    </div>
  );
}

function Group14({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group3 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Emergency Reserves</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Growing Money">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgGrowingMoney} />
      </div>
    </div>
  );
}

function Group15({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group5 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Roth IRA and HSA</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">5</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Stocks Growth">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgStocksGrowth} />
      </div>
    </div>
  );
}

function Group16({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group6 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Max-out Retirement</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">6</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]" data-name="Gold Bars">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgGoldBars} />
      </div>
    </div>
  );
}

function Group17({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group9 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Hyper-Accumulation</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">7</p>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] flex items-center justify-center relative size-[64px] md:size-[99.931px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="relative size-[64px] md:size-[99.931px]" data-name="Graduation Cap">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgGraduationCap} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Group18({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group8 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Prepaid Future Expenses</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">8</p>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="[grid-area:1_/_1] ml-[8px] md:ml-[11.99px] mt-[8px] md:mt-[11.99px] relative size-[64px] md:size-[99.931px]">
      <div className="absolute left-0 size-[64px] md:size-[99.931px] top-0" data-name="Mortgage Interest">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgMortgageInterest} />
      </div>
      <div className="absolute left-[11px] md:left-[16.99px] size-[32px] md:size-[49.965px] top-[16px] md:top-[24.98px]" data-name="Low Price">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgLowPrice} />
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[60px] md:ml-[88.94px] mt-[20px] md:mt-[33.98px] place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#799952] ml-0 mt-0 relative rounded-[20px] md:rounded-[29.979px] size-[80px] md:size-[122.915px]">
        <div aria-hidden="true" className="absolute border-[#e0af41] border-[2px] md:border-[2.998px] border-solid inset-[-3px] pointer-events-none rounded-[22px] md:rounded-[32.9769px] shadow-[1.999px_3.997px_3.997px_0px_rgba(0,0,0,0.5)]" />
      </div>
      <Group7 />
    </div>
  );
}

function Group19({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <Group10 />
      <div className="[grid-area:1_/_1] flex flex-col font-['Nunito:Black',sans-serif] font-black h-[60px] md:h-[98.931px] justify-center ml-[100px] md:ml-[150.9px] mt-[145px] md:mt-[221.35px] relative text-[#45280b] text-[16px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%] w-[200px] md:w-[301.79px]">
        <p className="leading-[normal]">Low-Interest Debt</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Figma_Hand:Bold',sans-serif] justify-center ml-[42px] md:ml-[63.96px] mt-[16px] md:mt-[24.98px] not-italic relative size-[32px] md:size-[49.965px] text-[#45280b] text-[18px] md:text-[23.983px] text-center translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">9</p>
      </div>
    </div>
  );
}

function Frame1({ onStepClick }: { onStepClick?: (stepId: number) => void }) {
  return (
    <div className="relative w-full px-4 md:px-0 md:pl-12 py-4 md:py-8">
      {/* Desktop Layout - 3 columns for steps 1-6, then 3 more for 7-9 */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-x-8 gap-y-12 mb-16 max-w-5xl mx-auto">
          <div className="flex justify-center"><Group11 onClick={() => onStepClick?.(1)} /></div>
          <div className="flex justify-center"><Group12 onClick={() => onStepClick?.(2)} /></div>
          <div className="flex justify-center"><Group13 onClick={() => onStepClick?.(3)} /></div>
          <div className="flex justify-center"><Group14 onClick={() => onStepClick?.(4)} /></div>
          <div className="flex justify-center"><Group15 onClick={() => onStepClick?.(5)} /></div>
          <div className="flex justify-center"><Group16 onClick={() => onStepClick?.(6)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
          <div className="flex justify-center"><Group17 onClick={() => onStepClick?.(7)} /></div>
          <div className="flex justify-center"><Group18 onClick={() => onStepClick?.(8)} /></div>
          <div className="flex justify-center"><Group19 onClick={() => onStepClick?.(9)} /></div>
        </div>
      </div>
      
      {/* Mobile Layout - 1 column with tighter spacing for 3 items visible */}
      <div className="md:hidden flex flex-col gap-4 items-center">
        <Group11 onClick={() => onStepClick?.(1)} />
        <Group12 onClick={() => onStepClick?.(2)} />
        <Group13 onClick={() => onStepClick?.(3)} />
        <Group14 onClick={() => onStepClick?.(4)} />
        <Group15 onClick={() => onStepClick?.(5)} />
        <Group16 onClick={() => onStepClick?.(6)} />
        <Group17 onClick={() => onStepClick?.(7)} />
        <Group18 onClick={() => onStepClick?.(8)} />
        <Group19 onClick={() => onStepClick?.(9)} />
      </div>
    </div>
  );
}

export default function PersonalFinanceRoadmap({ onStepClick, onMenuClick, onLogoClick, onProfileClick, isAuthenticated, userEmail }: PersonalFinanceRoadmapProps) {
  return (
    <div className="bg-[#d4e8c1] relative w-full min-h-screen" data-name="Personal Finance Roadmap">
      {/* Header */}
      <Header onMenuClick={onMenuClick} onLogoClick={onLogoClick} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />
      
      {/* Title Section */}
      <div className="text-center pt-8 md:pt-12 pb-4 md:pb-8 px-4">
        <div className="bg-gradient-to-br from-[#fff5d6] to-white p-8 md:p-12 rounded-2xl border-t-4 border-[#799952] shadow-lg max-w-4xl mx-auto">
          <h1 className="text-[#578027] text-2xl md:text-5xl [text-shadow:rgba(0,0,0,0.35)_0px_3.997px_3.997px]">
            The Financial Sequence
          </h1>
        </div>
      </div>
      
      {/* Steps Section - Now with green background */}
      <div className="bg-[#d4e8c1] w-full pb-8 md:pb-16">
        <Frame1 onStepClick={onStepClick} />
      </div>
    </div>
  );
}