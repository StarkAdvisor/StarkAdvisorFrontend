import React, { JSX, useEffect, useMemo, useState } from "react";

// -------------------------------
// Tipos
// -------------------------------

type RiskProfile = "Conservador" | "Moderado" | "Arriesgado";

type Avatar = "Masculino" | "Femenino" | "Desconocido";

interface User {
  id: string;
  email: string;
  username: string;
  password: string; // Nota: en producción nunca guardes contraseñas en claro
  riskProfile: RiskProfile;
  avatar: Avatar;
  prefersDark?: boolean;
}

// -------------------------------
// API Simulada (localStorage)
// -------------------------------

const API_KEY = "__UM_USERS_v1";
const SESSION_KEY = "__UM_SESSION_v1";

const fakeApi = {
  _delay<T>(value: T, ms = 300) {
    return new Promise<T>((res) => setTimeout(() => res(value), ms));
  },

  _readStore(): User[] {
    try {
      const raw = localStorage.getItem(API_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as User[];
    } catch (e) {
      console.error("UserManager: read store failed", e);
      return [];
    }
  },
  _writeStore(users: User[]) {
    localStorage.setItem(API_KEY, JSON.stringify(users));
  },

  async register(payload: Omit<User, "id">) {
    const users = fakeApi._readStore();
    if (users.find((u) => u.username === payload.username)) {
      return fakeApi._delay({ ok: false, message: "El usuario ya existe" }, 250);
    }
    if (users.find((u) => u.email === payload.email)) {
      return fakeApi._delay({ ok: false, message: "El correo ya está registrado" }, 250);
    }
    const newUser: User = { ...payload, id: Date.now().toString() };
    users.push(newUser);
    fakeApi._writeStore(users);
    return fakeApi._delay({ ok: true, user: newUser }, 400);
  },

  async login(username: string, password: string) {
    const users = fakeApi._readStore();
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) return fakeApi._delay({ ok: false, message: "Credenciales inválidas" }, 250);
    // Store session id
    localStorage.setItem(SESSION_KEY, user.id);
    return fakeApi._delay({ ok: true, user }, 300);
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
    return fakeApi._delay({ ok: true }, 200);
  },

  async currentUser(): Promise<{ ok: boolean; user?: User }>
  {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return fakeApi._delay({ ok: false }, 100);
    const users = fakeApi._readStore();
    const user = users.find((u) => u.id === id);
    if (!user) return fakeApi._delay({ ok: false }, 100);
    return fakeApi._delay({ ok: true, user }, 150);
  },

  async updateUser(id: string, patch: Partial<User>) {
    const users = fakeApi._readStore();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return fakeApi._delay({ ok: false, message: "Usuario no encontrado" }, 200);
    users[idx] = { ...users[idx], ...patch };
    fakeApi._writeStore(users);
    return fakeApi._delay({ ok: true, user: users[idx] }, 300);
  },

  async deleteUser(id: string) {
    let users = fakeApi._readStore();
    users = users.filter((u) => u.id !== id);
    fakeApi._writeStore(users);
    // if deleted user was in session, clear it
    const sid = localStorage.getItem(SESSION_KEY);
    if (sid === id) localStorage.removeItem(SESSION_KEY);
    return fakeApi._delay({ ok: true }, 200);
  },
};

// -------------------------------
// Helper hooks
// -------------------------------

function useSystemPrefersDark() {
  const [prefersDark, setPrefersDark] = useState<boolean>(() => {
    
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler));
  }, []);

  return prefersDark;
}

// -------------------------------
// Component
// -------------------------------

export default function UserManager(): JSX.Element {


  // Views: "landing" | "login" | "register" | "app" - app = user is authenticated
  const [view, setView] = useState<"landing" | "login" | "register" | "app">("landing");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Theme
  const systemPrefersDark = useSystemPrefersDark();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("__UM_theme");
    if (saved) return saved === "dark";
    return systemPrefersDark;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("__UM_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Try to load session on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fakeApi.register({
  email: registerForm.email,
  username: registerForm.username,
  password: registerForm.password,
  riskProfile: registerForm.riskProfile,
  avatar: registerForm.avatar,
});

