const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: "Url və format tələb olunur" });
  }

  try {
    // format mp3 və ya mp4 ola bilər
    const info = await ytdl.getInfo(url);

    let filter;
    if (format === "mp3") {
      filter = "audioonly";
    } else {
      filter = "videoandaudio";
    }

    res.header(
      "Content-Disposition",
      `attachment; filename="download.${format === "mp3" ? "mp3" : "mp4"}"`
    );

    ytdl(url, { filter })
      .on("error", (err) => {
        console.error("Yükləmə xətası:", err);
        res.status(500).end("Yükləmə zamanı xəta baş verdi");
      })
      .pipe(res);
  } catch (err) {
    console.error("İnfo xətası:", err);
    res.status(500).json({ error: "Video məlumatı alınmadı" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portunda işləyir`));
