import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitch, LocaleSwitchProps } from "./locale-switch";
import { PropsWithChildren } from "react";
import { ThemeToggle } from "./theme-toggle";

export default function AuthPageLayout({
  children,
  clientURL,
  localeOptions,
  displayNameHtml
}: PropsWithChildren<{
  clientURL?: string;
  displayNameHtml: string;
  localeOptions: LocaleSwitchProps;
}>) {
  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative grid min-h-svh lg:grid-cols-[1fr_1.5fr]">
        {/* Left side - Branding */}
        <div className="relative hidden lg:flex items-center justify-center p-12">
          <div className="relative z-10 text-center space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <h1
              className="relative text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: displayNameHtml }}
            />
            <p className="relative text-lg text-muted-foreground max-w-md">
              Secure authentication with modern design
            </p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="relative flex flex-col gap-4 p-6 md:p-10 lg:p-12">
          <div className="flex gap-2 justify-between items-center z-10">
            {clientURL && (
              <Button
                variant="ghost"
                onClick={() => window.location.replace(clientURL)}
                className="hover:bg-primary/10 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="size-4" />
                <span className="sr-only">Back</span>
              </Button>
            )}

            <div className="flex gap-2">
              <LocaleSwitch {...localeOptions} />
              <ThemeToggle />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-500 delay-150">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
