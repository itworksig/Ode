"use client";

import { type ReactNode } from "react";

type AdmonitionProps = {
  children: ReactNode;
};

export function Note({ children }: AdmonitionProps) {
  return (
    <aside className="admonition admonition--note" role="note">
      <span className="admonition__label">Note</span>
      <div className="admonition__body">{children}</div>
    </aside>
  );
}

export function Info({ children }: AdmonitionProps) {
  return (
    <aside className="admonition admonition--info" role="note">
      <span className="admonition__label">Info</span>
      <div className="admonition__body">{children}</div>
    </aside>
  );
}

export function Warning({ children }: AdmonitionProps) {
  return (
    <aside className="admonition admonition--warning" role="note">
      <span className="admonition__label">Warning</span>
      <div className="admonition__body">{children}</div>
    </aside>
  );
}

export function Danger({ children }: AdmonitionProps) {
  return (
    <aside className="admonition admonition--danger" role="alert">
      <span className="admonition__label">Danger</span>
      <div className="admonition__body">{children}</div>
    </aside>
  );
}

export function Tip({ children }: AdmonitionProps) {
  return (
    <aside className="admonition admonition--tip" role="note">
      <span className="admonition__label">Tip</span>
      <div className="admonition__body">{children}</div>
    </aside>
  );
}

type StaleProps = {
  children: ReactNode;
  /** ISO date string: content is considered stale after this date */
  since?: string;
};

export function Stale({ children, since }: StaleProps) {
  let ageText = "";
  if (since) {
    const sinceDate = new Date(since);
    const now = new Date();
    const months =
      (now.getFullYear() - sinceDate.getFullYear()) * 12 +
      (now.getMonth() - sinceDate.getMonth());
    if (months >= 24) {
      ageText = `${Math.floor(months / 12)} years ago`;
    } else if (months >= 1) {
      ageText = `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      ageText = "recently";
    }
  }

  return (
    <aside className="admonition admonition--stale" role="note">
      <span className="admonition__label">
        Stale content{ageText ? ` — written ${ageText}` : ""}
      </span>
      <div className="admonition__body">{children}</div>
    </aside>
  );
}
