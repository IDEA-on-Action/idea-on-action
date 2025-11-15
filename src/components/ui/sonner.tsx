import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { toastClassNames } from "./sonner.config";
import type { ToasterProps } from "./sonner.config";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: toastClassNames,
      }}
      {...props}
    />
  );
};

export { Toaster };
