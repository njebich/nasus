# Übergabe Session 6 an Session 7

## Magie-Renderer und Eingabesteuerung

- `renderSpruchmagieView` erzeugt im Kopf ein Suchfeld (`#spruchmagie-search`) und den Filter
  `#spruchmagie-nur-verfuegbare`. Jede Zauberzeile enthält `-`/`+`-Buttons und eine sichtbare
  Kostenanzeige. Für die reine Charakterbogen-Ausgabe müssen Such-/Filtereingaben und die
  Steigerungsbuttons entfallen oder über eine eigene Read-only-Variante gerendert werden.
- Die Spruchmagie-Schulgruppen sind native `<details>`; Gradblöcke werden über
  `button[data-grad-target]` auf- und zugeklappt. Diese Steuerungen verändern keine
  Charakterdaten. Session 7 kann sie als reine Darstellungsnavigation beibehalten, sofern die
  Abnahme dort Buttons zum Aufklappen zulässt, oder die Blöcke in der Read-only-Ausgabe statisch
  geöffnet rendern.
- `renderKiView` erzeugt pro Fähigkeit `-`/`+`-Steigerungsbuttons. Für
  `ki_meister_der_grundfertigkeiten` kommen zusätzlich `.ki-grundfertigkeit-pick`-Selects hinzu,
  die `onGrundfertigkeitPick` auslösen. Beides muss in der Charakterbogen-Ausgabe entfallen;
  Info-Block, Probe, Werte, Wirkungen und Dauerangaben können gemeinsam genutzt werden.
- `renderPsiView` erzeugt pro Fähigkeit `-`/`+`-Steigerungsbuttons. Info-Block und Tabellenwerte
  sind ansonsten reine Ausgabe und können gemeinsam genutzt werden.
- `renderGeweihteView` ist bereits vollständig read-only und erzeugt keine Inputs, Selects oder
  Buttons. Das Sichtbarkeits-Gate muss in Session 7 auch für den Charakterbogen-Untertab gelten.

## Zustände beim Ansichtswechsel

- Spruchmagie hält Suchtext, Verfügbarkeitsfilter, offene Schulen, offene Gradblöcke und den
  Zustand der Gesamtliste modulweit; diese Zustände bleiben beim Wechsel der Magie-Untertabs
  erhalten.
- KI-Grundfertigkeitsauswahlen und alle gesteigerten Werte stammen aus `CharacterState` und
  werden beim erneuten Rendern unverändert eingelesen. PSI- und Spruchmagiewerte stammen ebenso
  aus dem jeweils neu berechneten `ComputedSheet`.
- Geweihte fällt bei entzogenem Gate über `normalizeNavigation` innerhalb von `Magie` auf
  `Spruchmagie` zurück.
