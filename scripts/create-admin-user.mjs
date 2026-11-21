// Creates an ADMIN_USERS entry for the admin dashboard (the password is not stored).
// Usage:  node scripts/create-admin-user.mjs <email> <owner|viewer>
// It then asks for the password twice; what you type is never shown on screen
// (raw keyboard mode — each character is echoed as "*").
import { randomBytes, scryptSync } from "node:crypto";

const [email, role = "viewer"] = process.argv.slice(2);
if (!email || !["owner", "viewer"].includes(role)) {
  console.error("Usage: node scripts/create-admin-user.mjs <email> <owner|viewer>");
  process.exit(1);
}
if (!process.stdin.isTTY) {
  console.error("Run this in an interactive terminal so the password can be typed hidden.");
  process.exit(1);
}

function askHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk) => {
      for (const c of chunk) {
        if (c === "\r" || c === "\n") {
          stdin.setRawMode(false);
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

const password = await askHidden("Password (12+ characters): ");
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}
const again = await askHidden("Repeat the password: ");
if (password !== again) {
  console.error("The two passwords do not match. Nothing was created.");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log("Add this entry to ADMIN_USERS (separate entries with ';'):");
console.log(`${email.trim().toLowerCase()}:${role}:${salt.toString("hex")}:${hash.toString("hex")}`);
