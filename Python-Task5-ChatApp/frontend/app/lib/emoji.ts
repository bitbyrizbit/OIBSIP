const SHORTCODE_MAP: Record<string, string> = {
  ":smile:": "😄",
  ":laughing:": "😆",
  ":wink:": "😉",
  ":heart:": "❤️",
  ":thumbsup:": "👍",
  ":thumbsdown:": "👎",
  ":fire:": "🔥",
  ":cry:": "😢",
  ":joy:": "😂",
  ":thinking:": "🤔",
  ":wave:": "👋",
  ":clap:": "👏",
  ":eyes:": "👀",
  ":100:": "💯",
  ":tada:": "🎉",
  ":pray:": "🙏",
  ":ok_hand:": "👌",
  ":rocket:": "🚀",
  ":sunglasses:": "😎",
  ":shrug:": "🤷",
};

export function renderEmojiShortcodes(text: string): string {
  let result = text;
  for (const [code, emoji] of Object.entries(SHORTCODE_MAP)) {
    result = result.split(code).join(emoji);
  }
  return result;
}