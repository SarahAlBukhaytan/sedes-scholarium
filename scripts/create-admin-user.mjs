// Creates an ADMIN_USERS entry for the admin dashboard (the password is not stored).
// Usage:  node scripts/create-admin-user.mjs <email> <owner|viewer>
// It then asks for the password without echoing it to the screen.
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const [email, role = "viewer"] = process.argv.slice(2);
if (!email || !["owner", "viewer"].includes(role)) {
  console.error("Usage: node scripts/create-admin-user.mjs <email> <owner|viewer>");
  process.exit(1);
}
const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => (s.includes("Password") ? rl.output.write(s) : rl.output.write("*"));
rl.question("Password (12+ characters): ", (password) => {
  rl.close();
  console.log();
  if (password.length < 12) {
    console.error("Password must be at least 12 characters.");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  console.log("Add this entry to ADMIN_USERS (separate entries with ';'):");
  console.log(`${email.trim().toLowerCase()}:${role}:${salt.toString("hex")}:${hash.toString("hex")}`);
});
