import imgFinneganNoNameplate from "figma:asset/ca8fc888defe7c130c35b3640351b50793d3ce2f.png";

function FinneganNoNameplate() {
  return (
    <div className="absolute left-[677px] size-[206px] top-0" data-name="Finnegan no nameplate">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgFinneganNoNameplate} />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px] absolute flex flex-col font-['Nunito:Black',sans-serif] font-black h-[195px] justify-center leading-[0] left-[calc(50%-97px)] text-[#45280b] text-[250px] text-center top-[calc(50%+8px)] translate-x-[-50%] translate-y-[-50%] w-[689px]">
        <p className="leading-[normal]">
          Edu<span className="text-[#578027]">Fi</span>
        </p>
      </div>
      <FinneganNoNameplate />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[211px] left-[94px] top-[66px] w-[883px]">
      <Group />
    </div>
  );
}

export default function ScalableCompanyName() {
  return (
    <div className="bg-[#fff5d6] relative size-full" data-name="Scalable Company name">
      <Frame />
    </div>
  );
}