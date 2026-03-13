const bcrypt = require("bcryptjs");

const hashedPassword = "$2b$10$0IsW8qCGd6uvdt1lElwrZ.vzsOF8/./dArNHPgAj.rJqbeMRncS9y";

const passwords = ["doctor123", "password123", "12345678", "admin123", "rajesh123", "Doctor123", "Password123"];

async function test() {
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, hashedPassword);
    if (match) {
      console.log(`✅ MATCH FOUND: "${pwd}"`);
      return;
    }
  }
  console.log("❌ No match found. Try more passwords.");
}

test();