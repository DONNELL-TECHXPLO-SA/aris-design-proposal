import { FC } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({ className, onChange }) => {
  return (
    <input
      type="file"
      className={`h-[54px] w-full cursor-pointer overflow-hidden rounded-field border border-line bg-card ps-[6px] text-fx-17 text-secondary outline-none file:me-[14px] file:h-[40px] file:cursor-pointer file:rounded-full file:border-0 file:bg-tile file:px-[18px] file:text-fx-15 file:font-medium file:text-ink hover:file:bg-hover focus:border-dark ${className}`}
      onChange={onChange}
    />
  );
};

export default FileInput;