if (!res.ok) {
  return notify((res as { message: string }).message || "Error al registrarse");
}


setCurrentUser(res.user); // ✅ Aquí ya sabemos que existe
notify("Registro exitoso. Has iniciado sesión automáticamente.");
setView("app");

    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Forms state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
const [registerForm, setRegisterForm] = useState<{
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptDisclaimer: boolean;
  riskProfile: RiskProfile;
  avatar: Avatar;
}>({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  acceptDisclaimer: false,
  riskProfile: "Moderado",
  avatar: "Desconocido",
});

  // User panel open
  const [panelOpen, setPanelOpen] = useState(false);

  // Notification helper
  function notify(text: string, ms = 2500) {
    setMessage(text);
    setTimeout(() => setMessage(null), ms);
  }

  // -------------------------------
  // Handlers: Auth
  // -------------------------------
  type RegisterForm = Omit<User, "id"> & {
  confirmPassword: string;
};


async function handleRegister(e: React.FormEvent) {
  e.preventDefault();

  if (registerForm.password !== registerForm.confirmPassword) {
    return notify("Las contraseñas no coinciden");
  }
  if (!registerForm.acceptDisclaimer) {
    return notify("Debes aceptar la cláusula de responsabilidad");
  }

  try {
    const res = await fakeApi.register({
      email: registerForm.email,
      username: registerForm.username,
      password: registerForm.password,
      riskProfile: registerForm.riskProfile,
      avatar: registerForm.avatar,
    });

    if (!res.ok) {
      return notify("message" in res ? res.message : "Error al registrarse");
    }

    setCurrentUser(res.user);
    notify("Registro exitoso. Has iniciado sesión automáticamente.");
    setView("app");
  } catch {
    notify("Error en la conexión con el servidor");
  }
}


async function handleLogin(e?: React.FormEvent) {
  if (e) e.preventDefault();
  const { username, password } = loginForm;
  if (!username || !password) return notify("Rellena usuario y contraseña");

  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json(); // 👈 parsear respuesta

    setLoading(false);

    if (!res.ok) return notify(result.message || "Error al iniciar sesión");

    setCurrentUser(result.user as User);
    notify("Bienvenido, " + result.user.username);
    setView("app");
  } catch (err) {
    setLoading(false);
    notify("Error en la conexión con el servidor");
  }
}


  // -------------------------------
  // Handlers: User management (update avatar, theme, delete account)
  // -------------------------------

