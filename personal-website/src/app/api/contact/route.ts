import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface ContactPayload {
  field: string;
  email: string;
  message: string;
  canRefer: boolean;
  isRecruiter: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactPayload>;

  if (!body.email || !body.message) {
    return NextResponse.json(
      { message: "email and message are required" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("suggestionsInfoDB");
  const result = await db.collection("contacts").insertOne({
    field: body.field ?? "Other",
    email: body.email,
    message: body.message,
    canRefer: Boolean(body.canRefer),
    isRecruiter: Boolean(body.isRecruiter),
    submittedAt: new Date(),
  });

  return NextResponse.json({ message: "Message received", id: result.insertedId });
}
