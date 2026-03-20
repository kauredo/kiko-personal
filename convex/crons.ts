import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "mark past events",
  { hourUTC: 0, minuteUTC: 5 },
  internal.events.markPastEvents,
);

export default crons;
