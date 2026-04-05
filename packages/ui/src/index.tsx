import type { ReactNode } from "react";

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function Button(props: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  const tone = props.tone ?? "primary";

  return (
    <button
      className={cx(
        "dd-button",
        tone === "secondary" && "dd-button-secondary",
        tone === "ghost" && "dd-button-ghost",
        props.className,
      )}
      type={props.type ?? "button"}
    >
      {props.children}
    </button>
  );
}

export function Badge(props: { children: ReactNode; tone?: "neutral" | "success" | "warning" }) {
  const tone = props.tone ?? "neutral";

  return (
    <span
      className={cx(
        "dd-badge",
        tone === "success" && "dd-badge-success",
        tone === "warning" && "dd-badge-warning",
      )}
    >
      {props.children}
    </span>
  );
}

export function SectionHeading(props: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="dd-section-heading">
      {props.eyebrow ? <p className="dd-eyebrow">{props.eyebrow}</p> : null}
      <h2>{props.title}</h2>
      {props.description ? <p>{props.description}</p> : null}
    </div>
  );
}

export function MetricCard(props: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "accent" | "success" | "warning";
}) {
  return (
    <article className={cx("dd-metric-card", props.tone && `dd-metric-${props.tone}`)}>
      <p>{props.label}</p>
      <strong>{props.value}</strong>
      <span>{props.hint}</span>
    </article>
  );
}
