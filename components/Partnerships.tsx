import Image from "next/image";

export interface Partner {
  id?: string;
  name: string;
  logo_url?: string;
  status?: string;
}

export function Partnerships({ partners = [] }: { partners?: Partner[] }) {
  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#f4f4f4] py-10 sm:py-16 border-t border-stone-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Centered Heading */}
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#8c7e72] mb-6 sm:mb-10 text-center">
          TRUSTED BY GOVERNMENTS &amp; COMPANIES
        </h2>

        {/* Centered Logos Flex Container */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 max-w-5xl mx-auto">
          {partners.map((partner) => {
            const lowerName = partner.name.toLowerCase();

            // Visit Rwanda custom brand badge
            if (lowerName.includes("visit rwanda")) {
              return (
                <div
                  key={partner.id || partner.name}
                  className="flex items-center justify-center bg-white px-6 sm:px-8 py-3.5 sm:py-4 border border-stone-200/70 shadow-xs rounded-sm transition-transform hover:scale-[1.02] cursor-default"
                >
                  <div className="flex flex-col items-center justify-center text-black select-none tracking-tight">
                    <span className="text-[13px] sm:text-[14px] font-black tracking-[0.35em] leading-none text-black uppercase">
                      VISIT
                    </span>
                    <span className="text-[18px] sm:text-[20px] font-black tracking-[0.18em] leading-tight text-black uppercase font-mono">
                      RW<span className="inline-block relative top-[-1px] font-sans font-extrabold text-black">A</span>ND<span className="inline-block relative top-[-1px] font-sans font-extrabold text-black">A</span>
                    </span>
                  </div>
                </div>
              );
            }

            // RDB custom brand badge
            if (lowerName.includes("rdb") || lowerName.includes("rwanda development")) {
              return (
                <div
                  key={partner.id || partner.name}
                  className="flex items-center justify-center gap-2.5 bg-white px-5 sm:px-6 py-3 sm:py-3.5 border border-stone-200/70 shadow-xs rounded-sm select-none transition-transform hover:scale-[1.02] cursor-default"
                >
                  <div className="flex gap-[3px] items-center">
                    <div className="w-[4px] sm:w-[5px] h-[22px] sm:h-[24px] bg-stone-600 rounded-[1px]"></div>
                    <div className="w-[4px] sm:w-[5px] h-[22px] sm:h-[24px] bg-stone-400 rounded-[1px]"></div>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-bold tracking-tight text-stone-800 font-sans">RDB</span>
                      <span className="text-[8px] sm:text-[9px] uppercase font-semibold tracking-wider text-stone-500">RWANDA</span>
                    </div>
                    <span className="text-[7px] sm:text-[7.5px] uppercase tracking-widest font-semibold text-stone-500 leading-none">
                      DEVELOPMENT BOARD
                    </span>
                  </div>
                </div>
              );
            }

            // Custom partner with image logo
            if (partner.logo_url && partner.logo_url.trim().length > 0 && !partner.logo_url.includes("placeholder")) {
              return (
                <div
                  key={partner.id || partner.name}
                  className="flex items-center justify-center bg-white px-5 sm:px-6 py-3 sm:py-3.5 border border-stone-200/70 shadow-xs rounded-sm transition-transform hover:scale-[1.02]"
                >
                  <Image
                    src={partner.logo_url}
                    alt={partner.name}
                    width={130}
                    height={44}
                    className="max-h-8 sm:max-h-9 w-auto object-contain"
                  />
                </div>
              );
            }

            // Generic clean partner text card
            return (
              <div
                key={partner.id || partner.name}
                className="flex items-center justify-center bg-white px-5 sm:px-6 py-3 sm:py-3.5 border border-stone-200/70 shadow-xs rounded-sm transition-transform hover:scale-[1.02]"
              >
                <span className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider">
                  {partner.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
