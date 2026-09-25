"use client";

import { isRtl } from "@/i18n/languages";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/utils";
import { ChevronDown as IconChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

interface CountryCode {
  code: string;
  label: string;
}

interface PhoneInputProps {
  countries: CountryCode[];
  placeholder?: string;
  id?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end"; // New prop for dropdown position
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "+1 (555) 000-0000",
  onChange,
  selectPosition = "start", // Default position is 'start'
}) => {
  const locale = useLocale();
  const isRtlLayout = isRtl(locale as Locale);

  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [phoneNumber, setPhoneNumber] = useState<string>("+1");

  const countryCodes: Record<string, string> = countries.reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {},
  );

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setPhoneNumber(countryCodes[newCountry]);
    if (onChange) {
      onChange(countryCodes[newCountry]);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  return (
    <div className="relative flex">
      {/* Dropdown position: Start */}
      {selectPosition === "start" && (
        <div className="inset-s-0 absolute top-0 z-10 flex h-full items-center">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="h-full appearance-none rounded-s-[14px] border-0 border-e border-line bg-transparent bg-none py-3 ps-3.5 pe-8 leading-tight text-ink focus:border-line focus:ring-3 focus:ring-dark/10 focus:outline-hidden"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-ink"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="inset-e-3 pointer-events-none absolute inset-y-0 flex items-center text-ink">
            <IconChevronDown size={20} />
          </div>
        </div>
      )}

      {/* Input field */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-field border border-line bg-transparent py-3 text-start text-fx-15 text-ink placeholder:text-muted focus:border-line focus:ring-3 focus:ring-dark/10 focus:outline-hidden",
          // In RTL, "start" is visually on the right, so swap padding sides
          isRtlLayout
            ? selectPosition === "start"
              ? "ps-4 pe-21"
              : "ps-21 pe-4"
            : selectPosition === "start"
              ? "ps-21 pe-4"
              : "ps-4 pe-21",
        )}
      />

      {/* Dropdown position: End */}
      {selectPosition === "end" && (
        <div className="inset-e-0 absolute top-0 z-10 flex h-full items-center">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="h-full appearance-none rounded-e-[14px] border-0 border-s border-line bg-transparent bg-none py-3 ps-3.5 pe-8 leading-tight text-ink focus:border-line focus:ring-3 focus:ring-dark/10 focus:outline-hidden rtl:ps-8 rtl:pe-3.5"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-ink"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="inset-e-3 rtl:inset-s-3 rtl:inset-e-auto pointer-events-none absolute inset-y-0 flex items-center text-ink">
            <IconChevronDown size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
