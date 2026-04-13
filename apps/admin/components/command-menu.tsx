"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  Moon, 
  Sun,
  Search,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const openFromHeader = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", openFromHeader);
    
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", openFromHeader);
    };
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="command-menu-overlay"
    >
      <div className="command-menu-content">
        <Command.Input placeholder="Хайх..." />

        <Command.List>
          <Command.Empty>Илэрц олдсонгүй.</Command.Empty>

          <Command.Group heading="Шилжих">
            <Command.Item onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboard size={18} />
              <span>Хяналтын самбар</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/products"))}>
              <Package size={18} />
              <span>Бүтээгдэхүүн</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/orders"))}>
              <ShoppingCart size={18} />
              <span>Захиалга</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings size={18} />
              <span>Тохиргоо</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Үйлдэл">
            <Command.Item onSelect={() => runCommand(() => toggleTheme())}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'light' ? 'Харанхуй' : 'Гэрэлтэй'} горимд шилжих</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Шуурхай холбоос">
            <Command.Item onSelect={() => runCommand(() => window.open('/chatbot', '_blank'))}>
              <MessageSquare size={18} />
              <span>Чатбот нээх</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
