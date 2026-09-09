# Bittu — Website Live Karne Ka Poora Guide

Yeh guide bilkul step-by-step hai. Koi coding knowledge nahi chahiye — bas copy-paste aur click karna hai.

Total time: ~30-40 minutes. Total cost: ₹0 (Anthropic ka $5 free credit use hoga).

---

## Step 1: Anthropic API Key Banao (5 min)

1. Jao: https://console.anthropic.com
2. "Sign Up" karo — email se account banao
3. Phone number verify karo (koi card nahi chahiye)
4. Account banne ke baad, automatically **$5 free credit** mil jayega
5. Left side mein "API Keys" pe click karo
6. "Create Key" pe click karo, naam do jaise "bittu-app"
7. Jo key dikhegi (shuru "sk-ant-" se hogi), usko **kahin safe jagah copy karke rakh lo** — yeh dobara nahi dikhegi

---

## Step 2: GitHub Account Banao (5 min)

GitHub ek jagah hai jahan code store hota hai — Vercel yahan se code utha ke website banayega.

1. Jao: https://github.com
2. "Sign Up" karo, free account banao
3. Login karne ke baad, "New Repository" pe click karo
4. Naam do: `bittu-app`
5. "Public" select karo, "Create Repository" pe click karo

### Ab is folder ka poora code GitHub pe upload karo:
- Repository page pe "uploading an existing file" wala link dikhega, uspe click karo
- Is project ke teeno files/folders (`index.html`, `api/chat.js`, `package.json`) ko drag-drop karke upload karo
- Neeche "Commit changes" pe click karo

---

## Step 3: Vercel Pe Deploy Karo (10 min)

Vercel free mein websites host karta hai.

1. Jao: https://vercel.com
2. "Sign Up" karo — **GitHub account se hi sign up karna** (easy hoga connect karna)
3. Login hone ke baad "Add New Project" pe click karo
4. Apni `bittu-app` repository dikhegi list mein — usko "Import" karo
5. Deploy se pehle, "Environment Variables" section kholo:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (Step 1 mein jo key copy ki thi, wahi paste karo)
   - "Add" pe click karo
6. Ab "Deploy" button dabao
7. 1-2 minute mein aapki website ban jayegi — ek link milega jaisa `bittu-app.vercel.app`

**Bas ho gaya — yeh link kisi ko bhi bhej sakte ho, wo apne phone/laptop pe Bittu se baat kar sakega.**

---

## Step 4: Test Karo

- Apna link kholo
- Chat karke dekho, mic try karo
- Agar koi error aaye jaisa "ANTHROPIC_API_KEY missing", toh Step 3 ka Environment Variable dobara check karo

---

## Cost Ke Baare Mein Honestly

- $5 free credit se roughly **2,000-4,000 messages** ho sakte hain (Haiku model use ho raha hai, jo sabse sasta hai)
- Jab yeh khatam ho jaye, tab Anthropic Console mein card add karke aur credit dalna padega
- Jab tak sirf aap aur 5-10 test students use kar rahe ho, yeh $5 kaafi der chalega

---

## Agla Kadam

Jab yeh live ho jaaye, is link ko apne 5-10 college friends ko bhejo aur unka reaction record karo — yeh Phase 0 validation hai jo humne pehle discuss kiya tha.
