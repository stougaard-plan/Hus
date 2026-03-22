-- TASK_LIBRARY: 55 husholdings- og vedligeholdelsesopgaver for Kløvervej 23

INSERT INTO tasks (title, category, frequency, season, estimated_minutes, assigned_to, child_friendly, steps, note) VALUES

-- UDENDØRS (15 opgaver)
('Slå græsplæne', 'Udendørs', 'Ugentlig', 'Forår/Sommer', 45, ARRAY['Lasse','Julie'], true,
 '["Start plæneklipperen","Klip i rækker med overlap","Tøm opsamler efter behov","Trim kanter med kanttrimmer"]',
 'Klip ikke for kort i tørre perioder'),

('Luge ukrudt i bede', 'Udendørs', 'Ugentlig', 'Forår/Sommer', 30, ARRAY['Lasse','Julie'], true,
 '["Tag handsker på","Lug med rod","Saml ukrudt i spand","Kompostér"]',
 NULL),

('Hækkeklipning', 'Udendørs', 'Månedlig', 'Forår/Sommer', 90, ARRAY['Lasse'], false,
 '["Sæt stige op","Klip top først","Klip sider i vinkel","Fej op"]',
 'Klip hæk i trapezform – bredere forneden'),

('Rive blade sammen', 'Udendørs', 'Ugentlig', 'Efterår', 45, ARRAY['Lasse','Julie'], true,
 '["Riv blade med rive","Saml i bunker","Fyld i havesæk","Kør til genbrugspladsen"]',
 NULL),

('Rens tagrender', 'Udendørs', 'Halvårlig', 'Forår/Efterår', 60, ARRAY['Lasse'], false,
 '["Sæt stige sikkert op","Fjern blade og skidt","Skyl med vandslange","Tjek nedløbsrør"]',
 'Brug handsker og sikkerhedsstige'),

('Vinterklargør havemøbler', 'Udendørs', 'Årlig', 'Efterår', 30, ARRAY['Lasse','Julie'], true,
 '["Rengør møbler","Stak og dæk til","Opbevar hynder indendørs"]',
 NULL),

('Fejning af indkørsel og terrasse', 'Udendørs', 'Ugentlig', 'Hele året', 20, ARRAY['Lasse','Julie'], true,
 '["Fej indkørsel","Fej terrasse","Fjern mos med skraber"]',
 NULL),

('Højtryksspuling af fliser', 'Udendørs', 'Årlig', 'Forår', 120, ARRAY['Lasse'], false,
 '["Tilslut højtryksrenser","Spul fliser systematisk","Spul terrasse","Ryd op"]',
 'Lej højtryksrenser hvis nødvendigt'),

('Klip og vedligehold buske', 'Udendørs', 'Kvartalsvis', 'Forår/Sommer', 60, ARRAY['Lasse'], false,
 '["Beskær døde grene","Form buske","Saml affald","Kompostér"]',
 NULL),

('Rens og olie træterrasse', 'Udendørs', 'Årlig', 'Forår', 180, ARRAY['Lasse'], false,
 '["Rengør terrasse grundigt","Lad tørre 24 timer","Påfør terrasseolie med rulle","Lad tørre"]',
 'Brug UV-beskyttende olie'),

('Tjek og reparer hegn', 'Udendørs', 'Årlig', 'Forår', 60, ARRAY['Lasse'], false,
 '["Inspicér alle sektioner","Udskift løse brædder","Tjek stolper for råd","Mal/bejds ved behov"]',
 NULL),

('Plant forårsblomster', 'Udendørs', 'Årlig', 'Forår', 60, ARRAY['Lasse','Julie'], true,
 '["Vælg planter","Grav huller","Plant og vand grundigt","Læg barkflis"]',
 NULL),

('Vand have i tørkeperioder', 'Udendørs', 'Daglig', 'Sommer', 20, ARRAY['Lasse','Julie'], true,
 '["Vand tidligt morgen eller sen aften","Fokusér på bede og nyplantede","Undgå at vande græsplæne"]',
 'Brug regnvand fra tønde hvis muligt'),

