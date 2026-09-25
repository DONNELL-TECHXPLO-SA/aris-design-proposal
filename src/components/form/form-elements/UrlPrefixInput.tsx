import Input from "../input/InputField";

export default function UrlPrefixInput() {
  return (
    <div className="relative">
      <span className="absolute start-0 top-1/2 inline-flex h-11 -translate-y-1/2 items-center justify-center border-e border-line py-3 ps-3.5 pe-3 text-secondary">
        http://
      </span>

      <Input type="url" placeholder="www.tailadmin.com" className="ps-[90px]" />
    </div>
  );
}