async function changeAvatar(next: Avatar) {
  if (!currentUser) return;
  setLoading(true);

  try {
    const res = await fetch(`/api/users/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: next }),
    });

    const result = await res.json(); // 👈 parseamos JSON
    setLoading(false);

    if (!res.ok) {
      return notify(result.message || "Error al actualizar avatar");
    }

    setCurrentUser(result.user as User);
    notify("Avatar actualizado a: " + next);
  } catch (err) {
    setLoading(false);
    notify("Error en la conexión con el servidor");
  }
}


  async function toggleTheme(newMode?: boolean) {
    const nm = typeof newMode === "boolean" ? newMode : !darkMode;
    setDarkMode(nm);
    if (!currentUser) return;
    // Persist preference in user record
    await fakeApi.updateUser(currentUser.id, { prefersDark: nm });
    // refresh local currentUser
    const cur = await fakeApi.currentUser();
    if (cur.ok) setCurrentUser(cur.user as User);
  }

async function updateRiskProfile(risk: RiskProfile) {
  if (!currentUser) return;
  setLoading(true);

  try {
    const res = await fetch(`/api/users/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ riskProfile: risk }),
    });

    const result = await res.json(); // 👈

    setLoading(false);

    if (!res.ok) {
      return notify(result.message || "Error al actualizar perfil de riesgo");
    }

    setCurrentUser(result.user as User);
    notify("Perfil de riesgo actualizado a " + risk);
  } catch (err) {
    setLoading(false);
    notify("Error en la conexión con el servidor");
  }
}


  async function deleteAccount() {
    if (!currentUser) return;
    if (!window.confirm("¿Eliminar tu cuenta?")) return;
    setLoading(true);
    await fakeApi.deleteUser(currentUser.id);
    setLoading(false);
    setCurrentUser(null);
    setView("landing");
    notify("Cuenta eliminada. Has sido desconectado.");
  }

  // -------------------------------
  // UI pieces
  // -------------------------------

  const avatarEmoji = useMemo(() => {
    if (!currentUser) return "👤";
    switch (currentUser.avatar) {
      case "Masculino":
        return "👨";
      case "Femenino":
        return "👩";
      default:
        return "🧑";
    }
  }, [currentUser]);

  // Small responsive helper styles (kept inline to avoid depending on CSS nuevo)
  const containerStyle: React.CSSProperties = { maxWidth: 1024, margin: "1rem auto", padding: "1rem" };
  const cardStyle: React.CSSProperties = { padding: "1rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", background: darkMode ? "#111" : "#fff", color: darkMode ? "#eee" : "#111", marginBottom: "1rem" };
  const btnPrimary = "btn-primary";
  const btnSecondary = "btn-secondary";

  // -------------------------------
  // Render
  // -------------------------------
