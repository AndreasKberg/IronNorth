# Iron North

**Forge yourself. Every day.**

A PWA (Progressive Web App) for daily discipline, skill trees, and character development. Built for young men who want to build real habits — not just track them.

---

## Deploy to Netlify (3 minutes)

1. Go to [netlify.com](https://netlify.com) and sign in (free account works)
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the entire `iron-north` folder into the drop zone
4. Netlify gives you a live URL instantly (e.g. `iron-north-abc123.netlify.app`)
5. Optional: set a custom domain in Site Settings

That's it. The `netlify.toml` handles all routing and caching automatically.

---

## Install on Phone

### iPhone (Safari)
1. Open your Netlify URL in Safari
2. Tap the **Share** button → **"Add to Home Screen"**
3. Iron North installs like a native app

### Android (Chrome)
1. Open the URL in Chrome
2. Chrome shows an **"Add to Home Screen"** banner automatically
3. Or tap the three-dot menu → "Add to Home Screen"

---

## AI Coach Setup

The AI Coach uses Claude (Anthropic) to generate personalized daily challenges and coach messages.

1. Get an API key at [anthropic.com](https://anthropic.com)
2. Open Iron North → Profile → **AI Coach API Key**
3. Paste your key — it's stored locally on your device only

Without a key, the app uses built-in coach messages and challenge sets (fully functional).

---

## What's Built

| Feature | Status |
|---|---|
| Onboarding (3 steps) | ✅ |
| Daily task system (seeded by date) | ✅ |
| AI-generated challenges | ✅ |
| AI Coach daily message | ✅ |
| XP system | ✅ |
| Tier progression (Bronze → Olympian) | ✅ |
| 6 Skill Trees × 5 nodes each | ✅ |
| Weekly missions (auto-reset Monday) | ✅ |
| Streak tracking + milestone bonuses | ✅ |
| 28-day forged days calendar | ✅ |
| Daily reflection journal | ✅ |
| Edit profile / areas | ✅ |
| Data export (JSON) | ✅ |
| Offline support (service worker) | ✅ |
| PWA installable on iOS + Android | ✅ |
| Level-up animation | ✅ |

---

## File Structure

```
iron-north/
├── index.html       # App entry point
├── style.css        # All styles
├── app.js           # All logic, state, rendering
├── sw.js            # Service worker (offline)
├── manifest.json    # PWA config
├── netlify.toml     # Hosting config
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Customization

All challenge content, skill trees, tiers, weekly missions, and reflection prompts are in `app.js` at the top in clearly labeled `const` blocks. Edit freely.

---

*Iron North — Built for those who forge.*
