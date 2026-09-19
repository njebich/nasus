import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'vite';

// Isolierter Speicher: verändert keine Charaktere im Browser.
const memory = new Map();
globalThis.localStorage = { getItem: k => memory.get(k) ?? null, setItem: (k,v) => memory.set(k,String(v)), removeItem: k => memory.delete(k) };
const server = await createServer({ root: process.cwd(), configFile:false, appType:'custom', server:{middlewareMode:true,hmr:false,watch:null} });
const out = 'outputs/straitmor-nahkaempfer-20260913';
try {
  const load = p => server.ssrLoadModule(`/src/${p}.ts`);
  const store = await load('state/characterStore');
  const mutations = await load('state/characterMutations');
  const files = await load('state/characterFile');
  const { GESINNUNG_TRAITS } = await load('data/gesinnung');
  const { getOrtById } = await load('state/orteStore');
  const { PREISLISTE } = await load('data/equipment/preisliste');
  const { RUESTUNG_BASIS } = await load('data/equipment/armor');
  const { inspectNpc } = await load('addins/npc/engine/npcCreation');
  const { buildNahkampfRows } = await load('views/kampf');
  const ort = getOrtById('straitmor');
  assert(ort);
  const common = {
    att_vitalitaet:4,att_glueck:3,nk_hiebwaffen:16,nk_spez_hiebwaffen_aexte:16,
    gr_menschenkenntnis:6,gr_schaetzen:4,gr_ueberzeugen:4,gr_orientierung:2,
    sf_gefahreninstinkt:2,sf_selbstbeherrschung:2,sf_ausweichen:6,
    whk_ermittlung:12,whk_rechtskunde:8,whk_etikette:8,whk_fuehrung:8,
    whk_hauswirtschaft:8,whk_ueberleben:8,whk_koch:6,whk_kaufmann:2,
    whk_spez_ermittlung_observation:8,whk_spez_ueberleben_wald:8,whk_spez_ueberleben_stadt:4,
    whk_spez_etikette_gemeinvolk:3,whk_spez_kaufmann_kraemer:2,
    ssk_sprache_orkisch:3,ssk_schrift_zwerge:2,ssk_kultur_orks:3,
  };
  const refs = ['k_ausstrahlung','g_intelligenz','g_mut','g_sinneschaerfe','g_willenskraft','k_athletik','k_geschicklichkeit','k_konstitution','k_schnelligkeit','k_staerke'];
  const purchases = [673,907,948,145,927,974,975,896,891,796,784,553,821,767,
    54,523,526,529,359,674,663,684];
  const reports = [];
  mkdirSync(out,{recursive:true});
  for (const [label,spezies,props,rm,sp,allocation] of [
    ['Indianer','Indianer',[9,9,13,12,11,17,10,15,17,17],20,6397,{nat:3,npa:3,gat:4,gpa:4,mat:1,mpa:1}],
    ['Troll','Trolle',[12,4,13,6,10,17,4,21,15,21],19,6382,{nat:3,npa:4,gat:4,gpa:3,mat:1,mpa:1}],
  ]) {
    let c = store.createCharacter(`Wache Straitmor – ${label}`,{spezies,beruf:'Wache',herkunftOrtId:ort.id,herkunftSnapshot:{name:ort.name,region:ort.region,welt:ort.welt}},'normal',false,'NSC');
    c.gesinnung = Object.fromEntries(GESINNUNG_TRAITS.map(t => [t.key,0]));
    c.gesinnungNotiz = 'Neutrale Platzhalter für den regeltechnischen Vergleich; Persönlichkeit noch nicht individuell festgelegt.';
    c.notes = 'CK Nahkämpfer, Stufe/Kreis 0. Städter; Gelände Stadt; soziale Lage Einfach. Wache, WHK Meister mit vertiefter Ausbildung, protokollierender Dienst. Beschreibender Platzhaltername. Ein Diensttag in Straitmor, Mahlzeit und 1 L Wasser mitgeführt, Nachfüllen/Essen auf der Wache. Feldflasche gefüllt: zusätzlich 1 kg Wasser, nicht im Kataloggewicht enthalten. Restbudget bleibt Bankvermögen; kein zusätzlicher Geldbeutel. Rüstung und Axt in passender Volksgröße, Gesellenarbeit, von der Stange. Vollständige Traglast offen: Waffen-/Rüstungsgewichte fehlen im Modell; RBE 0 ist kein vollständiger Lastnachweis.';
    c.npcArmorMaxBe = 0;
    c.selections = {vn_aussehen_normal:1,vn_schlaf_normal:1,talente_ruestungsmanoever_stufe_1:1,talente_ruestungsmanoever_stufe_2:1};
    for (const [i,ref] of refs.entries()) c.values[`eig_${ref}`] = props[i];
    for (const [ref,value] of Object.entries({...common,sf_ruestungsmanoever:rm})) c = mutations.setValue(c,ref,value);
    c = mutations.buyWeapon(c,5,2,5,2,2);
    const axe = c.equipment.find(e => e.family === 'weapon');
    for (const [row,zones] of [[2,['kopf','torso','arme','beine']],[5,['kopf','torso','arme','beine']],[8,['torso','arme']],[16,['torso']]]) {
      const basis = RUESTUNG_BASIS.find(b => b.sourceRow === row);
      for (const zone of zones) c = mutations.equipRuestung(c,zone,Number(basis.Lage),row,2,3);
    }
    for (const row of purchases) c = mutations.buyPreislisteItem(c,row,1);
    c = mutations.setWaffenPoolAllocation(c,'nk_pool_hiebwaffen_aexte',axe.id,allocation);
    c = mutations.addWaffenLoadout(c,'nk2h',axe.id,'');
    c = mutations.toggleWaffenLoadoutFavorite(c,c.waffenLoadouts.at(-1).id);
    const result = inspectNpc(c);
    assert.deepEqual(result.issues,[],JSON.stringify(result.issues));
    assert.equal(result.sheet.spSpent,sp);
    assert.equal(result.sheet.tapRemaining,4);
    const doc = files.createCharacterCheckpoint(c,'Vergleichscharakter Straitmor: bestätigte Endwerte, gleiche Zeughausausstattung, Versorgung für Stadtdienst.');
    const raw = files.serializeCharacterFile(doc);
    const restored = files.installCharacterFile(files.parseCharacterFile(raw));
    const reloaded = store.loadCharacter(restored.id);
    assert.deepEqual(inspectNpc(reloaded).issues,[]);
    assert.deepEqual(reloaded.values,c.values);
    assert.deepEqual(reloaded.equipment,JSON.parse(JSON.stringify(c.equipment)));
    assert.deepEqual(reloaded.ruestungSlots,JSON.parse(JSON.stringify(c.ruestungSlots)));
    assert.deepEqual(reloaded.poolAllocations,c.poolAllocations);
    writeFileSync(`${out}/${files.characterFileName(c)}`,raw);
    reports.push({name:c.name,file:files.characterFileName(c),spSpent:result.sheet.spSpent,spRemaining:result.sheet.spRemaining,tapRemaining:result.sheet.tapRemaining,dublonenSpent:result.sheet.dublonenSpent,dublonenRemaining:result.sheet.dublonenRemaining,armor:result.armor,combat:buildNahkampfRows(c,result.sheet),knownInventoryKg:purchases.reduce((sum,id)=>sum+PREISLISTE.find(p=>p.sourceRow===id).gewichtKg,0),waterKg:1,issues:result.issues});
  }
  writeFileSync(`${out}/Pruefbericht.json`,JSON.stringify({assumption:'Stadtdienst, Wasser nachfüllen; Waffen- und Rüstungsgewichte fehlen, keine vollständige Traglastfreigabe.',inventory:purchases.map(id=>PREISLISTE.find(p=>p.sourceRow===id)),characters:reports},null,2));
  console.log(JSON.stringify(reports.map(({combat,...r})=>({...r,combat:combat.filter(x=>x.equipmentId && x.equipmentId!=='unbewaffnet')})),null,2));
} finally { await server.close(); }
