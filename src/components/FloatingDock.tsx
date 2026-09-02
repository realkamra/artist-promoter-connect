import {
  IconHome,
  IconLayoutNavbarCollapse,
  IconMusic,
  IconSend,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FloatingDockItem {
  title: string;
  icon: ReactNode;
  href: string;
  onClick?: () => void;
}

interface FloatingDockProps {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}

export function FloatingDock({ items, desktopClassName, mobileClassName }: FloatingDockProps) {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
}

export function createArtistDockItems({
  onSignOut,
  onCreateListing,
}: {
  onSignOut?: () => void;
  onCreateListing?: () => void;
} = {}): FloatingDockItem[] {
  return [
    { title: "Home", icon: <IconHome className="size-full" />, href: "/" },
    { title: "Matches", icon: <IconMusic className="size-full" />, href: "#matches" },
    {
      title: "My listing",
      icon: <IconSend className="size-full" />,
      href: "/create-listing",
      onClick: onCreateListing,
    },
    ...(onSignOut
      ? [{ title: "Sign out", icon: <IconLayoutNavbarCollapse className="size-full" />, href: "/", onClick: onSignOut }]
      : []),
  ];
}

function FloatingDockMobile({ items, className }: { items: FloatingDockItem[]; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="floating-dock-nav"
            className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {items.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                initial={{ opacity: 0, x: 12, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 12, y: 8 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-xl shadow-black/20"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-primary">{item.icon}</span>
                {item.title}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        layout
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex size-12 items-center justify-center rounded-2xl border border-border bg-primary text-primary-foreground shadow-xl shadow-primary/20"
        whileTap={{ scale: 0.94 }}
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <IconLayoutNavbarCollapse className="size-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}

function FloatingDockDesktop({ items, className }: { items: FloatingDockItem[]; className?: string }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    mouseX.set(event.clientX);
  };

  return (
    <motion.nav
      aria-label="Primary navigation"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn("fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 items-end gap-2 rounded-2xl border border-border bg-sidebar/95 px-3 pb-3 pt-3 shadow-2xl shadow-black/30 backdrop-blur md:flex", className)}
    >
      {items.map((item) => <DockIcon key={item.title} mouseX={mouseX} {...item} />)}
    </motion.nav>
  );
}

function DockIcon({ mouseX, title, icon, href, onClick }: FloatingDockItem & { mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });
  const width = useSpring(useTransform(distance, [-150, 0, 150], [42, 72, 42]), { mass: 0.1, stiffness: 150, damping: 12 });
  const iconSize = useSpring(useTransform(distance, [-150, 0, 150], [19, 32, 19]), { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      style={{ width, height: width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={title}
      className="relative flex shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card text-primary transition-colors hover:bg-muted"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 5, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 3, x: "-50%" }}
            className="pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-semibold text-popover-foreground shadow-lg"
          >
            {title}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
        {icon}
      </motion.span>
    </motion.a>
  );
}

export default FloatingDock;
