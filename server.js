const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const https = require("https");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: "Url və format tələb olunur" });
  }

  const ytDlpCmd =
    format === "mp3"
      ? `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --get-url "${url}"`
      : `yt-dlp -f bestvideo+bestaudio --get-url "${url}"`;

  exec(ytDlpCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", error);
      console.error("stderr:", stderr);
      return res.status(500).json({ error: "Video linki əldə edilə bilmədi" });
    }

    const directUrl = stdout.trim();

    // Fayl adını təyin edirik (istəyə görə dəyişə bilərsən)
    const filename = `download.${format === "mp3" ? "mp3" : "mp4"}`;

    // YouTube CDN linkindən stream edib istifadəçiyə forward edirik
    https.get(directUrl, streamRes => {
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", streamRes.headers["content-type"] || "application/octet-stream");
      streamRes.pipe(res);
    }).on("error", err => {
      console.error("Stream error:", err);
      res.status(500).json({ error: "Yükləmə zamanı xəta baş verdi" });
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portunda işləyir`));
