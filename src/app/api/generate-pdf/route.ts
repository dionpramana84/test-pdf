import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";

export async function POST(req: Request) {
  const { mode, payload } = await req.json();

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Draw text
    page.drawText("Hello, world!", {
      x: 50,
      y: height / 2 + 300,
      size: 30,
      color: rgb(0, 0, 0),
    });

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");

    if (mode === "DOWNLOAD") {
      headers.set("Content-Disposition", 'inline; filename="myfile.pdf"');
    } else {
      headers.set("Content-Disposition", 'attachment; filename="filename.pdf"');
    }

    return new NextResponse(pdfBytes, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
