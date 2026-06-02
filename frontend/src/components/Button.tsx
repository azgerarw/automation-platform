import { type ReactNode } from 'react';

type ButtonProps = {
  id?: string;
  onClick?: (e: any) => void;
  children: ReactNode;
  className?: string;
  margin?: string;
  disabled?: boolean;
};

export default function Button({id, onClick, children, className='', margin='', disabled=false}: ButtonProps) {

    return (
      <button
        id={id}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`bg-black hover:bg-gray-600 text-white ${margin ? `m-${margin}` : ''} ${className ?? ''} p-2 w-fit h-10 cursor-pointer active:scale-95 transition-transform rounded-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}

      >
        {children}
      </button>
    );
}
