import { formatWorldTime } from "./clockTime.js";

export const defaultWorkSchedule = {
  end: "18:00",
  start: "09:00",
  workdays: [1, 2, 3, 4, 5],
};

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function localTime(date, formatter) {
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );
  return {
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
      parts.weekday,
    ),
  };
}

function isWithinSchedule(local, schedule) {
  return (
    schedule.workdays.includes(local.weekday) &&
    local.minutes >= timeToMinutes(schedule.start) &&
    local.minutes < timeToMinutes(schedule.end)
  );
}

function overlapGroups(
  date,
  first,
  second,
  firstSchedule = defaultWorkSchedule,
  secondSchedule = defaultWorkSchedule,
) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const formatterOptions = {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    weekday: "short",
  };
  const firstFormatter = new Intl.DateTimeFormat("en-US", {
    ...formatterOptions,
    timeZone: first.timeZone,
  });
  const secondFormatter = new Intl.DateTimeFormat("en-US", {
    ...formatterOptions,
    timeZone: second.timeZone,
  });
  const matches = [];

  for (let minute = 0; minute < 24 * 60; minute += 15) {
    const candidate = new Date(start.getTime() + minute * 60 * 1000);
    if (
      isWithinSchedule(localTime(candidate, firstFormatter), firstSchedule) &&
      isWithinSchedule(localTime(candidate, secondFormatter), secondSchedule)
    ) {
      matches.push(candidate);
    }
  }

  const groups = matches.reduce((result, candidate) => {
    const group = result.at(-1);
    if (
      group &&
      candidate.getTime() - group.at(-1).getTime() === 15 * 60 * 1000
    )
      group.push(candidate);
    else result.push([candidate]);
    return result;
  }, []);
  return groups;
}

export function overlapSlotsFor(
  date,
  first,
  second,
  locale,
  firstSchedule = defaultWorkSchedule,
  secondSchedule = defaultWorkSchedule,
  durationMinutes = 15,
) {
  return overlapGroups(date, first, second, firstSchedule, secondSchedule)
    .flatMap((group) => {
      const slots = [];
      for (
        let index = 0;
        index + durationMinutes / 15 <= group.length && slots.length < 3;
        index += 2
      )
        slots.push({
          end: new Date(group[index].getTime() + durationMinutes * 60 * 1000),
          start: group[index],
        });
      return slots;
    })
    .slice(0, 3);
}

export function overlapFor(
  date,
  first,
  second,
  locale,
  firstSchedule = defaultWorkSchedule,
  secondSchedule = defaultWorkSchedule,
  durationMinutes = 15,
) {
  const overlap = overlapGroups(
    date,
    first,
    second,
    firstSchedule,
    secondSchedule,
  ).find((group) => group.length * 15 >= durationMinutes);
  if (!overlap)
    return locale.startsWith("zh")
      ? "无符合条件的工作时间重叠"
      : "No matching working-hours overlap";
  return `${formatWorldTime(overlap[0], first.timeZone, true, locale)} – ${formatWorldTime(new Date(overlap.at(-1).getTime() + 15 * 60 * 1000), first.timeZone, true, locale)}`;
}
