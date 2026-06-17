import segno
url = "https://docs.google.com/forms/d/e/1FAIpQLScRlluMC_P15YlJ8YREvoAvlVcvBfnvWP2SpZ8t_iiQHBNwPA/viewform?usp=header"
qr = segno.make(url, error='h')
# High-contrast, on-theme dark green modules on white, generous quiet zone
qr.save("flyer/assets/qr.png", scale=18, border=3, dark="#15412e", light="#ffffff")
print("QR modules:", qr.symbol_size())
