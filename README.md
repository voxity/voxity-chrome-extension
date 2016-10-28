# Plugin Chrome Voxity click2call

Le plugin click2call Voxity vous permet de

**Générer des appels** 
1. Surlignez le numéro dans le naviguateur.
2. Effectuez un clique droit sur le numéro surligné.
3. Dans le menu contextuel, aller sur le menu 'Voxity click-2_call', appeler le numéro
4. Votre poste va sonner, décrocher l'appel est en cours.

**Envoyer des SMS**
1. Surlignez le numéro dans le naviguateur.
2. Effectuez un clique droit sur le numéro surligné.
3. Dans le menu contextuel, aller sur le menu 'Voxity click-2_call', Envoyer un SMS
4. Complétéz le message, et envoyer

**Gérez vos contact**
1. Cliquez sur l'icone avec le logo Voxity
2. Dans le popup, qui s'affiche aller dans la section contact
3. Rcherchez votre contact.

Si Vous etes administrateur, vous pourrez creer/éditer/supprimer des contacts.


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
7. Ajouter le dossier du projet *(/voxity-chrome-extension/)*
8. modifier le fichier ``index.js``:83, la variable ```clientID```


# Install <small>(test build)</small>
## Dépendance 

* Google Chrome
* bower 
* être Utilisateur de la solution Voxity
* npm
* Grunt

1. Clonner le projet 
2. ce mettre à la racine du projet
3. ```
bower install
npm install
grunt
```
4. Aller dans la gestion de vos extensions [chrome://extensions/]
5. Activer le *Mode Développeur*
6. cliquer sur *Charger l'extension non empaquetée...*
7. Ajouter le dossier du projet **(/dist/)**
8. modifier le fichier ``index.js``:83, la variable ```clientID```
9. ```grunt``