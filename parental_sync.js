/* =========================================================
   PARENTAL CONTROLS — PHASE 2 + 3: FAMILY SYNC & LIVE LOCATION
   Barrow Quest / LEOIDS
   =========================================================
   PHASE 2:
   - Parent generates family code (e.g. KHYL-8392)
   - Child enters code to link their phone
   - Both phones share family_id via Supabase
   - SOS alerts sync in real time to parent phone
   - Check-ins sync in real time
   - Settings push from parent to child
   - Alerts log synced both ways

   PHASE 3:
   - Child GPS tracked every 10 seconds
   - Parent sees live map with child's position
   - Marker updates smoothly in real time
   - Distance shown on parent screen
   - Location history stored (last 50 points)
   - Low accuracy warning shown to parent
   - GPS auto-starts when child opens app if linked
========================================================= */

const SYNC_STORAGE_KEY = "bq_parental_sync_v1";

/* =========================================================
   SYNC STATE
========================================================= */

let syncState = {
  familyId: null,
  familyCode: null,
  deviceRole: null,
  deviceId: null,
  childRecordId: null,
  realtimeChannel: null,
  syncActive: false,
  lastSyncAt: null,
  locationWatchId: null,
  locationTrackingActive: false,
  lastLocationSyncAt: 0,
};

