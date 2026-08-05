# WHK-Nebenprojekt: Zensus-Auswertung & Taxonomie-Entwurf

Status: **Entwurf, nichts eingebaut.** Quellen: `whk_1880_review.yaml` (421 US-Zensus-Berufe, 17 Themengruppen) und eine Stichprobe echter Charakterbögen, abgeglichen gegen das bestehende `src/data/rules-jsonl/whk.jsonl`. Ab Runde 4 gilt: **die bisherige `whk.jsonl`-Liste ist selbst nur ein Vorschlag**, genau wie die Charakterbogen-Einträge — alles läuft in eine gemeinsame Zieltabelle (unten).

## Entscheidungsraster (bestätigt, siehe Chat)

Für jedes Berufscluster wird geprüft:

1. **Ändert sich die Technik überhaupt mit Ziel/Kontext?**
   Nein → eine Hauptfertigkeit, Spezialisierung nur wenn es innerhalb der Fertigkeit selbst echte fachliche Nuancen gibt (nicht nach Arbeitgeber/Branche — Buchhaltung ist überall gleich, aber Bilanzbuchhaltung ≠ Betriebsprüfung).
2. **Ja, generelle Kompetenz hilft trotzdem beim Sonderfall?** → Hauptfertigkeit + Spezialisierung nach der Achse, die den Unterschied wirklich trägt (Material, Zielspezies/-terrain, Warengruppe, Technik/Methode — je nachdem was bei der konkreten Fertigkeit divergiert).
3. **Kompetenz in A hilft praktisch nicht bei B?** → getrennte Hauptfertigkeiten (Test: könnte Meister A für einen Tag Bs Job übernehmen?).

Zusatzregel aus dem Zensus-Durchlauf: **Branchen-Etiketten sind keine Spezialisierungsachse.** "Bankbuchhalter/Fabrikbuchhalter/Ladenbuchhalter" sind neun Zensus-Titel für denselben Beruf mit anderem Arbeitgeber — die richtige Spez-Achse ist die Buchhaltungsfunktion (Bilanz/Prüfung/Kosten), nicht die Branche.

Zweite Zusatzregel (aus der Krankenpflege-Diskussion): **Kompetenz-Spannbreite ist kein Fall-3-Grund.** Dass ein schnell angelernter Assistent TaW 4 hat und eine Koryphäe TaW 30, rechtfertigt für sich allein keine getrennte Hauptfertigkeit — dafür ist der Wertebereich der Fertigkeit selbst da. Ein Fall-3-Split lohnt nur, wenn sich die Art des Wissens qualitativ unterscheidet (Geologe/Bergmann: Theorie vs. Praxis), nicht wenn nur das Niveau variiert.

Formatvorgabe für die Zieltabelle (Runde 4): **mindestens 3 Spezialisierungen pro Hauptfertigkeit, mehr ist gerne gesehen**, einfache/kurze Begriffe statt verschachtelter Klammer-Varianten. Ausnahmen mit Freitext statt fester Liste (*Pädagoge*, *Tänzer*, *Geschichte*) bleiben Sonderfälle, siehe Tabelle.

## Abenteurerleben-Prinzip (neu, Runde 4)

Ausdrücklicher Designgrundsatz: mit wenigen Hauptfertigkeiten muss sich das "normale" Abenteurerleben abbilden lassen — Rasten in der Wildnis, Feuer machen, Fouragieren, Jagen, Fischen — ohne dass dafür gleich eine volle Handwerksfertigkeit nötig ist. Auflösung: **Überleben** deckt diese Aktivitäten auf Subsistenzniveau (Camping/Fouragieren/Feuer machen sowie beiläufiges Jagen und Fischen zum eigenen Bedarf) automatisch mit ab. *Jäger* und *Fischer* bleiben separat, aber nur für den **professionellen Ertrag** nötig (Felle, Fischöl, Marktware, Spezialtechniken wie Walfang/Fallenstellen) — nicht um unterwegs die Mahlzeit zu sichern. Mechanisch ist das noch nicht geprüft/kodiert, siehe "Weiterhin offene Punkte".

---

## Gesamttabelle: Ziel-Taxonomie aller Hauptfertigkeiten

