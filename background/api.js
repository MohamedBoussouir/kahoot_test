importScripts('../config.js');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_ANSWER") {
        console.time("⏱️ زمن المعالجة");

        askGroqModel(message.payload)
            .then((answerIndices) => {
                console.timeEnd("⏱️ زمن المعالجة");
                sendResponse({ answerIndices });
            })
            .catch((err) => {
                console.timeEnd("⏱️ زمن المعالجة");
                console.error("❌ خطأ من Groq API:", err.message);
                sendResponse({ answerIndices: [] });
            });

        return true;
    }
});

async function askGroqModel(data) {
  const storage = await chrome.storage.local.get(['grokApiKey']);
  const apiKey = storage.grokApiKey || CONFIG.GROQ?.API_KEY || CONFIG.GROK?.API_KEY;

  if (!apiKey) {
    throw new Error("لم يتم العثور على API Key صالح في الإعدادات أو ملف config.js");
  }

  // صياغة برومت مباشر ومختصر جداً لتقليل وقت معالجة الرموز
  const prompt = `Kahoot question: "${data.question}"
Options:
${data.options.map((opt, i) => `${i}:${opt.text}`).join("\n")}

Respond ONLY with the digits of the correct option(s) (e.g. 0 or 1,2). No words.`;

  const startTime = performance.now();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "qwen/qwen3.8-27b", // سريع جداً ودقيق، أو استخدم "openai/gpt-oss-20b"
      messages: [
        {
          role: "system",
          content: "You are an instant Kahoot solver. Output ONLY the answer digit(s). Nothing else."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 10 // تقليل التوكنز ينهي الاستجابة فور توليد الرقم
    })
  });

  const duration = Math.round(performance.now() - startTime);
  console.log(`⚡ زمن استجابة Groq: ${duration}ms`);

  const resData = await response.json();
  if (!response.ok || resData.error) {
    throw new Error(resData.error?.message || `HTTP error ${response.status}`);
  }

  const rawAnswer = (resData.choices?.[0]?.message?.content || "").trim();
  console.log("📝 الإجابة المستلمة:", rawAnswer);

  const matches = rawAnswer.match(/\d/g);
  const uniqueIndices = matches ? [...new Set(matches.map(Number))] : [];

  console.log("🎯 الأرقام المحددة للنقر:", uniqueIndices);
  return uniqueIndices;
}