async function handleLogout(): Promise<void> {
  setLoading(true);
  await fakeApi.logout();
  setLoading(false);
  setCurrentUser(null);
  setView("landing");
  notify("Has cerrado sesión correctamente.");
}

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header className="App-header" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="logo">UM</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <strong>Gestión de Usuarios</strong>
            <small style={{ opacity: 0.85 }}>Componente único (components/UserManager.tsx)</small>
          </div>
        </div>

        <nav className="nav-links">
          {!currentUser ? (
            <>
              <button className={btnSecondary} onClick={() => setView("login")}>Iniciar sesión</button>
              <button className={btnPrimary} onClick={() => setView("register")}>Registrarse</button>
            </>
          ) : (
            <>
              <button className={btnSecondary} onClick={() => setPanelOpen((s) => !s)}>Perfil</button>
              <button className={btnPrimary} onClick={handleLogout}>Cerrar sesión</button>
            </>
          )}
        </nav>
      </header>

      {/* Notification */}
      {message && (
        <div style={{ padding: "0.6rem 1rem", borderRadius: 8, background: "#0077ff", color: "#fff", marginBottom: "1rem" }}>{message}</div>
      )}

      {/* Loading */}
      {loading && <div style={{ marginBottom: 12 }}>Cargando...</div>}

      {/* Landing */}
      {view === "landing" && (
        <main style={cardStyle}>
          <h2>Bienvenido</h2>
          <p>Usa los botones arriba para iniciar sesión o registrarte.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <button className={btnPrimary} onClick={() => setView("login")}>Iniciar Sesión</button>
            <button className={btnSecondary} onClick={() => setView("register")}>Crear Cuenta</button>
          </div>
        </main>
      )}

      {/* Login */}
      {view === "login" && (
        <section style={cardStyle}>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <label>
              Usuario
              <input value={loginForm.username} onChange={(e) => setLoginForm((s) => ({ ...s, username: e.target.value }))} />
            </label>
            <label>
              Contraseña
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))} />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className={btnPrimary}>Entrar</button>
              <button type="button" className={btnSecondary} onClick={() => setView("landing")}>Volver</button>
            </div>
          </form>
        </section>
      )}

      {/* Register */}
      {view === "register" && (
        <section style={cardStyle}>
          <h2>Registro</h2>
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <label>
              Correo
              <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm((s) => ({ ...s, email: e.target.value }))} />
            </label>
            <label>
              Usuario
              <input value={registerForm.username} onChange={(e) => setRegisterForm((s) => ({ ...s, username: e.target.value }))} />
            </label>
            <label>
              Contraseña
              <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm((s) => ({ ...s, password: e.target.value }))} />
            </label>
            <label>
              Verificar contraseña
              <input type="password" value={registerForm.password2} onChange={(e) => setRegisterForm((s) => ({ ...s, password2: e.target.value }))} />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={registerForm.acceptDisclaimer} onChange={(e) => setRegisterForm((s) => ({ ...s, acceptDisclaimer: e.target.checked }))} />
              Acepto la cláusula de exención de responsabilidad financiera
            </label>

            <label>
              Estilo de persona
              <select value={registerForm.riskProfile} onChange={(e) => setRegisterForm((s) => ({ ...s, riskProfile: e.target.value as RiskProfile }))}>
                <option>Conservador</option>
                <option>Moderado</option>
                <option>Arriesgado</option>
              </select>
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className={btnPrimary}>Registrar</button>
              <button type="button" className={btnSecondary} onClick={() => setView("landing")}>Cancelar</button>
            </div>
          </form>
        </section>
      )}

      {/* App view */}
      {view === "app" && currentUser && (
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 48 }}>{avatarEmoji}</div>
              <div>
                <h3>{currentUser.username}</h3>
                <p>{currentUser.email}</p>
                <small>Perfil: {currentUser.riskProfile}</small>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Tema
                  <button className={btnSecondary} onClick={() => toggleTheme()}>{darkMode ? "Oscuro" : "Claro"}</button>
                </label>
              </div>

              <div>
                <button className={btnPrimary} onClick={() => setPanelOpen((s) => !s)}>Abrir gestión</button>
              </div>

              <div>
                <button className={btnSecondary} onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>
          </div>

          {/* Panel: gestión cuando panelOpen true */}
          {panelOpen && (
            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: darkMode ? "#0b1620" : "#f7f7f7" }}>
                <h4>Cambiar Avatar</h4>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className={btnSecondary} onClick={() => changeAvatar("Masculino")}>Masculino 👨</button>
                  <button className={btnSecondary} onClick={() => changeAvatar("Femenino")}>Femenino 👩</button>
                  <button className={btnSecondary} onClick={() => changeAvatar("Desconocido")}>Desconocido 🧑</button>
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: darkMode ? "#0b1620" : "#f7f7f7" }}>
                <h4>Cambiar estilo visual</h4>
                <p>Estado actual: {darkMode ? "Oscuro" : "Claro"} (por defecto: preferencia de equipo)</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className={btnSecondary} onClick={() => toggleTheme(false)}>Forzar Claro</button>
                  <button className={btnSecondary} onClick={() => toggleTheme(true)}>Forzar Oscuro</button>
                  <button className={btnSecondary} onClick={() => { localStorage.removeItem("__UM_theme"); setDarkMode(systemPrefersDark); notify("Volviendo a configuración del equipo"); }}>Usar preferencia de equipo</button>
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: darkMode ? "#0b1620" : "#f7f7f7" }}>
                <h4>Cambiar Perfil de Riesgo</h4>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className={btnSecondary} onClick={() => updateRiskProfile("Conservador")}>Conservador</button>
                  <button className={btnSecondary} onClick={() => updateRiskProfile("Moderado")}>Moderado</button>
                  <button className={btnSecondary} onClick={() => updateRiskProfile("Arriesgado")}>Arriesgado</button>
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: darkMode ? "#0b1620" : "#f7f7f7" }}>
                <h4>Acciones de cuenta</h4>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className={btnSecondary} onClick={() => { navigator.clipboard?.writeText(currentUser.id); notify("ID de usuario copiado"); }}>Copiar ID</button>
                  <button className={btnSecondary} onClick={deleteAccount}>Eliminar cuenta</button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <footer style={{ textAlign: "center", marginTop: 24 }}>
        <small style={{ opacity: 0.7 }}>Componente funcional Responsive • Simulación de endpoints con localStorage</small>
      </footer>
    </div>
  );
}
