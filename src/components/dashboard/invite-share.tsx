"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InviteShare({
  code,
  title,
}: {
  code: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  function getLink() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/invite/${code}`;
  }

  async function copy() {
    const link = getLink();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    const link = getLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my duel — ${title}`,
          text: `I started a FitDuel. Join me → `,
          url: link,
        });
      } catch {
        /* cancelled */
      }
    } else {
      copy();
    }
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-text-muted">
          Invite link
        </div>
        <div className="mt-1 truncate font-mono text-sm text-text">
          {typeof window === "undefined" ? `/invite/${code}` : getLink()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="glass" size="sm" onClick={copy}>
          {copied ? (
            <>
              <Check className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy
            </>
          )}
        </Button>
        <Button variant="flame" size="sm" onClick={share}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
}
