import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'work'/'video-runtime'))
import qrcode
import qrcode.image.svg
qr=qrcode.QRCode(box_size=8,border=4,error_correction=qrcode.constants.ERROR_CORRECT_M)
qr.add_data(sys.stdin.read());qr.make(fit=True)
sys.stdout.buffer.write(qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).to_string())
