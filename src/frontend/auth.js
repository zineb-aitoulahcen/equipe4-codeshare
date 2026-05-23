// ============================================
// GESTION DU TOKEN JWT CÔTÉ CLIENT
// US-02 : Gestion session utilisateur
// ============================================

const AUTH_TOKEN_KEY = 'codeshare_token';
const AUTH_USER_KEY = 'codeshare_user';

// Sauvegarder le token après connexion
function saveToken(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Récupérer le token
function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Récupérer l'utilisateur connecté
function getUser() {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return getToken() !== null;
}

// Déconnexion
function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'login.html';
}

// Rediriger si non connecté
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Rediriger si déjà connecté
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

// Récupérer le token après callback GitHub
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
    localStorage.setItem('token', token);
    window.location.href = '/index.html';
}