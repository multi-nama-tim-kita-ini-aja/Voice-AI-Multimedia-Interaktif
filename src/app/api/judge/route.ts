import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("\n==================== [AI JUDGE REQUEST] ====================");

  try {
    const body = await req.json();
    const { question, options, correctKey, userSpeech } = body;

    console.log("📥 1. Ucapan pemain diterima:", userSpeech);

    const apiKey = process.env.AI_KEY;
    const MODEL_NAME = process.env.AI_MODEL || "kr/claude-sonnet-4.5";

    const optionsText =
      options
        ?.map((opt: { key: string; text: string }) => `${opt.key}. ${opt.text}`)
        .join("\n") || "";

    const systemPrompt = `Kamu adalah juri voice quiz interaktif (VoxIQ).
Tugasmu adalah menganalisis ucapan pemain, menentukan apakah dia berniat menjawab salah satu opsi (A/B/C/D), ingin melewati (skip), atau suaranya tidak jelas.

KEMBALIKAN OUTPUT HANYA BERUPA JSON MURNI TANPA BACKTICK MARKDOWN (JANGAN GUNAKAN \`\`\` ATAU \`\`\`json).
Format struktur JSON wajib:
{
  "action": "ANSWER" | "SKIP" | "UNCLEAR",
  "selectedKey": "A" | "B" | "C" | "D" | null,
  "isCorrect": true | false,
  "feedbackSpeech": "Kalimat respon singkat maksimal 1 kalimat"
}

Aturan Penilaian:
1. SKIP: Jika ucapan mengandung kata "next", "lanjut", "skip", "lewati", "pas", "lewat", "ga tau" -> action: "SKIP", selectedKey: null, isCorrect: false.
2. ANSWER: Jika pemain menyebut huruf opsi (A/B/C/D) atau menyebut frase/teks pilihan jawaban.
   - selectedKey: Opsi yang dipilih ("A", "B", "C", atau "D").
   - isCorrect: true jika selectedKey sama dengan Kunci Jawaban Benar, jika beda false.
3. UNCLEAR: Jika hanya gumaman tidak jelas atau di luar konteks.
4. feedbackSpeech: Berikan 1 kalimat bahasa Indonesia santai & seru untuk disuarakan:
   - Jika benar: Berikan pujian seru dan antusias.
   - Jika salah: Beri tahu jawaban yang benarnya dengan ramah.
   - Jika skip: Konfirmasi singkat ("Siap, kita lanjut ke soal berikutnya.").`;

    const userPrompt = `[Pertanyaan]
${question}

[Pilihan Jawaban]
${optionsText}

[Kunci Jawaban Benar]
${correctKey}

[Ucapan Pemain]
"${userSpeech}"`;

    const targetUrl = "https://9router.aaronabil.my.id/v1/chat/completions";

    console.log(`🚀 2. Mengirim ke ${targetUrl} (stream: false)...`);

    const aiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        stream: false, // Memaksa router tidak mengirim format streaming chunks
      }),
    });

    const rawText = await aiResponse.text();
    console.log(
      "📄 3. Raw response dari router (panjang:",
      rawText.length,
      "karakter)",
    );

    if (!aiResponse.ok) {
      throw new Error(`AI Router error (${aiResponse.status}): ${rawText}`);
    }

    let messageContent = "";

    // Cek apakah response berupa streaming (data: {...}) atau JSON standar
    if (rawText.trim().startsWith("data:")) {
      const lines = rawText.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:") && !trimmed.includes("[DONE]")) {
          try {
            const chunkJson = JSON.parse(trimmed.replace(/^data:\s*/, ""));
            const delta = chunkJson.choices?.[0]?.delta?.content || "";
            messageContent += delta;
          } catch {}
        }
      }
    } else {
      const chatCompletion = JSON.parse(rawText);
      messageContent = chatCompletion.choices?.[0]?.message?.content || "";
    }

    // Bersihkan pembungkus markdown ```json ... ``` bila model tetap menyertakannya
    let cleanJson = messageContent.trim();
    if (cleanJson.includes("```")) {
      cleanJson = cleanJson
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
    }

    // Ekstrak objek JSON murni di antara kurung kurawal pertama dan terakhir
    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(cleanJson);
    console.log("✅ 4. Hasil evaluasi juri siap dikirim:", parsedData);
    console.log(
      "============================================================\n",
    );

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("❌ ERROR KONEKSI AI JUDGE:", error.message || error);
    console.log(
      "============================================================\n",
    );

    return NextResponse.json(
      {
        action: "UNCLEAR",
        selectedKey: null,
        isCorrect: false,
        feedbackSpeech: "Maaf, juri AI sedang mengalami kendala jaringan.",
        errorDetail: error.message,
      },
      { status: 500 },
    );
  }
}
