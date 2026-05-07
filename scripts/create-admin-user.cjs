/* eslint-disable no-console */
const admin = require("firebase-admin");
const { initFirebaseAdmin } = require("./firebase-admin-init.cjs");

const ADMIN_EMAIL = "admin@gmail.com";

async function main() {
  initFirebaseAdmin();

  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password || password.length < 6) {
    throw new Error(
      "Set ADMIN_INITIAL_PASSWORD (min 6 chars) in .env.local or env before running."
    );
  }

  try {
    const user = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password,
      emailVerified: true,
      displayName: "Admin",
    });
    console.log("[CreateAdmin] User created:", user.uid, user.email);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      console.log("[CreateAdmin] User", ADMIN_EMAIL, "already exists. Nothing to do.");
      return;
    }
    throw err;
  }

  console.log("[CreateAdmin] Done.");
}

main().catch((err) => {
  console.error("[CreateAdmin] Failed:", err);
  process.exit(1);
});
