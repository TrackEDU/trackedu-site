<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>TrackEDU House Points</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
> <link rel="dns-prefetch" href="https://script.google.com">
<link rel="preconnect" href="https://script.google.com" crossorigin>
<link rel="dns-prefetch" href="https://script.googleusercontent.com">
<link rel="preconnect" href="https://script.googleusercontent.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<script>
// --- APP IDENTITY & PARAMS ---
const params = new URLSearchParams(window.location.search);
const schoolId = params.get('id') || 'demo';
const isStudentApp = params.get('view') === 'public';

const appName = isStudentApp ? "TrackEDU Student" : "TrackEDU Teacher";
const appIcon = isStudentApp ? 'https://trackedu.github.io/common-assets/studentapp.png' : 'https://trackedu.github.io/common-assets/teacherapp.png';
const themeColor = "#ffffff"; 

const metaThemeColor = document.createElement('meta');
metaThemeColor.name = "theme-color";
metaThemeColor.content = themeColor;
document.head.appendChild(metaThemeColor);

const baseManifest = {
  name: appName,
  short_name: "TrackEDU",
  start_url: window.location.origin + window.location.pathname + window.location.search,
  display: "standalone", 
  background_color: "#ffffff",
  theme_color: themeColor,
  orientation: "portrait",
  icons: [
    { src: appIcon, sizes: "192x192", type: "image/png", purpose: "any maskable" },
    { src: appIcon, sizes: "512x512", type: "image/png", purpose: "any maskable" }
  ]
};

const manifestBlob = new Blob([JSON.stringify(baseManifest)], { type: 'application/json' });
const manifestURL = URL.createObjectURL(manifestBlob);
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = manifestURL;
document.head.appendChild(manifestLink);

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  setTimeout(() => {
    navigator.serviceWorker.register('/sw.js');
  }, 2000);
}
</script>

<style>
body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #ffffff; font-family: 'Inter', sans-serif; }

/* --- SCHOOL-FRIENDLY LOBBY SCREEN --- */
#welcomeScreen { 
  position: fixed; inset: 0; background: #ffffff; 
  z-index: 9999; display: flex; flex-direction: column; 
  align-items: center; justify-content: center; 
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
  padding: 20px; text-align: center;
  will-change: opacity; /* Forces GPU acceleration */
  contain: strict; /* Critical for old device performance */
}

.executive-card {
  background: #ffffff; border-radius: 24px; padding: 45px 35px; width: 100%; max-width: 460px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.08); display: flex; flex-direction: column; align-items: center;
  position: relative; overflow: hidden; border: 1px solid #f1f5f9;
}

.executive-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
}

.system-status {
  display: flex; align-items: center; gap: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; 
  color: #166534; padding: 6px 14px; border-radius: 50px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px;
}

.status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }

.logo-img { width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

.welcome-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; }

.ethos-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 22px; border-radius: 14px; margin-bottom: 30px; width: 100%; box-sizing: border-box; }
.ethos-box p { color: #334155; font-size: 14px; margin: 0; line-height: 1.6; font-weight: 500; font-style: italic; }

.btn-launch {
  background: #1e40af; color: white; border: none; border-radius: 12px; padding: 18px 24px; font-size: 16px;
  font-weight: 700; width: 100%; cursor: pointer; box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2); transition: all 0.2s ease;
}
.btn-launch:active { transform: scale(0.98); opacity: 0.9; }

#loadingState { display: none; flex-direction: column; align-items: center; width: 100%; }
.tip-container { width: 100%; min-height: 80px; margin-top: 20px; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 14px; font-weight: 600; line-height: 1.5; transition: opacity 0.4s ease; }
.spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

