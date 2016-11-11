# Plugin Chrome Voxity click2call

Le plugin click2call Voxity vous permet de

**Générer des appels** 

1. Surlignez le numéro dans le navigateur.
2. Effectuez un clique droit sur le numéro surligné.
3. Dans le menu contextuel cliquez sur **appeler le numéro**
4. Votre poste va sonner, décrochez l'appel débutera seulement si vous décrochez.

**Gérez vos contacts**

1. Cliquez sur l'icône avec le logo Voxity
2. Dans le popup, qui s'affiche allez dans la section contacts
3. Recherchez vos contacts.

*Si Vous etes administrateur, vous pourrez creer/éditer/supprimer des contacts.*


# installation <small>(utilisateur)</small>
Version non-disponible dans le chrome web store.

<!-- 1. Aller dans le [Chrome Web Store](https://chrome.google.com/webstore/detail/voxity-click-to-call/dclmglagehopkegbnobbpkdcbdoiijcg)
2. *(si le plugin ne s'affiche pas)* rechercher **Voxity Click-to-call**
3. Cliquer sur **Ajouter à Chrome** -->

# installation <small>(développement)</small>

## Dépendance 
* Google Chrome
* bower 
* être Utilisateur de la solution Voxity

1. Clonner le projet 
2. Aller à la racine du projet
3. ```bower install```
4. Aller dans la gestion de vos extensions [chrome://extensions/]
5. Activer le *Mode Développeur*
6. Cliquer sur *Charger l'extension non empaquetée...*
7. Ajouter le dossier du projet *(/voxity-chrome-extension/)*
8. Modifier le fichier ``index.js``:83, la variable ```clientID```

# Install <small>(test build)</small>
## Dépendance 

* Google Chrome
* bower 
* être Utilisateur de la solution Voxity
* npm
* Grunt

1. Clonner le projet 
2. Se mettre à la racine du projet
3. ```
bower install
npm install
grunt
```
4. Aller dans la gestion de vos extensions [chrome://extensions/]
5. Activer le *Mode Développeur*
6. Cliquer sur *Charger l'extension non empaquetée...*
7. Ajouter le dossier du projet **(/dist/)**
8. Modifier le fichier ``index.js``:83, la variable ```clientID```
9. ```grunt``