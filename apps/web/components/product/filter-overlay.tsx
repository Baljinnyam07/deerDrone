"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: "checkbox" | "range" | "toggle";
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
}

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  onFilterChange?: (
    groupId: string,
    optionId: string,
    checked: boolean,
  ) => void;
  onApply?: (filters: Record<string, string[]>) => void;
}

export function FilterOverlay({
  isOpen,
  onClose,
  filterGroups,
  onFilterChange,
  onApply,
}: FilterOverlayProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set([filterGroups[0]?.id]),
  );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      />

      {/* Filter Panel */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            position: "sticky",
            top: 0,
            backgroundColor: "#FFFFFF",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Шүүлтүүрүүд
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Groups */}
        <div style={{ padding: "16px 20px", paddingBottom: "100px" }}>
          {filterGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);

            return (
              <div
                key={group.id}
                style={{
                  borderBottom: "1px solid #E2E8F0",
                  paddingBottom: "16px",
                  marginBottom: "16px",
                }}
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    marginBottom: isExpanded ? "12px" : "0",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {group.title}
                  </h3>
                  <ChevronDown
                    size={20}
                    style={{
                      color: "#94A3B8",
                      transition: "transform 200ms ease",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Filter Options */}
                {isExpanded && group.type === "checkbox" && group.options && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={(e) =>
                            onFilterChange?.(
                              group.id,
                              option.id,
                              e.target.checked,
                            )
                          }
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            borderRadius: "4px",
                            border: "1.5px solid #E2E8F0",
                            accentColor: "#2563EB",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.9rem",
                            color: "#475569",
                            fontWeight: 500,
                          }}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Range Slider */}
                {isExpanded && group.type === "range" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#94A3B8",
                      }}
                    >
                      {group.min}₮
                    </span>
                    <input
                      type="range"
                      min={group.min}
                      max={group.max}
                      style={{
                        flex: 1,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#94A3B8",
                      }}
                    >
                      {group.max}₮
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Apply Button */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 20px 20px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #E2E8F0",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <button
            onClick={() => {
              onApply?.({});
              onClose();
            }}
            style={{
              width: "100%",
              minHeight: "48px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            className="apply-btn"
          >
            Шүүлтүүрийг хэрэглэх
          </button>
        </div>
      </div>

      <style jsx>{`
        .apply-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
