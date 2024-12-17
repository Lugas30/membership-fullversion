import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen max-w-md mx-auto">
      <div className="flex flex-col justify-center items-center gap-2">
        <Image src="/images/logo.svg" width={150} height={150} alt="logo" />
        <p className="text-xs logo-text">MEMBERSHIP</p>
      </div>
    </div>
  );
}
