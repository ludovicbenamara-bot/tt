# tt — TizenTube avec mode « Audio seulement »

Version modifiée du script de [TizenTube](https://github.com/reisxd/TizenTube) (client YouTube TV pour Android TV / Tizen) qui ajoute un mode **écoute sans vidéo** avec une interface inspirée d'Apple Music.

## Fonctionnalités ajoutées

- **Bouton « Audio seulement »** dans la barre du lecteur et dans le menu ⚙ des paramètres de lecture.
- **Écran « À l'écoute »** : grande pochette, fond flou animé aux couleurs de la pochette, titre / artiste, progression avec temps restant.
- **Spectre LED façon Winamp** qui suit **la vraie musique** (capture Android, voir plus bas) et prend la couleur de la pochette.
- **Horloge widget** (cadran + chiffres, date, météo du jour) translucide.
- **Carte météo de la Suisse** (données MétéoSuisse, contour et lacs swisstopo) avec 16 villes ; la pochette, réduite, est à côté du titre.
- **Météo sur 5 jours** (MétéoSuisse pour la localité la plus proche ; icônes en couleur, températures max / min).
- **Télécommande** : OK = lecture / pause, ◀ ▶ = ±10 s, CH+ / CH− = morceau suivant / précédent, Retour = revenir à la vidéo.
- **Protection anti-marquage** de l'écran :
  1. décalage imperceptible de l'affichage toutes les 60 s ;
  2. atténuation des éléments fixes après 3 min sans toucher la télécommande ;
  3. mode ambiance (fond noir, petit bloc qui se déplace) après 10 min.
  La première touche ne fait que réveiller l'écran.
- Traductions française et anglaise.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `u.js` | Script compilé chargé par l'application (via jsDelivr). |
| `audio-only.patch` | Code source des modifications du script, à appliquer sur TizenTube. |
| `native-src.zip` | Code source Java ajouté à l'APK (capture du son réel, météo MétéoSuisse), avec `BUILD.md`. |
| `LICENSE` | Licence GPL-3.0 (identique au projet d'origine). |

## Reconstruire depuis les sources

Le patch s'applique sur TizenTube, commit `f99945a84ff767bf14ad8c1146e8e3fd49a3d628` :

```bash
git clone https://github.com/reisxd/TizenTube
cd TizenTube
git checkout f99945a84ff767bf14ad8c1146e8e3fd49a3d628
git apply ../audio-only.patch
cd mods
npm ci
npm run build   # produit ../dist/userScript.js
```

## Notes techniques

- YouTube TV n'autorise les connexions réseau qu'à une liste de sites Google / YouTube. La météo est donc récupérée par le module Java (MétéoSuisse, sinon [Open-Meteo](https://open-meteo.com/)) et servie au script sur `127.0.0.1` ; avec l'APK d'origine, une feuille Google Sheets publique sert de secours. Données météo : © MétéoSuisse ; fond de carte : © swisstopo.
- L'application pointe vers une version figée de `u.js` (`cdn.jsdelivr.net/gh/ludovicbenamara-bot/tt@<commit>/u.js`) : le cache de jsDelivr sur une branche peut durer plusieurs heures.

## Spectre audio réel

Cobalt joue le son via le lecteur natif de la TV, donc la page ne peut pas l'analyser.
L'APK modifié contient un petit module Java (`native-src.zip`) qui capte la sortie audio
avec `android.media.audiofx.Visualizer` et la sert au script sur `http://127.0.0.1:47913`
(accessible uniquement depuis la TV ; la politique de sécurité de YouTube autorise `127.0.0.1`).
Sans ce module (APK d'origine), le spectre reste animé en mode simulé.
Il faut accorder l'autorisation audio une fois :
`adb shell pm grant io.gh.reisxd.tizentube.cobalt android.permission.RECORD_AUDIO`.

## Licence

TizenTube est distribué sous licence **GNU GPL v3.0** ; ces modifications le sont aussi. Voir `LICENSE`.
Projet d'origine : <https://github.com/reisxd/TizenTube> — merci à son auteur et à ses contributeurs.
