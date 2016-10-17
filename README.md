# Plugin Chrome Voxity click2call

# install <small>(Utilisateur)</small>
Version non disponible
<!-- 1. Aller dans le [Chrome Web Store](https://chrome.google.com/webstore/detail/voxity-click-to-call/dclmglagehopkegbnobbpkdcbdoiijcg)
2. *(si le plugin ne s'affiche pas)* rechercher **Voxity Click-to-call**
3. Cliquer sur **Ajouter à Chrome** -->

# install <small>(developpement)</small>

## Dépendance 
* Google Chrome
* bower 
* être Utilisateur de la solution Voxity

1. Clonner le projet 
2. ce mettre à la racine du projet
3. ```bower install```
4. Aller dans la gestion de vos extensions [chrome://extensions/]
5. Activer le *Mode Développeur*
6. cliquer sur *Charger l'extension non empaquetée...*
7. Ajouter le dossier du projet
8. modifier le fichier ``index.js``:83, la variable ```clientID```

# Todo
 - [ ] Cache 
 - [ ] Configuration des services via des provider
 - [X] Gestion des droits admin
