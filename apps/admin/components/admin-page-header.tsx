import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  kicker?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  filters?: ReactNode;
}

export function AdminPageHeader({
  kicker,
  title,
  description,
  actions,
  filters,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      {/* Title + Actions */}
      <div className="admin-page-header-top">
        <div className="admin-page-title-block">
          {kicker && <span className="admin-page-kicker">{kicker}</span>}
          <h1 className="admin-page-title">{title}</h1>
          <p className="admin-page-description">{description}</p>
        </div>
        {actions && <div className="admin-page-actions">{actions}</div>}
      </div>

      {/* Filters */}
      {filters && <div className="admin-page-filters">{filters}</div>}
    </div>
  );
}
