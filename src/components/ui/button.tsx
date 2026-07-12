import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary";
};

export function Button({
  className = "",
  tone = "secondary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${tone} ${className}`}
      type={type}
      {...props}
    />
  );
}
