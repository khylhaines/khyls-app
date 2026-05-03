// leoids_supabase.js
// Barrow Quest - LEOIDS Supabase Multiplayer Layer

const LEOIDS_SUPABASE_CONFIG = {
  url: "https://tdrcnvtnqedzommfffmq.supabase.co",
  key: "sb_publishable_YPSe_GdMCdfteff1-A-G4g_Y7cvA5Eb"
};

const LEOIDSSupabase = {
  client: null,
  sessionId: null,
  playerId: null,
  playerName: null,
  playerRole: "runner",
  playersChannel: null,
  remotePlayers: {},

  init() {
    if (!window.supabase || !window.supabase.createClient) {
      console.error("Supabase library not loaded.");
      return false;
    }

    this.client = window.supabase.createClient(
      LEOIDS_SUPABASE_CONFIG.url,
      LEOIDS_SUPABASE_CONFIG.key
    );

    console.log("LEOIDS Supabase connected.");
    return true;
  },

  async createSession(name = "Barrow LEOIDS Session", options = {}) {
    if (!this.client) {
      console.warn("Supabase not initialised. Run LEOIDSSupabase.init() first.");
      return null;
    }

    const { data, error } = await this.client
      .from("leoids_sessions")
      .insert({
        name,
        status: options.status || "lobby",
        host_name: options.hostName || options.host_name || "Host",
        max_players: Number(options.maxPlayers || options.max_players || 12),
        is_public: options.isPublic ?? options.is_public ?? true,
        last_seen: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create LEOIDS session:", error);
      return null;
    }

    this.sessionId = data.id;
    console.log("LEOIDS session created:", data);
    return data;
  },

  async listPublicSessions() {
    if (!this.client) {
      console.warn("Supabase not initialised. Run LEOIDSSupabase.init() first.");
      return [];
    }

    const { data: sessions, error: sessionError } = await this.client
      .from("leoids_sessions")
      .select("*")
      .eq("is_public", true)
      .in("status", ["lobby", "active"])
      .order("last_seen", { ascending: false })
      .limit(20);

    if (sessionError) {
      console.error("Failed to list public LEOIDS sessions:", sessionError);
      return [];
    }

    const sessionIds = (sessions || []).map((session) => session.id);

    if (!sessionIds.length) {
      return [];
    }

    const { data: players, error: playerError } = await this.client
      .from("leoids_players")
      .select("id, session_id")
      .in("session_id", sessionIds);

    if (playerError) {
      console.error("Failed to fetch LEOIDS session player counts:", playerError);

      return sessions.map((session) => ({
        ...session,
        player_count: 0
      }));
    }

    const counts = {};

    (players || []).forEach((player) => {
      counts[player.session_id] = (counts[player.session_id] || 0) + 1;
    });

    return sessions.map((session) => ({
      ...session,
      player_count: counts[session.id] || 0
    }));
  },

  async updateSessionHeartbeat(sessionId = this.sessionId) {
    if (!this.client || !sessionId) return false;

    const { error } = await this.client
      .from("leoids_sessions")
      .update({
        last_seen: new Date().toISOString()
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Failed to update LEOIDS session heartbeat:", error);
      return false;
    }

    return true;
  },

  async updateSessionStatus(status = "lobby", sessionId = this.sessionId) {
    if (!this.client || !sessionId) return false;

    const { error } = await this.client
      .from("leoids_sessions")
      .update({
        status,
        last_seen: new Date().toISOString()
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Failed to update LEOIDS session status:", error);
      return false;
    }

    return true;
  },

  async joinSession({ sessionId, displayName = "Player", role = "runner" }) {
    if (!this.client) {
      console.warn("Supabase not initialised. Run LEOIDSSupabase.init() first.");
      return null;
    }

    this.sessionId = sessionId;
    this.playerName = displayName;
    this.playerRole = role;

    const { data, error } = await this.client
      .from("leoids_players")
      .insert({
        session_id: sessionId,
        display_name: displayName,
        role,
        status: "free",
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to join LEOIDS session:", error);
      return null;
    }

    this.playerId = data.id;

    await this.updateSessionHeartbeat(sessionId);

    console.log("Joined LEOIDS session as player:", data);
    return data;
  },

  async updatePosition(lat, lng, accuracy = null, heading = null) {
    if (!this.client || !this.playerId) {
      console.warn("Supabase not ready or player not joined.");
      return null;
    }

    const { data, error } = await this.client
      .from("leoids_players")
      .update({
        lat,
        lng,
        accuracy,
        heading,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", this.playerId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update position:", error);
      return null;
    }

    await this.updateSessionHeartbeat(this.sessionId);

    console.log("LEOIDS position updated:", data);
    return data;
  },

  async syncMyPosition(lat, lng, accuracy = null, heading = null) {
    return this.updatePosition(lat, lng, accuracy, heading);
  },

  subscribeToPlayers(onChange) {
    if (!this.client || !this.sessionId) {
      console.warn("Supabase not ready or no session joined.");
      return null;
    }

    if (this.playersChannel) {
      this.client.removeChannel(this.playersChannel);
      this.playersChannel = null;
    }

    this.playersChannel = this.client
      .channel(`leoids_players_${this.sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leoids_players",
          filter: `session_id=eq.${this.sessionId}`
        },
        (payload) => {
          console.log("Realtime player update:", payload);

          if (typeof onChange === "function") {
            onChange(payload);
          }
        }
      )
      .subscribe((status) => {
        console.log("LEOIDS players realtime status:", status);
      });

    console.log("Subscribed to player updates.");
    return this.playersChannel;
  },

  async loadPlayers() {
    if (!this.client || !this.sessionId) {
      console.warn("Supabase not ready or no session joined.");
      return [];
    }

    const { data, error } = await this.client
      .from("leoids_players")
      .select("*")
      .eq("session_id", this.sessionId);

    if (error) {
      console.error("Failed to load LEOIDS players:", error);
      return [];
    }

    return data || [];
  },

  async leaveSession() {
    if (!this.client) return;

    if (this.playersChannel) {
      await this.client.removeChannel(this.playersChannel);
      this.playersChannel = null;
    }

    if (this.playerId) {
      await this.client
        .from("leoids_players")
        .delete()
        .eq("id", this.playerId);
    }

    await this.updateSessionHeartbeat(this.sessionId);

    this.sessionId = null;
    this.playerId = null;
    this.playerName = null;
    this.playerRole = "runner";
    this.remotePlayers = {};

    console.log("Left LEOIDS Supabase session.");
  }
};

window.LEOIDSSupabase = LEOIDSSupabase;
