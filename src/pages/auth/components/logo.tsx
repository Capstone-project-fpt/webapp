import React from "react";
import { SiGitbook } from "react-icons/si";

const Logo: React.FC = () => {
  return (
    <div className="hidden lg:basis-1/2 bg-dark lg:h-full lg:flex flex-col justify-center items-center">
      <div>
        <div className="flex items-center gap-3">
          <SiGitbook className="text-light text-[90px] lg:text-[150px]" />
        </div>
      </div>
      <div className="text-light text-center mt-8">
        <div className="lg:text-xl">FCPMS</div>
        <div className="lg:text-sm text-xs text-slate-500 mt-4">
          -- By FPT Minh Bear --
        </div>
      </div>
    </div>
  );
};

export default Logo;