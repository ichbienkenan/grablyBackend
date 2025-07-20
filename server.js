const express = require("express");
const cors = require("cors");
const ytdl = require("youtube-dl-exec");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: "Url və format tələb olunur" });
  }

  try {
    let directUrl;

    if (format === "mp3") {
      directUrl = await ytdl(url, {
        extractAudio: true,
        audioFormat: "mp3",
        getUrl: true,
        format: "bestaudio",
      });
    } else {
      directUrl = await ytdl(url, {
        getUrl: true,
        format: "mp4",
      });
    }

    res.json({
      message: "URL əldə olundu",
      downloadUrl: directUrl.trim(),
    });
  } catch (err) {
    console.error("youtube-dl-exec error:", err);
    res.status(500).json({ error: "Yükləmə zamanı xəta baş verdi" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portunda işləyir`));