iframe { position: fixed; inset: 0; width: 100%; height: 100%; border: none; z-index: 1; background-color: #ffffff; opacity: 0; transition: opacity 0.5s ease; }
</style>
</head>

<body>
<div id="welcomeScreen">
  <div class="executive-card">
    <div class="system-status"><div class="status-dot"></div> School Connection Active</div>
    <img src="https://trackedu.github.io/common-assets/teacherapp.png" class="logo-img" alt="TrackEDU Logo">
    
    <div id="initialState" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
      <h1 class="welcome-title">House Spirit Portal</h1>
      <div class="ethos-box">
        <p id="ethosText">Connecting to your House system...</p>
      </div>
      <button class="btn-launch" id="btnLaunch" onclick="handleLaunchClick()">Enter Portal <i class="fas fa-school" style="margin-left:8px; font-size:13px;"></i></button>
    </div>

    <div id="loadingState">
      <div class="spinner"></div>
      <p style="color: #0f172a; font-weight: 700; margin: 15px 0 5px 0; font-size: 13px;">Preparing Dashboard...</p>
      <div class="tip-container" id="tipText"></div>
    </div>
  </div>
</div>

> <iframe id="appFrame" allow="fullscreen" fetchpriority="high"></iframe>

<script>
// --- SCHOOL-FRIENDLY MISSION & ANT ETHOS ---
const ethosStatements = [
  "The Ant was chosen because a single worker is small, but a colony is an unstoppable force of nature.",
  "Every House Point awarded is a positive behavior reinforced. You are building school culture.",
  "Ants communicate constantly, ensuring no member is left behind. Success is found in connection.",
  "An ant can lift 50x its weight, proving that with purpose, students are capable of more than they imagine.",
  "House success isn't found in individual glory, but in the collective momentum of the team.",
  "The colony thrives on resilience. Every challenge is an opportunity to strengthen our community.",
  "In nature, the ant is the ultimate architect. In school, you are the architect of student character.",
  "Teamwork is the silent language of the colony. One goal, many hands, infinite impact.",
  "Like the ant, high-performing students show up every day with discipline, drive, and dedication.",
  "A House is not just a group; it is a community fueled by the spirit of its members."
];

// --- SCHOOL-FRIENDLY TIPS ---
const tips = [
  "💡 High-performing schools are built on consistent recognition, not just high points.",
  "💡 Use the 'Magic Hat' in the Toolkit to ensure every student has a fair chance to participate.",
  "💡 Fairness First: Use the 'Award History' log to review and maintain point consistency.",
  "💡 Support Your Values: Set custom Point Reasons to align rewards with your school’s pillars.",
  "💡 Students who maintain a 5-day login streak earn automated resilience bonuses.",
  "💡 Use 'Duo Mode' to manage lesson time while keeping student selection randomized.",
  "💡 Celebrate Success: Print 'Engagement Posters' to help students access their binders easily.",
  "💡 The 'Loot Drop' feature is perfect for creating fun scavenger hunts in your classroom.",
  "💡 Leadership in Action: House Captains can send weekly messages to inspire their team.",
  "💡 Collaboration: Launch 'Mystery Word' missions that require students to work together.",
  "💡 Student Voice: Use Polls to involve your students in fun school-wide choices.",
  "💡 Every milestone reached unlocks a unique trading card in the student's digital binder.",
  "💡 Time Saver: Use 'Bulk Assignment' to award House Points to entire classes at once.",
  "💡 Instant Rewards: Tap any student's icon for a quick +1 House Point award.",
  "💡 To correct a mistake, a long-press on a student's icon allows for rapid point removal.",
  "💡 Peer Mentorship: Monitor Top Contributing Classes to identify positive role models.",
  "💡 System Security: The 'Remember Me' toggle keeps you signed in safely for 30 days.",
  "💡 Your House Identity: Customize colors and mottos to match your school's unique history.",
  "💡 The 'House of Fortune' is a fun way to do lucky draws during morning assemblies.",
  "💡 Remember: One point is a small step; a colony moves mountains."
];

let tipInterval;
let appReady = false; 
let userWaiting = false; 

// Initialize Ethos Statement
document.getElementById('ethosText').innerText = ethosStatements[Math.floor(Math.random() * ethosStatements.length)];

function startTipCarousel() {
  const tipTextEl = document.getElementById('tipText');
  let currentTipIndex = Math.floor(Math.random() * tips.length);
  tipTextEl.innerHTML = tips[currentTipIndex];
  tipInterval = setInterval(() => {
    tipTextEl.style.opacity = '0'; 
    setTimeout(() => {
      currentTipIndex = (currentTipIndex + 1) % tips.length;
      tipTextEl.innerHTML = tips[currentTipIndex];
      tipTextEl.style.opacity = '1'; 
    }, 400);
  }, 4000);
}

// --- SECURE SILENT LOADING ENGINE ---
const GATEKEEPER_URL = "https://script.google.com/macros/s/AKfycbzqrrKj_6yEG_F7C032K1yvMxk9cLv2n-bFsRx6I0zuCUpkQo5pzzBPx7j4zmhxuBO73g/exec";
const CACHE_KEY = `trackedu_license_${schoolId}`;

// ⚡ INSTANT GHOST LOAD: Fire immediately, do not wait for window load
(function instantGatekeeper() {
  const cachedData = localStorage.getItem(CACHE_KEY);
  let loadedUrl = null;
  
  if (cachedData) {
    try {
      // Returning user: Start loading the heavy Google iframe INSTANTLY
      const data = JSON.parse(cachedData);
      loadedUrl = data.url; 
      loadIframeSilently(data);
    } catch(e) {
      localStorage.removeItem(CACHE_KEY); // Failsafe if cache gets corrupted
    }
  }
  
  // ALWAYS check gatekeeper silently in the background to verify license AND URL changes
  fetch(`${GATEKEEPER_URL}?id=${schoolId}`)
    .then(r => r.json())
    .then(newData => {
      if (!newData.success) {
        showHardLock(newData.reason);
      } else {
        // Save the absolute freshest data to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
        
        // ⚡ THE FIX: If you deployed a new backend URL, reload the iframe!
        if (cachedData && loadedUrl !== newData.url) {
          console.log("Backend URL updated, reloading iframe...");
          loadIframeSilently(newData);
        } else if (!cachedData) {
          // First time ever
          loadIframeSilently(newData);
        }
      }
    }).catch(() => {
      if (!cachedData) showHardLock("Connection Error. Please check your internet.");
    });
})();

function loadIframeSilently(data) {
  let url = data.url;
  url += (url.includes('?') ? '&' : '?') + "expiry=" + encodeURIComponent(data.expiry) + "&tier=" + encodeURIComponent(data.tier);
  if (isStudentApp) url += "&view=house-students";

  const frame = document.getElementById('appFrame');
  frame.src = url;
  
  // Modern browsers and cached GAS apps often only fire onload ONCE.
  // We accept the first load, but give a tiny buffer for Google's redirect to paint.
  frame.onload = () => { 
    setTimeout(() => {
      appReady = true; 
      if (userWaiting) revealApp(); 
    }, 800); 
  };
}

function handleLaunchClick() {
  if (appReady) {
    revealApp(); // Instant transition if loaded in background
  } else {
    userWaiting = true; // Still loading? Show tips until ready.
    document.getElementById('initialState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
    startTipCarousel();
    setTimeout(revealApp, 8000); // Safety reveal
  }
}

function revealApp() {
  if (tipInterval) clearInterval(tipInterval);
  const loader = document.getElementById('welcomeScreen');
  const frame = document.getElementById('appFrame');
  if (loader && loader.style.display !== 'none') {
    frame.style.opacity = '1';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      // ⚡ RAM CLEANUP: Destroy DOM elements and arrays to free up memory on old devices
      loader.remove(); 
      tips.length = 0; 
      ethosStatements.length = 0;
    }, 600);
  }
}

