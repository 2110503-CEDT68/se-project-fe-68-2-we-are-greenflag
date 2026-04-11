/** Calendar date in the user's local timezone (YYYY-MM-DD). */
export function formatLocalYmd(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseTimeHm(timeHm: string): [number, number] | null {
  const m = timeHm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return [h, mi];
}

/** Interprets YYYY-MM-DD + HH:mm as local wall-clock time. */
export function localDateTimeFromYmdHm(dateYmd: string, timeHm: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateYmd)) return null;
  const parts = dateYmd.split('-').map(Number);
  const y = parts[0];
  const mo = parts[1];
  const d = parts[2];
  const hm = parseTimeHm(timeHm);
  if (y === undefined || mo === undefined || d === undefined || !hm) return null;
  const [h, mi] = hm;
  const dt = new Date(y, mo - 1, d, h, mi, 0, 0);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

export type BookingValidationResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Ensures booking is not in the past and end is after start.
 * Uses the browser's local clock and local interpretation of date/time fields.
 */
export function validateBookingSchedule(
  dateYmd: string,
  startTime: string,
  endTime: string,
  opts?: { now?: Date }
): BookingValidationResult {
  const now = opts?.now ?? new Date();
  const start = localDateTimeFromYmdHm(dateYmd, startTime);
  const end = localDateTimeFromYmdHm(dateYmd, endTime);
  if (!start || !end) {
    return { ok: false, message: 'วันที่หรือเวลาไม่ถูกต้อง' };
  }
  if (start >= end) {
    return { ok: false, message: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น' };
  }
  if (start < now) {
    return { ok: false, message: 'ไม่สามารถจองวันหรือช่วงเวลาที่ผ่านมาแล้วได้' };
  }
  return { ok: true };
}