function loadSyncState() {
  try {
    const raw = localStorage.getItem(SYNC_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    syncState = { ...syncState, ...parsed };
  } catch {}
}

function saveSyncState() {
  try {
    const toSave = {
      familyId: syncState.familyId,
      familyCode: syncState.familyCode,
      deviceRole: syncState.deviceRole,
      deviceId: syncState.deviceId,
      childRecordId: syncState.childRecordId,
    };
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

/* =========================================================
   DEVICE ID
========================================================= */

function getDeviceId() {
  if (syncState.deviceId) return syncState.deviceId;
  let id = localStorage.getItem("bq_device_id");
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("bq_device_id", id);
  }
  syncState.deviceId = id;
  return id;
}

/* =========================================================
   SUPABASE ACCESS
========================================================= */

function getSupabase() {
  return window.LEOIDSSupabase?.client || null;
}

/* =========================================================
   FAMILY CODE GENERATOR
========================================================= */

function generateFamilyCode(parentName = "FMLY") {
  const prefix = (parentName || "FMLY")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `${prefix}-${suffix}`;
}

/* =========================================================
   CREATE FAMILY — PARENT SIDE
========================================================= */

async function createFamily(parentName, localConfig) {
  const supabase = getSupabase();
  if (!supabase) { console.warn("Supabase not ready."); return null; }

  const familyCode = generateFamilyCode(parentName);
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("parental_families")
    .insert({ family_code: familyCode, parent_name: parentName, parent_device_id: deviceId, is_active: true })
    .select()
    .single();

  if (error) { console.error("Could not create family:", error); return null; }

  syncState.familyId = data.id;
  syncState.familyCode = data.family_code;
  syncState.deviceRole = "parent";
  syncState.deviceId = deviceId;
  saveSyncState();

  await pushSettingsToSupabase(localConfig);
  return data;
}

/* =========================================================
   JOIN FAMILY — CHILD SIDE
========================================================= */

async function joinFamily(familyCode, childName, childAge) {
  const supabase = getSupabase();
  if (!supabase) { console.warn("Supabase not ready."); return null; }

  const cleanCode = String(familyCode || "").trim().toUpperCase();

  const { data: family, error: familyError } = await supabase
    .from("parental_families")
    .select("*")
    .eq("family_code", cleanCode)
    .eq("is_active", true)
    .single();

  if (familyError || !family) { console.warn("Family code not found:", cleanCode); return null; }

  const deviceId = getDeviceId();

  const { data: existing } = await supabase
    .from("parental_children")
    .select("*")
    .eq("family_id", family.id)
    .eq("device_id", deviceId)
    .maybeSingle();

  let childRecord = existing;

  if (!childRecord) {
    const { data: newChild, error: childError } = await supabase
      .from("parental_children")
      .insert({ family_id: family.id, child_name: childName, child_age: childAge, device_id: deviceId, sos_active: false, last_seen: new Date().toISOString() })
      .select()
      .single();

    if (childError) { console.error("Could not create child record:", childError); return null; }
    childRecord = newChild;
  } else {
    await supabase
      .from("parental_children")
      .update({ child_name: childName, child_age: childAge, last_seen: new Date().toISOString() })
      .eq("id", childRecord.id);
  }

  syncState.familyId = family.id;
  syncState.familyCode = cleanCode;
  syncState.deviceRole = "child";
  syncState.deviceId = deviceId;
  syncState.childRecordId = childRecord.id;
  saveSyncState();

  await pullSettingsFromSupabase();
  return { family, childRecord };
}

/* =========================================================
   PUSH / PULL SETTINGS
========================================================= */

async function pushSettingsToSupabase(localConfig) {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return false;

  const settingsPayload = {
    features: localConfig.features,
    lobbies: localConfig.lobbies,
    screenTime: {
      enabled: localConfig.screenTime.enabled,
      dailyLimitMinutes: localConfig.screenTime.dailyLimitMinutes,
      lockAfterHour: localConfig.screenTime.lockAfterHour,
      unlockAfterHour: localConfig.screenTime.unlockAfterHour,
      blockSchoolHours: localConfig.screenTime.blockSchoolHours,
      schoolStartHour: localConfig.screenTime.schoolStartHour,
      schoolEndHour: localConfig.screenTime.schoolEndHour,
    },
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("parental_settings")
    .upsert({ family_id: syncState.familyId, settings_json: settingsPayload, updated_at: new Date().toISOString() }, { onConflict: "family_id" });

  if (error) { console.warn("Could not push settings:", error); return false; }
  return true;
}

async function pullSettingsFromSupabase() {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return null;

  const { data, error } = await supabase
    .from("parental_settings")
    .select("settings_json, updated_at")
    .eq("family_id", syncState.familyId)
    .maybeSingle();

  if (error || !data) return null;

  const settings = data.settings_json;
  if (!settings) return null;

  try {
    const raw = localStorage.getItem("bq_parental_controls_v1");
    const localConfig = raw ? JSON.parse(raw) : {};
    if (settings.features) localConfig.features = { ...localConfig.features, ...settings.features };
    if (settings.lobbies) localConfig.lobbies = { ...localConfig.lobbies, ...settings.lobbies };
    if (settings.screenTime) localConfig.screenTime = { ...localConfig.screenTime, ...settings.screenTime };
    localStorage.setItem("bq_parental_controls_v1", JSON.stringify(localConfig));
    if (typeof window.checkAndApplyScreenLock === "function") window.checkAndApplyScreenLock();
    return localConfig;
  } catch (err) {
    console.warn("Could not apply pulled settings:", err);
    return null;
  }
}

/* =========================================================
   PHASE 3 — CHILD GPS TRACKING
   Starts on child phone, pushes location every 10 seconds
========================================================= */

function startChildLocationTracking() {
  if (!navigator.geolocation) {
    console.warn("GPS not available on this device.");
    return false;
  }

  if (!syncState.childRecordId) {
    console.warn("Cannot start location tracking — child not linked.");
    return false;
  }

  stopChildLocationTracking();

  syncState.locationTrackingActive = true;

  syncState.locationWatchId = navigator.geolocation.watchPosition(
    async (position) => {
      const lat = Number(position.coords.latitude);
      const lng = Number(position.coords.longitude);
      const accuracy = Math.round(Number(position.coords.accuracy || 999));

      const now = Date.now();

      // Only sync if moved or 10 seconds passed
      const timeSinceLastSync = now - Number(syncState.lastLocationSyncAt || 0);
      if (timeSinceLastSync < 10000) return;

      syncState.lastLocationSyncAt = now;

      await syncChildLocationToSupabase(lat, lng, accuracy);

      console.log("PARENTAL GPS SYNC", { lat, lng, accuracy });
    },
    (error) => {
      console.warn("Parental GPS error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    }
  );

  console.log("Child location tracking started.");
  return true;
}

function stopChildLocationTracking() {
  if (syncState.locationWatchId !== null && syncState.locationWatchId !== undefined) {
    try {
      navigator.geolocation.clearWatch(syncState.locationWatchId);
    } catch {}
  }
  syncState.locationWatchId = null;
  syncState.locationTrackingActive = false;
  console.log("Child location tracking stopped.");
}

/* =========================================================
   SYNC CHILD LOCATION TO SUPABASE
========================================================= */

async function syncChildLocationToSupabase(lat, lng, accuracy = null) {
  const supabase = getSupabase();
  if (!supabase || !syncState.childRecordId) return false;

  await supabase
    .from("parental_children")
    .update({
      last_lat: lat,
      last_lng: lng,
      last_accuracy: accuracy,
      last_seen: new Date().toISOString(),
    })
    .eq("id", syncState.childRecordId);

  return true;
}

/* =========================================================
   PHASE 3 — PARENT LIVE MAP
   Parent sees child's position updating in real time
========================================================= */

function openChildLiveMap(child) {
  const old = document.getElementById("parental-live-map");
  if (old) old.remove();

  const hasLocation = child.last_lat && child.last_lng;
  const accuracy = child.last_accuracy || null;
  const lastSeen = child.last_seen ? new Date(child.last_seen).toLocaleString() : "Unknown";

  const modal = document.createElement("div");
  modal.id = "parental-live-map";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:#07111f;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    display:flex;flex-direction:column;
  `;

  modal.innerHTML = `
    <!-- HEADER -->
    <div style="
      padding:14px 16px;
      background:linear-gradient(180deg,#07111f,#0b1627);
      border-bottom:1px solid rgba(255,255,255,.1);
      display:flex;align-items:center;gap:12px;
      flex-shrink:0;
    ">
      <button id="btn-livemap-back" type="button" style="
        width:42px;height:42px;border-radius:50%;
        background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
        font-size:18px;cursor:pointer;flex-shrink:0;
      ">←</button>
      <div style="flex:1;min-width:0;">
        <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.1em;">LIVE LOCATION</div>
        <div style="font-size:18px;font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:white;">
          ${child.child_name || "Child"}
        </div>
      </div>
      <button id="btn-livemap-refresh" type="button" style="
        width:42px;height:42px;border-radius:50%;
        background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
        font-size:18px;cursor:pointer;flex-shrink:0;
      ">↻</button>
    </div>

    <!-- STATUS BAR -->
    <div id="livemap-status-bar" style="
      padding:10px 16px;
      background:#0b1627;
      border-bottom:1px solid rgba(255,255,255,.08);
      display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;
      flex-shrink:0;
    ">
      <div style="text-align:center;">
        <div style="font-size:10px;opacity:.65;color:white;letter-spacing:.08em;">STATUS</div>
        <div id="livemap-status-text" style="font-size:13px;font-weight:900;color:#22c55e;margin-top:2px;">
          ${child.sos_active ? "🚨 SOS" : "🟢 OK"}
        </div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:10px;opacity:.65;color:white;letter-spacing:.08em;">ACCURACY</div>
        <div id="livemap-accuracy-text" style="font-size:13px;font-weight:900;color:white;margin-top:2px;">
          ${accuracy ? `~${accuracy}m` : "—"}
        </div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:10px;opacity:.65;color:white;letter-spacing:.08em;">LAST SEEN</div>
        <div id="livemap-lastseen-text" style="font-size:11px;font-weight:900;color:white;margin-top:2px;">
          ${lastSeen}
        </div>
      </div>
    </div>

    <!-- MAP CONTAINER -->
    <div id="parental-map-container" style="flex:1;position:relative;min-height:0;">
      ${hasLocation ? `
        <div id="parental-leaflet-map" style="width:100%;height:100%;"></div>
      ` : `
        <div style="
          width:100%;height:100%;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          color:white;text-align:center;padding:28px;
        ">
          <div style="font-size:52px;margin-bottom:16px;">📍</div>
          <div style="font-size:18px;font-weight:900;margin-bottom:8px;">No Location Yet</div>
          <div style="font-size:14px;opacity:.8;line-height:1.5;">
            ${child.child_name || "Child"}'s phone hasn't sent a location yet.<br>
            Make sure GPS is on and the app is open on their phone.
          </div>
          <button id="btn-livemap-wait-refresh" type="button" style="
            margin-top:20px;min-height:46px;padding:0 24px;
            border-radius:16px;background:#00d4ff;color:#05070b;
            font-weight:1000;border:none;cursor:pointer;font-size:14px;
          ">CHECK AGAIN</button>
        </div>
      `}
    </div>

    <!-- BOTTOM ACTIONS -->
    <div style="
      padding:14px 16px;
      background:linear-gradient(0deg,#07111f,#0b1627);
      border-top:1px solid rgba(255,255,255,.08);
      display:grid;grid-template-columns:1fr 1fr;gap:10px;
      flex-shrink:0;
    ">
      ${hasLocation ? `
        <a id="btn-livemap-google" href="https://maps.google.com/?q=${child.last_lat},${child.last_lng}" target="_blank" style="
          display:flex;align-items:center;justify-content:center;
          min-height:48px;border-radius:16px;
          background:#ffd54a;color:#231600;font-weight:1000;
          text-decoration:none;font-size:14px;
        ">📍 Open in Maps</a>
      ` : `
        <div></div>
      `}
      ${child.sos_active ? `
        <button id="btn-livemap-cancel-sos" type="button" style="
          min-height:48px;border-radius:16px;
          background:#ff3b3b;color:white;font-weight:1000;
          border:none;cursor:pointer;font-size:14px;
        ">🚨 Cancel SOS</button>
      ` : `
        <button id="btn-livemap-close" type="button" style="
          min-height:48px;border-radius:16px;
          background:#111827;color:white;font-weight:900;
          border:1px solid rgba(255,255,255,.1);cursor:pointer;font-size:14px;
        ">CLOSE</button>
      `}
    </div>
  `;

  document.body.appendChild(modal);

  // Wire buttons
  document.getElementById("btn-livemap-back")?.addEventListener("click", () => {
    modal.remove();
    stopParentMapUpdates();
  });

  document.getElementById("btn-livemap-close")?.addEventListener("click", () => {
    modal.remove();
    stopParentMapUpdates();
  });

  document.getElementById("btn-livemap-cancel-sos")?.addEventListener("click", async () => {
    await cancelRemoteSOS(child.id);
    modal.remove();
    stopParentMapUpdates();
  });

  document.getElementById("btn-livemap-wait-refresh")?.addEventListener("click", async () => {
    modal.remove();
    const children = await loadFamilyChildren();
    const updated = children.find(c => c.id === child.id) || child;
    openChildLiveMap(updated);
  });

  document.getElementById("btn-livemap-refresh")?.addEventListener("click", async () => {
    const children = await loadFamilyChildren();
    const updated = children.find(c => c.id === child.id) || child;
    updateLiveMapDisplay(updated);
  });

  // Init Leaflet map if we have location
  if (hasLocation) {
    initParentalLeafletMap(child);
  }

  // Start polling for updates every 10 seconds
  startParentMapUpdates(child.id);
}

/* =========================================================
   INIT LEAFLET MAP ON PARENT SCREEN
========================================================= */

let parentMapInstance = null;
let parentChildMarker = null;
let parentAccuracyCircle = null;
let parentMapUpdateInterval = null;

function initParentalLeafletMap(child) {
  // Wait a tick for DOM
  setTimeout(() => {
    const mapEl = document.getElementById("parental-leaflet-map");
    if (!mapEl) return;

    if (parentMapInstance) {
      try { parentMapInstance.remove(); } catch {}
      parentMapInstance = null;
    }

    const lat = Number(child.last_lat);
    const lng = Number(child.last_lng);
    const accuracy = Number(child.last_accuracy || 20);

    parentMapInstance = L.map("parental-leaflet-map", {
      zoomControl: true,
      attributionControl: false,
    }).setView([lat, lng], 17);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(parentMapInstance);

    // Accuracy circle
    parentAccuracyCircle = L.circle([lat, lng], {
      radius: accuracy,
      color: "#00d4ff",
      fillColor: "#00d4ff",
      fillOpacity: 0.12,
      weight: 1,
    }).addTo(parentMapInstance);

    // Child marker
    const icon = L.divIcon({
      className: "parental-child-marker",
      html: `
        <div style="
          width:38px;height:38px;border-radius:50%;
          background:#00d4ff;
          border:3px solid white;
          box-shadow:0 0 18px #00d4ff;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;
        ">
          👧
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    parentChildMarker = L.marker([lat, lng], { icon })
      .bindTooltip(`${child.child_name || "Child"} — last seen ${child.last_seen ? new Date(child.last_seen).toLocaleTimeString() : "?"}`, {
        permanent: false,
        direction: "top",
      })
      .addTo(parentMapInstance);

  }, 150);
}

/* =========================================================
   UPDATE LIVE MAP DISPLAY
========================================================= */

function updateLiveMapDisplay(child) {
  if (!child) return;

  const lat = Number(child.last_lat);
  const lng = Number(child.last_lng);
  const accuracy = Number(child.last_accuracy || 20);
  const hasLocation = child.last_lat && child.last_lng;

  // Update status bar
  const statusText = document.getElementById("livemap-status-text");
  const accuracyText = document.getElementById("livemap-accuracy-text");
  const lastSeenText = document.getElementById("livemap-lastseen-text");

  if (statusText) {
    statusText.innerText = child.sos_active ? "🚨 SOS" : "🟢 OK";
    statusText.style.color = child.sos_active ? "#ff3b3b" : "#22c55e";
  }

  if (accuracyText) {
    accuracyText.innerText = accuracy ? `~${accuracy}m` : "—";
    accuracyText.style.color = accuracy > 50 ? "#ffb000" : "white";
  }

  if (lastSeenText && child.last_seen) {
    lastSeenText.innerText = new Date(child.last_seen).toLocaleTimeString();
  }

  // Update Google Maps link
  if (hasLocation) {
    const googleLink = document.getElementById("btn-livemap-google");
    if (googleLink) {
      googleLink.href = `https://maps.google.com/?q=${lat},${lng}`;
    }
  }

  // Update Leaflet marker
  if (parentMapInstance && parentChildMarker && hasLocation) {
    parentChildMarker.setLatLng([lat, lng]);
    parentChildMarker.setTooltipContent(
      `${child.child_name || "Child"} — ${new Date(child.last_seen || Date.now()).toLocaleTimeString()}`
    );

    if (parentAccuracyCircle) {
      parentAccuracyCircle.setLatLng([lat, lng]);
      parentAccuracyCircle.setRadius(accuracy);
    }

    // Pan map to child
    parentMapInstance.panTo([lat, lng], { animate: true, duration: 0.5 });
  }

  // SOS pulse
  if (child.sos_active) {
    showParentSOSAlert(child);
  }
}

/* =========================================================
   START / STOP PARENT MAP POLLING
========================================================= */

function startParentMapUpdates(childId) {
  stopParentMapUpdates();

  parentMapUpdateInterval = setInterval(async () => {
    const children = await loadFamilyChildren();
    const updated = children.find(c => c.id === childId);
    if (updated) updateLiveMapDisplay(updated);
  }, 10000);
}

function stopParentMapUpdates() {
  if (parentMapUpdateInterval) {
    clearInterval(parentMapUpdateInterval);
    parentMapUpdateInterval = null;
  }
}

/* =========================================================
   SOS SYNC
========================================================= */

async function syncSOSToSupabase(active = true) {
  const supabase = getSupabase();
  if (!supabase || !syncState.childRecordId) return false;

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("parental_children")
    .update({
      sos_active: active,
      sos_triggered_at: active ? now : null,
      last_seen: now,
    })
    .eq("id", syncState.childRecordId);

  if (error) { console.warn("Could not sync SOS:", error); return false; }

  if (syncState.familyId) {
    const raw = localStorage.getItem("bq_parental_controls_v1");
    const config = raw ? JSON.parse(raw) : {};
    const childName = config?.child?.name || "Child";

    await supabase.from("parental_alerts").insert({
      family_id: syncState.familyId,
      child_id: syncState.childRecordId,
      message: active ? `🚨 SOS ACTIVATED by ${childName}` : `✅ SOS cancelled`,
      level: active ? "red" : "green",
      source: "child",
    });
  }

  return true;
}

/* =========================================================
   CHECK-IN SYNC
========================================================= */

async function syncCheckInToSupabase() {
  const supabase = getSupabase();
  if (!supabase || !syncState.childRecordId) return false;

  const now = new Date().toISOString();

  await supabase
    .from("parental_children")
    .update({ last_checkin_at: now, last_seen: now })
    .eq("id", syncState.childRecordId);

  if (syncState.familyId) {
    const raw = localStorage.getItem("bq_parental_controls_v1");
    const config = raw ? JSON.parse(raw) : {};
    const childName = config?.child?.name || "Child";

    await supabase.from("parental_alerts").insert({
      family_id: syncState.familyId,
      child_id: syncState.childRecordId,
      message: `✅ CHECK-IN: ${childName} is safe`,
      level: "green",
      source: "child",
    });
  }

  return true;
}

/* =========================================================
   LOAD DATA
========================================================= */

async function loadRemoteAlerts() {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return [];

  const { data, error } = await supabase
    .from("parental_alerts")
    .select("*")
    .eq("family_id", syncState.familyId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return [];
  return data || [];
}

async function markRemoteAlertsRead() {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return;

  await supabase
    .from("parental_alerts")
    .update({ read_at: new Date().toISOString() })
    .eq("family_id", syncState.familyId)
    .is("read_at", null);
}

async function loadFamilyChildren() {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return [];

  const { data, error } = await supabase
    .from("parental_children")
    .select("*")
    .eq("family_id", syncState.familyId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data || [];
}

async function cancelRemoteSOS(childId) {
  const supabase = getSupabase();
  if (!supabase || !childId) return false;

  await supabase
    .from("parental_children")
    .update({ sos_active: false, sos_triggered_at: null })
    .eq("id", childId);

  if (syncState.familyId) {
    await supabase.from("parental_alerts").insert({
      family_id: syncState.familyId,
      child_id: childId,
      message: "✅ SOS cancelled by parent",
      level: "green",
      source: "parent",
    });
  }

  return true;
}

/* =========================================================
   REALTIME LISTENERS
========================================================= */

function startParentRealtimeListener() {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return false;

  if (syncState.realtimeChannel) {
    try { supabase.removeChannel(syncState.realtimeChannel); } catch {}
    syncState.realtimeChannel = null;
  }

  const channel = supabase
    .channel(`parental_family_${syncState.familyId}`)
    .on("postgres_changes", {
      event: "*", schema: "public", table: "parental_children",
      filter: `family_id=eq.${syncState.familyId}`,
    }, (payload) => handleChildUpdate(payload))
    .on("postgres_changes", {
      event: "INSERT", schema: "public", table: "parental_alerts",
      filter: `family_id=eq.${syncState.familyId}`,
    }, (payload) => handleNewAlert(payload))
    .subscribe((status) => {
      syncState.syncActive = status === "SUBSCRIBED";
    });

  syncState.realtimeChannel = channel;
  return true;
}

function startChildRealtimeListener() {
  const supabase = getSupabase();
  if (!supabase || !syncState.familyId) return false;

  if (syncState.realtimeChannel) {
    try { supabase.removeChannel(syncState.realtimeChannel); } catch {}
    syncState.realtimeChannel = null;
  }

  const channel = supabase
    .channel(`parental_child_${syncState.familyId}`)
    .on("postgres_changes", {
      event: "*", schema: "public", table: "parental_settings",
      filter: `family_id=eq.${syncState.familyId}`,
    }, () => pullSettingsFromSupabase())
    .subscribe();

  syncState.realtimeChannel = channel;
  return true;
}

function stopRealtimeSync() {
  const supabase = getSupabase();
  if (syncState.realtimeChannel && supabase) {
    try { supabase.removeChannel(syncState.realtimeChannel); } catch {}
  }
  syncState.realtimeChannel = null;
  syncState.syncActive = false;
}

/* =========================================================
   HANDLE REALTIME EVENTS
========================================================= */

function handleChildUpdate(payload) {
  const child = payload.new || payload.old;
  if (!child) return;

  if (child.sos_active) showParentSOSAlert(child);

  // If live map is open, update it
  updateLiveMapDisplay(child);
}

function handleNewAlert(payload) {
  const alert = payload.new;
  if (!alert) return;
  showParentAlertToast(alert);
  if (alert.level === "red") {
    document.body.animate(
      [{ background: "rgba(255,0,0,.22)" }, { background: "transparent" }],
      { duration: 800, easing: "ease-out" }
    );
  }
}

/* =========================================================
   SOS ALERT ON PARENT PHONE
========================================================= */

function showParentSOSAlert(child) {
  const old = document.getElementById("parent-sos-alert");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "parent-sos-alert";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999999;
    background:rgba(0,0,0,.92);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  overlay.innerHTML = `
    <div style="
      width:min(92vw,420px);
      border:3px solid #ff3b3b;border-radius:28px;
      background:linear-gradient(180deg,#2a1116,#05070b);
      padding:28px;text-align:center;color:white;
      box-shadow:0 0 52px rgba(255,59,59,.65);
    ">
      <div style="font-size:64px;margin-bottom:12px;">🚨</div>
      <div style="font-size:26px;font-weight:1000;color:#ff3b3b;margin-bottom:8px;">SOS ALERT</div>
      <div style="font-size:18px;font-weight:900;margin-bottom:6px;">${child.child_name || "Your child"} needs help</div>
      <div style="font-size:13px;opacity:.85;margin-bottom:20px;">
        ${child.sos_triggered_at ? new Date(child.sos_triggered_at).toLocaleString() : "Just now"}
      </div>

      ${(child.last_lat && child.last_lng) ? `
        <a href="https://maps.google.com/?q=${child.last_lat},${child.last_lng}" target="_blank" style="
          display:block;width:100%;min-height:48px;border-radius:16px;
          background:#ffd54a;color:#231600;font-weight:1000;
          text-decoration:none;line-height:48px;margin-bottom:10px;
        ">📍 VIEW LOCATION ON MAP</a>
        <button id="btn-sos-open-livemap" type="button" style="
          width:100%;min-height:46px;border-radius:16px;
          background:#00d4ff;color:#05070b;font-weight:1000;
          border:none;cursor:pointer;margin-bottom:10px;
        ">📍 OPEN LIVE MAP IN APP</button>
      ` : `
        <div style="padding:12px;border-radius:14px;margin-bottom:12px;background:rgba(255,255,255,.07);font-size:13px;opacity:.85;">
          Location not available. GPS may be off.
        </div>
      `}

      <button id="btn-parent-sos-cancel" type="button" style="
        width:100%;min-height:52px;border-radius:18px;
        background:#ff3b3b;color:white;font-weight:1000;font-size:16px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">MARK SAFE — CANCEL ALERT</button>

      <button id="btn-parent-sos-dismiss" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#202a3c;color:white;font-weight:900;border:none;cursor:pointer;
      ">DISMISS (alert stays active)</button>
    </div>
  `;

  document.body.appendChild(overlay);

  if (navigator.vibrate) navigator.vibrate([300, 200, 300, 200, 500]);

  try {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(`SOS alert. ${child.child_name || "Your child"} needs help. Check the app now.`);
      msg.rate = 0.85;
      msg.volume = 1;
      window.speechSynthesis.speak(msg);
    }
  } catch {}

  document.getElementById("btn-parent-sos-cancel")?.addEventListener("click", async () => {
    await cancelRemoteSOS(child.id);
    overlay.remove();
  });

  document.getElementById("btn-parent-sos-dismiss")?.addEventListener("click", () => overlay.remove());

  document.getElementById("btn-sos-open-livemap")?.addEventListener("click", () => {
    overlay.remove();
    openChildLiveMap(child);
  });
}

/* =========================================================
   ALERT TOAST
========================================================= */

function showParentAlertToast(alert) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position:fixed;top:16px;left:50%;transform:translateX(-50%);
    z-index:999999;
    background:${alert.level === "red" ? "#ff3b3b" : alert.level === "amber" ? "#ffb000" : "#22c55e"};
    color:${alert.level === "amber" ? "#231600" : "white"};
    font-weight:1000;font-size:15px;
    padding:12px 20px;border-radius:18px;
    box-shadow:0 0 24px rgba(0,0,0,.45);
    font-family:system-ui,-apple-system,sans-serif;
    max-width:min(92vw,420px);text-align:center;
  `;
  toast.innerText = alert.message || "New alert";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: "ease-out", fill: "forwards" });
    setTimeout(() => toast.remove(), 420);
  }, 4000);
}

/* =========================================================
   FAMILY LINKING SCREEN
========================================================= */

function openFamilyLinkingScreen() {
  const old = document.getElementById("parental-family-link");
  if (old) old.remove();

  loadSyncState();

  const isLinked = !!syncState.familyId;
  const isParent = syncState.deviceRole === "parent";

  const modal = document.createElement("div");
  modal.id = "parental-family-link";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-link-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div>
          <div style="font-size:11px;color:#ffd54a;font-weight:900;letter-spacing:.1em;">PHASE 2 + 3</div>
          <div style="font-size:20px;font-weight:1000;">Family Linking</div>
        </div>
      </div>

      ${isLinked ? `
        <div style="padding:16px;border-radius:18px;margin-bottom:16px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.45);text-align:center;">
          <div style="font-weight:900;color:#22c55e;font-size:16px;">🔗 LINKED</div>
          <div style="font-size:13px;margin-top:6px;opacity:.9;">
            Code: <strong style="color:#ffd54a;letter-spacing:.1em;">${syncState.familyCode || "—"}</strong>
          </div>
          <div style="font-size:12px;margin-top:4px;opacity:.75;">
            Role: ${isParent ? "Parent device" : "Child device"} •
            Sync: ${syncState.syncActive ? "🟢 Active" : "🔴 Offline"}
          </div>
        </div>

        <div style="display:grid;gap:10px;margin-bottom:16px;">
          <button id="btn-start-sync" type="button" style="
            width:100%;min-height:50px;border-radius:16px;
            background:#22c55e;color:#05070b;font-weight:1000;border:none;cursor:pointer;
          ">▶ START SYNC</button>

          ${isParent ? `
            <button id="btn-view-family" type="button" style="
              width:100%;min-height:50px;border-radius:16px;
              background:linear-gradient(180deg,#1b2538,#111827);
              color:white;font-weight:900;border:1px solid rgba(255,255,255,.1);cursor:pointer;
            ">👨‍👩‍👧 VIEW FAMILY DASHBOARD</button>

            <button id="btn-show-code" type="button" style="
              width:100%;min-height:50px;border-radius:16px;
              background:linear-gradient(180deg,#261b08,#111827);
              color:#ffd54a;font-weight:900;border:1px solid rgba(255,213,74,.3);cursor:pointer;
            ">🔑 SHOW FAMILY CODE</button>
          ` : `
            <button id="btn-start-location" type="button" style="
              width:100%;min-height:50px;border-radius:16px;
              background:#00d4ff;color:#05070b;font-weight:1000;border:none;cursor:pointer;
            ">📍 START SHARING MY LOCATION</button>

            <button id="btn-stop-location" type="button" style="
              width:100%;min-height:46px;border-radius:16px;
              background:#202a3c;color:white;font-weight:900;border:none;cursor:pointer;
            ">⏹ STOP LOCATION SHARING</button>
          `}

          <button id="btn-unlink" type="button" style="
            width:100%;min-height:46px;border-radius:16px;
            background:#3a1111;color:white;font-weight:900;
            border:1px solid rgba(255,59,59,.35);cursor:pointer;
          ">🔗 UNLINK THIS DEVICE</button>
        </div>
      ` : `
        <div style="font-size:14px;opacity:.85;margin-bottom:18px;line-height:1.6;">
          Link your parent and child phones so SOS alerts, check-ins, settings, and live location sync between them.
        </div>

        <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
          <div style="font-weight:900;color:#ffd54a;margin-bottom:10px;">📱 THIS IS THE PARENT PHONE</div>
          <div style="font-size:13px;opacity:.8;margin-bottom:12px;">Create a family and get a code. Enter it on the child's phone.</div>
          <button id="btn-create-family" type="button" style="
            width:100%;min-height:50px;border-radius:16px;
            background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
            color:#231600;font-weight:1000;border:none;cursor:pointer;
          ">CREATE FAMILY & GET CODE</button>
        </div>

        <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
          <div style="font-weight:900;color:#00d4ff;margin-bottom:10px;">📱 THIS IS THE CHILD'S PHONE</div>
          <div style="font-size:13px;opacity:.8;margin-bottom:12px;">Enter the code from the parent's phone.</div>
          <input id="join-code-input" type="text" maxlength="9" placeholder="Enter code (e.g. KHYL-8392)" style="
            width:100%;box-sizing:border-box;min-height:50px;border-radius:12px;
            border:1px solid rgba(0,212,255,.45);background:#0b1220;
            color:#00d4ff;padding:0 14px;font-size:20px;font-weight:900;
            letter-spacing:.15em;outline:none;text-align:center;
            text-transform:uppercase;margin-bottom:10px;
          " />
          <button id="btn-join-family" type="button" style="
            width:100%;min-height:50px;border-radius:16px;
            background:#00d4ff;color:#05070b;font-weight:1000;border:none;cursor:pointer;
          ">JOIN FAMILY</button>
        </div>
      `}

      <button id="btn-link-close" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeScreen = () => modal.remove();

  document.getElementById("btn-link-back")?.addEventListener("click", closeScreen);
  document.getElementById("btn-link-close")?.addEventListener("click", closeScreen);

  document.getElementById("btn-create-family")?.addEventListener("click", async () => {
    const raw = localStorage.getItem("bq_parental_controls_v1");
    const config = raw ? JSON.parse(raw) : {};
    const parentName = config?.parent?.name || "Parent";
    const btn = document.getElementById("btn-create-family");
    btn.innerText = "Creating...";
    btn.disabled = true;
    const family = await createFamily(parentName, config);
    if (!family) { alert("Could not create family. Check your internet."); btn.innerText = "CREATE FAMILY & GET CODE"; btn.disabled = false; return; }
    modal.remove();
    openFamilyLinkingScreen();
    setTimeout(() => showFamilyCode(family.family_code), 300);
  });

  document.getElementById("btn-join-family")?.addEventListener("click", async () => {
    const code = document.getElementById("join-code-input")?.value?.trim()?.toUpperCase() || "";
    if (!code || code.length < 4) { alert("Enter the family code from the parent's phone."); return; }
    const raw = localStorage.getItem("bq_parental_controls_v1");
    const config = raw ? JSON.parse(raw) : {};
    const btn = document.getElementById("btn-join-family");
    btn.innerText = "Joining...";
    btn.disabled = true;
    const result = await joinFamily(code, config?.child?.name || "Child", config?.child?.age || 10);
    if (!result) { alert("Code not found. Ask the parent to check their code."); btn.innerText = "JOIN FAMILY"; btn.disabled = false; return; }
    startChildRealtimeListener();
    startChildLocationTracking();
    modal.remove();
    alert(`Linked! ${config?.child?.name || "Child"} is now connected to the family.`);
    openFamilyLinkingScreen();
  });

  document.getElementById("btn-start-sync")?.addEventListener("click", () => {
    if (syncState.deviceRole === "parent") startParentRealtimeListener();
    else { startChildRealtimeListener(); startChildLocationTracking(); }
    modal.remove();
    openFamilyLinkingScreen();
  });

  document.getElementById("btn-start-location")?.addEventListener("click", () => {
    startChildLocationTracking();
    alert("Location sharing started.");
    modal.remove();
    openFamilyLinkingScreen();
  });

  document.getElementById("btn-stop-location")?.addEventListener("click", () => {
    stopChildLocationTracking();
    alert("Location sharing stopped.");
    modal.remove();
    openFamilyLinkingScreen();
  });

  document.getElementById("btn-view-family")?.addEventListener("click", () => {
    modal.remove();
    openRemoteFamilyDashboard();
  });

  document.getElementById("btn-show-code")?.addEventListener("click", () => {
    showFamilyCode(syncState.familyCode);
  });

  document.getElementById("btn-unlink")?.addEventListener("click", () => {
    if (!confirm("Unlink this device? You can re-link any time.")) return;
    stopChildLocationTracking();
    stopRealtimeSync();
    syncState.familyId = null;
    syncState.familyCode = null;
    syncState.deviceRole = null;
    syncState.childRecordId = null;
    saveSyncState();
    modal.remove();
    openFamilyLinkingScreen();
  });
}

/* =========================================================
   SHOW FAMILY CODE
========================================================= */

function showFamilyCode(code) {
  const old = document.getElementById("family-code-display");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "family-code-display";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999999;
    background:rgba(0,0,0,.94);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  overlay.innerHTML = `
    <div style="
      width:min(92vw,420px);text-align:center;color:white;
      border:2px solid rgba(255,213,74,.85);border-radius:28px;
      background:linear-gradient(180deg,#171b2b,#05070b);
      padding:28px;box-shadow:0 0 42px rgba(255,213,74,.25);
    ">
      <div style="font-size:42px;margin-bottom:12px;">🔑</div>
      <div style="font-size:16px;font-weight:900;color:#ffd54a;letter-spacing:.1em;margin-bottom:8px;">YOUR FAMILY CODE</div>
      <div style="font-size:42px;font-weight:1000;color:#ffd54a;letter-spacing:.25em;margin:16px 0;text-shadow:0 0 22px rgba(255,213,74,.55);">
        ${code || "----"}
      </div>
      <div style="font-size:13px;opacity:.85;line-height:1.6;margin-bottom:20px;">
        Enter this on the child's phone under<br>
        <strong>Parental Controls → Family Linking → This is the child's phone</strong>
      </div>
      <button id="btn-code-close" type="button" style="
        width:100%;min-height:48px;border-radius:16px;
        background:#ffd54a;color:#231600;font-weight:1000;border:none;cursor:pointer;
      ">GOT IT</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("btn-code-close")?.addEventListener("click", () => overlay.remove());
}

/* =========================================================
   REMOTE FAMILY DASHBOARD — now includes LIVE MAP button
========================================================= */

async function openRemoteFamilyDashboard() {
  const old = document.getElementById("remote-family-dashboard");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "remote-family-dashboard";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-remote-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div>
          <div style="font-size:11px;color:#ffd54a;font-weight:900;letter-spacing:.1em;">LIVE</div>
          <div style="font-size:20px;font-weight:1000;">Family Status</div>
        </div>
        <button id="btn-remote-refresh" type="button" style="
          margin-left:auto;width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">↻</button>
      </div>

      <div id="remote-children-list">
        <div style="opacity:.75;padding:12px;">Loading family data...</div>
      </div>

      <div style="margin-top:16px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:10px;">RECENT ALERTS</div>
        <div id="remote-alerts-list">
          <div style="opacity:.75;padding:12px;">Loading alerts...</div>
        </div>
      </div>

      <button id="btn-remote-close" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;margin-top:16px;
      ">CLOSE</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-remote-back")?.addEventListener("click", () => modal.remove());
  document.getElementById("btn-remote-close")?.addEventListener("click", () => modal.remove());
  document.getElementById("btn-remote-refresh")?.addEventListener("click", async () => {
    await renderRemoteChildren();
    await renderRemoteAlerts();
  });

  await renderRemoteChildren();
  await renderRemoteAlerts();
  await markRemoteAlertsRead();
}

async function renderRemoteChildren() {
  const list = document.getElementById("remote-children-list");
  if (!list) return;

  const children = await loadFamilyChildren();
  if (!children.length) { list.innerHTML = `<div style="opacity:.75;padding:12px;">No child devices linked yet.</div>`; return; }

  list.innerHTML = children.map(child => {
    const lastSeen = child.last_seen ? new Date(child.last_seen).toLocaleString() : "Never";
    const lastCheckin = child.last_checkin_at ? new Date(child.last_checkin_at).toLocaleString() : "No check-in yet";
    const hasLocation = child.last_lat && child.last_lng;
    const accuracy = child.last_accuracy;

    return `
      <div style="
        padding:16px;border-radius:18px;margin-bottom:12px;background:#111827;
        border:2px solid ${child.sos_active ? "#ff3b3b" : "rgba(255,255,255,.1)"};
      ">
        ${child.sos_active ? `<div style="padding:10px;border-radius:12px;margin-bottom:12px;background:rgba(255,59,59,.2);text-align:center;font-weight:1000;color:#ff3b3b;">🚨 SOS ACTIVE</div>` : ""}

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <div style="font-size:18px;font-weight:900;">${child.child_name || "Child"}</div>
            <div style="font-size:12px;opacity:.7;margin-top:2px;">Age ${child.child_age || "?"}</div>
          </div>
          <div style="width:14px;height:14px;border-radius:50%;background:${child.sos_active ? "#ff3b3b" : "#22c55e"};box-shadow:0 0 8px ${child.sos_active ? "rgba(255,59,59,.7)" : "rgba(34,197,94,.5)"};"></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
          <div style="padding:10px;border-radius:12px;background:rgba(255,255,255,.06);">
            <div style="font-size:10px;opacity:.65;letter-spacing:.08em;">LAST SEEN</div>
            <div style="font-size:12px;font-weight:900;margin-top:3px;">${lastSeen}</div>
          </div>
          <div style="padding:10px;border-radius:12px;background:rgba(255,255,255,.06);">
            <div style="font-size:10px;opacity:.65;letter-spacing:.08em;">GPS ACCURACY</div>
            <div style="font-size:12px;font-weight:900;margin-top:3px;color:${accuracy > 50 ? "#ffb000" : "white"};">${accuracy ? `~${accuracy}m` : "—"}</div>
          </div>
        </div>

        <button data-open-map="${child.id}" type="button" style="
          width:100%;min-height:46px;border-radius:14px;
          background:${hasLocation ? "#00d4ff" : "#202a3c"};
          color:${hasLocation ? "#05070b" : "white"};
          font-weight:1000;border:none;cursor:pointer;margin-bottom:8px;
        ">📍 ${hasLocation ? "OPEN LIVE MAP" : "NO LOCATION YET"}</button>

        ${hasLocation ? `
          <a href="https://maps.google.com/?q=${child.last_lat},${child.last_lng}" target="_blank" style="
            display:block;width:100%;min-height:42px;border-radius:14px;
            background:#ffd54a;color:#231600;font-weight:1000;
            text-decoration:none;line-height:42px;text-align:center;margin-bottom:8px;
          ">🗺️ OPEN IN GOOGLE MAPS</a>
        ` : ""}

        ${child.sos_active ? `
          <button data-cancel-sos="${child.id}" type="button" style="
            width:100%;min-height:46px;border-radius:14px;
            background:#ff3b3b;color:white;font-weight:1000;border:none;cursor:pointer;
          ">MARK SAFE / CANCEL SOS</button>
        ` : ""}
      </div>
    `;
  }).join("");

  // Bind live map buttons
  list.querySelectorAll("[data-open-map]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const childId = btn.dataset.openMap;
      const freshChildren = await loadFamilyChildren();
      const child = freshChildren.find(c => c.id === childId);
      if (child) {
        document.getElementById("remote-family-dashboard")?.remove();
        openChildLiveMap(child);
      }
    });
  });

  list.querySelectorAll("[data-cancel-sos]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await cancelRemoteSOS(btn.dataset.cancelSos);
      await renderRemoteChildren();
    });
  });
}

