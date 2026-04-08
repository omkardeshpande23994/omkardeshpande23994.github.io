with open('D:/GitHub/Web-Resume-v3/index.html', 'rb') as f:
    content = f.read()

# Find pattern around line 58-60
idx = content.find(b'ML Enthusiast</span></p>')
print('idx:', idx)
print(repr(content[idx:idx+100]))
