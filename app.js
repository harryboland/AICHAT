# import React, { useState } from "react";

const OPENAI_API_KEY = "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";
const ELEVENLABS_API_KEY = "sk_68c074132abc9c86952f5be7e6f182dac4d18815d79695ed";
const ELEVENLABS_VOICE_ID = "t5jyWhrVoC4rsMf2fTLW";

export default function VidolPrototype() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [tokens, setTokens] = useState(5); // Mock Vidol Tokens

  const handleSendMessage = async () => {
    if (tokens <= 0) {
      setResponse("You need more Vidol Tokens to continue chatting!");
      return;
    }

    setTokens(tokens - 1); // Deduct a token per message
    const aiResponse = await fetchChatResponse(message);
    setResponse(aiResponse);
    await fetchVoiceResponse(aiResponse); // Generate voice reply
  };

  const fetchChatResponse = async (message) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const fetchVoiceResponse = async (text) => {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({ text }),
    });
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    new Audio(audioUrl).play();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Vidol AI Chatbot</h1>
      <p>Tokens Left: {tokens}</p>
      <textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "80%", height: "100px" }}
      />
      <br />
      <button onClick={handleSendMessage} style={{ marginTop: "10px", padding: "10px 20px" }}>
        Send Message
      </button>
      {response && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{response}</p>}
    </div>
  );
}