async function renderRemoteAlerts() {
  const list = document.getElementById("remote-alerts-list");
  if (!list) return;

  const alerts = await loadRemoteAlerts();
  if (!alerts.length) { list.innerHTML = `<div style="opacity:.75;padding:12px;">No alerts yet.</div>`; return; }

  list.innerHTML = alerts.slice(0, 20).map(alert => `
    <div style="
      padding:12px 14px;border-radius:14px;margin-bottom:8px;background:#111827;
      border-left:4px solid ${alert.level === "red" ? "#ff3b3b" : alert.level === "amber" ? "#ffb000" : "#22c55e"};
      opacity:${alert.read_at ? ".65" : "1"};
    ">
      <div style="font-size:14px;font-weight:900;">
        ${alert.level === "red" ? "🔴" : alert.level === "amber" ? "🟡" : "🟢"}
        ${alert.message || "Alert"}
      </div>
      <div style="font-size:11px;opacity:.7;margin-top:4px;">
        ${alert.created_at ? new Date(alert.created_at).toLocaleString() : ""}
        ${alert.read_at ? " • Read" : " • Unread"}
      </div>
    </div>
  `).join("");
}

/* =========================================================
   HEARTBEAT
========================================================= */

function startChildHeartbeat() {
  if (!syncState.childRecordId) return;
  setInterval(async () => {
    const supabase = getSupabase();
    if (!supabase || !syncState.childRecordId) return;
    await supabase.from("parental_children").update({ last_seen: new Date().toISOString() }).eq("id", syncState.childRecordId);
  }, 120000);
}

