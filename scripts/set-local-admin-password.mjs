// Sets a new password for a system-admin account in .env.local (local development).
// The password is typed hidden, never printed, never written to disk — only its
// scrypt hash is stored in ADMIN_USERS.
// Usage:  node scripts/set-local-admin-password.mjs [email]   (default admin@sedes.local)
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const email = (process.argv[2] ?? "admin@sedes.local").trim().toLowerCase();
const envPath = path.join(process.cwd(), ".env.local");
if (!existsSync(envPath)) {
  console.error("لم يُعثر على .env.local — شغّل الأمر من مجلد المشروع.");
  process.exit(1);
}

function askHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (ch) => {
      for (const c of ch) {
        if (c === "\r" || c === "\n") {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          return resolve(value);
        }
        if (c === "\u0003") process.exit(130); // Ctrl+C
        if (c === "\u007f" || c === "\b") {
          if (value) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          value += c;
          process.stdout.write("*");
        }
      }
    };
    stdin.on("data", onData);
  });
}

const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
const idx = lines.findIndex((l) => l.startsWith("ADMIN_USERS="));
if (idx < 0) {
  console.error("لا يوجد ADMIN_USERS في .env.local.");
  process.exit(1);
}
const entries = lines[idx].slice("ADMIN_USERS=".length).split(";").filter(Boolean);
const pos = entries.findIndex((e) => e.split(":")[0].toLowerCase() === email);
if (pos < 0) {
  console.error(`الحساب ${email} غير موجود في ADMIN_USERS.`);
  process.exit(1);
}

const pass = await askHidden(`كلمة المرور الجديدة للحساب ${email} (12 حرفًا على الأقل): `);
if (pass.length < 12) {
  console.error("كلمة المرور أقصر من 12 حرفًا. لم يتغير شيء.");
  process.exit(1);
}
const again = await askHidden("أعد كتابتها للتأكيد: ");
if (pass !== again) {
  console.error("كلمتا المرور غير متطابقتين. لم يتغير شيء.");
  process.exit(1);
}

const role = entries[pos].split(":")[1];
const salt = randomBytes(16);
const hash = scryptSync(pass, salt, 64);
entries[pos] = `${email}:${role}:${salt.toString("hex")}:${hash.toString("hex")}`;
lines[idx] = `ADMIN_USERS=${entries.join(";")}`;

// drop any old plain-text password note left in the file
const cleaned = lines.filter((l) => !/^#\s*password:/i.test(l));
writeFileSync(envPath, cleaned.join("\n"));
console.log(`تم. حُفظت البصمة المشفّرة لكلمة المرور الجديدة للحساب ${email} (لا تُحفظ كلمة المرور نفسها).`);
console.log("أعد تشغيل خادم التطوير ثم سجّل الدخول من /admin/login.");
