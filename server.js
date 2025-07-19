const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// downloads qovluğu yaradırıq sadəcə müvəqqəti fayllar üçün
const downloadsDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

app.use("/downloads", express.static(downloadsDir));

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) {
    return res.status(400).json({ error: "Url və format tələb olunur" });
  }

  const filename = `video_${Date.now()}`;
  const output = path.join(downloadsDir, `${filename}.%(ext)s`);
  const ytDlpCmd =
    format === "mp3"
      ? `yt-dlp -o "${output}" -x --audio-format mp3 "${url}"`
      : `yt-dlp -o "${output}" "${url}"`;

  exec(ytDlpCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", error);
      console.error("stderr:", stderr);
      return res.status(500).json({ error: "Download zamanı xəta baş verdi" });
    }

    fs.readdir(downloadsDir, (err, files) => {
      if (err) {
        console.error("Fayl qovluğu oxunarkən xəta:", err);
        return res.status(500).json({ error: "Serverdə xəta baş verdi" });
      }

      const matchedFile = files.find(f => f.startsWith(filename));
      if (!matchedFile) {
        return res.status(500).json({ error: "Yüklənmiş fayl tapılmadı" });
      }

      const filePath = path.join(downloadsDir, matchedFile);
      const downloadUrl = `https://grably.onrender.com/downloads/${matchedFile}`;

      // 1 dəqiqə sonra faylı sil
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Fayl silinərkən xəta:", err);
          else console.log("Fayl silindi:", matchedFile);
        });
      }, 60 * 1000); // 1 dəqiqə = 60 * 1000 ms

      res.json({
        message: "Download tamamlandı",
        downloadUrl,
      });
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portunda işləyir`));
