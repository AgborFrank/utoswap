"use client";

import clsx from "clsx";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";

type Props = {
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // const pathname = usePathname(); // Removed unused variable
  const t = useTranslations("common.Navigation");

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    startTransition(() => {
      let newUrl = "/en"; // Default
      if (value === "fr") {
        newUrl = "/fr";
      } else if (value === "de") {
        newUrl = "/de";
      }
      router.replace(newUrl);
    });
  }

  return (
    <label
    style={{ zIndex:1000 }}
      className={clsx(
        "relative text-gray-200 w-[190px] items-center flex",
        isPending && "transition-opacity opacity-30"
      )}
    >
      <Icon icon="meteor-icons:globe" width={24} height={24} className="text-white mr-4" />
      <p className="sr-only">{t(`language.${defaultValue}`)}</p>
      <Select
        placeholder={label}
        defaultSelectedKeys={[defaultValue]}
        disabled={isPending}
        onChange={onSelectChange}
        className={clsx("max-w-[100px] bg-black min-w-[100px] lang")}
      >
        <SelectItem key="en" >
          <div className="flex items-center gap-2">
            English
          </div>
        </SelectItem>
        <SelectItem key="fr" >
          <div className="flex items-center gap-2">
            Français
          </div>
        </SelectItem>
        <SelectItem key="gh" >
          <div className="flex items-center gap-2">
            German
          </div>
        </SelectItem>
      </Select>
    </label>
  );
}