Eine Tabelle für alles: bestehende Hauptfertigkeiten (ggf. erweitert/umbenannt) und neu vorgeschlagene, in Kategorien sortiert. Begründungen zu markierten Zeilen stehen im Abschnitt [Begründungen](#begründungen) danach.

| Kategorie | Hauptfertigkeit | Status | Spezialisierungen |
|---|---|---|---|
| Bau | Zimmerei | neu[^zimmerei] | Dachstuhlbauer · Fenster- und Türenbauer · Schindelmacher · Fachwerkbauer[^hausbau] |
| Bau | Maurerhandwerk | neu[^maurerhandwerk] | Ziegelmaurer · Stuckateur · Dachdecker · Fliesenleger |
| Bau | Architektur | neu[^architektur] | Brückenbauingenieur · Festungsbaumeister · Stadtplaner · Baumeister |
| Bau | Holzbearbeitung | erweitert | Drechsler · Bürstenbinder · Fassbinder · Korbflechter · Köhler · Schnitzer · Tischler · Wagner · Holzfäller |
| Bau | Bootsbauer | erweitert[^bootsbauer] | Großschiffbauer · Kleinbootbauer · Galeerenbauer |
| Bau | Glaser | bestehend | Apparateglaser · Glasbläser · Kristallschleifer · Optiker · Fensterglaser |
| Bau | Maler | neu[^anstreicher] | Fassadenmaler · Anstreicher · Tapezierer |
| Metall | Schmied | bestehend | Feinschmied · Grobschmied · Hufschmied |
| Metall | Buntmetallschmied | umbenannt[^buntmetallschmied] | Bronzeschmied · Goldschmied · Kupferschmied · Silberschmied · Zinngießer |
| Metall | Waffenschmied | erweitert[^waffenschmied] | Klingenwaffen · Hiebwaffen · Stangenwaffen · Stichwaffen |
| Metall | Rüstungsschmied | erweitert[^ruestungsschmied] | Tierrüstungen · Kettenrüstungen · Plattenpanzer |
| Metall | Feuerwaffenbauer | erweitert[^feuerwaffenbauer] | Vorderlader · Stein-/Perkussionsschloss · Kipplaufverschluss · Trommelverschluss · Repetierverschluss |
| Metall | Metallurgie | erweitert[^metallurgie-merge] | Edelmetalle · Schwermetalle · Sonderlegierungen · Eisen & Stahl · Messing |
| Metall | Gießer | neu[^giesser] | Glockengießer · Werkzeuggießer · Stückgießer · Munitionsgießer |
| Metall | Bogenbauer | neu[^bogenbauer] | Holzbögen · Kompositbögen · Umspannbögen |
| Textil/Leder | Schneider | erweitert[^ruestungsschmied] | Segelmacher · Konfektionsschneider · Hutmacher · Teppichknüpfer · Stoffrüstungen |
| Textil/Leder | Weber | erweitert | Seidenweber · Leinweber · Tuchmacher · Färber · Stricker |
| Textil/Leder | Lederbearbeitung | erweitert[^jaeger-spez] | Handschuhmacher · Oberbekleidung · Sattler · Schuster · Täschner · Gerber · Kürschner · Lederrüstungen |
| Textil/Leder | Seiler | bestehend | Netzmacher · Reepschläger |
| Nahrung | Bäcker | bestehend | Brotbäcker · Konditor |
| Nahrung | Koch | erweitert[^koch-spez] | Backen · Braten · Räuchern · Konservieren |
| Nahrung | Metzger | neu[^metzger] | Schlachtung · Pökeln · Trocknen · Wursterei · Talgsieder |
| Nahrung | Brenner | bestehend | Alchemistische Zutaten · Geist · Kräutergeist |
| Nahrung | Fischer | erweitert | Angler · Tranbrenner · Netzfischer · Schwammtaucher · Walfänger · Austernfischer |
| Sonstiges Handwerk | Töpfer | bestehend | Emailleur · Geschirr |
| Sonstiges Handwerk | Kunsthandwerker | erweitert[^kunsthandwerker] | Bildhauer · Maler · Tätowierer · Elfenbeinschnitzer |
| Sonstiges Handwerk | Instrumentenbauer | erweitert | Blasinstrumente · Saiteninstrumente · Schlaginstrumente · Tasteninstrumente |
| Sonstiges Handwerk | Mechanikus | erweitert[^mechanikus] | Feinmechaniker · Rechenmaschinen · Uhrmacher · Maschinenbauer · Dampftechniker · Pumpenbauer |
| Sonstiges Handwerk | Barbier | erweitert | Bader · Frisör · Kosmetiker |
| Sonstiges Handwerk | Drucker | erweitert | Buchbinder · Papiermacher · Lithograf · Stereotypeur |
| Sonstiges Handwerk | Luftschiffbauer | erweitert[^luftschiffbauer] | Militärschiffbauer · Reiseschiffbauer · Transportschiffbauer |
| Natur/Landwirtschaft | Landwirtschaft | erweitert | Gemüsebauer · Getreidebauer · Obstbauer · Rübenbauer · Tabakpflanzer · Winzer · Baumschulgärtner · Gewürze · Baumwollpflanzer · Alchemistische Zutaten |
| Natur/Landwirtschaft | Viehwirtschaft | erweitert[^metzger] | Geflügelzüchter · Imker · Milchbauer · Weidehirte · Viehtreiber · Großechsenzüchter · Riesenasselzüchter · Wargzüchter |
| Natur/Landwirtschaft | Jäger | erweitert[^jaeger-spez] | Fallensteller · Großwildjäger · Treiber · Rotwildjäger |
| Natur/Landwirtschaft | Pflanzenkunde | erweitert[^pflanzenkunde] | Förster · Farbstoffe · Kräuterkundler · Moose · Pilzsammler · Sträucher · Alchemistische Zutaten |
| Natur/Landwirtschaft | Bergbau | erweitert[^bergbau-spez] | Edelsteinschürfer · Steinbrecher · Kohlenhauer · Salzbergmann · Ölbohrer · Prospektor |
| Natur/Landwirtschaft | Alchemie | erweitert[^alchemie-spez] | Feuerwerker · Pigmentmacher · Leimsieder · Parfumeur · Pulvermacher · Trankbrauer · Giftmischer · Salbenmischer · Seifensieder |
| Natur/Landwirtschaft | Abrichten | bestehend | Drache · Laufvogel · Reitkrebse · Reitreptilien · Rok · Warg · Asseln · Elefanten · Flugechsen · Fledertiere · Greifen · Hornträger · Hundeartige · Katzenartige · Kamele · Pegasi · Pferde · Primaten · Raptoren · Rollocks · Rattenartige · Schleichkatzen · Spinnen · Schweine · Vögel |
| Handel/Verwaltung | Kaufmann | erweitert[^kaufmann] | Gastwirt · Sklavenhändler · Artefakthändler · Bogenhändler · Armbrusthändler · Feuerwaffenhändler · Krämer · Kutschenhändler · Schiffsmakler · Blankwaffenhändler · Rüstungshändler · Schmuckhändler · Baustoffhändler · Textilhändler · Haushaltswarenhändler · Metallwarenhändler · Provianthändler · Papierwarenhändler · Immobilienmakler · Rohstoffhändler · Musikalienhändler |
| Handel/Verwaltung | Bankwesen | neu[^bankwesen] | Kreditwesen · Einlagengeschäft · Wechsler · Hypothekenwesen |
| Handel/Verwaltung | Versicherungswesen | neu[^versicherung] | Feuerversicherung · Lebensversicherung · Transportversicherung · Schiffsversicherung |
| Handel/Verwaltung | Buchhaltung | neu[^buchhaltung] | Bilanzbuchhalter · Betriebsprüfer · Kostenrechnung |
| Handel/Verwaltung | Administration | umbenannt[^verwaltung] | Schreiber · Landvermesser · Archivar · Verwaltungsbeamter |
| Handel/Verwaltung | Rechtskunde | umbenannt[^rechtskunde] | Vertragsrecht · Strafrecht · Bergrecht · Bürgerrecht |
| Handel/Verwaltung | Logistik | neu[^logistik] | Bahnspediteur · Fuhrspediteur · Hafenspediteur · Schiffsspediteur |
| Handel/Verwaltung | Fuhrmann | bestehend | Lastfuhrmann · Postkutscher · Reisekutscher |
| Handel/Verwaltung | Eisenbahner | erweitert | Lokführer · Signaler |
| Führung/Reise | Führung | erweitert[^fuehrung-spez] | Dampferkapitän · Karawanenführer · Luftschiffkapitän · Schiffskapitän · Zöllner · Gutsverwalter · Lotse · Werksleiter · Kavallerieoffizier · Artillerieoffizier · Infanterieoffizier |
| Führung/Reise | Seefahrt | neu[^seefahrt] | Küstenschifffahrt · Hochseeschifffahrt · Ruderschifffahrt · Flussschifffahrt |
| Führung/Reise | Luftschifffahrt | neu[^luftschifffahrt] | Höhenfahrt · Sturmfahrt · Langstreckenfahrt |
| Führung/Reise | Überleben | bestehend[^ueberleben-prinzip] | Berge · Dschungel · Ebene · Eis · Stadt · Unterirdisch · Wald · Wüste |
| Führung/Reise | Telegrafie | neu[^telegrafie] | Telegrafist · Leitungsbauer · Kryptografie |
| Wissenschaft | Chemie | neu[^chemie] | Anorganische Chemie · Organische Chemie · Thermochemie |
| Wissenschaft | Physik | neu[^physik] | Mechanik · Optik · Thermodynamik |
| Wissenschaft | Mathematik | neu[^mathematik] | Arithmetik · Geometrie · Statistik |
| Wissenschaft | Philosophie | neu[^philosophie] | Ethik · Logik · Naturphilosophie |
| Wissenschaft | Wirtschaftslehre | neu[^wirtschaftslehre] | Volkswirtschaftslehre · Betriebswirtschaftslehre · Außenhandel |
| Wissenschaft | Soziologie | neu[^soziologie] | Vergleichende Kulturkunde · Gesellschaftsstruktur · Migrationsforschung |
| Wissenschaft | Astronomie | neu[^astronomie] | Navigationsastronomie · Kalenderkunde · Kosmologie |
| Wissenschaft | Geschichte | neu, Sonderfall[^geschichte] | *beliebige Spezies/Kultur als Fach* (Freitext) |
| Wissenschaft | Sprachwissenschaft | umbenannt[^sprachwissenschaft] | Vergleichende Grammatik · Etymologie · Dialektologie |
| Wissenschaft | Altzwergisch | neu[^altesprachen-split] | — (Einzelsprache, keine weitere Spez) |
| Wissenschaft | Altelfisch | neu[^altesprachen-split] | — (Einzelsprache, keine weitere Spez) |
| Wissenschaft | Biologie | neu[^biologie] | Zoologie · Botanik · Anatomie |
| Wissenschaft | Theologie | neu[^theologie] | Religionswissenschaft · Kirchengeschichte · Mythologie |
| Wissenschaft | Geologie | neu[^geologie] | Lagerstättenkunde · Mineralogie · Tektonik |
| Wissenschaft | Geografie | neu[^geografie] | Kartografie · Länderkunde · Klimakunde |
| Wissenschaft | Militärtheorie | neu[^militaertheorie] | Strategie · Taktik |
| Wissenschaft | Magietheorie | erweitert[^magietheorie-spez] | Antimagie · Beherrschung · Erdbeschwörung · Feuerbeschwörung · Heilung · Hellsicht · Illusion · Luftbeschwörung · Magiebeschwörung · Veränderung · Verzauberung · Wasserbeschwörung · Dämonologie · Nekromantie · PSI-Theorie |
| Wissenschaft | Medizin | erweitert[^medizin-spez] | Veterinär · Chirurg · Zahnarzt · Geburtshelfer · Erste Hilfe |
| Magie/Klerus | Geweihte: Stoßgebet | bestehend[^geweihte-split] | — (nicht spezialisierbar) |
| Magie/Klerus | Geweihte: Wunder | bestehend[^geweihte-split] | — (nicht spezialisierbar) |
| Magie/Klerus | Geweihte: Ritual | bestehend[^geweihte-split] | — (nicht spezialisierbar) |
| Sozial/Kunst | Ermittlung | neu[^ermittlung] | Spurenlesen · Verhör · Observation |
| Sozial/Kunst | Diebeskunst | neu[^diebeskunst] | Taschendieb · Schlossknacker · Taschenspieler · Betrüger |
| Sozial/Kunst | Etikette | neu[^etikette] | Gemeinvolk · Bürgertum · Hochfinanz |
| Sozial/Kunst | Pädagoge | neu, Sonderfall[^paedagoge] | *beliebiges WHK-Fach* (Freitext) |
| Sozial/Kunst | Musizieren | neu[^musizieren] | Blasinstrumente · Saiteninstrumente · Schlaginstrumente |
| Sozial/Kunst | Schriftstellerei | neu[^schriftstellerei] | Journalismus · Belletristik · Fachliteratur |
| Sozial/Kunst | Fotografie | neu[^fotografie] | Studioaufnahmen · Außenaufnahmen · Bewegtbild |
| Sozial/Kunst | Schauspielkunst | umbenannt[^schauspiel] | Schauspieler · Redner · Schausteller |
| Sozial/Kunst | Tänzer | neu, Sonderfall[^taenzer] | *beliebige Spezies* (Freitext) |
| Sozial/Kunst | Gastgewerbe | neu[^gastgewerbe] | Kellner · Barkeeper · Sommelier |
| Sozial/Kunst | Hauswirtschaft | neu[^hauswirtschaft] | Haushälter · Wäscher · Hausmeister |
| Sozial/Kunst | Bestattungswesen | neu[^bestattungswesen] | Einbalsamierer · Rekonstruktion · Präsentation |
| Sozial/Kunst | Stimmen imitieren | bestehend | Dalkini · Drow · Elf · Goblin · Indianer · Katzenmenschen · Ork · Troll · Zentauren · Zwerg · Tiere |

*Status-Legende: **bestehend** = unverändert aus `whk.jsonl`; **erweitert** = bestehende HF, neue Spez ergänzt; **umbenannt** = bestehende HF, neuer Name, Spez unverändert; **neu** = komplett neue Hauptfertigkeit.*

### Etikette vs. SSK-Kultur — geklärt

Auflösung: **Option B**, mit sauberer Achsentrennung. SSK bildet einen **Grundmodifikator auf soziale Interaktion allgemein** (nicht nur Etikette) — als **fester additiver Modifikator auf die Probe**, nicht als Multiplikator (Runde 7-Korrektur: das gesamte Proben-System in `Proben v2.0.md` ist durchgängig additiv — jede Probenformel im Regelwerk zieht Erschwerung als festen Term ab, ein prozentualer/multiplikativer Malus existiert nirgends im System, auch keine TaW-effektiv-Skalierung). **Modifikator-Stufen (final, Runde 7):**

| SSK-Kenntnisstufe | Modifikator |
|---|---|
| keine Kenntnis | −20 |
| geringe Kenntnis | −10 |
| gute Kenntnis | −5 |
| Muttersprache/-kultur | 0 |
| Akademisches Niveau | +3 |

**SSK-Kultur/Sprache-X liefert diesen Modifikator auf die Probe, nicht die Fertigkeit selbst.**

Etikette selbst spezialisiert dafür **nach Gesellschaftsschicht, nicht nach Spezies** (Gemeinvolk/Bürgertum/Hochfinanz in der Tabelle oben) — bewusst säkular formuliert, kein Adels-/Hof-Framing, weil das weder zum Western-Setting noch zwingend zu jeder Spezies passt. Ergebnis: ein Charakter, der bei Zwergen in feiner Gesellschaft auftreten will, braucht **Etikette→Hochfinanz** (die Schicht-Kompetenz) **und** profitiert zusätzlich von seinem *SSK Zwergisch/Zwergische Kultur*-Wert (der Sprache-/Kultur-Modifikator) — zwei verschiedene, sich ergänzende Werte, keine Doppelstruktur.

Nebenbefund, nicht Teil dieses Projekts: die ursprüngliche Speziesliste ("alle definierten Indianerkulturen") zeigt, dass *SSK-Kultur* selbst zu grob ist — es gibt schon 8 einzelne Indianisch-**Sprachen**, aber nur eine einzige lumpe "Indianische Kultur". Eigener Nacharbeits-Punkt bei SSK, hier nur vermerkt.

---

## Begründungen

[^zimmerei]: Baukonstruktion ist ein anderes Handwerk als die feine Möbeltischlerei in *Holzbearbeitung* — genau wie *Bootsbauer* schon eigene Hauptfertigkeit ist. Zensus: Zimmermann, Säger, Türenbauer, Fensterrahmenbauer, Schindelmacher, Lattenmacher.
[^hausbau]: Fehlte noch — der allgemeine Rohbau/Fachwerkbau eines Hauses, nicht nur Dachstuhl/Fenster/Schindeln einzeln. Benannt als "Rohbau".
[^maurerhandwerk]: Stein/Ton/Mörtel statt Holz — im Zensus fälschlich unter "Bau, Holz" einsortiert. Zensus: Steinmaurer, Ziegelmaurer, Stuckateur, Weißbinder, Dachdecker, Schieferdecker, Fliesenmacher, Ziegelmacher. *Maler* (Bauanstrich) ist wieder raus (siehe eigene Hauptfertigkeit unten) — bleibt kein eigenes Gewerk unter *Maurerhandwerk*.
[^architektur]: Planung/Statik ist Wissensfertigkeit, nicht Ausführung — ein Architekt mauert nicht automatisch (Spiegelbild zu Geologe/Bergmann). Zensus: Architekt, Bauingenieur, Technischer Zeichner, Brückenbauer.
[^bootsbauer]: *Kalfatern* raus (zu dünn für eine eigene Spez neben den Schiffsklassen), dafür *Galeeren* als eigene Bootsklasse rein — passt zum Bootsbauer-typischen Muster "nach Schiffsgröße/-klasse", nicht nach Arbeitsschritt.
[^anstreicher]: Wandert aus *Maurerhandwerk* wieder raus zur eigenen Hauptfertigkeit, jetzt umbenannt von "Anstreicher" zu *Maler* — Bauanstrich (Fassade/Innenraum) ist ein eigenständiges Gewerk, nicht nur eine Spez neben Ziegelbau/Putz/Dachdeckung. Namensüberschneidung mit *Kunsthandwerker→Maler* (Kunstmaler) ist bewusst in Kauf genommen — im Deutschen ist "Maler" ohnehin der generische Oberbegriff für beide, unterschieden durch den Kontext (eigene HF hier vs. Spez dort), ähnlich wie *Buntmetallschmied* schon eine Spez namens "Goldschmied" hat. Tapezieren als dritte Spez, weil schon als Nachbargewerk notiert.
[^buntmetallschmied]: Reine Umbenennung (vorher "Goldschmied"), keine Strukturänderung — deckte inhaltlich schon immer alle Buntmetalle ab (Bronze/Kupfer/Silber/Zinn), der alte Name war nur irreführend.
[^waffenschmied]: Ergänzt um die Waffenfamilien aus dem Kampfmodul (`nahkampf.jsonl`: Hiebwaffen, Klingenwaffen, Stangenwaffen, Stichwaffen, Unbewaffnet) — alle außer *Unbewaffnet* (das schmiedet niemand), damit *Waffenschmied* nicht länger nur Klingen abdeckt.
[^ruestungsschmied]: *Lederrüstungen* wandert zu *Lederbearbeitung*, *Stoffrüstungen* zu *Schneider* — beides liegt fachlich näher am jeweiligen Grundmaterial-Handwerk als am Metallschmieden. *Rüstungsschmied* bleibt für die Metallrüstungen (Tier-, Ketten-, Plattenrüstung).
[^feuerwaffenbauer]: War der am stärksten unterentwickelte Ast im System (nur "Vorlagen"). Ausbau nach Verschlusstyp statt Waffentyp — der Verschluss ist die Kernmechanik, passt auch zum bestehenden Ladezeit-System, wo der Verschlusstyp schon die Ladezeit-Formel bestimmt.
[^metallurgie-merge]: Eisen & Stahl/Messing ergänzt (fehlten komplett). *Gießerei/Formguss* ist raus — gehört jetzt exklusiv zu *Gießer*. *Metallurge* (die separate Theorie-HF aus Runde 1+2) ist wieder zurückgeführt/gemerged in *Metallurgie* — die Theorie/Praxis-Trennung wurde für dieses Fach nicht gewollt, anders als bei Chemie/Alchemie. *Legierungen* umbenannt zu *Sonderlegierungen* (präziser: nicht die alltägliche Legierung, sondern besondere/seltene Mischungen).
[^giesser]: Guss ist eigenes Handwerk (Formenbau, Gießtemperatur, Abkühlung), nicht nur eine Metallurgie-Variante — behält seine eigene Hauptfertigkeit, auch nach dem Metallurgie/Metallurge-Merge. *Munitionsherstellung* neu ergänzt (Kugeln/Schrot gießen, naheliegende Ergänzung zu Geschützguss).
[^bogenbauer]: Fehlte komplett — Bögen/Armbrust/Pfeile/Bolzen existieren zwar längst als Ausrüstungskatalog, aber niemand baut sie. Parallel zu *Feuerwaffenbauer* (Schusswaffen) und *Waffenschmied* (Nahkampfwaffen): eigenes Handwerk fürs Bogenschnitzen. Achse = Bauweise (Holz/Komposit/Umspannt), analog zum Verschlusstyp-Muster bei Feuerwaffen.
[^jaeger-spez]: Kürschner wandert von *Jäger* zu *Lederbearbeitung→Kürschnerei* (muss erst gegerbt werden, bevor der Kürschner arbeitet). *Vögel* ist raus, dafür *Großwild*/*Treibjagd*/*Rotwild* rein — *Jäger* jetzt klarer auf Wildtier-Jagd zugeschnitten. Nachbargewerke: *Lederbearbeitung→Gerberei*, *Schneider* (näht am Ende ggf. mit).
[^koch-spez]: Lebensmittelkonservierung war noch nicht abgedeckt, jetzt als *Konservieren* (vorher "Einkochen/Konservieren", vereinfacht). *Rösten* ist wieder raus.
[^metzger]: Löst die Inkonsistenz "Metzger steckte in *Viehwirtschaft*" auf: eigene Hauptfertigkeit, weil Schlachten/Verarbeiten ein anderes Handwerk ist als Tierhaltung selbst. *Trocknen* ergänzt neben Pökeln (Selchen fällt als eigener Begriff raus, ist im Kern dasselbe wie Räuchern/Pökeln). Nachbargewerke: *Viehwirtschaft* (liefert das Tier), *Koch* (Weiterverarbeitung zu Gerichten), *Lederbearbeitung→Gerberei* (Fell/Haut als Nebenprodukt), *Kaufmann* (Verkauf/Fleischerladen).
[^kunsthandwerker]: *Lackierung* geht in *Maler* auf (waren zu nah beieinander, um zwei eigene Spez zu rechtfertigen) — deckt jetzt sowohl Bild- als auch Lackmalerei ab.
[^mechanikus]: *Maschinenbau/Dampftechnik* aufgeteilt in zwei eigene Spez (unterschiedliche Fachrichtungen), dazu *Pumpenbau* neu ergänzt.
[^luftschiffbauer]: Spez-Achse präzisiert nach Einsatzzweck statt nur Größe: Militär-, Reise- und Transportschiffe statt der vagen "Sonderschiffe".
[^pflanzenkunde]: *DSA-Pflanzen* raus (Altlast-Platzhaltername aus der Datenmigration, kein echter Begriff), dafür *Alchemika* rein — Anknüpfung an die Alchemie-Zutatenversorgung.
[^bergbau-spez]: *Probierkunst* ersetzt durch *Prospektion* (Suche nach Lagerstätten statt reiner Erzprüfung) — handlungsnäherer, spielrelevanterer Begriff für einen Goldrausch-Treffer.
[^alchemie-spez]: Tränke/Gifte fehlten trotz Alchemisten-Kernkompetenz — auffällig, weil sie als Item-Katalog (Alchemika-Erfassung: Gifte, Heiltränke etc.) längst existieren, nur die Herstellungs-Spez in der WHK selbst fehlte. *DSA-Material* raus (derselbe Altlast-Platzhaltername wie bei *Pflanzenkunde*).
[^kaufmann]: Warengruppen-Cluster statt 1:1-Import der 66 Zensus-"-händler"-Titel, sonst wäre es ein SP-Sink. *Wanderhandel* ist wieder raus.
[^bankwesen]: Eigener Wissenskörper, kein Transfer zu Handel oder Buchhaltung.
[^versicherung]: Neue Hauptfertigkeit — Versicherungsbeamter/-kaufmann lief bisher nur als Basis-*Bankwesen* mit, bekommt jetzt eigenen Platz. Spez bestätigt: Feuer-/Lebens-/Transport-/Schiffsversicherung (vier große Versicherungssparten der Epoche).
[^buchhaltung]: Nuanciert genug für Spez (Bilanzbuchhalter ≠ Betriebsprüfer), aber die Achse ist Funktion, nicht Branche. Zensus: Bank-/Büro-/Eisenbahn-/Fabrik-/Ladenbuchhalter.
[^verwaltung]: Umbenannt von "Verwaltung/Amtswesen" zu *Administration*. Bürokratie/Korrespondenz/Vorschriften — anderer Kern als Buchhaltung (Worte/Verfahren statt Zahlen). **Schreiben-können (Grundfertigkeit/Literalität) ≠ Schreiber (Gewerbe).**
[^rechtskunde]: Umbenannt von "Rechtskunde (Jura)" zu *Rechtskunde*. Bürgerrecht neu ergänzt (Staatsbürgerschaft/Bürgerrechte, starker Western-Treffer neben Bergrecht).
[^logistik]: *Fuhrmann* fährt selbst; *Logistik* plant Routen, Ladung, Lagerbestände — andere Kompetenz. *Schiffslogistik* ergänzt neben *Hafenlogistik* (Ladung/Route an Bord vs. Umschlag im Hafen). Die reine Lade-/Trage-Handarbeit (Lagerarbeiter, Packer) bleibt unskilled.
[^fuehrung-spez]: Gutsaufsicht deckt auch Plantagen-/Sklavenaufseher und Bergwerksbeamter ab. Lotsendienst ist aus *Seefahrt* hierher verschoben. *Werksleitung* neu ergänzt (Fabrik-/Betriebsleitung, passt zum Industrialisierungs-Cluster).
[^seefahrt]: Fehlende Basis unter *Führung*: die bestehenden Spez (Schiffskapitän, Dampferkapitän) sind reine Kommando-Rollen, ein Matrose braucht die Grundfertigkeit selbst. "(Matrosenhandwerk)" aus dem Namen raus, nur noch *Seefahrt*. *Flussschifffahrt* neu ergänzt neben Küste/Hochsee/Ruder — Binnengewässer sind nochmal eine andere Praxis als Küstennähe.
[^luftschifffahrt]: Schließt dieselbe Lücke wie *Ermittlung*/"Spuren Lesen": `grundfertigkeit.jsonl` (Fliegen-Eintrag) verweist auf eine WHK "Luftschifffahrt", die nie gebaut wurde. Luftschiffe sind magisch angetrieben und von einem Ballon getragen, Navigation läuft wie bei einem Schiff, nur mit Luftströmungen statt Meeresströmungen. *Stadtverkehr* ist raus, *Langstreckenfahrt* rein — Achse jetzt Distanz/Wetterrisiko statt Nahbereich/Fernbereich/Extrem.
[^ueberleben-prinzip]: Deckt nach dem Abenteurerleben-Prinzip (siehe Abschnitt oben) implizit Rasten, Feuer machen, Fouragieren sowie Jagen/Fischen auf Subsistenzniveau ab — *Jäger*/*Fischer* bleiben die professionellen Ertragsfertigkeiten. Mechanisch noch nicht geprüft/kodiert. (Runde 6 hatte kurz "nicht spezialisierbar" vorgeschlagen — zurückgenommen, die 8 Gelände-Spez bleiben.)
[^telegrafie]: Genre-Treffer für Western (Telegrafenstationen). Kryptografie als dritte Spez ist ein netter Abenteuerhaken.
[^chemie]: Theorie-Pendant zu *Alchemie* — pro Fach eine eigene Hauptfertigkeit, nicht in einem Sammelfach ("Naturphilosophie") gebündelt.
[^physik]: Theorie-Pendant zu *Mechanikus*/*Zimmerei*/*Architektur* (Statik!) — bisher komplett fehlend. Runde 7: **Elektrizitätslehre bewusst nicht als Spez ergänzt** — im Setting ist Elektrizität Magie, keine mundane Physik, siehe Weltenbau-Klärung.
[^mathematik]: Reine Formalwissenschaft, eigener Fall-3-Kandidat. Geometrie überschneidet sich nützlich mit *Architektur*.
[^philosophie]: Klassische Geisteswissenschaft, bisher nirgends abgebildet.
[^wirtschaftslehre]: Theorie-Pendant zu *Kaufmann*/*Bankwesen*/*Buchhaltung* (Praxis) — ein Ökonom ist kein automatisch guter Kaufmann.
[^soziologie]: Wissenschaft ÜBER Gesellschaften allgemein — abgegrenzt von *SSK-Kultur* (konkrete Fluency in EINER Kultur) und *Etikette* (praktische Anwendung).
[^astronomie]: Navigationsastronomie ist der praktische Anknüpfungspunkt zu *Seefahrt→Hochseeschifffahrt*.
[^geschichte]: Klassische Lore-Wissensfertigkeit, bisher nirgends abgebildet. Spez-Achse jetzt entschieden: Spezies/Kultur statt Thema — läuft technisch wie *Pädagoge*/*Tänzer* über Freitext, passend zum Charakterbogen-Fund "Geschichte -> Elfen".
[^sprachwissenschaft]: Umbenannt von "Sprachwissenschaft (Linguistik)" zu *Sprachwissenschaft*. Theorie ÜBER Sprachen allgemein/vergleichend, getrennt von *SSK-Sprache-X* (konkrete Fluency in EINER lebenden Sprache) und von *Altzwergisch*/*Altelfisch* (konkretes Lesen je einer toten Sprache).
[^altesprachen-split]: Keine gemeinsame Sammel-HF *Alte Sprachen* mehr — Altzwergisch und Altelfisch sind zu unterschiedlich, um unter einem Dach zu stehen, und werden zu je eigener Hauptfertigkeit. *Alt-Dalkinisch* als dritter Kandidat ist damit ebenfalls vom Tisch. Anders als lebende SSK-Sprachen eher altertumskundlich zu lesen (tote Sprache, kein gesprochener Gebrauch) — daher WHK statt SSK. Beide ohne weitere Spez, wie eine Einzelsprache es nahelegt.
[^biologie]: Theorie-Pendant zu *Medizin* (Anatomie), *Pflanzenkunde* (Botanik) und *Viehwirtschaft/Jäger* (Zoologie).
[^theologie]: Theorie-Pendant zu den drei *Geweihte*-Hauptfertigkeiten (Praxis: Stoßgebet/Wunder/Ritual) — akademisches Studium von Glauben statt gelebter Glaube.
[^geologie]: War im Entwurf bisher nur die Analogie fürs ganze Theorie/Praxis-Muster, nie selbst vorgeschlagen. Theorie-Pendant zu *Bergbau*.
[^geografie]: Passt ins selbe Muster wie Astronomie/Geschichte/Biologie.
[^militaertheorie]: Löst die Grenzfrage Soldat/Offizier auf: *Militärtheorie* ist das Wissen (Planung, Feldzugslehre), keine Kampfmodul-Fertigkeit. Bewusste Ausnahme von der 3er-Vorgabe: nur Strategie und Taktik, eine dritte Achse hätte künstlich gewirkt. *Führung→Militärführung* (Kommando in der Schlacht selbst) bliebe eine separate, noch nicht gebaute Spez, falls gewünscht.
[^magietheorie-spez]: Ergänzt um Dämonologie, Nekromantie, PSI-Theorie — schloss eine Lücke: die 12 bestehenden Spez deckten nur die klassischen Spruchmagie-Schulen ab, obwohl Dämonologie/Nekromantie/PSI als eigene Systeme existieren.
[^geweihte-split]: Waren als eine Hauptfertigkeit *Geweihte (Klerus)* mit 3 Spez modelliert — sollen aber drei **eigenständige, nicht weiter spezialisierbare Hauptfertigkeiten** sein. Technisch WHK-Kategorien in `whk.jsonl`, gehören aber zum separaten Geweihte-/Klerus-Feature (Karma-Pool, Wundertabelle) und sind sonst nicht Teil dieser Taxonomie-Überarbeitung — nur der Vollständigkeit halber mit aufgeführt.
[^medizin-spez]: Hatte nur eine Spez (Veterinär). Chirurgie/Zahnheilkunde/Geburtshilfe sind Fachrichtungen; Erste Hilfe (Sofortmaßnahme) eine zusätzliche Achse. *Vitalpunkte* ist wieder raus.
[^ermittlung]: `grundfertigkeit.jsonl` (Fährtensuche) verweist selbst auf eine WHK "Spuren Lesen", die nirgends existierte. *Fährtensuche* (Grundfertigkeit, Spuren *finden*) bleibt unverändert, *Ermittlung* füllt die WHK-Lücke (Spuren *lesen/deuten*) und erweitert um allgemeine Ermittlungsarbeit. "(Spurenkunde)" aus dem Namen raus, nur noch *Ermittlung*.
[^diebeskunst]: Ersetzt die vorherige Entscheidung "Schlösser Knacken wird eigene Grundfertigkeit" (Runde 3) — stattdessen eigene Hauptfertigkeit *Diebeskunst* mit *Schlösser knacken* als eine von vier Spez, neben Taschendiebstahl, Taschenspielertricks und Betrug. Bündelt das "Gauner-Handwerk" an einer Stelle statt als verstreute Einzelfertigkeiten.
[^etikette]: Achse ist Gesellschaftsschicht, nicht Spezies (bewusst säkular statt Adel/Hof-Framing). Siehe eigener Abschnitt oben.
[^paedagoge]: Ersetzt den zu generischen "Lehrer". Unterrichten ist eine vom Fach unabhängige Kompetenz. Musiklehrer/Kunstlehrer = Pädagoge (Spez: Musizieren/Kunsthandwerker) zusätzlich zur Fachfertigkeit.
[^musizieren]: *Instrumentenbauer* baut, spielt aber nicht — komplett anderes Skillset. Achse bewusst identisch zu *Instrumentenbauer* (dieselben 3 Familien).
[^schriftstellerei]: Autor (Fiktion) vs. Journalist (Reportage) vs. Fachliteratur teilen Schreibhandwerk, unterschiedliche Methodik.
[^fotografie]: Neues, periodentypisches Handwerk (Chemie+Optik+Komposition). Studio/Außen/Bewegtbild sind spürbar unterschiedliche Praxis.
[^schauspiel]: Umbenannt von "Schauspiel-/Vortragskunst" zu *Schauspielkunst*. Publikum fesseln ist der gemeinsame Kern, aber ein guter Schauspieler ist kein automatisch guter Jahrmarkt-Ausrufer.
[^taenzer]: Existierte nirgends im System. Spezies statt Themenachse, weil sich Tanztraditionen stark nach Körperbau/Kultur unterscheiden — anders als bei *Etikette* (dort bewusst NICHT Spezies), weil die Achse hier tatsächlich trägt. Läuft technisch wie *Pädagoge*.
[^gastgewerbe]: *Kaufmann→Gastwirt* ist der Betrieb/Besitz; das eigentliche Bedienen ist ein eigenes Handwerk.
[^hauswirtschaft]: Domestik-Dienst fehlte komplett, aber periodentypisch relevant. "/Dienstbotenwesen" aus dem Namen raus, nur noch *Hauswirtschaft*.
[^bestattungswesen]: Eigenständiges Handwerk, kein Transfer von woanders. Seelsorge bewusst nicht als 4. Spez — überschneidet sich mit *Geweihte*.

---

## Bereits sauber abgedeckt (kein neuer Aufwand, unverändert gültig)

Ganze Zensus-Cluster kollabieren direkt auf bestehende Hauptfertigkeiten/Spez, ohne eigenen Slot zu brauchen:

- **Holzbearbeitung→Tischler**: Möbeltischler, Tischler
- **Holzbearbeitung→Bürstenbinder**: Besenmacher, Bürstenmacher
- **Holzbearbeitung→Fassbinder**: Küfer, Daubenmacher, Fassbodenmacher, Gebindebrettmacher
- **Holzbearbeitung→Korbflechter**: Korbmacher · **→Köhler**: Köhler · **→Wagner**: Wagenbauer, Kutschenbauer, Waggonbauer
- **Bootsbauer**: Schiffszimmermann
- **Bäcker→Konditor**: Konditor
- **Barbier→Frisör**: Friseur, Haarreiniger, Haarzurichter
- **Kaufmann→Gastwirt**: Herbergswirt, Hotelier, Hotelkaufmann, Pensionswirt, Saloonwirt, Restaurantbetreiber
- **Kaufmann→Sklavenhändler**: Sklavenauktionator, -makler, -vermieter
- **Schneider**: Damenschneider, Hemdenmacher, Korsettmacher, Kragenmacher, Manschettenmacher, Näher, Modist, Mützenmacher, Handschuhmacher, Knopf-/Markisen-/Schirmmacher
- **Lederbearbeitung**: Riemer, Sattler, Schuhmacher (→Schuster)
- **Bergbau**: Bergmann, Steinbrucharbeiter (→Gesteine), Ölbohrarbeiter (→Ölprodukte)
- **Buntmetallschmied**: Kupferschmied, Zinnschmied/Zinnwarenmacher/Britanniawarenmacher (→Zinngießer)
- **Fuhrmann**: Droschkenkutscher, Gespannführer, Lastfuhrmann, Frachtführer
- **Alchemie→Seifensieder**: Kerzenzieher, Seifensieder
- **Metzger→Talgsieder**: Talgverarbeiter
- **Schmied**: Kesselschmied, Klempner, Schlosser, Maschinenschlosser, Nagelschmied, Schraubenmacher, Feilenhauer, Werkzeugmacher

## Zensus-Gruppen mit Sonderrolle (kein WHK nötig)

- **slavery_system komplett**: alle 11 Berufe sind Geschäftsmodell-Varianten bestehender Fertigkeiten (Handel, Führung, Fuhrmann, Jäger).
- **general_unspecified**: Arbeiter, Fabrikarbeiter, Handwerkslehrling — Status, keine Fertigkeit.
- **Unternehmer-Rollen**: Bauunternehmer, Brückenbauunternehmer, Fabrikant, Buchverleger/Kartenverleger/Zeitungsverleger, Hotelkaufmann — Geschäftsinhaber, kein eigenes Handwerk (= Kaufmann + Fachfertigkeit).
- **Zu generisch**: Künstler, Gestalter, Wissenschaftler, Erfinder, Händler (ohne Ware), Führer (kontextabhängig) — keine eigene Fertigkeit, sondern Anwendung einer bestehenden.
- **Reine Hilfsarbeit**: Landarbeiter, Stallknecht, Ladenporter, Lagerarbeiter/-porter, Packer, Bote, Zeitungsausträger, Metallwerkstattarbeiter, Pochwerkarbeiter — kein Fachwissen nötig.
- **Kampfmodul-Territorium, nicht WHK**: Soldat, Heeresoffizier, Marineinfanterist, Marineoffizier — Offizier jetzt an *Militärtheorie* (Wissen) andockbar, Kommando-Ausführung bleibt Kampfmodul/*Führung*.
- **Aus military_security**: Detektiv → *Ermittlung*. Kundschafter → *Jäger*/*Überleben*. Privatwächter/Mautwächter/Brückenwächter → reiner Wachdienst, kein WHK.

## Industrialisierungs-Cluster

**Im Scope:** Eisenbahn und alles direkt Angehängte — Eisenbahnbauer (→ *Zimmerei*/*Architektur*/*Logistik*), Eisenbahnbeamter/-buchhalter (→ *Verwaltung*/*Buchhaltung*), Dampftechnik (→ *Mechanikus*), Kohle (→ *Bergbau*), Stahl (→ *Metallurgie*), Telegrafie.

**Cutoff:** Gaswerksarbeiter, Gasinstallateur, Chemiewerksarbeiter, Gummifabrikarbeiter, Düngemittelfabrikarbeiter, Telefonmitarbeiter, Straßenbahner, Nähmaschinenbediener bleiben außen vor — Setting bleibt bei Eisenbahn-Ära-Technik stehen.

---

## Änderungsprotokoll (chronologisch)

### Runde 1+2

1. Krankenpflege → kein Split, *Medizin* deckt die Spanne über den TaW-Wert ab.
2. Metallurge vs. *Metallurgie* → getrennt, wie Chemie/Alchemie.
3. Schreiber/Behördenschreiber → eigene Spez unter *Verwaltung*.
4. Industrialisierungs-Cutoff bestätigt.
5. Ermittlung/Fahndung → *Ermittlung (Spurenkunde)*, verschmilzt mit der nie gebauten "Spuren Lesen"-WHK.
6. Logistik → 3 Spez nach Transportmittel.
7. Gießerei → eigene Hauptfertigkeit *Gießer*, nicht Metallurgie-Spez.
8. Etikette vs. SSK-Kultur → beide bleiben, getrennt (siehe Abschnitt oben).
9. Weitere Wissensfächer ergänzt (Astronomie, Geschichte, Sprachwissenschaft, Biologie, Theologie).

### Runde 3

Zweite Datenquelle: eine Liste echter Charakterbogen-Einträge, abgeglichen gegen `whk.jsonl`.

**Schon durch den Entwurf abgedeckt (nur Namensabgleich):** Mathematik/Geschichte/Etikette/Physik (gleicher Name), Schifffahrt (→ *Seefahrt*), Tierkunde (→ *Biologie→Zoologie*), Juristik (→ *Rechtskunde*), Medizin (TaW deckt die Spanne), Stoßgebet/Ritual (→ *Geweihte*), Überleben→Wald (bestehend).

**Außerhalb des WHK-Scope:** EH Sp Schlagwaffen/Schusswaffen — Kampf-Spezialisierungen, gehören ins Kampfmodul.

**Entscheidungen:**

1. Verhandeln → kein neuer Fund, dieselbe Fertigkeit wie *Überzeugen* (Grundfertigkeit) unter anderem Spielernamen.
2. Geologie, Geografie → neue Hauptfertigkeiten, siehe Gesamttabelle.
3. Luftschiffe → neue HF *Luftschifffahrt*. Weltenbau-Klärung: magisch angetrieben, von einem Ballon getragen, Navigation wie ein Schiff, nur mit Luftströmungen statt Meeresströmungen.
4. Tanzen → neue HF *Tänzer*, Spezies-Achse (Freitext wie *Pädagoge*).
5. Strategie u. Taktik → neue HF *Militärtheorie*, Spez Strategie · Taktik (bewusst nur 2).
6. Schlösser Knacken vs. Schlosser vs. Feinmechanik/Uhrmacher → aufgelöst: **Schlösser Knacken wird eigene Grundfertigkeit**, keine WHK — reiht sich neben *Schleichen*/*Verstecken*/*Klettern* als Breitenfertigkeit ein, die grundsätzlich jeder Abenteurer üben kann, statt eine Handwerksausbildung zu brauchen. Abgrenzung zu den WHK-Nachbarn: *Schmied→Schlosser* baut/repariert Schlösser (legitimes Handwerk), *Mechanikus* liefert das Fachwissen für komplexe/feine Mechanismen (deckt u.a. *Uhrmacher* ab) — aber keins von beiden ersetzt die Übung, ein fremdes Schloss ohne Schlüssel unter Zeitdruck zu knacken (Fall-3-Test: "könnte der Meister-Schlosser für einen Tag den Einbrecher-Job übernehmen?" — nein, nicht ohne Übung). *Schlosser*/*Mechanikus* könnten als Startwert-Bonus wirken, das ist Umsetzungsdetail.
7. Magietheorie-Lücke (Dämonologie/Nekromantie/PSI), Medizin-Lücke (Erste Hilfe/Vitalpunkte), Alchemie-Lücke (Tränke/Gifte) als Funde notiert — in Runde 4 in die Gesamttabelle übernommen.
8. Altzwergisch/Altelfisch als SSK-Lücke notiert — in Runde 4 zu eigener WHK *Alte Sprachen* aufgewertet (siehe unten).

### Runde 4

1. Wildnisleben/Fischen und Gebet → beide kein neuer Fund, nur Spielernamen (Wildnisleben = *Überleben*, Gebet = *Geweihte: Wunder*).
2. Altzwergisch/Altelfisch → **keine SSK-Sprachen**, sondern eher wissenschaftlich/altertumskundlich zu erfassen (tote, nicht mehr gesprochene Sprachen) → damals zur gemeinsamen WHK *Alte Sprachen* zusammengefasst — **in Runde 5 wieder aufgeteilt**, siehe unten.
3. Geschichte → Spez-Achse auf Spezies/Kultur umgestellt (statt der ursprünglich vorgeschlagenen thematischen Achse Regional-/Militär-/Kulturgeschichte).
4. Magietheorie ergänzt um Dämonologie, Nekromantie, PSI-Theorie.
5. Abenteurerleben-Prinzip explizit gemacht (siehe eigener Abschnitt oben).
6. **Gesamt-Konsolidierung:** alle bisherigen Tabellen (Neue Hauptfertigkeiten, Neue Spezialisierungen, Charakterbogen-Funde) in eine einzige Ziel-Taxonomie-Tabelle zusammengeführt — die bisherige `whk.jsonl`-Liste gilt ab jetzt selbst nur noch als Vorschlag, gleichrangig mit allen anderen Quellen.

### Runde 5 (aktuell)

Großer Feinschliff-Durchgang an der Gesamttabelle, viele Einzelkorrekturen:

1. **Alte Sprachen aufgeteilt**: Alt-Dalkinisch verworfen, *Altzwergisch* und *Altelfisch* werden je eigene Hauptfertigkeit statt gemeinsamer Spez.
2. **Zimmerei**: *Hausbau* als vierte Spez ergänzt (Namensvorschlag, siehe offene Punkte).
3. **Anstreicher**: eigene neue Hauptfertigkeit, aus *Maurerhandwerk* wieder herausgelöst.
4. **Bootsbauer**: *Kalfatern* raus, *Galeeren* rein.
5. **Waffenschmied**: um die Kampfmodul-Waffenfamilien Hiebwaffen/Stangenwaffen/Stichwaffen ergänzt (alle außer Unbewaffnet).
6. **Rüstungsschmied**: Lederrüstungen → *Lederbearbeitung*, Stoffrüstungen → *Schneider* verschoben.
7. **Metallurgie**: Gießerei/Formguss raus (exklusiv bei *Gießer*); *Metallurge* wieder zurück in *Metallurgie* gemerged — die Theorie/Praxis-Trennung war hier doch nicht gewollt.
8. **Koch**: Rösten raus.
9. **Metzger**: Selchen raus, Trocknen rein.
10. **Mechanikus**: Pumpenbau neu, Maschinenbau/Dampftechnik in zwei Spez aufgeteilt.
11. **Barbier**: Kosmetiker neu.
12. **Luftschiffbauer**: Spez-Achse auf Militär-/Reise-/Transportschiffe umgestellt.
13. **Landwirtschaft**: Gewürze, Baumwolle, Alchemika neu.
14. **Viehwirtschaft**: Großechsen, Riesenasseln, Warge neu (Zucht/Haltung, nicht Abrichtung).
15. **Jäger**: Vögel raus, Großwild/Treibjagd/Rotwild rein.
16. **Pflanzenkunde**: DSA-Pflanzen raus (Altlast-Platzhaltername), Alchemika rein.
17. **Bergbau**: Probierkunst → Prospektion.
18. **Alchemie**: DSA-Material raus (derselbe Altlast-Platzhaltername).
19. **Kaufmann**: Wanderhandel raus.
20. **Versicherungswesen**: neue Hauptfertigkeit, Spez-Vorschlag Feuer-/Lebens-/Transportversicherung (unbestätigt).
21. **Administration**: Umbenennung von "Verwaltung/Amtswesen".
22. **Rechtskunde**: "(Jura)" aus dem Namen raus, Bürgerrecht als Spez neu.
23. **Logistik**: Schiffslogistik neu neben Hafenlogistik.
24. **Eisenbahner**: Signaler neu.
25. **Führung**: Werksleitung neu.
26. **Luftschifffahrt**: Stadtverkehr raus, Langstreckenfahrt rein.
27. **Sprachwissenschaft**: "(Linguistik)" aus dem Namen raus.
28. **Geweihte aufgeteilt**: Stoßgebet/Wunder/Ritual werden drei eigenständige, nicht spezialisierbare Hauptfertigkeiten statt einer HF mit 3 Spez.
29. **Schauspielkunst**: Umbenennung von "Schauspiel-/Vortragskunst" (Spez unverändert).
30. **Diebeskunst**: neue Hauptfertigkeit, ersetzt die Runde-3-Entscheidung "Schlösser Knacken = Grundfertigkeit" — jetzt Spez von *Diebeskunst* neben Taschendieb/Taschenspieler/Betrüger.

**Ausblick, nächster Durchgang** (noch nicht umgesetzt): Hauptfertigkeiten sollen konsequent Oberbegriffe sein, Spezialisierungen wo möglich als konkrete Berufsbezeichnungen formuliert werden statt als abstrakte Tätigkeitsfelder — Auftrag für die nächste Feinschliff-Runde über die ganze Gesamttabelle.

### Runde 6 (aktuell)

Weiterer Feinschliff, u.a. zwei Namenskonflikte und eine Strukturentscheidung:

1. **Rohbau**: löst den Zimmerei-Platzhalter "Hausbau" ab.
2. **Maler**: löst "Anstreicher" als Namen der neuen Bau-Hauptfertigkeit ab (bewusste Namensüberschneidung mit *Kunsthandwerker→Maler*, siehe Begründung).
3. **Gießer**: Munitionsherstellung neu.
4. **Metallurgie**: Legierungen → Sonderlegierungen.
5. **Koch**: Einkochen/Konservieren → Konservieren.
6. **Kunsthandwerker**: Lackierung geht in *Maler* auf.
7. **Bogenbauer**: komplett neue Hauptfertigkeit (Holzbögen/Kompositbögen/Umspannbögen) — bisher fehlender Ausrüstungsbau trotz längst bestehendem Bögen-Ausrüstungskatalog.
8. **Seefahrt**: "(Matrosenhandwerk)" raus, Flussschifffahrt neu.
9. **Medizin**: Vitalpunkte raus.
10. **Ermittlung**: "(Spurenkunde)" raus.
11. **Hauswirtschaft**: "/Dienstbotenwesen" raus.
12. **Versicherungswesen**: Spez bestätigt und um Schiffsversicherung auf vier erweitert.
13. ~~Überleben wird nicht spezialisierbar~~ → **zurückgenommen** (übersehene Konsequenz für die Geländeschwierigkeit-Abbildung). Die 8 Gelände-Spez bleiben unverändert bestehen.

### Runde 7 (aktuell)

Die drei "Weiterhin offene Punkte" aus Runde 6 abgearbeitet:

1. **SSK-Modifikator**: Mechanismus korrigiert von multiplikativ (×1/×1,1) auf **festen additiven Modifikator** — Recherche im Engine-Code und in `Proben v2.0.md` bestätigt, dass das gesamte Proben-System durchgängig additiv ist (Erschwerung als fester Term in jeder Probenformel), ein prozentualer/multiplikativer Malus existiert nirgends im System. Konkrete Stufen festgelegt: keine Kenntnis −20 · geringe Kenntnis −10 · gute Kenntnis −5 · Muttersprache/-kultur 0 · Akademisches Niveau +3.
2. **Abenteurerleben-Prinzip**: geklärt als **reiner Fluff-/GM-Text, kein Code nötig**. WHK-Hauptfertigkeiten haben aktuell überhaupt keine Wirkungstexte im Datenmodell (bewusste Tooltip-System-Entscheidung "WHK/SSK bleiben tooltip-frei") — das Prinzip bleibt Doku-Notiz, keine neue Wirkungstext-Spalte.
3. **Berufsbezeichnungen-Pass** komplett durch, Kategorie für Kategorie (Bau, Metall, Textil/Leder, Nahrung, Sonstiges Handwerk, Natur/Landwirtschaft, Handel/Verwaltung, Führung/Reise, Medizin/Ermittlung, Verbrechen, Sozial/Kunst). Muster: wo der Zensus/die Historie einen echten Zunftberuf liefert, den nehmen; wo die Spez-Achse eigentlich Fachgebiet/Technik/Material/Gelände/Zielgruppe ist (nicht Beruf), bewusst unverändert gelassen — betrifft ganze Kategorien (**Wissenschaft**, **Magie/Klerus**) sowie einzelne Ausnahmen (Feuerwaffenbauer, Metallurgie, Bogenbauer, Instrumentenbauer/Musizieren, Fotografie, Ermittlung, Seefahrt/Luftschifffahrt/Überleben-Gelände, Etikette-Schicht-Achse, Stimmen imitieren/Abrichten-Spezies-Achse, Rechtskunde-Rechtsgebiete). Nebenbei: SSK-Zensus-Mapping korrigiert (Alchemie→Fettprodukte aufgeteilt in *Alchemie→Seifensieder* + *Metzger→Talgsieder*, siehe "Bereits sauber abgedeckt"). *Führung* um drei Militär-Kommando-Spez ergänzt (Kavallerieoffizier · Artillerieoffizier · Infanterieoffizier), schließt die in Runde 3/Fußnote [^militaertheorie] offen gelassene Lücke.
4. **Generelle Feinschliff-Runde** (alle 34 komplett neuen Hauptfertigkeiten geprüft): *Maurerhandwerk* um **Fliesenleger** ergänzt (Zensus-Lücke, siehe Fußnote), *Bankwesen* um **Hypothekenwesen** ergänzt (Western-Landspekulation-Fit). *Physik→Elektrizitätslehre* bewusst **abgelehnt** — Weltenbau-Klärung: **Elektrizität ist im Setting Magie, keine mundane Physik**. Rest der 34 HF geprüft und für solide befunden, keine weiteren Änderungen.
5. **Kategorie-Oberbegriffe-Pass geprüft und verworfen**: Vorschlag durchgespielt (Bauhandwerk/Metallhandwerk/Textilhandwerk/Lebensmittelhandwerk/Landwirtschaft passten sofort, aber Führung/Reise, Magie/Klerus, Medizin/Ermittlung, Sozial/Kunst, Verbrechen ließen sich nicht ohne künstliche Verrenkung in "...handwerk/...wissenschaft/...kunst/...wirtschaft" pressen) — User-Entscheidung: **Pass fällt weg, erste Spalte bleibt wie sie ist.**

### Runde 8 (aktuell) — Schlusskorrekturen an der Gesamttabelle

1. *Landwirtschaft* und *Pflanzenkunde*: Spez **Alchemika → Alchemistische Zutaten** (klarerer Begriff, gleicher Name wie bei *Brenner*).
2. *Kaufmann*: **Artefaktehändler → Artefakthändler** (Tippfehler-Korrektur); vier fehlende Warengruppen ergänzt (**Armbrusthändler, Rüstungshändler, Schiffsmakler, Immobilienmakler**), der generische **Makler**-Eintrag dafür gedroppt (Immobilienmakler ersetzt ihn präziser).
3. **Kategorien-Umzüge** (keine Umbenennung der Spalte selbst, nur einzelne HF verschoben): *Magietheorie* und *Medizin* von Magie/Klerus bzw. Medizin/Ermittlung nach **Wissenschaft** verschoben (beides Wissensfertigkeiten mit akademischem Charakter). *Abrichten* (bisher alleinige HF der Kategorie *Tierhaltung*) nach **Natur/Landwirtschaft** verschoben, Kategorie *Tierhaltung* damit aufgelöst. *Ermittlung* und *Diebeskunst* (bisher je alleinige HF der Kategorien *Ermittlung* bzw. *Verbrechen*) nach **Sozial/Kunst** verschoben — beide Alleingänger-Kategorien damit aufgelöst, keine Ein-HF-Kategorie mehr in der Gesamttabelle übrig.

---

## Weiterhin offene Punkte

*(aktuell keine offenen Punkte — der Kategorie-Oberbegriffe-Pass wurde in Runde 7 geprüft und verworfen, siehe Änderungsprotokoll)*

---

*Nichts hiervon ist in Code/Daten eingebaut.*

## Umsetzungshinweise (für die nächste Session)

Entwurf ist inhaltlich fertig (Runde 8), keine offenen Punkte mehr — bereit zur Umsetzung in Code/Daten. Für die Umsetzung wichtig:

1. **Quelle der Wahrheit ist die xlsx, nicht `whk.jsonl` direkt.** Aktuelle Build-Datei: `werte 0.8-claude.xlsx`, Sheet **"Werte"** (Haupttabelle, ~1639 Zeilen), Spalten `Referenz, Kategorie, Beschreibung, Abkürzung, Info, Parent, Art, Formel, Pool, Flag, Grad, Kosten, Verfuegbarkeit, Mindest-TaW, Eig-Bonus, Wirkung`. Alle WHK-Zeilen haben `Kategorie = "WHK"` (das ist nicht dasselbe wie die "Kategorie"-Spalte in der Gesamttabelle oben in diesem Dokument — die hier ist reine Doku-Gliederung, kein Datenfeld). Hauptfertigkeit-Zeilen und ihre Spezialisierungen hängen über die **`Parent`-Spalte** zusammen (Spez-Zeile referenziert den Namen ihrer Hauptfertigkeit-Zeile als Parent, siehe bestehende `->Berge` etc. unter `Überleben` als Muster).
2. **`whk.jsonl` wird generiert, nie von Hand editiert** — reine Projektion, bei jedem Lauf komplett neu geschrieben. Nach jeder xlsx-Änderung: `python scripts/generate_data_ts.py "werte 0.8-claude.xlsx"` ausführen (regeneriert `whk.jsonl` zusammen mit allen anderen Shards/`rules.json`/etc. in einem Durchgang).
3. **xlsx-Bearbeitung unter Windows**: kein LibreOffice hier — Excel-COM-Automatisierung nutzen (siehe eigene Referenz-Memory dazu), Python braucht Windows-Pfade.
4. **`whkCustomSpezialisierung.ts`** enthält nur generische, namensunabhängige Kostenformeln (SP-Kosten nach `wert`, gleiche Formel wie die festen WHK-Einträge) — für Freitext-Einträge (Pädagoge/Geschichte/Tänzer). Bei dieser Umsetzung voraussichtlich **unverändert**, da sich an den Kostenformeln nichts ändert, nur an Namen/Struktur der festen Einträge.
5. **Kosten-Tabelle für Spezialisierungen** (`WHK-Spez-Kosten`-Lookup-Sheet, SVERWEIS) ist von der Umbenennung/Umsortierung nicht betroffen — sie ist wertbasiert (TaW → SP), nicht namensbasiert.
6. Vor dem eigentlichen Import: die Gesamttabelle oben in diesem Dokument ist die vollständige Ziel-Liste aller Hauptfertigkeiten + Spezialisierungen (34 komplett neue HF, ~20 erweiterte/umbenannte, Rest unverändert) — 1:1 als Checkliste zum Abgleich mit den bestehenden `whk`-Zeilen in der xlsx verwendbar.
7. Danach prüfen, ob irgendwo im UI-Code (`views/`, `engine/`) hartcodierte WHK-Namen vorkommen, die sich durch Umbenennungen (z.B. Renamings wie Zinngerät→Zinngießer) ändern müssten — bisher nicht recherchiert, sollte zu Beginn der Umsetzungs-Session als erstes gecheckt werden.
