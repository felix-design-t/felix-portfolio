import { forgetViewer, noteViewer, onlineCountFor } from "@/lib/presence";

/**
 * Check-in desk for the "online" count.
 * A browser posts its id on a timer. Posting `leave` removes that id.
 */

const viewerIdPattern = /^[a-zA-Z0-9-]{8,64}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const viewerId =
    typeof body === "object" && body !== null && "id" in body
      ? String((body as { id: unknown }).id)
      : "";

  if (!viewerIdPattern.test(viewerId)) {
    return Response.json({ error: "Expected a visitor id." }, { status: 400 });
  }

  const isLeaving =
    typeof body === "object" &&
    body !== null &&
    "leave" in body &&
    (body as { leave: unknown }).leave === true;

  const peopleHere = isLeaving ? forgetViewer(viewerId) : noteViewer(viewerId);

  return Response.json(
    { peopleHere, online: onlineCountFor(peopleHere) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
