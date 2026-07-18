interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
}

export default function ConversationHeader({ roomName, activeUsers }: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-hairline bg-background px-8 py-5">
      <div>
        <h2 className="font-display text-xl text-ink">{roomName}</h2>
        <p className="mt-0.5 font-mono text-xs text-ink-tertiary">
          {activeUsers.length > 0
            ? `${activeUsers.join(", ")} on the line`
            : "no one on the line yet"}
        </p>
      </div>
    </div>
  );
}