import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900/95 group-[.toaster]:text-white group-[.toaster]:border-slate-700/50 group-[.toaster]:backdrop-blur-xl group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:border",
          title: "group-[.toast]:text-white group-[.toast]:font-semibold",
          description: "group-[.toast]:text-gray-300 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-purple-600 group-[.toast]:to-pink-600 group-[.toast]:text-white group-[.toast]:hover:from-purple-700 group-[.toast]:hover:to-pink-700",
          cancelButton:
            "group-[.toast]:bg-slate-700/50 group-[.toast]:text-gray-300 group-[.toast]:hover:bg-slate-700 group-[.toast]:border-slate-600",
          error:
            "group-[.toaster]:bg-red-950/80 group-[.toaster]:border-red-500/30 group-[.toaster]:text-red-100",
          success:
            "group-[.toaster]:bg-emerald-950/80 group-[.toaster]:border-emerald-500/30 group-[.toaster]:text-emerald-100",
          info: "group-[.toaster]:bg-blue-950/80 group-[.toaster]:border-blue-500/30 group-[.toaster]:text-blue-100",
          warning:
            "group-[.toaster]:bg-amber-950/80 group-[.toaster]:border-amber-500/30 group-[.toaster]:text-amber-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
