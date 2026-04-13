import type { ReactNode } from "react";

export interface FieldDef {
  label: string;
  value: ReactNode;
  muted?: boolean;
  fullWidth?: boolean;
}

interface FieldGridProps {
  fields: FieldDef[];
  cols?: 1 | 2 | 3;
}

export function FieldGrid({ fields, cols = 2 }: FieldGridProps) {
  const colsClass = cols === 1 ? "" : `cols-${cols}`;
  
  return (
    <div className={`field-grid ${colsClass}`}>
      {fields.map((field, idx) => (
        <div 
          key={idx} 
          className="field"
          style={field.fullWidth ? { gridColumn: "span " + cols } : undefined}
        >
          <div className="field-label">{field.label}</div>
          <div className={`field-value ${field.muted ? "muted" : ""}`}>
            {field.value}
          </div>
        </div>
      ))}
    </div>
  );
}