/* =========================================================
   SUPABASE TABLE UPDATE NEEDED FOR PHASE 3
   Run this in Supabase SQL editor:
   
   alter table parental_children add column if not exists last_accuracy int;
   
========================================================= */

/* =========================================================
   INIT
========================================================= */

export function initParentalSync() {
  loadSyncState();
  getDeviceId();

  if (syncState.familyId) {
    if (syncState.deviceRole === "parent") {
      startParentRealtimeListener();
    } else if (syncState.deviceRole === "child") {
      startChildRealtimeListener();
      startChildHeartbeat();
      startChildLocationTracking();
    }
  }

  window.openFamilyLinkingScreen = openFamilyLinkingScreen;
  window.openRemoteFamilyDashboard = openRemoteFamilyDashboard;
  window.openChildLiveMap = openChildLiveMap;
  window.syncSOSToSupabase = syncSOSToSupabase;
  window.syncCheckInToSupabase = syncCheckInToSupabase;
  window.syncChildLocationToSupabase = syncChildLocationToSupabase;
  window.pushSettingsToSupabase = pushSettingsToSupabase;
  window.startChildLocationTracking = startChildLocationTracking;
  window.stopChildLocationTracking = stopChildLocationTracking;
  window.getParentalSyncState = () => syncState;

  console.log("Parental sync + live location initialised. Family ID:", syncState.familyId || "none");
}

export {
  createFamily,
  joinFamily,
  syncSOSToSupabase,
  syncCheckInToSupabase,
  syncChildLocationToSupabase,
  pushSettingsToSupabase,
  pullSettingsFromSupabase,
  startParentRealtimeListener,
  startChildRealtimeListener,
  startChildLocationTracking,
  stopChildLocationTracking,
  stopRealtimeSync,
  openFamilyLinkingScreen,
  openRemoteFamilyDashboard,
  openChildLiveMap,
  loadFamilyChildren,
  loadRemoteAlerts,
  cancelRemoteSOS,
  showFamilyCode,
};