('Snerydning', 'Udendørs', 'Ved behov', 'Vinter', 30, ARRAY['Lasse'], false,
 '["Ryd indkørsel","Ryd fortov","Salt ved glat føre"]',
 'Kommunal pligt at rydde fortov'),

('Gødskning af græsplæne', 'Udendørs', 'Kvartalsvis', 'Forår/Sommer/Efterår', 30, ARRAY['Lasse'], false,
 '["Vælg gødning efter sæson","Spred jævnt med spreder","Vand efter"]',
 'Forårsgødning i april, sommergødning i juni, efterårsgødning i september'),

-- INDENDØRS (15 opgaver)
('Støvsugning hele huset', 'Indendørs', 'Ugentlig', 'Hele året', 45, ARRAY['Lasse','Julie'], true,
 '["Start på 1. sal","Tag alle rum","Støvsug under møbler","Tøm støvsuger"]',
 NULL),

('Gulvvask', 'Indendørs', 'Ugentlig', 'Hele året', 30, ARRAY['Lasse','Julie'], true,
 '["Støvsug først","Vask med gulvmoppe","Start bagerst i rummet","Lad tørre"]',
 'Brug pH-neutralt rengøringsmiddel'),

('Rengøring af badeværelser', 'Indendørs', 'Ugentlig', 'Hele året', 30, ARRAY['Julie','Lasse'], false,
 '["Rengør toilet","Skrub brusekabine","Vask håndvask og spejl","Vask gulv"]',
 NULL),

('Aftørring af køkkenbordplader', 'Indendørs', 'Daglig', 'Hele året', 5, ARRAY['Lasse','Julie'], true,
 '["Ryd bordplade","Sprøjt rengøringsmiddel","Tør af med klud"]',
 NULL),

('Rengør ovn', 'Indendørs', 'Månedlig', 'Hele året', 45, ARRAY['Lasse','Julie'], false,
 '["Fjern riste","Sprøjt ovnrens","Lad virke 30 min","Skrub og tør af"]',
 'Brug selvrensefunktion hvis tilgængelig'),

('Afkalkning af vandhaner og brusehoved', 'Indendørs', 'Kvartalsvis', 'Hele året', 30, ARRAY['Lasse','Julie'], false,
 '["Fjern brusehoved","Læg i eddikeopløsning","Skrub vandhaner","Skyl og monter"]',
 NULL),

('Vask vinduer indvendig', 'Indendørs', 'Kvartalsvis', 'Hele året', 60, ARRAY['Lasse','Julie'], true,
 '["Bland vinduesmiddel","Vask med svamp","Tør med skraber","Tør karme af"]',
 NULL),

('Tjek røgalarmer og skift batteri', 'Indendørs', 'Halvårlig', 'Hele året', 15, ARRAY['Lasse'], true,
 '["Test alle alarmer","Skift batterier","Notér dato"]',
 'Skift ved sommertid/vintertid-skift'),

('Rengør køleskab og fryser', 'Indendørs', 'Månedlig', 'Hele året', 30, ARRAY['Julie','Lasse'], false,
 '["Tøm indhold","Vask hylder","Tjek udløbsdatoer","Sæt tilbage"]',
 NULL),

('Rens afløb', 'Indendørs', 'Kvartalsvis', 'Hele året', 15, ARRAY['Lasse'], false,
 '["Fjern synligt hår/skidt","Hæld afløbsrens i","Lad virke","Skyl med varmt vand"]',
 'Forebyg tilstopning med filter i afløb'),

('Vask sengetøj', 'Indendørs', 'Ugentlig', 'Hele året', 15, ARRAY['Lasse','Julie'], true,
 '["Skift lagner og dynebetræk","Vask ved 60°C","Tør og fold"]',
 NULL),

('Afstøvning af hylder og møbler', 'Indendørs', 'Ugentlig', 'Hele året', 20, ARRAY['Lasse','Julie'], true,
 '["Start fra top","Brug fugtig klud","Tag lamper og reoler","Ryd op undervejs"]',
 NULL),

