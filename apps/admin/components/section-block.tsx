import type { ReactNode } from "react";

interface SectionBlockProps {
  title: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SectionBlock({ title, children, action }: SectionBlockProps) {
  return (
    <div className="section-block">
      {(title || action) && (
        <div className="section-block-header">
          <h3 className="section-block-title">{title}</h3>
          {action && (
            <button 
              onClick={action.onClick}
              className="section-block-action"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
