import Link from "next/link";
import type { ReactNode } from "react";

type MatchCenterLinkProps = {
  postSlug?: string;
  className: string;
  children: ReactNode;
};

export default function MatchCenterLink({ postSlug, className, children }: MatchCenterLinkProps) {
  if (postSlug) {
    return (
      <Link href={`/news/${postSlug}`} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span className={`${className} pointer-events-none cursor-default opacity-60`} aria-disabled="true">
      {children}
    </span>
  );
}
