const express = require("express");
const cors = require("cors");
const play = require("play-dl");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url || !play.yt_validate(url)) {
    return res.status(400).send("Yanlış və ya boş URL");
  }

  try {
    const info = await play.video_basic_info(url);
    const stream = await play.stream(url, { quality: 2 }); // best audio

    const fileName = `${info.video_details.title.replace(/[^\w\s]/gi, "")}.mp3`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    stream.stream.pipe(res);
  } catch (err) {
    console.error("Yükləmə xətası:", err);
    res.status(500).send("Yükləmə zamanı xəta baş verdi");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server http://localhost:${PORT} ünvanında işləyir`);
});
