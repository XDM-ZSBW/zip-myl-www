import ftplib
from pathlib import Path

ftp = ftplib.FTP()
ftp.connect("myl.zip", 21)
ftp.login("mylzipftp@myl.zip", "h8r(wrKhdk")
print("[OK] Connected!")

local_path = Path("../src/js").resolve()
print(f"[UPLOAD] Uploading JS files from {local_path}")

# Upload JS files
for item in ["cross-platform-chat.js", "setup-wizard.js", "main.js"]:
    if (local_path / item).exists():
        ftp.storbinary(f"STOR js/{item}", open(local_path / item, "rb"))
        print(f"[OK] Uploaded js/{item}")
    else:
        print(f"[WARN] {item} not found")

print("[OK] JS files uploaded!")
ftp.quit()
print("[SUCCESS] JS files uploaded!")
