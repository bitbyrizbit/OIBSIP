const conditionLines: Record<string, string[]> = {
  Clear: [
    "not a cloud stands between the glass and the sky.",
    "the reading is steady, the light unbroken.",
  ],
  Clouds: [
    "the air carries a weight the glass has been predicting since dawn.",
    "a grey ceiling holds over the city, patient and unhurried.",
  ],
  Rain: [
    "water finds the streets again, as the glass warned it would.",
    "the pressure has been falling all morning, and now it shows.",
  ],
  Drizzle: [
    "a fine mist settles rather than falls, barely worth an umbrella.",
    "the glass reads a soft, uncommitted kind of wet.",
  ],
  Thunderstorm: [
    "the sky has made up its mind, and it is not a quiet one.",
    "the glass is falling fast, and the horizon agrees with it.",
  ],
  Snow: [
    "the world outside has gone quiet under a fresh, cold weight.",
    "the glass reads a stillness that only snow brings.",
  ],
  Mist: [
    "the horizon has gone soft, folded into its own breath.",
    "visibility gives way to something quieter, closer to the ground.",
  ],
  Haze: [
    "the light arrives filtered, as though passed through paper.",
    "the far edges of the city have gone indistinct today.",
  ],
};

const fallback = [
  "the instrument holds a reading, waiting to be understood.",
];

export function describeConditions(condition: string, locationName: string): string {
  const lines = conditionLines[condition] ?? fallback;
  const line = lines[Math.floor(Math.random() * lines.length)];
  return line.charAt(0).toUpperCase() + line.slice(1);
}

export function isStormCondition(condition: string): boolean {
  return ["Rain", "Thunderstorm", "Drizzle", "Snow"].includes(condition);
}