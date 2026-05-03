// leoids_supabase.js
// Barrow Quest - LEOIDS Supabase Multiplayer Layer
// Phase 1: connect, create/join session, sync player position, listen to players

const LEOIDS_SUPABASE_CONFIG = {
  url: "PASTE_YOUR_PROJECT_URL_HERE",
  key: "PASTE_YOUR_PUBLISHABLE_KEY_HERE"
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

    if (
      !LEOIDS_SUPABASE_CONFIG.url ||
      LEOIDS_SUPABASE_CONFIG.url.includes("PASTE_") ||
      !LEOIDS_SUPABASE_CONFIG.key ||
      LEOIDS_SUPABASE_CONFIG.key.includes("PASTE_")
    ) {
      console.error("Supabase config missing. Add your project URL and publishable key.");
      return false;
    }

    this.client = window.supabase.createClient(
      LEOIDS_SUPABASE_CONFIG.url,
      LEOIDS_SUPABASE_CONFIG.key
    );

    console.log("LEOIDS Supabase connected.");
    return true;
  },

  async createSession(name = "Barrow LEOIDS Test Session") {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from("leoids_sessions")
      .insert({
        name,
        status: "lobby"
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

  async joinSession({ sessionId, displayName = "Player", role = "runner" }) {
    if (!this.client) return null;

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
    console.log("Joined LEOIDS session as player:", data);
    return data;
  },

  async syncMyPosition(lat, lng, accuracy = null, heading = null) {
    if (!this.client || !this.playerId) return false;

    const { error } = await this.client
      .from("leoids_players")
      .update({
        lat,
        lng,
        accuracy,
        heading,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", this.playerId);

    if (error) {
      console.error("Failed to sync player position:", error);
      return false;
    }

    return true;
  },

  async loadPlayers() {
    if (!this.client || !this.sessionId) return [];

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

  subscribeToPlayers(onChange) {
    if (!this.client || !this.sessionId) return null;

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
          console.log("LEOIDS player realtime change:", payload);

          if (typeof onChange === "function") {
            onChange(payload);
          }
        }
      )
      .subscribe((status) => {
        console.log("LEOIDS players realtime status:", status);
      });

    return this.playersChannel;
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

    this.sessionId = null;
    this.playerId = null;
    this.playerName = null;
    this.playerRole = "runner";
    this.remotePlayers = {};
  }
};

window.LEOIDSSupabase = LEOIDSSupabase;
