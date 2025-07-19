const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) {
    return res.status(400).json({ error: "Url və format tələb olunur" });
  }

  try {
    // Yalnız mp3 üçün düz indirilebilen URL al
    if (format === "mp3") {
      const directUrl = await ytdlp(url, {
        extractAudio: true,
        audioFormat: "mp3",
        format: "bestaudio",
        getUrl: true,
      });

      return res.json({
        message: "URL əldə olundu",
        downloadUrl: directUrl.trim(),
      });
    } else {
      // video üçün mp4 linki al
      const directUrl = await ytdlp(url, {
        format: "mp4",
        getUrl: true,
      });

      return res.json({
        message: "URL əldə olundu",
        downloadUrl: directUrl.trim(),
      });
    }
  } catch (err) {
    console.error("yt-dlp xətası:", err);
    return res.status(500).json({ error: "Yükləmə zamanı xəta baş verdi" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portunda işləyir`));
