const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

// Statik faylları /downloads URL-dən serve etmək üçün
const downloadsDir = path.join(__dirname, "downloads");

// downloads qovluğu yoxdursa yaradılır
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// Express-ə deyirik ki, /downloads altında statik fayllar var
app.use("/downloads", express.static(downloadsDir));

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) {
    return res.status(400).json({ error: "Url və format tələb olunur" });
  }

  const filename = `video_${Date.now()}`;
  const output = path.join(downloadsDir, `${filename}.%(ext)s`); // Məsələn: downloads/video_123456.mp4

  const ytDlpPath = "C:\\Users\\User\\Downloads\\yt-dlp.exe";

    const ytDlpCmd =
    format === "mp3"
        ? `"${ytDlpPath}" -o "${output}" -x --audio-format mp3 "${url}"`
        : `"${ytDlpPath}" -o "${output}" "${url}"`;


  exec(ytDlpCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", error);
      console.error("stderr:", stderr);
      return res.status(500).json({ error: "Download zamanı xəta baş verdi" });
    }

    // yt-dlp işi bitəndə .mp3 və ya .mp4 faylı yaranır.
    // İndi həmin faylın tam adı nədir, tapmaq lazımdır.

    // yt-dlp bəzən başqa extension qoyur, ona görə downloads qovluğunu skan edirik.
    fs.readdir(downloadsDir, (err, files) => {
      if (err) {
        console.error("Fayl qovluğu oxunarkən xəta:", err);
        return res.status(500).json({ error: "Serverdə xəta baş verdi" });
      }

      // Bizim fayl adı prefixi ilə başlayan faylları tapırıq
      const matchedFile = files.find(f => f.startsWith(filename));

      if (!matchedFile) {
        return res.status(500).json({ error: "Yüklənmiş fayl tapılmadı" });
      }

      // İstifadəçi üçün URL hazırla
      const downloadUrl = `${req.protocol}://${req.get('host')}/downloads/${matchedFile}`;

      res.json({
        message: "Download tamamlandı",
        downloadUrl,
      });
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ${port} portunda işləyir`));
