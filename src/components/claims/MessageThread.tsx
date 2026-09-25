"use client";

import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import { useAuth } from "@/context/AuthContext";
import { findUser, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";
import { useState } from "react";

interface ThreadEntry {
  id: string;
  authorId: string;
  authorRole: Role;
  body: string;
  createdAt: string;
}

interface MessageThreadProps {
  claimId: string;
  entries: ThreadEntry[];
  onSubmit: (body: string) => void;
  placeholder: string;
  emptyMessage: string;
}

export default function MessageThread({ entries, onSubmit, placeholder, emptyMessage }: MessageThreadProps) {
  const { state } = useData();
  const { currentUser } = useAuth();
  const [body, setBody] = useState("");

  return (
    <div className="space-y-[20px]">
      <div className="space-y-[12px]">
        {entries.length === 0 ? (
          <p className="rounded-tile bg-tile px-[20px] py-[32px] text-center text-fx-15 text-secondary">{emptyMessage}</p>
        ) : (
          entries.map((entry) => {
            const author = findUser(state, entry.authorId);
            const isMine = entry.authorId === currentUser?.id;
            return (
              <div key={entry.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[520px] rounded-tile px-[18px] py-[12px] ${isMine ? "bg-dark text-on-dark" : "bg-tile text-ink"}`}>
                  <p className="text-fx-17">{entry.body}</p>
                  <p className={`mt-[4px] text-fx-14 ${isMine ? "text-on-dark opacity-70" : "text-secondary"}`}>
                    {author?.name ?? "Unknown"} · {formatDateTime(entry.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="flex items-start gap-[15px]">
        <div className="flex-1">
          <TextArea rows={2} placeholder={placeholder} value={body} onChange={setBody} />
        </div>
        <Button
          size="sm"
          disabled={!body.trim()}
          onClick={() => {
            onSubmit(body.trim());
            setBody("");
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