('Rengør emhætte og filter', 'Indendørs', 'Kvartalsvis', 'Hele året', 20, ARRAY['Lasse'], false,
 '["Fjern fedtfilter","Læg i opvaskemaskine eller vask i hånd","Tør emhætte af","Monter filter"]',
 NULL),

('Rengør vaskemaskine', 'Indendørs', 'Månedlig', 'Hele året', 10, ARRAY['Julie','Lasse'], false,
 '["Kør tom vask ved 90°C","Tilsæt maskinrens","Tør gummiliste","Lad låge stå åben"]',
 NULL),

-- VVS OG TEKNIK (10 opgaver)
('Aflæs el-, vand- og varmemåler', 'VVS og Teknik', 'Månedlig', 'Hele året', 10, ARRAY['Lasse'], true,
 '["Aflæs elmåler","Aflæs vandmåler","Aflæs varmemåler","Notér i app"]',
 'Sammenlign med tidligere forbrug'),

('Tjek vandtryk', 'VVS og Teknik', 'Kvartalsvis', 'Hele året', 10, ARRAY['Lasse'], false,
 '["Tjek manometer på varmtvandsbeholder","Normalt: 1-3 bar","Kontakt VVS ved afvigelse"]',
 NULL),

('Udluftning af radiatorer', 'VVS og Teknik', 'Årlig', 'Efterår', 30, ARRAY['Lasse'], false,
 '["Skru udluftningsventil op","Lad luft slippe ud til vand kommer","Luk ventil","Tjek vandtryk i kedel"]',
 'Gør det inden fyringssæsonen'),

('Rens varmeveksler/kedel (serviceaftale)', 'VVS og Teknik', 'Årlig', 'Efterår', 15, ARRAY['Lasse'], false,
 '["Ring til VVS-firma","Book årligt eftersyn","Vær hjemme ved besøg"]',
 'Serviceaftale med lokalt VVS-firma'),

('Tjek fuger i badeværelse', 'VVS og Teknik', 'Halvårlig', 'Hele året', 15, ARRAY['Lasse'], false,
 '["Inspicér silikone-fuger","Tjek flisefuger","Notér revner eller misfarvning","Planlæg omfugning ved behov"]',
 NULL),

('Rens gulvafløb i bryggers', 'VVS og Teknik', 'Kvartalsvis', 'Hele året', 10, ARRAY['Lasse'], false,
 '["Fjern rist","Rens for snavs","Hæld vand i vandlås","Sæt rist på"]',
 'Forhindrer lugtgener'),

('Tjek og rens ventilationsriste', 'VVS og Teknik', 'Halvårlig', 'Hele året', 20, ARRAY['Lasse'], false,
 '["Find alle ventilationsriste","Støvsug riste","Vask med sæbevand","Monter igen"]',
 NULL),

('Test HPFI-relæ', 'VVS og Teknik', 'Kvartalsvis', 'Hele året', 5, ARRAY['Lasse'], false,
 '["Tryk på testknap på HPFI","Tjek at strømmen slår fra","Tænd igen"]',
 'Livsvigtig sikkerhedstest'),

('Tjek vandtilslutninger for dryp', 'VVS og Teknik', 'Halvårlig', 'Hele året', 15, ARRAY['Lasse'], false,
 '["Tjek under køkkenvask","Tjek under håndvask","Tjek ved vaskemaskine/opvaskemaskine","Stram eller udskift ved dryp"]',
 NULL),

('Eftersyn af eltavle', 'VVS og Teknik', 'Årlig', 'Hele året', 10, ARRAY['Lasse'], false,
 '["Åbn eltavle","Tjek at ingen sikringer er sprunget","Tjek for varmgang","Luk tavle"]',
 'Kontakt elektriker ved problemer'),

-- SÆSON (10 opgaver)
('Forårsklargøring af have', 'Sæson', 'Årlig', 'Forår', 120, ARRAY['Lasse','Julie'], true,
 '["Ryd vinterdækning","Beskær roser og buske","Gødsk bede","Så græs i bare pletter"]',
 'Start når frosten er overstået'),

