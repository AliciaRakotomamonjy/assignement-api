# Contributions au Projet Assignment

## Rakotomamonjy Alicia

- **Mise en place de l'environnement de développement :**
  - Configuration de Git, Angular, MongoDB, Express, etc.
- **Template avec menu :**
  - Création d'un modèle de page avec un menu comprenant toolbar et sidebar.
- **Fiche de devoir & liste des devoirs des élèves avec widgets tables :**
  - Mise en place de la vue des devoirs et des listes de devoirs des élèves avec des widgets tables.
- **Affichage de devoirs rendus et non rendus avec drag and drop :**
  - Implémentation de la fonctionnalité permettant d'afficher les devoirs rendus et non rendus avec la possibilité de les trier par glisser-déposer.
- **Attribution de notes aux devoirs :**
  - Développement de la fonctionnalité permettant aux enseignants d'attribuer des notes aux devoirs avec notifications snack-bar.
- **Profil professeur avec édition de profil et import de photo de profil :**
  - Création de la page de profil du professeur avec possibilité d'édition de profil et d'import de photo de profil.
- **Déploiement :**
  - Déploiement du backend sur [https://mbds-assignement-api.onrender.com](https://mbds-assignement-api.onrender.com).
  - Déploiement du frontend : https://mbds-assignement-app.onrender.com/login?fbclid=IwZXh0bgNhZW0CMTAAAR2WNDsA6hUyHr4degDwzfnmdKVGifn_qyo5_RRpMjNYx2QCji83IA6zoDQ_aem_ATzhgpmRrOsEpFYxmn5HOHYsvnWovQw63DyftSVShOu2fYfxy2OlGRy_M96jt9S7_dprJbPsb5TAVXd0rNHCH84O

## Ratsimbazafy Henintsoa Elysée

- **Login avec Token :**
  - Implémentation de la fonctionnalité de connexion à l'application.
  - Utilisation de snack-bar et `<mat-progress-spinner>` pour les notifications et les indicateurs de chargement.
  - Configuration et intégration de l'envoi de courriels aux utilisateurs après leur conneexion.
- **Inscription :**
  - Mise en place de la fonctionnalité d'inscription avec snack-bar et `<mat-progress-spinner>`.
  - Configuration et intégration de l'envoi de courriels aux utilisateurs après leur inscription.
- **Pagination, Filtrage et Affichage de la liste des Assignments avec `<mat-paginator>` pour les professeurs:**
  - Développement de la fonctionnalité pour afficher les devoirs avec pagination.
  - Filtrage : Permet aux utilisateurs de filtrer les assignments de manière efficace selon des critères spécifiques :
      - **Par Matière :** Aide à trouver rapidement les assignments d'une matière donnée.
      - **Par Date Limite :** Offre la possibilité de filtrer les assignments en fonction de leur date limite, avec des conditions flexibles :
        - Si **une date** est spécifiée, les assignments affichés auront une date limite **supérieure** à cette date.
        - Si **deux dates** sont données, seuls les assignments situés **entre** ces dates seront présentés.
        - Si **seulement la deuxième date** est spécifiée, les assignments montrés auront une date limite **strictement inférieure** à cette date.
- **Ajout de devoir en utilisant stepper :**
  - Implémentation de l'ajout de devoirs via un processus de type stepper.
  - Intégration de la fonctionnalité d'envoi de notifications par courriel aux étudiants.
- **Édition et suppression de devoir :**
  - Ajout des fonctionnalités d'édition et de suppression de devoirs avec notifications snack-bar et `<mat-progress-spinner>`.
- **Liste des Assignments pour les Élèves :**
  - Création d'une fonctionnalité offrant aux élèves la possibilité de consulter la liste des devoirs de manière intuitive, en utilisant des tables pour l'affichage et `<mat-progress-spinner>` pour les indicateurs de chargement. Cette fonctionnalité est enrichie par la pagination et des options de filtrage avancées, améliorant l'expérience utilisateur par une navigation et une recherche optimisées. Les aspects clés comprennent :
    - **Widgets Tables :** Utilisés pour présenter les devoirs de manière organisée, permettant aux élèves de parcourir facilement les informations pertinentes.
    - **Indicateurs de Chargement :** `<mat-progress-spinner>` indique visuellement l'état de chargement des devoirs, fournissant un feedback instantané et améliorant la réactivité de l'interface.
    - **Pagination :** Permet de naviguer entre les pages de devoirs, évitant ainsi la surcharge visuelle et facilitant l'accès aux différentes sections de la liste.
    - **Filtrage :** Comme pour l'affichage des assignments, les élèves peuvent filtrer les devoirs selon des critères détaillés pour affiner leur recherche :
      - **Par Matière :** Aide les élèves à trouver les devoirs relatifs à une matière spécifique de façon rapide et efficace.
      - **Par Date Limite :** Les options de filtrage par date limite sont identiques à celles mentionnées précédemment, offrant la flexibilité nécessaire pour afficher les devoirs selon :
        - **Une date spécifiée**, montrant les devoirs avec une date limite postérieure.
        - **Deux dates spécifiées**, restreignant l'affichage aux devoirs dont la date limite se situe entre ces deux points.
        - **Une deuxième date spécifiée seule**, affichant uniquement les devoirs dont la date limite est strictement antérieure à cette date.
- **Faire les devoirs avec import de fichier :**
  - Mise en œuvre de la fonctionnalité permettant aux élèves de soumettre leurs devoirs en important des fichiers.
- **Profil élève avec édition de profil et import de photo de profil :**
  - Implémentation de la page de profil élève avec possibilité d'édition de profil et d'import de photo de profil.
- **Déploiement du Front-end Angular :**
  - Création d'un serveur Node.js pour héberger le build du projet Angular. Le build a été généré avec la commande `ng build`, et un serveur Node  `app.js` a été configuré pour servir les fichiers statiques générés lors de la construction de l'application Angular.
- **Création des fonctions Node.js pour générer des données simulées dans la base de données.**
## Contribution commune
- **Conception et création des modèles sur Angular et Express :**
  - Définition des modèles nécessaires à l'application sur les frameworks Angular et Express.
- **Vidéo**

# Instructions pour exécuter le projet Assignment
1. **API Backend :**
- Accédez au dossier `assignment-api`.
- Installez les dépendances en exécutant la commande suivante :
  ```
  npm install
  ```
- Démarrez l'API localement en exécutant la commande :
  ```
  npm start
  ```
L'API sera disponible à l'adresse http://localhost:3001.

3. **Application Frontend Angular :**
- Accédez au dossier `assignment-app`.
- Si vous souhaitez utiliser l'API localement, ouvrez le fichier `src/environments/environment.ts` et modifiez la valeur de `API_URL` pour `http://localhost:3001`.
- Installez les dépendances en exécutant la commande suivante :
  ```
  npm install
  ```
- Lancez l'application en exécutant la commande :
  ```
  ng serve 
  ```

## Comptes de Test

### Professeur
- **Adresse-Email** : melanie.leroy@gmail.com
- **Mot de passe** : ABC123abc.

### Élève
- **Adresse-Email** : henintsoa.corban@gmail.com
- **Mot de passe** : ABC123abc.

