yfonts-otf package
==================

## Description

This bundle provides OpenType versions of the Old German fonts `yfrak’,
`ygoth’ and `yswab’ designed by Yannis Haralambous in Metafont (1990).

## Contents

* yfrak.otf, ygoth.otf, yswab.otf: the three OpenType fonts
* yfonts-otf.sty        LaTeX style file defining the three font families
* yfonts-otf.pdf        Documentation in PDF format
* yfonts-otf.ltx        LaTeX source of yfonts-otf.pdf
* Erlkonig.pdf          Example: Goethe's poem typeset with these fonts
* Erlkonig.ltx          LaTeX source of Erlkonig.pdf
* README.md             (this file)

## Installation

This package is meant to be installed automatically by TeXLive, MikTeX, etc.
Otherwise, the package can be installed under TEXMFHOME or TEXMFLOCAL, f.i.
yfonts-otf in directory  texmf-local/fonts/opentype/public/yfonts-otf/
and oldgerm-otf.sty in directory  texmf-local/tex/latex/yfonts-otf/.
Documentation files and their sources can go to directory
texmf-local/doc/fonts/public/yfonts-otf/

Don't forget to rebuild the file database (mktexlsr or so) if you install
under TEXMFLOCAL.

## License

* The three fonts are licensed under the SIL Open Font License,
Version 1.1. This license is available with a FAQ at:
http://scripts.sil.org/OFL
* The other files are distributed under the terms of the LaTeX Project
Public License from CTAN archives in directory macros/latex/base/lppl.txt.
Either version 1.3 or, at your option, any later version.

## Changes

* First public version: 0.30

* v0.40:
  Substantial changes following suggestions by Keno Wehr:
  - oldgerm-otf.sty has been renamed to yfonts-otf.sty, oldgerm-otf.sty
    is kept for compatibility; it inputs yfonts-otf.sty.
  - Ligatures features reorganised: dlig and alig features deleted,
    only rlig, liga (and hlig for ygoth only) are used.
  - Ligature tz was missing in yswab.otf, added now.
  - Hungarian Umlaut was missing in yfrak.otf and yswab.otf, added now.
  - The s variant (long/short) is chosen automatically (feature +ss11
    borrowed from Unifraktur Maguntia).
* v0.42:
  - Added characters ÀÁÄÈÉËÌÍÏÒÓÖÙÚÜ (uppercase of all available lowercase
    characters); Ä->Ae, Ö->Oe, Ü->Ue.
  - ygoth.otf: fixed right bearing of the long-s variants.
    Missing Ligatures longs_i added for the long-s and its variant.
  - yfonts-otf.sty: \char"200C deleted in \longs definition so that
    \longs\longs prints the ligature ſ_ſ.
  - Documentation fixes.
* v0.43:
  - yfrak.otf, yswab.otf: missing ligatures f_i, f_l, f_f_i, f_f_l added.
  - yswab.otf: features "cv01" and "cv02" added (variants for "!" and "?").
  - ygoth.otf: feature "Alternate=1" renamed "StylisticSet=1" as it didn't
    work with XeLaTeX.  Fixed inconsistent bearings.
* v0.50:
  - ygoth.otf: feature "StylisticSet=1" is now stand-alone (it replaces
    "StylisticSet=11" when the long-s variant is required).  
    "cv01" added for ygoth.otf (long-s -> long-s variant substitution).
  - yfrak.otf and yswab.otf: added accented glyphs for French and other
    West European languages, changed %, & and quotes (formerly from cmr).
* v0.60:
  - Feature "Alternate=1" (aliased as "StylisticSet=2" for XeLaTeX users)
    added: "A, "O, "U may be printed as Ä, Ö, Ü respectively instead of
    Ae, Oe, Ue (the default). Works for yfrak, yswab and ygoth families.
  - Accents placement tuned.
* v0.61:
  - Features "Alternate=0" and "Alternate=1" now work as intended for
    LuaLaTeX and XeLaTeX. Feature "StylisticSet=2" deleted.
  
---
Copyright 2022-2025  Daniel Flipo  
E-mail: daniel (dot) flipo (at) free (dot) fr
