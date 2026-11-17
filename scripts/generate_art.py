#!/usr/bin/env python3
"""
Original, reproducible flat-illustration art for Aurora (Animal Homes & Shapes).

Generates all PNG assets in public/art/ and public/icons/ using only Pillow.
No external/copyrighted assets. Re-run any time to regenerate the artwork.

    pip install pillow
    python scripts/generate_art.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "art"
ICONS = ROOT / "public" / "icons"
SRC_ASSETS = ROOT / "src" / "assets"
ART.mkdir(parents=True, exist_ok=True)
ICONS.mkdir(parents=True, exist_ok=True)
SRC_ASSETS.mkdir(parents=True, exist_ok=True)

SS = 3                      # supersample factor for smooth edges
SZ = 512                    # logical size
PX = SZ * SS

OUT = (92, 62, 46, 255)     # dark-brown outline
WHITE = (255, 255, 255, 255)


class D:
    """Thin wrapper that scales all drawing coordinates by SS."""
    def __init__(self, img):
        self.d = ImageDraw.Draw(img)

    @staticmethod
    def _box(b):
        return tuple(v * SS for v in b)

    @staticmethod
    def _pts(p):
        return [(x * SS, y * SS) for x, y in p]

    def ellipse(self, box, fill=None, outline=None, width=1):
        self.d.ellipse(self._box(box), fill=fill, outline=outline, width=width * SS)

    def circle(self, cx, cy, r, fill=None, outline=None, width=1):
        self.ellipse((cx - r, cy - r, cx + r, cy + r), fill, outline, width)

    def rounded_rectangle(self, box, r, fill=None, outline=None, width=1):
        self.d.rounded_rectangle(self._box(box), radius=r * SS, fill=fill,
                                 outline=outline, width=width * SS)

    def rectangle(self, box, fill=None, outline=None, width=1):
        self.d.rectangle(self._box(box), fill=fill, outline=outline, width=width * SS)

    def polygon(self, pts, fill=None, outline=None):
        p = self._pts(pts)
        self.d.polygon(p, fill=fill)
        if outline:
            self.d.line(p + [p[0]], fill=outline, width=5 * SS, joint="curve")

    def line(self, pts, fill, width=1, joint="curve"):
        self.d.line(self._pts(pts), fill=fill, width=width * SS, joint=joint)

    def arc(self, box, start, end, fill, width=1):
        self.d.arc(self._box(box), start, end, fill=fill, width=width * SS)

    def pieslice(self, box, start, end, fill=None, outline=None):
        self.d.pieslice(self._box(box), start, end, fill=fill, outline=outline,
                        width=4 * SS)

    def text(self, xy, txt, fill, font):
        self.d.text((xy[0] * SS, xy[1] * SS), txt, fill=fill, font=font)


def canvas():
    return Image.new("RGBA", (PX, PX), (0, 0, 0, 0))


def finish(img, name, folder=ART):
    out = img.resize((SZ, SZ), Image.LANCZOS)
    out.save(folder / f"{name}.png")


def eyes(d, cy, leftx, rightx, r=26):
    for x in (leftx, rightx):
        d.circle(x, cy, r, WHITE, OUT, 4)
        d.circle(x + 5, cy + 3, r // 2, (40, 34, 30, 255))
        d.circle(x + 2, cy - 2, 5, WHITE)


def smile(d, cx, cy, w=34):
    d.arc((cx - w, cy - w // 2, cx + w, cy + w // 2), 15, 165, OUT, 4)


# ---------------------------------------------------------------------------
# Mascot
# ---------------------------------------------------------------------------
def mascot():
    im = canvas(); d = D(im)
    # ear tufts
    d.polygon([(150, 175), (175, 105), (215, 168)], (188, 148, 108, 255), OUT)
    d.polygon([(362, 175), (337, 105), (297, 168)], (188, 148, 108, 255), OUT)
    # body
    d.ellipse((120, 150, 392, 432), (206, 170, 132, 255), OUT, 6)
    # belly
    d.ellipse((178, 262, 334, 420), (246, 231, 204, 255))
    # wings
    d.ellipse((92, 252, 168, 392), (176, 136, 96, 255), OUT, 5)
    d.ellipse((344, 252, 420, 392), (176, 136, 96, 255), OUT, 5)
    # eyes
    eyes(d, 225, 200, 312, 40)
    # beak
    d.polygon([(236, 278), (276, 278), (256, 314)], (255, 176, 59, 255), OUT)
    # smile + feet
    smile(d, 256, 340, 26)
    d.ellipse((188, 416, 240, 444), (255, 176, 59, 255), OUT, 4)
    d.ellipse((272, 416, 324, 444), (255, 176, 59, 255), OUT, 4)
    finish(im, "mascot")


# ---------------------------------------------------------------------------
# Animals
# ---------------------------------------------------------------------------
def bird():
    im = canvas(); d = D(im)
    d.polygon([(120, 268), (40, 214), (48, 330)], (86, 156, 222, 255), OUT)
    d.ellipse((132, 168, 380, 402), (116, 182, 238, 255), OUT, 6)
    d.ellipse((156, 236, 262, 336), (86, 156, 214, 255), OUT, 4)
    d.circle(340, 250, 30, WHITE, OUT, 4)
    d.circle(346, 252, 14, (40, 34, 30, 255))
    d.polygon([(372, 268), (438, 282), (374, 296)], (255, 176, 59, 255), OUT)
    d.circle(312, 300, 12, (244, 160, 160, 180))
    smile(d, 350, 318, 18)
    d.line([(210, 400), (200, 436)], (255, 150, 50, 255), 7)
    d.line([(280, 400), (292, 436)], (255, 150, 50, 255), 7)
    finish(im, "bird")


def bear():
    im = canvas(); d = D(im)
    d.circle(168, 154, 46, (166, 118, 78, 255), OUT, 5)
    d.circle(344, 154, 46, (166, 118, 78, 255), OUT, 5)
    d.ellipse((116, 150, 396, 424), (176, 126, 86, 255), OUT, 6)
    d.ellipse((196, 262, 316, 346), (242, 222, 194, 255), OUT, 4)
    d.ellipse((238, 286, 274, 310), (60, 46, 38, 255))
    eyes(d, 240, 196, 316, 22)
    smile(d, 256, 322, 26)
    d.circle(150, 278, 14, (230, 150, 150, 150))
    d.circle(362, 278, 14, (230, 150, 150, 150))
    finish(im, "bear")


def rabbit():
    im = canvas(); d = D(im)
    d.ellipse((168, 54, 226, 246), (250, 250, 250, 255), OUT, 5)
    d.ellipse((286, 54, 344, 246), (250, 250, 250, 255), OUT, 5)
    d.ellipse((184, 78, 210, 210), (244, 168, 180, 255))
    d.ellipse((302, 78, 328, 210), (244, 168, 180, 255))
    d.ellipse((128, 190, 384, 428), (250, 250, 250, 255), OUT, 6)
    eyes(d, 272, 206, 306, 22)
    d.polygon([(244, 310), (268, 310), (256, 326)], (232, 132, 148, 255), OUT)
    smile(d, 256, 336, 24)
    d.circle(168, 312, 13, (246, 188, 196, 170))
    d.circle(344, 312, 13, (246, 188, 196, 170))
    finish(im, "rabbit")


def fish():
    im = canvas(); d = D(im)
    d.polygon([(132, 270), (36, 196), (44, 348)], (255, 158, 88, 255), OUT)
    d.polygon([(214, 186), (262, 108), (312, 186)], (255, 158, 88, 255), OUT)
    d.ellipse((104, 176, 368, 384), (255, 172, 100, 255), OUT, 6)
    d.arc((170, 220, 300, 350), 300, 60, (230, 130, 70, 255), 5)
    d.circle(168, 244, 26, WHITE, OUT, 4)
    d.circle(173, 246, 12, (40, 34, 30, 255))
    smile(d, 150, 300, 20)
    d.circle(300, 264, 12, (244, 160, 160, 170))
    finish(im, "fish")


def bee():
    im = canvas(); d = D(im)
    d.line([(214, 214), (194, 158)], OUT, 5)
    d.line([(298, 214), (318, 158)], OUT, 5)
    d.circle(194, 154, 9, OUT)
    d.circle(318, 154, 9, OUT)
    d.ellipse((150, 150, 258, 258), (222, 240, 250, 220), OUT, 4)
    d.ellipse((266, 140, 374, 248), (222, 240, 250, 220), OUT, 4)
    body = Image.new("RGBA", (PX, PX), (0, 0, 0, 0))
    bd = D(body)
    bd.ellipse((132, 202, 380, 388), (255, 214, 82, 255), OUT, 6)
    stripes = Image.new("RGBA", (PX, PX), (0, 0, 0, 0))
    sd = D(stripes)
    for x in (204, 262, 320):
        sd.rounded_rectangle((x - 20, 200, x + 20, 392), 12, (60, 48, 40, 255))
    mask = Image.new("L", (PX, PX), 0)
    ImageDraw.Draw(mask).ellipse(D._box((132, 202, 380, 388)), fill=255)
    body.paste(stripes, (0, 0), mask)
    im.alpha_composite(body)
    d = D(im)
    d.circle(184, 272, 22, WHITE, OUT, 3)
    d.circle(188, 274, 10, (40, 34, 30, 255))
    d.circle(324, 272, 22, WHITE, OUT, 3)
    d.circle(328, 274, 10, (40, 34, 30, 255))
    smile(d, 256, 330, 26)
    finish(im, "bee")


def squirrel():
    im = canvas(); d = D(im)
    # bushy tail behind body
    d.ellipse((252, 96, 472, 420), (208, 132, 74, 255), OUT, 6)
    d.ellipse((300, 150, 452, 360), (230, 160, 98, 255))
    d.polygon([(150, 220), (172, 138), (214, 206)], (208, 132, 74, 255), OUT)
    d.polygon([(262, 206), (304, 138), (326, 220)], (208, 132, 74, 255), OUT)
    d.ellipse((116, 196, 340, 428), (216, 142, 82, 255), OUT, 6)
    d.ellipse((180, 300, 300, 424), (246, 224, 190, 255))
    eyes(d, 262, 196, 280, 22)
    d.ellipse((236, 298, 272, 320), (60, 46, 38, 255))
    smile(d, 254, 332, 22)
    finish(im, "squirrel")


# ---------------------------------------------------------------------------
# Homes
# ---------------------------------------------------------------------------
def nest():
    im = canvas(); d = D(im)
    d.line([(44, 372), (468, 372)], (150, 104, 64, 255), 16)
    d.ellipse((116, 250, 396, 418), (176, 126, 78, 255), OUT, 6)
    d.arc((132, 250, 380, 404), 0, 180, (120, 82, 50, 255), 8)
    d.ellipse((190, 244, 248, 308), WHITE, OUT, 4)
    d.ellipse((268, 244, 326, 308), WHITE, OUT, 4)
    for x, y in ((150, 300), (362, 300), (256, 360)):
        d.line([(x, y), (x - 16, y - 26)], (150, 104, 64, 255), 5)
    finish(im, "nest")


def cave():
    im = canvas(); d = D(im)
    d.ellipse((52, 196, 460, 470), (128, 188, 108, 255), OUT, 6)
    d.rounded_rectangle((190, 316, 322, 470), 60, (74, 58, 48, 255))
    d.ellipse((190, 258, 322, 350), (74, 58, 48, 255))
    d.arc((190, 258, 322, 350), 180, 360, OUT, 5)
    for x in (110, 400):
        d.line([(x, 230), (x, 196)], (86, 150, 70, 255), 5)
    d.circle(330, 244, 9, (244, 120, 130, 255))
    d.circle(150, 276, 8, (255, 214, 90, 255))
    finish(im, "cave")


def burrow():
    im = canvas(); d = D(im)
    d.ellipse((96, 280, 416, 454), (188, 146, 104, 255), OUT, 6)
    d.ellipse((196, 306, 316, 420), (78, 58, 44, 255), OUT, 4)
    for x in (150, 256, 360):
        d.line([(x, 300), (x - 12, 270)], (96, 164, 78, 255), 7)
        d.line([(x + 16, 302), (x + 28, 274)], (96, 164, 78, 255), 7)
    d.circle(178, 336, 8, (244, 120, 130, 255))
    d.circle(340, 350, 8, (255, 214, 90, 255))
    finish(im, "burrow")


def pond():
    im = canvas(); d = D(im)
    d.ellipse((56, 196, 456, 420), (108, 190, 230, 255), OUT, 6)
    d.ellipse((104, 230, 408, 390), (140, 212, 240, 255))
    d.arc((150, 268, 300, 350), 200, 320, WHITE, 5)
    d.ellipse((150, 282, 232, 338), (110, 186, 96, 255), OUT, 3)
    d.ellipse((296, 308, 378, 364), (110, 186, 96, 255), OUT, 3)
    d.polygon([(191, 308), (170, 296), (170, 320)], (108, 190, 230, 255))
    d.polygon([(337, 334), (316, 322), (316, 346)], (108, 190, 230, 255))
    d.circle(262, 268, 10, (244, 160, 160, 200))
    finish(im, "pond")


def hive():
    im = canvas(); d = D(im)
    d.rounded_rectangle((146, 306, 366, 410), 28, (230, 190, 112, 255), OUT, 5)
    d.rounded_rectangle((168, 242, 344, 336), 26, (236, 200, 126, 255), OUT, 5)
    d.rounded_rectangle((192, 186, 320, 268), 24, (242, 210, 140, 255), OUT, 5)
    d.ellipse((230, 330, 282, 388), (80, 60, 44, 255), OUT, 4)
    d.arc((160, 320, 352, 400), 10, 170, (200, 156, 84, 255), 4)
    finish(im, "hive")


def tree_hollow():
    im = canvas(); d = D(im)
    d.rounded_rectangle((188, 178, 324, 458), 24, (168, 122, 82, 255), OUT, 6)
    d.ellipse((214, 252, 298, 338), (72, 54, 42, 255), OUT, 4)
    d.ellipse((108, 92, 306, 246), (110, 178, 92, 255), OUT, 5)
    d.ellipse((250, 78, 452, 246), (128, 196, 104, 255), OUT, 5)
    d.circle(168, 168, 12, (150, 210, 120, 255))
    d.circle(380, 160, 10, (150, 210, 120, 255))
    finish(im, "tree-hollow")


# ---------------------------------------------------------------------------
# Background
# ---------------------------------------------------------------------------
def background():
    w = h = 1024
    im = Image.new("RGB", (w, h))
    px = im.load()
    top = (196, 232, 250)
    bot = (255, 244, 214)
    for y in range(h):
        t = y / h
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = c
    d = ImageDraw.Draw(im)
    # clouds
    for cx, cy, s in ((220, 160, 1.0), (760, 110, 1.2), (520, 220, 0.7)):
        d.ellipse((cx - 70*s, cy - 34*s, cx + 70*s, cy + 34*s), fill=(255, 255, 255))
        d.ellipse((cx - 40*s, cy - 60*s, cx + 44*s, cy + 20*s), fill=(255, 255, 255))
    # hills
    d.ellipse((-160, 640, 700, 1180), fill=(168, 214, 142))
    d.ellipse((420, 700, 1240, 1200), fill=(142, 198, 122))
    d.ellipse((-100, 840, 1120, 1320), fill=(122, 184, 104))
    # flowers
    for x, y, col in ((150, 900, (244, 132, 150)), (380, 970, (255, 214, 96)),
                      (640, 920, (180, 150, 230)), (880, 980, (244, 132, 150)),
                      (520, 1010, (255, 244, 220))):
        d.ellipse((x-7, y-7, x+7, y+7), fill=col)
        d.rectangle((x-2, y+6, x+2, y+22), fill=(86, 150, 74))
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    im.save(ART / "bg-meadow.png")
    im.save(SRC_ASSETS / "bg-meadow.png")


# ---------------------------------------------------------------------------
# PWA icons (from the owl mascot)
# ---------------------------------------------------------------------------
def icons():
    base = Image.open(ART / "mascot.png").convert("RGBA")
    for name, size, bg in (
        ("icon-192.png", 192, (255, 183, 77, 255)),
        ("icon-512.png", 512, (255, 183, 77, 255)),
        ("icon-maskable-512.png", 512, (255, 183, 77, 255)),
    ):
        pad = int(size * 0.10)
        icon = Image.new("RGBA", (size, size), bg)
        art = base.resize((size - 2 * pad, size - 2 * pad), Image.LANCZOS)
        if name.startswith("icon-maskable"):
            # keep art inside the central safe zone for Android adaptive icons
            art = art.resize((int(size * 0.7), int(size * 0.7)), Image.LANCZOS)
            art = art.resize((int(size * 0.7), int(size * 0.7)), Image.LANCZOS)
        icon.alpha_composite(art, (pad if not name.startswith("icon-maskable") else int(size*0.15),
                                   pad if not name.startswith("icon-maskable") else int(size*0.15)))
        icon.convert("RGB").save(ICONS / name)


# ---------------------------------------------------------------------------
# Extra animals (18 more, for a total of 24)
# ---------------------------------------------------------------------------
def animal(name, body, *, pre=None, post=None, ears=None, ear_color=None,
           eye_y=250, eye_x=(206, 306), eye_r=22, muzzle=None, nose=None,
           smile_y=None, box=(120, 170, 392, 420)):
    im = canvas(); d = D(im)
    ec = ear_color or body
    if pre:
        pre(d)
    if ears == 'round':
        d.circle(160, 150, 40, ec, OUT, 5); d.circle(352, 150, 40, ec, OUT, 5)
    elif ears == 'pointy':
        d.polygon([(150, 200), (176, 110), (222, 190)], ec, OUT)
        d.polygon([(362, 200), (336, 110), (290, 190)], ec, OUT)
    elif ears == 'long':
        d.ellipse((168, 50, 224, 230), ec, OUT, 5)
        d.ellipse((288, 50, 344, 230), ec, OUT, 5)
        d.ellipse((182, 72, 210, 200), (244, 168, 180, 255))
        d.ellipse((302, 72, 330, 200), (244, 168, 180, 255))
    elif ears == 'floppy':
        d.ellipse((104, 176, 180, 300), ec, OUT, 5)
        d.ellipse((332, 176, 408, 300), ec, OUT, 5)
    elif ears == 'tuft':
        d.polygon([(150, 180), (172, 110), (208, 172)], ec, OUT)
        d.polygon([(362, 180), (340, 110), (304, 172)], ec, OUT)
    d.ellipse(box, body, OUT, 6)
    if muzzle:
        d.ellipse((200, 288, 312, 356), muzzle, OUT, 4)
    if post:
        post(d)
    eyes(d, eye_y, eye_x[0], eye_x[1], eye_r)
    if nose:
        d.ellipse((238, 300, 274, 322), nose)
    smile(d, 256, smile_y or eye_y + 62, 22)
    finish(im, name)


def dog():
    def pre(d):
        d.line([(380, 330), (440, 300), (452, 250)], (160, 110, 70, 255), 9)
    animal('dog', (222, 184, 135), ears='floppy', ear_color=(160, 110, 70),
           muzzle=(246, 230, 204), nose=(60, 46, 38, 255), smile_y=334, pre=pre)


def cat():
    def pre(d):
        d.line([(360, 340), (440, 310), (462, 230)], (255, 167, 90, 255), 10)
    def post(d):
        for y1, y2 in ((318, 306), (332, 340)):
            d.line([(180, y1), (120, y2)], OUT, 3)
            d.line([(332, y1), (392, y2)], OUT, 3)
    animal('cat', (255, 167, 90), ears='pointy', muzzle=(255, 232, 200),
           nose=(230, 130, 140, 255), smile_y=330, pre=pre, post=post)


def fox():
    def pre(d):
        d.ellipse((300, 240, 470, 400), (230, 130, 70, 255), OUT, 5)
        d.ellipse((382, 250, 462, 350), (250, 250, 250, 255))
    animal('fox', (230, 130, 70), ears='pointy', muzzle=(250, 250, 250),
           nose=(60, 46, 38, 255), smile_y=330, pre=pre)


def owl_animal():
    def post(d):
        d.ellipse((100, 260, 170, 390), (150, 112, 82, 255), OUT, 4)
        d.ellipse((342, 260, 412, 390), (150, 112, 82, 255), OUT, 4)
        d.polygon([(236, 290), (276, 290), (256, 326)], (255, 176, 59, 255), OUT)
    animal('owl', (176, 140, 108), ears='tuft', eye_y=232, eye_x=(200, 312),
           eye_r=40, smile_y=350, post=post)


def duck():
    def pre(d):
        d.polygon([(120, 260), (44, 232), (56, 320)], (255, 214, 90, 255), OUT)
    def post(d):
        d.ellipse((160, 250, 250, 330), (240, 200, 80, 255), OUT, 4)
        d.polygon([(368, 262), (436, 278), (368, 294)], (255, 150, 50, 255), OUT)
    animal('duck', (255, 224, 110), eye_y=240, eye_x=(196, 294), eye_r=20,
           smile_y=300, pre=pre, post=post)


def frog():
    def pre(d):
        d.circle(180, 180, 34, (124, 196, 96, 255), OUT, 4)
        d.circle(332, 180, 34, (124, 196, 96, 255), OUT, 4)
    animal('frog', (124, 196, 96), eye_y=180, eye_x=(180, 332), eye_r=24,
           smile_y=318, box=(120, 200, 392, 430), pre=pre)


def hen():
    def pre(d):
        for x in (232, 256, 280):
            d.circle(x, 150, 18, (230, 70, 70, 255), OUT, 3)
    def post(d):
        d.polygon([(370, 266), (430, 280), (370, 294)], (255, 176, 59, 255), OUT)
        d.ellipse((160, 240, 250, 320), (240, 240, 240, 255), OUT, 4)
        d.ellipse((244, 300, 270, 340), (230, 70, 70, 255))
    animal('hen', (250, 250, 250), eye_y=246, pre=pre, post=post, smile_y=330)


def cow():
    def pre(d):
        d.polygon([(160, 170), (140, 110), (190, 150)], (240, 230, 210, 255), OUT)
        d.polygon([(352, 170), (372, 110), (322, 150)], (240, 230, 210, 255), OUT)
    def post(d):
        d.ellipse((160, 230, 230, 300), (70, 60, 55, 255))
        d.ellipse((300, 340, 370, 410), (70, 60, 55, 255))
    animal('cow', (250, 250, 250), ears='round', ear_color=(240, 230, 210),
           muzzle=(248, 190, 190), nose=(210, 120, 120, 255),
           smile_y=340, pre=pre, post=post)


def horse():
    def pre(d):
        d.polygon([(150, 180), (120, 110), (176, 160)], (150, 100, 64, 255), OUT)
        d.polygon([(362, 180), (392, 110), (336, 160)], (150, 100, 64, 255), OUT)
        d.line([(150, 190), (120, 300), (100, 380)], (110, 70, 44, 255), 12)
    def post(d):
        d.line([(180, 168), (256, 120), (340, 168)], (110, 70, 44, 255), 14)
    animal('horse', (180, 130, 86), muzzle=(224, 180, 140),
           nose=(90, 60, 44, 255), smile_y=340, pre=pre, post=post)


def sheep():
    def pre(d):
        for cx, cy in ((160, 250), (210, 220), (270, 220), (330, 250),
                       (180, 310), (256, 330), (332, 310)):
            d.circle(cx, cy, 52, (250, 250, 250, 255), OUT, 3)
    animal('sheep', (250, 250, 250), ears='round', ear_color=(80, 70, 66),
           eye_y=270, eye_x=(216, 300), eye_r=18, muzzle=(70, 64, 60),
           nose=(50, 44, 40, 255), smile_y=350, box=(150, 240, 360, 420), pre=pre)


def pig():
    def pre(d):
        d.line([(390, 330), (430, 300), (410, 270), (440, 250)],
               (248, 180, 190, 255), 8)
    def post(d):
        d.circle(256, 330, 34, (240, 160, 175, 255), OUT, 4)
        d.circle(244, 330, 6, (190, 110, 125, 255))
        d.circle(268, 330, 6, (190, 110, 125, 255))
    animal('pig', (248, 180, 190), ears='pointy', ear_color=(240, 160, 175),
           smile_y=374, pre=pre, post=post)


def turtle():
    im = canvas(); d = D(im)
    for x, y in ((160, 380), (340, 380), (190, 300), (322, 300)):
        d.ellipse((x - 26, y - 18, x + 26, y + 18), (120, 190, 110, 255), OUT, 4)
    d.polygon([(120, 350), (70, 370), (120, 390)], (120, 190, 110, 255), OUT)
    d.ellipse((130, 190, 382, 390), (86, 150, 96, 255), OUT, 6)
    for cx, cy in ((200, 250), (310, 250), (256, 320)):
        d.polygon([(cx - 26, cy), (cx, cy - 26), (cx + 26, cy), (cx, cy + 26)],
                  (120, 184, 120, 255))
    d.ellipse((340, 220, 440, 320), (140, 200, 130, 255), OUT, 5)
    d.circle(390, 250, 18, WHITE, OUT, 3); d.circle(394, 252, 8, (40, 34, 30, 255))
    smile(d, 395, 290, 16)
    finish(im, 'turtle')


def snail():
    im = canvas(); d = D(im)
    d.ellipse((120, 330, 400, 430), (210, 180, 130, 255), OUT, 5)
    d.circle(256, 250, 110, (200, 140, 80, 255), OUT, 6)
    d.arc((176, 170, 336, 330), 0, 360, (160, 100, 60, 255), 8)
    d.arc((206, 200, 306, 300), 0, 360, (160, 100, 60, 255), 8)
    d.ellipse((360, 300, 450, 400), (210, 180, 130, 255), OUT, 5)
    d.line([(390, 310), (380, 250)], OUT, 5); d.line([(420, 310), (432, 250)], OUT, 5)
    d.circle(380, 246, 8, OUT); d.circle(432, 246, 8, OUT)
    d.circle(392, 340, 14, WHITE, OUT, 3); d.circle(396, 342, 6, (40, 34, 30, 255))
    finish(im, 'snail')


def ant():
    im = canvas(); d = D(im)
    for x, y in ((150, 400), (256, 400), (362, 400), (180, 320),
                 (332, 320), (256, 300), (256, 200)):
        d.line([(256, 300), (x, y)], OUT, 4)
    d.ellipse((330, 150, 430, 250), (70, 50, 44, 255), OUT, 5)
    d.ellipse((216, 240, 296, 320), (70, 50, 44, 255), OUT, 5)
    d.ellipse((150, 150, 250, 250), (90, 64, 50, 255), OUT, 5)
    d.line([(180, 160), (150, 100)], OUT, 4); d.line([(222, 160), (250, 100)], OUT, 4)
    d.circle(190, 190, 16, WHITE, OUT, 3); d.circle(194, 192, 7, (40, 34, 30, 255))
    smile(d, 200, 220, 14)
    finish(im, 'ant')


def mole():
    def pre(d):
        d.ellipse((130, 330, 210, 430), (150, 110, 90, 255), OUT, 5)
        d.ellipse((302, 330, 382, 430), (150, 110, 90, 255), OUT, 5)
    animal('mole', (140, 110, 90), ears='round', ear_color=(120, 90, 74),
           eye_y=250, eye_x=(210, 302), eye_r=10, muzzle=(230, 180, 170),
           nose=(230, 120, 130, 255), smile_y=340, pre=pre)


def mouse():
    def pre(d):
        d.line([(392, 360), (450, 390), (470, 340)], (200, 170, 170, 255), 7)
    animal('mouse', (190, 190, 196), ears='round', ear_color=(220, 190, 196),
           eye_y=252, eye_r=18, muzzle=(240, 220, 224),
           nose=(230, 130, 150, 255), smile_y=332, pre=pre)


def hedgehog():
    def pre(d):
        for i in range(9):
            x = 140 + i * 28
            d.polygon([(x - 14, 230), (x, 150), (x + 14, 230)],
                      (120, 86, 60, 255), OUT)
    animal('hedgehog', (200, 160, 120), ears='round', eye_y=290,
           eye_x=(210, 300), eye_r=16, muzzle=(240, 210, 180),
           nose=(60, 46, 38, 255), smile_y=350,
           box=(140, 250, 380, 430), pre=pre)


def penguin():
    im = canvas(); d = D(im)
    d.ellipse((120, 150, 392, 430), (50, 50, 60, 255), OUT, 6)
    d.ellipse((180, 230, 332, 420), (250, 250, 250, 255))
    d.ellipse((90, 250, 160, 360), (50, 50, 60, 255), OUT, 4)
    d.ellipse((352, 250, 422, 360), (50, 50, 60, 255), OUT, 4)
    d.polygon([(240, 220), (272, 220), (256, 250)], (255, 160, 50, 255), OUT)
    d.circle(214, 210, 18, WHITE, OUT, 3); d.circle(218, 212, 8, (40, 34, 30, 255))
    d.circle(298, 210, 18, WHITE, OUT, 3); d.circle(302, 212, 8, (40, 34, 30, 255))
    d.ellipse((180, 414, 240, 450), (255, 160, 50, 255), OUT, 4)
    d.ellipse((272, 414, 332, 450), (255, 160, 50, 255), OUT, 4)
    finish(im, 'penguin')


# ---------------------------------------------------------------------------
# Extra homes (18 more, for a total of 24)
# ---------------------------------------------------------------------------
def doghouse():
    im = canvas(); d = D(im)
    d.polygon([(80, 250), (256, 110), (432, 250)], (180, 120, 80, 255), OUT)
    d.rectangle((110, 250, 402, 430), (210, 160, 110, 255), OUT, 5)
    d.rounded_rectangle((206, 300, 306, 430), 50, (70, 52, 40, 255), OUT, 4)
    d.circle(256, 370, 8, (255, 214, 90, 255))
    finish(im, 'doghouse')


def cat_house():
    im = canvas(); d = D(im)
    d.polygon([(80, 250), (256, 110), (432, 250)], (210, 150, 190, 255), OUT)
    d.rectangle((110, 250, 402, 430), (244, 210, 220, 255), OUT, 5)
    d.circle(256, 366, 52, (80, 60, 56, 255), OUT, 4)
    d.ellipse((180, 408, 332, 432), (255, 224, 200, 255))
    finish(im, 'cat-house')


def fox_den():
    im = canvas(); d = D(im)
    d.ellipse((60, 240, 452, 460), (196, 130, 84, 255), OUT, 6)
    d.rounded_rectangle((190, 320, 322, 460), 60, (70, 52, 42, 255))
    d.ellipse((190, 262, 322, 354), (70, 52, 42, 255))
    d.arc((190, 262, 322, 354), 180, 360, OUT, 5)
    finish(im, 'fox-den')


def treehouse():
    im = canvas(); d = D(im)
    d.rounded_rectangle((220, 260, 292, 460), 18, (168, 122, 82, 255), OUT, 5)
    d.ellipse((120, 130, 300, 280), (110, 178, 92, 255), OUT, 5)
    d.ellipse((250, 120, 440, 280), (128, 196, 104, 255), OUT, 5)
    d.rectangle((150, 250, 362, 340), (226, 180, 116, 255), OUT, 5)
    d.polygon([(130, 250), (256, 170), (382, 250)], (190, 110, 80, 255), OUT)
    d.circle(256, 302, 26, (80, 60, 44, 255), OUT, 3)
    for y in (350, 385, 420):
        d.line([(232, y), (280, y)], (150, 104, 64, 255), 6)
    finish(im, 'treehouse')


def reed_nest():
    im = canvas(); d = D(im)
    for x in (110, 150, 190, 330, 370, 410):
        d.line([(x, 420), (x - 10, 190)], (96, 164, 78, 255), 7)
        d.ellipse((x - 14, 176, x + 14, 208), (176, 140, 96, 255), OUT, 3)
    d.ellipse((150, 300, 366, 420), (176, 126, 78, 255), OUT, 5)
    d.arc((166, 300, 350, 406), 0, 180, (120, 82, 50, 255), 7)
    d.ellipse((212, 288, 260, 340), WHITE, OUT, 3)
    d.ellipse((272, 288, 320, 340), WHITE, OUT, 3)
    finish(im, 'reed-nest')


def lily_pad():
    im = canvas(); d = D(im)
    d.ellipse((56, 200, 456, 424), (108, 190, 230, 255), OUT, 6)
    d.circle(256, 310, 118, (110, 186, 96, 255), OUT, 5)
    d.polygon([(256, 310), (330, 250), (350, 290)], (108, 190, 230, 255))
    d.arc((170, 248, 342, 380), 20, 150, (150, 210, 130, 255), 5)
    d.circle(160, 250, 10, (244, 160, 160, 200))
    finish(im, 'lily-pad')


def coop():
    im = canvas(); d = D(im)
    d.polygon([(90, 240), (256, 120), (422, 240)], (196, 150, 100, 255), OUT)
    d.rectangle((110, 240, 402, 420), (230, 190, 130, 255), OUT, 5)
    d.rounded_rectangle((212, 300, 300, 420), 40, (80, 60, 44, 255), OUT, 4)
    d.rectangle((160, 386, 352, 400), (150, 104, 64, 255), OUT, 3)
    finish(im, 'coop')


def barn():
    im = canvas(); d = D(im)
    d.polygon([(80, 250), (256, 110), (432, 250)], (120, 60, 56, 255), OUT)
    d.rectangle((100, 250, 412, 440), (200, 70, 64, 255), OUT, 5)
    d.rectangle((190, 310, 322, 440), (240, 230, 210, 255), OUT, 4)
    d.line([(190, 310), (322, 440)], (200, 70, 64, 255), 7)
    d.line([(322, 310), (190, 440)], (200, 70, 64, 255), 7)
    finish(im, 'barn')


def stable():
    im = canvas(); d = D(im)
    d.polygon([(80, 230), (256, 110), (432, 230)], (150, 100, 70, 255), OUT)
    d.rectangle((100, 230, 412, 440), (206, 160, 106, 255), OUT, 5)
    for x in (160, 300):
        d.rounded_rectangle((x, 300, x + 52, 440), 24, (80, 58, 44, 255), OUT, 4)
    finish(im, 'stable')


def sheep_pen():
    im = canvas(); d = D(im)
    d.ellipse((70, 360, 442, 450), (140, 196, 116, 255), OUT, 5)
    for x in (110, 200, 290, 380):
        d.rectangle((x, 260, x + 16, 390), (196, 148, 96, 255), OUT, 3)
    for y in (280, 330):
        d.rectangle((100, y, 410, y + 14), (196, 148, 96, 255), OUT, 3)
    finish(im, 'sheep-pen')


def pigsty():
    im = canvas(); d = D(im)
    d.ellipse((90, 330, 422, 440), (170, 130, 100, 255), OUT, 5)
    d.ellipse((150, 360, 360, 420), (140, 104, 80, 255))
    for x in (120, 220, 320):
        d.rectangle((x, 280, x + 14, 380), (196, 148, 96, 255), OUT, 3)
    d.rectangle((110, 300, 400, 312), (196, 148, 96, 255), OUT, 3)
    finish(im, 'pigsty')


def beach():
    im = canvas(); d = D(im)
    d.ellipse((60, 280, 452, 440), (244, 214, 150, 255), OUT, 5)
    d.ellipse((300, 330, 470, 430), (108, 190, 230, 255), OUT, 4)
    d.polygon([(180, 350), (210, 320), (240, 350), (210, 380)], (230, 160, 150, 255), OUT)
    d.circle(210, 350, 8, (250, 220, 190, 255))
    finish(im, 'beach')


def shell():
    im = canvas(); d = D(im)
    d.pieslice((120, 170, 392, 440), 180, 360, (236, 190, 170, 255), OUT)
    for r in (100, 76, 52, 28):
        d.arc((256 - r, 420 - r, 256 + r, 420 + r), 180, 360,
              (200, 140, 130, 255), 5)
    finish(im, 'shell')


def anthill():
    im = canvas(); d = D(im)
    d.ellipse((100, 280, 412, 450), (180, 130, 90, 255), OUT, 6)
    d.ellipse((216, 330, 296, 410), (74, 54, 42, 255), OUT, 4)
    for x, y in ((150, 400), (360, 400), (190, 430)):
        d.circle(x, y, 10, (90, 64, 50, 255), OUT, 2)
    finish(im, 'anthill')


def molehill():
    im = canvas(); d = D(im)
    d.ellipse((96, 280, 416, 450), (170, 130, 96, 255), OUT, 6)
    d.ellipse((206, 320, 306, 416), (74, 54, 42, 255), OUT, 4)
    d.line([(256, 320), (256, 270)], OUT, 6)
    d.circle(256, 262, 12, (170, 130, 96, 255), OUT, 3)
    finish(im, 'molehill')


def mouse_hole():
    im = canvas(); d = D(im)
    d.rectangle((90, 180, 422, 450), (236, 226, 210, 255), OUT, 5)
    for y in (250, 320, 390):
        d.line([(90, y), (422, y)], (214, 200, 184, 255), 4)
    d.ellipse((176, 300, 336, 440), (70, 54, 44, 255), OUT, 4)
    d.ellipse((190, 420, 322, 448), (150, 130, 110, 255))
    finish(im, 'mouse-hole')


def leaf_pile():
    im = canvas(); d = D(im)
    d.ellipse((90, 370, 422, 450), (170, 130, 90, 255), OUT, 4)
    colors = [(220, 140, 80, 255), (200, 90, 70, 255), (240, 180, 90, 255),
              (150, 180, 90, 255), (190, 120, 190, 255)]
    for i, (x, y) in enumerate(((160, 330), (256, 300), (350, 330),
                                (210, 380), (310, 380), (256, 400))):
        c = colors[i % len(colors)]
        d.ellipse((x - 56, y - 26, x + 56, y + 26), c, OUT, 4)
        d.line([(x - 50, y), (x + 50, y)], (120, 80, 60, 255), 3)
    finish(im, 'leaf-pile')


def iceberg():
    im = canvas(); d = D(im)
    d.ellipse((50, 380, 462, 450), (120, 190, 230, 255), OUT, 5)
    d.polygon([(90, 390), (200, 150), (300, 320), (380, 190), (450, 390)],
              (222, 244, 250, 255), OUT)
    d.polygon([(200, 150), (300, 320), (250, 390), (140, 390)],
              (190, 226, 240, 255))
    finish(im, 'iceberg')


if __name__ == "__main__":
    for fn in (mascot, bird, bear, rabbit, fish, bee, squirrel,
               nest, cave, burrow, pond, hive, tree_hollow,
               dog, cat, fox, owl_animal, duck, frog, hen, cow, horse,
               sheep, pig, turtle, snail, ant, mole, mouse, hedgehog, penguin,
               doghouse, cat_house, fox_den, treehouse, reed_nest, lily_pad,
               coop, barn, stable, sheep_pen, pigsty, beach, shell, anthill,
               molehill, mouse_hole, leaf_pile, iceberg, background, icons):
        fn()
        print("generated", fn.__name__)
    print("Done. Art lives in", ART)