('Efterårsklargøring af have', 'Sæson', 'Årlig', 'Efterår', 120, ARRAY['Lasse','Julie'], true,
 '["Plant forårsløg","Beskær stauder","Dæk sarte planter","Ryd blade"]',
 NULL),

('Vinterklargøring af hus', 'Sæson', 'Årlig', 'Efterår', 60, ARRAY['Lasse'], false,
 '["Tjek vinduestætning","Isolér udendørs vandhaner","Tjek tagsten","Rens tagrender"]',
 'Gør klar inden november'),

('Sommerklargøring af terrasse', 'Sæson', 'Årlig', 'Forår', 60, ARRAY['Lasse','Julie'], true,
 '["Rengør havemøbler","Sæt parasol op","Klargør grill","Plant krydderurter i krukker"]',
 NULL),

('Rens og klargør grill', 'Sæson', 'Årlig', 'Forår', 30, ARRAY['Lasse'], false,
 '["Rens rist grundigt","Tjek gastilslutning","Tjek slange for revner","Tænd og test"]',
 'Udskift gasslange hvert 5. år'),

('Klargør julelys og dekoration', 'Sæson', 'Årlig', 'Vinter', 45, ARRAY['Lasse','Julie'], true,
 '["Test lyskæder","Sæt udendørs lys op","Dekorér indendørs","Sæt adventskrans op"]',
 NULL),

('Nedtag julepynt', 'Sæson', 'Årlig', 'Vinter', 30, ARRAY['Lasse','Julie'], true,
 '["Tag udendørs lys ned","Pak pynt forsvarligt","Opbevar i kasser","Sæt på loft"]',
 NULL),

('Grundig forårsmain-rengøring', 'Sæson', 'Årlig', 'Forår', 240, ARRAY['Lasse','Julie'], false,
 '["Vask alle vinduer","Rengør bag møbler","Vask gardiner","Rens tæpper","Ryd skabe ud"]',
 'Fordel over en weekend'),

('Tjek og opfyld havelager', 'Sæson', 'Årlig', 'Forår', 30, ARRAY['Lasse'], false,
 '["Tjek gødning","Tjek frø","Tjek plantejord","Bestil manglende"]',
 NULL),

('Klargør vinteropbevaring af haveredskaber', 'Sæson', 'Årlig', 'Efterår', 30, ARRAY['Lasse'], false,
 '["Rens alle redskaber","Olier metaldele","Opbevar tørt","Tøm benzin fra maskiner"]',
 NULL),

-- ADMIN (5 opgaver)
('Tjek forsikringspolice', 'Admin', 'Årlig', 'Hele året', 30, ARRAY['Lasse','Julie'], false,
 '["Gennemgå husforsikring","Tjek dækning","Sammenlign priser","Opdatér ved behov"]',
 'Gør det ved årsskiftet'),

('Gennemgå energiforbrug', 'Admin', 'Kvartalsvis', 'Hele året', 20, ARRAY['Lasse'], false,
 '["Tjek el-forbrug","Tjek vandforbrug","Sammenlign med sidste år","Identificér besparelser"]',
 NULL),

('Opdatér husjournal/vedligeholdelseslog', 'Admin', 'Månedlig', 'Hele året', 15, ARRAY['Lasse','Julie'], false,
 '["Registrér udførte opgaver","Notér materialer brugt","Opdatér næste planlagte dato"]',
 'Brug HusApp til registrering'),

('Planlæg næste kvartals opgaver', 'Admin', 'Kvartalsvis', 'Hele året', 30, ARRAY['Lasse','Julie'], false,
 '["Gennemgå kommende opgaver","Fordel ansvar","Sæt datoer","Bestil materialer"]',
 NULL),

('Indhent tilbud på større vedligehold', 'Admin', 'Ved behov', 'Hele året', 30, ARRAY['Lasse'], false,
 '["Identificér behov","Kontakt 2-3 håndværkere","Sammenlign tilbud","Vælg og book"]',
 'Altid minimum 2 tilbud');
