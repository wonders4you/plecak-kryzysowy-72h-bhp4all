import type { IceContact, Profile } from "./types";

export type IceCardData = {
  meeting: string;
  ice: IceContact[];
  profile: Profile;
};

export function householdLine(profile: Profile): string {
  const bits: string[] = [];
  if (profile.adults) bits.push(`${profile.adults} doros.`);
  if (profile.children) bits.push(`${profile.children} dz.`);
  if (profile.infants) bits.push(`${profile.infants} niemowl.`);
  if (profile.pets) bits.push(`${profile.pets} zwierz.`);
  if (profile.insulin) bits.push("insulina");
  if (profile.epipen) bits.push("EpiPen");
  return bits.join(" · ");
}

const ALARM = [
  ["112", "Alarmowy"],
  ["999", "Pogotowie"],
  ["998", "Straż"],
  ["997", "Policja"],
] as const;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(/\s+/);
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cy);
    cy += lineHeight;
  }
  return cy;
}

export async function downloadIcePdf(data: IceCardData) {
  await document.fonts.ready;
  const W = 1240;
  const H = 1754;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#111111";

  const pad = 72;
  let y = 110;

  ctx.font = "600 28px Figtree, sans-serif";
  ctx.fillText("IN CASE OF EMERGENCY", pad, y);
  y += 70;
  ctx.font = "700 96px Fraunces, Georgia, serif";
  ctx.fillText("ICE", pad, y);
  y += 36;
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
  y += 70;

  ctx.font = "600 28px Figtree, sans-serif";
  ctx.fillText("PUNKT ZBIÓRKI", pad, y);
  y += 48;
  ctx.font = "500 40px Fraunces, Georgia, serif";
  const meeting = data.meeting.trim() || "— dopisz przed schowaniem karty —";
  y = wrapText(ctx, meeting, pad, y, W - pad * 2, 52);
  y += 36;

  ctx.font = "600 28px Figtree, sans-serif";
  ctx.fillText("KONTAKTY", pad, y);
  y += 20;

  if (!data.ice.length) {
    y += 40;
    ctx.font = "400 32px Figtree, sans-serif";
    ctx.fillText("Brak wpisów. Dopisz kogoś, zanim wydrukujesz.", pad, y);
    y += 24;
  } else {
    for (const c of data.ice) {
      y += 44;
      ctx.font = "600 36px Figtree, sans-serif";
      ctx.fillText(c.name, pad, y);
      y += 36;
      ctx.font = "400 28px Figtree, sans-serif";
      ctx.fillText(c.relation || "kontakt", pad, y);
      y += 48;
      ctx.font = "700 56px Figtree, sans-serif";
      ctx.fillText(c.phone, pad, y);
      y += 16;
      ctx.strokeStyle = "#dddddd";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(W - pad, y);
      ctx.stroke();
      ctx.strokeStyle = "#111111";
    }
  }

  const house = householdLine(data.profile);
  if (house) {
    y += 56;
    ctx.font = "600 28px Figtree, sans-serif";
    ctx.fillText("DOM", pad, y);
    y += 42;
    ctx.font = "400 32px Figtree, sans-serif";
    y = wrapText(ctx, house, pad, y, W - pad * 2, 42);
  }

  y += 56;
  ctx.font = "600 28px Figtree, sans-serif";
  ctx.fillText("NUMERY", pad, y);
  y += 20;
  for (const [num, name] of ALARM) {
    y += 48;
    ctx.font = "700 44px Figtree, sans-serif";
    ctx.fillText(num, pad, y);
    ctx.font = "400 32px Figtree, sans-serif";
    ctx.fillText(name, pad + 160, y);
  }

  ctx.font = "400 22px Figtree, sans-serif";
  ctx.fillText("72h · karta do worka z dokumentami", pad, H - 56);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("pdf"))),
      "image/jpeg",
      0.92,
    );
  });
  const jpeg = new Uint8Array(await blob.arrayBuffer());
  const pdf = jpegToPdf(jpeg, W, H);
  const url = URL.createObjectURL(pdf);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ICE-72h.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

function jpegToPdf(jpeg: Uint8Array, pxW: number, pxH: number): Blob {
  const ptW = Math.round((pxW / 150) * 72);
  const ptH = Math.round((pxH / 150) * 72);
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets = [0];
  let pos = 0;
  const add = (u: Uint8Array) => {
    chunks.push(u);
    pos += u.length;
  };
  const addStr = (s: string) => add(enc.encode(s));
  const obj = (n: number, body: string) => {
    offsets[n] = pos;
    addStr(`${n} 0 obj\n${body}\nendobj\n`);
  };

  addStr("%PDF-1.4\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptW} ${ptH}] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>`,
  );
  const content = `q ${ptW} 0 0 ${ptH} 0 0 cm /Im0 Do Q\n`;
  obj(4, `<< /Length ${content.length} >>\nstream\n${content}endstream`);

  offsets[5] = pos;
  addStr(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pxW} /Height ${pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  add(jpeg);
  addStr("\nendstream\nendobj\n");

  const xrefStart = pos;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  addStr(xref);
  addStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

  const out = new Uint8Array(pos);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return new Blob([out], { type: "application/pdf" });
}
