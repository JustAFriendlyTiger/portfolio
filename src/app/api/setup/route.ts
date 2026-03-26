import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// One-time setup route to create the admin account.
// Protected by a secret token from the SETUP_SECRET env var.
// Delete this file after first use.
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret || secret !== setupSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: "OWNER_EMAIL and OWNER_PASSWORD env vars are required" },
      { status: 500 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  return NextResponse.json({ ok: true, email: user.email });
}
