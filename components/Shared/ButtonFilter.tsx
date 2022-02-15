import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  onClick: () => void;
}

const ButtonFilter = ({ children }: IProps) => {
  return (
    <button className="relative m-1 cursor-pointer rounded-sm border-2 border-gray-600 bg-none px-2 py-4 text-xl hover:text-blue-500 focus:outline-none">
      {children}
    </button>
  );
};

export default ButtonFilter;
