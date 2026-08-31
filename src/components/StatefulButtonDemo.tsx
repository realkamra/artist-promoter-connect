import { motion, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatefulButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export function StatefulButton({ className, children, onClick }: StatefulButtonProps) {
  const [scope, animate] = useAnimate();

  const animateLoading = async () => {
    await animate(".loader", {
      width: "20px",
      scale: 1,
      display: "block",
    }, { duration: 0.2 });
  };

  const animateSuccess = async () => {
    await animate(".loader", {
      width: "0px",
      scale: 0,
      display: "none",
    }, { duration: 0.2 });

    await animate(".check", {
      width: "20px",
      scale: 1,
      display: "block",
    }, { duration: 0.2 });

    await animate(".check", {
      width: "0px",
      scale: 0,
      display: "none",
    }, { delay: 2, duration: 0.2 });
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await animateLoading();
    await onClick?.(event);
    await animateSuccess();
  };

  return (
    <motion.button
      className={cn(
        "flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground ring-offset-2 transition duration-200 hover:ring-2 hover:ring-primary",
        className
      )}
      layout
      layoutId="stateful-button"
      onClick={handleClick}
      ref={scope}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
}

function Loader() {
  return (
    <motion.svg
      className="loader text-white"
      style={{ scale: 0.5, display: "none" }}
      initial={{ scale: 0, width: 0, display: "none" }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
}

function CheckIcon() {
  return (
    <motion.svg
      className="check text-white"
      style={{ scale: 0.5, display: "none" }}
      initial={{ scale: 0, width: 0, display: "none" }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
}

export default function StatefulButtonDemo() {
  const handleClick = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 4000);
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <StatefulButton onClick={handleClick}>Send message</StatefulButton>
    </main>
  );
}
