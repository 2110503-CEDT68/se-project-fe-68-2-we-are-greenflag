/** อนุญาตตัวเลขและเครื่องหมายคั่นเบอร์ทั่วไป */
const ALLOWED_INPUT = /^[0-9\s\-().]+$/;

export type ThaiTelephoneResult =
  | { ok: true; normalized: string }
  | { ok: false; message: string };

/**
 * ตรวจเบอร์โทรในประเทศไทย: เป็นตัวเลข, ขึ้นต้นด้วย 0, ความยาว 9 หรือ 10 หลัก (นับรวม 0 นำหน้า)
 */
export function validateThaiTelephone(raw: string): ThaiTelephoneResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: 'กรุณากรอกเบอร์โทรศัพท์' };
  }
  if (!ALLOWED_INPUT.test(trimmed)) {
    return {
      ok: false,
      message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น (ใส่ - หรือช่องว่างคั่นได้)',
    };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (!digits.startsWith('0')) {
    return {
      ok: false,
      message: 'เบอร์โทรศัพท์ในประเทศต้องขึ้นต้นด้วย 0 (เช่น 08xxxxxxxx หรือ 02-xxx-xxxx)',
    };
  }
  if (digits.length !== 9 && digits.length !== 10) {
    return {
      ok: false,
      message: 'เบอร์โทรศัพท์ไทยต้องมีความยาว 9 หรือ 10 หลัก นับรวมเลข 0 นำหน้า',
    };
  }
  return { ok: true, normalized: digits };
}
