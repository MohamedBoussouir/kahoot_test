let lastProcessedQuestion = "";

function handleDomChange() {
  let isContextValid = false;
  try {
    isContextValid = Boolean(chrome && chrome.runtime && chrome.runtime.id);
  } catch (e) {
    isContextValid = false;
  }

  if (!isContextValid) {
    if (typeof observer !== "undefined") {
      observer.disconnect();
    }
    return;
  }

  const data = extractQuestionData();

  if (data && data.question && data.question !== lastProcessedQuestion && data.options?.length > 0) {
    lastProcessedQuestion = data.question;

    console.group("🚀 [Kahoot AI] سؤال جديد");
    console.log("❓ السؤال:", data.question);
    console.log("🔘 Multi-Select:", data.isMultiSelect);
    console.table(data.options);
    console.groupEnd();

    try {
      chrome.runtime.sendMessage(
        { type: "FETCH_ANSWER", payload: data },
        (response) => {
          if (chrome.runtime.lastError) return;

          const indices = response?.answerIndices;
          if (Array.isArray(indices) && indices.length > 0) {
            console.log("🤖 الخيارات المختارة:", indices);
            selectAndClickAnswers(indices, data.isMultiSelect);
          }
        }
      );
    } catch (err) {}
  }
}

const observer = new MutationObserver(handleDomChange);
observer.observe(document.body, { childList: true, subtree: true });

// تشغيل فحص فوري
handleDomChange();