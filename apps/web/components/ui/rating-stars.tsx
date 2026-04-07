"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function RatingStars({
  rating,
  reviewCount = 0,
  size = "sm",
  showCount = true,
}: RatingStarsProps) {
  const sizeMap = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const starSize = sizeMap[size];
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="d-flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < filledStars;
          const isHalf = i === filledStars && hasHalfStar;

          return (
            <div
              key={i}
              style={{ position: "relative", display: "inline-block" }}
            >
              {/* Background (empty) star */}
              <Star
                size={starSize}
                style={{
                  color: "#E2E8F0",
                  fill: "#E2E8F0",
                }}
              />

              {/* Filled star overlay */}
              {(isFilled || isHalf) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    overflow: isHalf ? "hidden" : "visible",
                    width: isHalf ? "50%" : "100%",
                  }}
                >
                  <Star
                    size={starSize}
                    style={{
                      color: "#F59E0B",
                      fill: "#F59E0B",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCount && reviewCount > 0 && (
        <span
          style={{
            fontSize: size === "sm" ? "0.8rem" : "0.9rem",
            color: "#475569",
            fontWeight: 500,
          }}
        >
          ({reviewCount})
        </span>
      )}

      {showCount && reviewCount === 0 && (
        <span
          style={{
            fontSize: size === "sm" ? "0.8rem" : "0.9rem",
            color: "#94A3B8",
            fontWeight: 400,
          }}
        >
          No reviews
        </span>
      )}
    </div>
  );
}
