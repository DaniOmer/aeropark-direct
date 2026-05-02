# Dashboard — Navigation jour par jour (Arrivées / Départs)

## Contexte

Le tableau de bord admin (`app/admin/page.tsx` + `app/admin/dashboard-client.tsx`) affiche
deux cartes côte à côte : "Arrivées aujourd'hui" et "Départs aujourd'hui". Les données
sont chargées côté serveur pour la date du jour uniquement.

L'admin souhaite pouvoir naviguer entre les jours (passé et futur) pour préparer
les jours à venir et consulter l'historique des jours précédents.

## Objectif

Ajouter un contrôle de navigation partagé au-dessus des deux cartes permettant de
parcourir les arrivées et départs jour par jour, sans recharger les autres parties
du tableau de bord (stats, graphique).

## Décisions

- **Contrôle partagé** : un seul bandeau de navigation au-dessus des deux cartes,
  pas de navigation indépendante par carte.
- **Sans borne** : navigation passé et futur illimitée.
- **PDF du jour affiché** : le bouton PDF exporte les données du jour
  sélectionné (titre et nom de fichier reflètent la date).
- **Server Action** plutôt que search param URL : seules les deux cartes se
  rafraîchissent ; les stats et le graphique restent figés.

## UX

Bandeau de navigation au-dessus de la grille des deux cartes :

```
[◀]   Vendredi 2 mai 2026   [▶]   [Aujourd'hui]
```

- Flèches ◀ ▶ : recule / avance d'un jour.
- Date affichée au format français long, en gras.
- Bouton "Aujourd'hui" : visible **uniquement** si la date sélectionnée n'est pas
  le jour courant ; ramène à aujourd'hui en un clic.
- Aucune limite de navigation (passé ou futur).

Adaptation des cartes :

- Les titres "Arrivées aujourd'hui" / "Départs aujourd'hui" deviennent dynamiques :
  - Jour courant : "Arrivées aujourd'hui" / "Départs aujourd'hui" (inchangé).
  - Autre jour : "Arrivées du 5 mai" / "Départs du 5 mai".
- Pendant le chargement (entre clic et réponse de l'action) : opacité réduite
  sur les listes des deux cartes pour signaler le rafraîchissement.
- Vide : message existant "Aucune arrivée prévue" / "Aucun départ prévu" est
  conservé, valable pour n'importe quel jour.

PDF :

- Titre du PDF : "Arrivées du 2 mai 2026" / "Départs du 2 mai 2026" (au lieu
  de "Arrivées du jour" / "Départs du jour").
- Nom de fichier : `arrivees-2026-05-02.pdf` (date sélectionnée, pas la date
  du jour courant).

## Architecture

### Server Action

Nouveau fichier `app/admin/actions.ts` :

```ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDayReservations(dateStr: string) {
  // dateStr au format YYYY-MM-DD
  const supabase = await createClient();

  const { data: arrivals } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("start_date", `${dateStr}T00:00:00`)
    .lt("start_date", `${dateStr}T23:59:59`)
    .in("status", ["confirmed", "pending"])
    .order("start_date", { ascending: true });

  const { data: departures } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("end_date", `${dateStr}T00:00:00`)
    .lt("end_date", `${dateStr}T23:59:59`)
    .in("status", ["confirmed", "completed"])
    .order("end_date", { ascending: true });

  return {
    arrivals: arrivals || [],
    departures: departures || [],
  };
}
```

La logique réplique exactement celle déjà présente dans `app/admin/page.tsx:27-42`.
À terme, `page.tsx` pourrait appeler cette server action pour le chargement initial,
mais ce n'est pas requis pour cette feature (risque de régression évité).

### Page serveur

`app/admin/page.tsx` reste inchangé ; il fournit `todayArrivals` et
`todayDepartures` comme état initial au client.

### Client component

`app/admin/dashboard-client.tsx` :

1. Nouveaux états :
   - `selectedDate: Date` — initialisé à aujourd'hui.
   - `arrivals: Reservation[]` — initialisé à `data.todayArrivals`.
   - `departures: Reservation[]` — initialisé à `data.todayDepartures`.
   - `isLoading: boolean`.

2. Handler `changeDay(deltaDays: number)` :
   - Calcule la nouvelle date.
   - Met à jour `selectedDate`.
   - Met `isLoading = true`, appelle `getDayReservations(newDateStr)`,
     met à jour `arrivals` / `departures`, puis `isLoading = false`.

3. Handler `goToToday()` : remet la date à aujourd'hui et déclenche le fetch
   (sauf si on y est déjà).

4. Nouveau composant local `<DayNavigator>` (dans le même fichier) :
   - Props : `date`, `onPrev`, `onNext`, `onToday`, `isToday`.
   - Affiche les flèches, la date formatée, et le bouton "Aujourd'hui"
     conditionnel.
   - Inséré au-dessus de la `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`.

5. Les cartes consomment `arrivals` / `departures` (pas `data.todayArrivals` /
   `data.todayDepartures`).

6. Helper `formatCardTitle(prefix: 'Arrivées' | 'Départs', date: Date)` qui
   produit "Arrivées aujourd'hui" si jour courant, sinon "Arrivées du 5 mai".

7. `downloadPDF` reçoit un nouveau paramètre `date: Date` :
   - Titre du PDF : `Arrivées du <date longue>` / `Départs du <date longue>`.
   - Nom du fichier : `arrivees-YYYY-MM-DD.pdf` / `departs-YYYY-MM-DD.pdf` (date
     sélectionnée, pas `new Date()`).

### Comparaison de date "aujourd'hui"

Pour déterminer si `selectedDate` correspond à aujourd'hui, comparer les chaînes
`YYYY-MM-DD` locales — pas de comparaison d'objets `Date` (sensible à l'heure).

## Hors scope

- Sélecteur de date avancé (date picker) : les flèches suffisent pour cette itération.
- Mise en cache côté client des jours déjà visités.
- Refacto de `app/admin/page.tsx` pour appeler la server action (gardé séparé).
- Modification des autres widgets du dashboard (occupation, CA, graphique).

## Tests / vérification manuelle

- Charger `/admin` : affiche aujourd'hui, bouton "Aujourd'hui" caché, comportement
  identique à avant.
- Cliquer ▶ : passe au lendemain, listes mises à jour, bouton "Aujourd'hui"
  apparaît, titres deviennent "Arrivées du …".
- Cliquer ◀ plusieurs fois : navigation arrière fonctionne, y compris bien avant
  aujourd'hui.
- Cliquer "Aujourd'hui" : revient au jour courant, bouton disparaît.
- Cliquer PDF un autre jour : le PDF contient les bonnes données et le bon titre.
- Jour sans réservation : message vide affiché correctement.
