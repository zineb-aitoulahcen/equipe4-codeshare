# Presentation du projet
Nom : CodeShare
objectif : Aider les étudiants à développer leurs compétences dans le codage
public cible : étudiants,professeurs,programmeurs...
# Membre de l'equipe 
AYA : Scrum master - gestion des sprints, organisation des sérémonie
KHAOULA : Product owner - rédaction des US
ZINEB : Devloppeur - Frontend/backend
# Technologies utilisées
Frontend: HTML/CSS/JavaScript 
Backend: Node.js / Express
BD : MySQL
Authentification : JWT , OAuth GitHub
# Prérequis d'installation
- Node.js 18.x ou supérieur — https://nodejs.org
- npm 9.x ou supérieur (inclus avec Node.js)
- MySQL 8.0 — https://dev.mysql.com/downloads/
- Navigateur moderne (Chrome 110+, Firefox 110+)
- Compte GitHub (pour la connexion OAuth)
# Instructions de lancement

1. Cloner le projet
git clone https://github.com/zineb-aitoulahcen/equipe4-codeshare.git

2. Aller dans le dossier backend
cd src/backend

3. Installer les dépendances
npm install

4. Créer le fichier .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql
DB_NAME=codeshare
JWT_SECRET=codeshare_secret_key
GITHUB_CLIENT_ID=Ov23liEWazqn4t4YYLXZ
GITHUB_CLIENT_SECRET=67659e766b48d02ad814a55b77c32b94864da2af

5. Créer la base de données MySQL
mysql -u root -p < src/database/schema.sql

6. Lancer le serveur
node server.js

7. Ouvrir dans le navigateur
http://localhost:3000
# URL de déploiement
- **Frontend** : https://equipe4-codeshare.netlify.app
# Identifiants de test

- **Email** : test@codeshare.ma
- **Mot de passe** : Test1234

# Livrables antérieurs
[Livrable1](docs/Projet_PartageDeCode.pdf)
[Livrable2](docs/4_Partage%20de%20code_S2.pdf)
[Livrable3](docs/livrable3_numEquipe4.pdf)