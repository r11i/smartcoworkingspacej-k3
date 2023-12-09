import React, { FC, MouseEvent, HTMLProps } from 'react';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({ label, onClick, className}) => {
  const defaultClasses = "rounded-[15px] px-[25px] py-[11px] text-[14px] leading-normal";
  const combinedClasses = className ? `${defaultClasses} ${className}` : defaultClasses;

  return (
    <button className={combinedClasses} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;