function showHardLock(reason) {
  if (tipInterval) clearInterval(tipInterval);
  localStorage.removeItem(CACHE_KEY);
  document.cookie = `${CACHE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  document.getElementById('welcomeScreen').innerHTML = `
    <div class="executive-card" style="border-top: 6px solid #b91c1c;">
      <div style="width: 60px; height: 60px; border-radius: 50%; background: #fef2f2; color: #b91c1c; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;">
        <i class="fas fa-lock"></i>
      </div>
      <h1 class="welcome-title" style="color:#0f172a;">Access Update Required</h1>
      <p style="font-size:13px; line-height:1.5; color:#475569; margin-bottom:25px;">
        The system requires an account verification or the license has ended.<br><br>
        <strong>Status:</strong> ${reason || "Verification required."}
      </p>
      <div style="display:flex; gap:10px; width:100%;">
        <button onclick="window.location.reload()" class="btn-launch" style="background:#f1f5f9; color:#475569; box-shadow:none; border:1px solid #cbd5e1;">Retry</button>
        <a href="mailto:support@trackedu.net" style="flex:1; background:#1e40af; color:#fff; text-decoration:none; padding:18px; border-radius:12px; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:14px;">Contact Admin</a>
      </div>
    </div>`;
}
</script>
</body>
</html>







const CACHE_NAME = 'trackedu-v22'; // Bumped version to force devices to update
const ASSETS = [
  // Base App Images
  'https://trackedu.github.io/common-assets/studentapp.png',
  'https://trackedu.github.io/common-assets/teacherapp.png',
  'https://trackedu.github.io/common-assets/tsloading.png',
  
  // ⚡ WORLD-CLASS TWEAK: Pre-cache the main stylesheets so they load instantly
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // ⚡ IPAD STANDALONE BYPASS:
  // STANDALONE iOS PWAs get stuck "waiting" on the Service Worker.
  // We do not intercept Google system URLs. This stops the 8-second hang.
  if (url.includes('google.com/macros') || url.includes('googleusercontent.com')) {
    return; 
  }

  // ⚡ DYNAMIC FONT & ICON CACHING (The slow Wi-Fi fix):
  // When the CSS asks for the actual font files (.woff2), we catch them, 
  // serve them from cache if we have them, or download and cache them for next time.
  if (url.includes('fonts.gstatic.com') || url.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return instantly from local device
        }
        // If not in cache, fetch it from the network
        return fetch(event.request).then((networkResponse) => {
          // Ensure we only cache valid responses
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }
          // Clone the response (it can only be consumed once) and put it in the cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default behavior for other requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});











