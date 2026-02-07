Here are the essential developer notes to add to your `README.md` file. These cover the specific "Dynamic School ID" architecture we built, so you won't forget how to deploy new schools later.

---

## 🛠️ Deployment Guide & Developer Notes

### 1. How the App Works (The "Traffic Cop" Logic)

This app uses a single frontend (GitHub Pages) to serve multiple schools. It determines which school data to load based on the `id` parameter in the URL.

* **URL Pattern:** `https://trackedu.net/app/?id=schoolname`
* **Frontend (GitHub):** Checks the `schoolRegistry` in `index.html` to find the matching Google Script URL.
* **Backend (Google Script):** Receives the request and serves the correct HTML template (`HousePointsUI` for teachers, `HouseStudents` for students).

### 2. Setting Up a New School (2-Step Process)

To deploy a copy for a new client (e.g., "British School"):

**Step A: The Google Sheet (Backend)**

1. Make a copy of the Master Spreadsheet.
2. Open **Extensions > Apps Script > `Code.gs**`.
3. Update the Configuration at the top:
```javascript
const CURRENT_SCHOOL_ID = "british"; // <--- Unique ID for this school

```


4. **Deploy:** Click `Deploy > New Deployment > Web App`.
* *Execute as:* **Me**
* *Who has access:* **Anyone**


5. **Copy** the resulting Web App URL.

**Step B: The GitHub Registry (Frontend)**

1. Open `app/index.html` in the repo.
2. Add the new school to the `schoolRegistry` object:
```javascript
const schoolRegistry = {
  "demo": "...",
  "tanglin": "...",
  "british": "https://script.google.com/macros/s/NEW_URL_HERE/exec" // <--- Add this line
};

```


3. Commit changes. The new link `trackedu.net/app/?id=british` is now live.

### 3. Critical Mobile Caching Rules (Service Worker)

The PWA aggressively caches files for offline use. If you make **any** changes to `index.html` (like adding a new school), you **MUST** force mobile devices to update.

1. Open `sw.js`.
2. Increment the version number at the top:
```javascript
const CACHE_NAME = 'trackedu-v14'; // Change v13 -> v14

```


3. Commit.
4. *Note:* Mobile users may need to close and reopen the app twice to catch the update.

### 4. Image Assets & Icons

* **Location:** All shared assets (icons, posters) are in the `common-assets` repository/folder.
* **Absolute Paths:** Always use full URLs in code, or the Service Worker will fail to cache them:
* ✅ `https://trackedu.github.io/common-assets/studentapp.png`
* ❌ `../images/studentapp.png`



### 5. Troubleshooting "School Not Found"

If a mobile user sees "School Not Found" but it works on desktop:

1. They are likely running an old cached version of `sw.js`.
2. **Fix:** Bump the version in `sw.js` (see step 3).
3. **Quick Fix for User:** Ask them to clear Safari/Chrome cache or delete and reinstall the PWA.

### 6. Dynamic Variables

* **`GLOBAL_SCHOOL_ID`**: This variable is injected into the `<head>` of the HTML by Google Apps Script.
* **Usage:** It allows buttons (like "Install App" or "Open Student View") to automatically generate links for the *current* school without manual code changes.
* *Code:* `window.open('...id=' + GLOBAL_SCHOOL_ID ...)`
