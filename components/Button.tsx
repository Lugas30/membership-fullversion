import React from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
};

export default function Button({
  label,
  onClick,
  type,
  disabled,
  className,
  loading = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} text-sm fontMon tracking-wider p-4 rounded-full w-72 uppercase`}
    >
      {loading ? <span>Loading...</span> : label}
    </button>
  );
}
