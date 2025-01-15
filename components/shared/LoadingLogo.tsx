import Image from "next/image";
import React = require("react");


type Props = {
  size?: number;
};

export const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Image
        src="assets/images/carnetlify.png"
        alt="Logo"
        width={size}
        height={size}
        className="animate-pulse duration-800"
      />
    </div>
  );
};
