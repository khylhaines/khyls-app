/* =========================================================
   OLD TOM — BARROW HISTORIAN
   Barrow Quest / LEOIDS
   =========================================================
   A wise storyteller from Barrow. Speaks at location pins.
   Three tiers of content: kid / teen / adult.
   Call speak(pinId, tier) to get Tom's words for any pin.
=========================================================  */

/* =========================================================
   TOM'S LINES — ALL PINS
   Format: { kid, teen, adult }
========================================================= */

const TOM_LINES = {

  // ===================== TOWN =====================

  town_hall_clock: {
    kid: "This clock has been telling Barrow the time for over a hundred years! Before phones and watches, people used to look up at this tower to know when to start work or come home for tea.",
    teen: "The Town Hall was built when Barrow was one of the fastest growing towns in England. In the 1870s this place was barely a village — by the time this clock went up it was a proper industrial town with thousands of workers pouring in from all over.",
    adult: "Barrow's Town Hall stands as a monument to Victorian civic ambition. Built as the town exploded from a small settlement into a major industrial centre in just a few decades, it was a statement of permanence and authority in a place that had reinvented itself almost overnight. The clock tower became the heartbeat of the town — workers, traders, and families all oriented their days around it.",
  },

  custom_house: {
    kid: "This old building used to be where the government checked everything coming in and out of the docks. Like a checkpoint for all the ships! If you wanted to bring goods into Barrow by sea, you had to stop here first.",
    teen: "The Custom House controlled the flow of trade through Barrow's docks in the Victorian era. Everything — iron ore, steel, timber, coal — had to be logged and taxed here. It was a sign that Barrow wasn't just an industrial town, it was a trading port too.",
    adult: "The Custom House is one of the older surviving civic buildings near the dock area. In Barrow's peak trading years, it served as the administrative gateway for all commercial maritime traffic. The port handled significant volumes of iron ore imported from Cumberland and beyond, and the Custom House was the regulatory hub that kept that trade orderly and taxed. It speaks to a dimension of Barrow's history that often gets overshadowed by the shipbuilding story.",
  },

  barrow_library: {
    kid: "Libraries might seem normal now but this one was really special when it opened. Before it was built, most working people in Barrow couldn't afford to buy books. This library meant everyone — even kids with no money — could read and learn.",
    teen: "Barrow Library was part of the great Victorian push to educate working people. Towns like Barrow, built on hard industrial labour, needed educated workers as industry got more complex. Libraries like this were built with that in mind — not charity, but investment in the workforce and in civic life.",
    adult: "The library represents the progressive civic culture that took root in Barrow during its industrial peak. Funded partly through the philanthropy typical of the era and partly through rates and public investment, it was part of a deliberate effort to build not just factories and docks, but a functioning, educated society. Barrow attracted a transient industrial population and institutions like this were essential to making it a permanent community rather than a temporary boomtown.",
  },

  dalton_road_clock: {
    kid: "Another clock! Barrow really loved its clocks didn't it? This one stands on Dalton Road, which has been one of the main shopping streets in Barrow for a very long time. Can you imagine what the shops here looked like a hundred years ago?",
    teen: "Dalton Road has been Barrow's main commercial street for well over a century. The clock is a small but telling piece of Victorian street furniture — put there to help coordinate the lives of thousands of workers and shoppers who passed through every day. Before mobile phones, public clocks weren't decoration. They were infrastructure.",
    adult: "The Dalton Road Clock is a remnant of Victorian civic investment in public space. In a town built for industrial productivity, regulating time was a serious matter. Workers' shifts, market hours, and transport connections all depended on a shared sense of time, and public clocks were the mechanism that made that possible. Dalton Road itself tells the longer story of Barrow's commercial development alongside its industrial one.",
  },

  the_forum: {
    kid: "The Forum is where Barrow goes to see shows, concerts, and events. But long before it was here, people in Barrow had to travel to bigger cities to see proper entertainment. Having a big venue like this was a really big deal for the town.",
    teen: "The Forum represents Barrow's investment in culture and community life. Industrial towns often get defined entirely by their factories, but the people who lived here needed more than work. Venues like this were central to the social fabric — dances, concerts, political meetings, boxing matches. They were where the community came together outside of the workplace.",
    adult: "The Forum continues a long tradition of civic entertainment venues in Barrow. The town has always had a strong working-class culture of communal leisure — clubs, bands, sporting events, theatre. In a town that was built rapidly and could easily have remained merely functional, the presence of performance and entertainment venues speaks to the ambitions of the community that settled here. Culture was never an afterthought in Barrow.",
  },

  market_hall: {
    kid: "Markets have been at the heart of Barrow since the town was small. Before big supermarkets, everyone came to places like this to buy their food and goods. Imagine hundreds of stalls with butchers, bakers, and traders all shouting out their prices!",
    teen: "The Market Hall was central to daily life in Barrow for generations. For working-class families, this was where wages got stretched as far as possible. Market traders knew their customers by name. It was a social space as much as a commercial one — the place you'd bump into your neighbours and catch up on the news.",
    adult: "Markets have been a constant in Barrow's civic life from its earliest days of rapid expansion. Unlike the formal Victorian institutions — the library, the town hall — the market was the organic, daily heartbeat of the community. It provided affordable food and goods to thousands of working families and served as one of the few genuinely mixed social spaces where people of all backgrounds met on roughly equal terms. The tradition continues today, though transformed.",
  },

  victoria_hall: {
    kid: "Victoria Hall has been a place for concerts and shows in Barrow for a really long time. It's named after Queen Victoria, who was queen when Barrow was growing fastest. Lots of famous performers have played in halls like this over the years.",
    teen: "Victoria Hall represents the Victorian era's belief in civic culture. Named after the queen whose reign coincided with Barrow's explosive growth, it was part of a broader movement to give working communities access to the arts. Music halls, lecture halls, and theatres weren't luxuries — they were seen as morally and socially beneficial for working people.",
    adult: "Victoria Hall is one of several civic performance spaces built during Barrow's Victorian peak. The town's rapid industrialisation brought not just wealth but also the social tensions of mass migration and overcrowding. Civic institutions like this were deliberately funded and built as instruments of social cohesion — shared cultural spaces that could build community identity in a town that had been assembled from scratch in a remarkably short time.",
  },

  nan_tait_centre: {
    kid: "This arts centre is named after Nan Tait, a woman who worked really hard to make arts and culture available to everyone in Barrow. It's a place where people come to make things, see things, and be creative.",
    teen: "The Nan Tait Centre carries the name of someone who dedicated herself to making culture accessible in Barrow. Arts centres like this don't just exist for enjoyment — they're places where communities process their history, express their identity, and imagine their future. Barrow's industrial past is always present in the art made here.",
    adult: "Named after Nan Tait, the centre represents the ongoing tradition of community arts in Barrow. The town has a long history of amateur and professional artistic practice — brass bands, dramatic societies, painters, writers — running parallel to its industrial identity. The centre continues that tradition in a contemporary form, providing a space where Barrow's community can engage creatively with their own story.",
  },

  spirit_of_barrow_mural: {
    kid: "This big painting tells the story of Barrow! Murals like this are a way for a town to show what it's proud of — the ships, the workers, the families, and the history that made this place what it is.",
    teen: "Street art and murals are one of the most honest forms of local history. They're not commissioned by governments or historians — they come from the community's own sense of identity. The Spirit of Barrow mural captures something that official histories sometimes miss: the human story of the people who built and lived in this place.",
    adult: "Public murals occupy an interesting space in the representation of local history. The Spirit of Barrow mural reflects the town's own self-understanding — its industrial pride, its community resilience, its complex identity as a place that has always been defined by what it makes. Unlike formal civic monuments, murals are living things, subject to reinterpretation and change, and they speak to how communities narrate themselves at a given moment.",
  },

  // ===================== MEMORIALS =====================

  cenotaph_core: {
    kid: "This cenotaph is a monument to the people from Barrow who went to war and didn't come home. Every town in Britain has one. On Remembrance Day, people come here to say thank you and to make sure those people are never forgotten.",
    teen: "Barrow's Cenotaph commemorates the men and women from this town who died in both World Wars. Barrow sent thousands to fight — workers from the shipyards, young men from the terraced streets, people from every background. The cenotaph is the focal point for remembrance, but the real cost of those wars is written into the family histories of almost every person in this town.",
    adult: "The Cenotaph stands as the principal memorial to Barrow's war dead. The town's contribution to both World Wars was substantial — particularly given the strategic significance of its shipbuilding industry. Many of the men commemorated here had built the very ships that fought in those conflicts. The memorial is also a reminder of the social transformation brought by the wars: the loss of a generation, the entry of women into the workforce, and the political changes that followed. Remembrance in Barrow has always carried particular weight.",
  },

  henry_schneider_statue: {
    kid: "Henry Schneider was one of the most important men in Barrow's history. He helped bring iron and steel making to Barrow and helped turn it from a tiny village into a big industrial town. Without people like him, Barrow wouldn't exist the way it does today.",
    teen: "Henry Schneider was one of the driving forces behind Barrow's industrial transformation in the Victorian era. He identified the iron ore deposits that could be combined with local coal to drive steelmaking, and he had the vision and capital to make it happen. His statue here is a reminder that cities don't just appear — they're built by specific people with specific ambitions, and Barrow's story is tied closely to his.",
    adult: "Henry Schneider's statue marks one of the key figures in Barrow's Victorian industrial revolution. Schneider, along with partners including Josiah Evans, developed the iron ore and steel industries that defined the town's early identity. His business interests were central to the establishment of Barrow as a significant industrial centre, and his partnership with the Furness Railway and later ventures shaped the physical and economic geography of the town. The statue is an acknowledgement of the role private capital played in building what became a working-class town.",
  },

  james_ramsden_statue: {
    kid: "James Ramsden was one of the builders of modern Barrow. He helped plan the streets, the docks, and many of the important buildings. He was almost like the town's designer — he helped decide what Barrow would look like and how it would work.",
    teen: "James Ramsden was Barrow's first mayor and one of the key figures in turning a railway and industrial settlement into a planned town. He oversaw the development of streets, civic buildings, and the infrastructure that made Barrow function. In many ways he was the town's chief executive as much as its mayor — hands-on in a way that modern officials rarely are. His legacy is literally built into the structure of the place.",
    adult: "Ramsden's statue stands near some of the civic institutions he was instrumental in creating. As general manager of the Furness Railway and later as Barrow's first mayor, he exercised extraordinary influence over the physical and administrative development of the town. His vision was of a planned industrial town built on rational principles — a grid of streets, proper civic buildings, clear separation of industrial and residential zones. Not all of it survived subsequent generations of development, but the bones of his plan are still visible in the town's layout.",
  },

  emlyn_hughes_statue: {
    kid: "Emlyn Hughes was a famous footballer from Barrow who played for Liverpool and England. He was one of the best players of his generation and his statue here shows how proud Barrow is of him. Even if football isn't your thing, it's amazing that someone from this town became world famous.",
    teen: "Emlyn Hughes grew up in Barrow and went on to captain Liverpool during one of their greatest ever periods, winning multiple league titles and European Cups. He also captained England. For a town like Barrow, producing a player of that calibre and that era is remarkable. His statue is a point of genuine local pride — not corporate civic branding, but real community affection for one of their own.",
    adult: "Emlyn Hughes represents the other side of Barrow's story — not the industrial and civic history, but the human stories of individuals who came from this working-class town and achieved extraordinary things. Hughes captained Liverpool through the dominant period of the late 1970s and was a genuine national figure. His connection to Barrow is a reminder that industrial towns produce culture and character as well as ships and steel, and that local identity is shaped by its people as much as its industries.",
  },

  submarine_memorial: {
    kid: "This memorial is for the people who served on submarines. Submarines are incredibly dangerous vessels to work on — they travel deep underwater for weeks at a time. Many of them were built right here in Barrow. This memorial honours the people who served on them.",
    teen: "The Submarine Memorial connects directly to Barrow's identity as the UK's primary submarine builder. The men who crewed these vessels lived and worked in extraordinary conditions — confined, pressurised, deep underwater, often for months. Many were from naval towns and working-class backgrounds. The memorial acknowledges both their service and the unique bond between the town that built the submarines and the people who sailed in them.",
    adult: "The Submarine Memorial occupies a specific and significant place in Barrow's civic memory. The town has built submarines since the late Victorian era — the first British submarine, Holland 1, was built here by Vickers in 1901. The memorial reflects the intimate relationship between the shipyard and the Royal Navy's submarine service, a relationship that has defined Barrow's strategic importance for over a century. It also acknowledges the particular dangers of submarine service — losses in both World Wars, training accidents, and the psychological demands of extended underwater deployment.",
  },

  lifeboat_monument: {
    kid: "This monument is for the brave people who go out in lifeboats to rescue others at sea. Imagine going out in a small boat in a huge storm to save people from a sinking ship. These are some of the bravest people you'll ever hear about.",
    teen: "Lifeboat crews have always been volunteers — ordinary people from coastal communities who go out in the worst conditions imaginable to save strangers. The waters around Barrow and the Furness coast are notoriously difficult, with strong tides, shifting sands, and unpredictable weather. The monument remembers those who served and those who didn't come back.",
    adult: "The lifeboat tradition along the Furness coast and in Barrow harbour reflects the practical realities of life in a maritime and industrial port town. The estuary and surrounding waters have claimed many lives over the centuries, and the lifeboat service developed in response to that constant danger. The monument is a recognition of voluntary service at its most demanding — crews who risk their lives for no material reward, drawing on a tradition of maritime community responsibility that goes back generations.",
  },

  // ===================== DOCKS & SUBMARINES =====================

  dock_museum_anchor: {
    kid: "This huge anchor sits outside the Dock Museum, which tells the whole story of how Barrow grew from a tiny place into one of the most important shipbuilding towns in the world. Barrow built warships, submarines, and ocean liners — some of the biggest and most important ships ever made.",
    teen: "The Dock Museum tells Barrow's shipbuilding story, and this anchor is a fitting symbol for it. Barrow went from a small fishing settlement to the UK's most important submarine builder in the space of a few generations. The story is one of extraordinary industrial ambition, immigrant labour, engineering innovation, and a community built literally on the water.",
    adult: "The anchor outside the Dock Museum is a physical link to Barrow's maritime and industrial heritage. The museum itself charts the development of shipbuilding in the town from the mid-Victorian period onwards, through Vickers and its various corporate successors to BAE Systems today. The anchor represents not just the machinery of shipbuilding but the whole complex ecosystem of trades, skills, and communities that grew up around the yards — riveters, welders, engineers, draughtsmen, and the families who depended on them.",
  },

  bae_main_gate: {
    kid: "Behind this gate is one of the most important shipbuilding factories in the whole country. This is where Britain's submarines are built. The submarines in the Royal Navy — the ones that patrol deep underwater — were made right here in Barrow.",
    teen: "BAE Systems at Barrow is the UK's only submarine builder and one of the most strategically important industrial sites in the country. The yard has been building warships since the 1870s — ironclads, battleships, aircraft carriers, and nuclear submarines. It's the reason Barrow exists in the form it does today, and it remains the town's largest employer.",
    adult: "The BAE Systems Barrow site represents one of the most concentrated examples of specialist industrial knowledge in Britain. The yard — formerly Vickers, then British Shipbuilders, then BAE — has built submarines continuously since 1901. It currently produces the Astute-class nuclear attack submarines and is central to the Dreadnought programme of nuclear deterrent submarines. The employment it provides, and its role in the national defence infrastructure, means Barrow's fate remains intimately tied to defence policy decisions made in Westminster and the MoD.",
  },

  graving_dock: {
    kid: "A graving dock is a special kind of dry dock where ships can be taken out of the water for repairs. They drain all the water out and suddenly you can see the whole bottom of the ship! It's like a giant bathtub that you can empty.",
    teen: "Graving docks were essential infrastructure for any serious shipbuilding or repair facility. The ability to take a vessel completely out of the water allowed for inspection and repair of the hull, propeller, and rudder — work that couldn't be done while the ship was afloat. Barrow's docks were designed with this capability from the beginning, reflecting the ambition to build a proper industrial port rather than just a landing stage.",
    adult: "The graving dock is a reminder of the full scope of Barrow's original maritime infrastructure. Victorian industrial planners built not just for current capacity but for anticipated growth, and the dock facilities were designed to handle large vessels at every stage of construction, fitting-out, and maintenance. The graving dock in particular required significant civil engineering — the ability to seal, drain, and manage water pressure at scale was a serious technical achievement that reflected the ambition of the original developers.",
  },

  dock_museum_submarine: {
    kid: "This is a real submarine that you can go inside! Submarines are the stealthiest vehicles ever made. They can travel underwater for months without anyone knowing where they are. And Barrow is where most of Britain's submarines have been built.",
    teen: "Standing next to a real submarine brings home just how extraordinary these machines are. They're essentially self-contained worlds — capable of operating independently underwater for extended periods, carrying enough fuel, food, air, and weapons to sustain a crew for months. The technology involved is some of the most complex ever produced, and much of it was developed and refined right here in Barrow.",
    adult: "The submarine exhibit represents the pinnacle of Barrow's industrial achievement. Submarine construction requires the integration of nuclear engineering, hydrodynamics, weapons systems, life support, and propulsion in a single extraordinarily complex hull. The expertise to do this has been accumulated in Barrow over more than a century, making the local workforce arguably the most specialised in the world for this kind of work. The submarine on display is a tangible connection to that legacy and to the thousands of workers whose skills made it possible.",
  },

  bae_the_bridge: {
    kid: "This bridge connects Barrow Island to the mainland. Barrow Island is where a lot of the shipbuilding work happens. Workers have been crossing bridges like this to get to the yards for over a hundred years.",
    teen: "Barrow Island was developed specifically as an industrial zone — the channel separating it from the mainland made it ideal for dock construction and heavy industry. The bridge connecting it to the town proper has been a daily crossing for generations of shipyard workers. The geography of Barrow — with its island, its channel, its docks — was deliberately shaped by the industrial developers of the Victorian era.",
    adult: "Barrow Island's separation from the mainland made it the natural location for the most intensive industrial development. The channel could be used for dock access and provided a degree of separation between heavy industry and residential areas. The bridge has always been a symbolic as well as practical connection — the point where the town and the yard meet, where workers cross from their homes into one of the most security-sensitive industrial environments in the country.",
  },

  // ===================== INDUSTRIAL =====================

  salthouse_mills: {
    kid: "Salthouse Mills is an old industrial building near the water. Mills and factories like this were where the work happened in Barrow's early days — grinding, processing, making things from raw materials. The whole area around here used to be full of industrial noise and smoke.",
    teen: "The Salthouse area reflects Barrow's pre-shipbuilding industrial history. Before the docks expanded and the shipyards came to dominate, the town had a more mixed industrial base. Salt, milling, and small-scale processing were part of the earlier economy. As the shipyards grew, everything else gradually became secondary.",
    adult: "Salthouse Mills is a surviving fragment of Barrow's pre-Victorian industrial landscape. The area around the Salthouse and the early dock development represents the transitional period between the small trading and milling settlement and the purpose-built industrial town. As the Furness Railway and the Devonshire Duke's development interests reshaped the area from the 1840s onwards, these older industrial traces were gradually absorbed into a new urban geography built around steel and ships.",
  },

  hindpool_tiger_core: {
    kid: "The Hindpool Tiger is a famous piece of local legend. The Hindpool area was once one of the most industrial parts of Barrow — full of steelworks and foundries. People who worked there were known for being tough and hard-working, just like a tiger.",
    teen: "The Hindpool area was at the heart of Barrow's steelmaking industry. The steelworks here were some of the largest in the country at their peak, employing thousands of men in extraordinarily hard conditions. The 'tiger' nickname speaks to the reputation of the area and its workers — fierce, industrial, proud of their toughness.",
    adult: "The Hindpool steelworks were central to Barrow's industrial identity from the 1860s onwards. At their peak they produced millions of tons of steel rails that were exported across the British Empire and beyond, helping to build railways on every inhabited continent. The works eventually declined as steel production consolidated elsewhere and cheaper foreign competition increased, but the Hindpool area remained a key industrial zone. The legacy of the steelworks is still present in the landscape and in local memory.",
  },

  old_brickworks: {
    kid: "Every single building in old Barrow needed bricks, and this is where many of them were made. Brickworks were really important in growing towns — you can't build houses and factories without them. The workers here were making the building blocks of the whole town.",
    teen: "Brickworks were essential infrastructure in any rapidly expanding Victorian town. Barrow grew at extraordinary speed in the 1860s and 1870s, requiring enormous quantities of building materials. Local brickworks helped supply that demand, contributing to the distinctive built character of the town's Victorian terraces and civic buildings. The industry was labour-intensive and often employed workers — including women and children in the early period — in demanding conditions.",
    adult: "The brickworks represent the supporting industrial ecosystem that enabled Barrow's rapid expansion. The town's growth between 1860 and 1880 was among the fastest of any urban settlement in Victorian Britain, and the demand for building materials was intense. Local brick production helped keep construction costs manageable and ensured a degree of consistency in the built fabric of the new town. The clay geology of parts of the Furness peninsula made local production viable, and the brickworks were a significant employer before eventually being superseded by imported materials and changing construction methods.",
  },

  hawcoat_quarry: {
    kid: "Quarries are where people cut rock out of the ground to use for building. The stone from Hawcoat Quarry was used in lots of Barrow's buildings. If you look at the old stone walls and buildings around the town, some of that stone came from right here.",
    teen: "Hawcoat Quarry provided building stone for many of Barrow's Victorian structures. In a town being built from scratch at speed, local stone quarrying was economically important — it reduced the cost and logistics of importing materials. The quarry landscape also shaped the geography of this part of Barrow, leaving behind the characteristic terrain visible today.",
    adult: "Hawcoat Quarry is one of the less discussed but significant elements of Barrow's industrial geography. The extraction of building stone from sites like this contributed to the material fabric of the Victorian town. As industrialisation expanded and new building techniques emerged, the relative importance of local stone declined compared to brick and later concrete. The quarry landscape now reads primarily as a geological and recreational feature, but its history connects directly to the physical construction of the town.",
  },

  kimberly_clark_factory: {
    kid: "This big factory makes paper products — things like tissues and other everyday items. Not all of Barrow's industry is about ships! This factory has given jobs to lots of people in the area for many years.",
    teen: "Kimberly-Clark represents the diversification of Barrow's industrial base beyond shipbuilding. The town has always been dangerously dependent on a single major employer and industry, and facilities like this have been important in providing employment that doesn't depend on defence contracts. Consumer goods manufacturing brought a different kind of work to Barrow — more stable in some ways, less linked to the volatile cycles of defence spending.",
    adult: "The Kimberly-Clark facility is a significant element of Barrow's post-war industrial geography. The town's extreme dependence on shipbuilding and defence contracts has always been a structural vulnerability, and successive economic development strategies have attempted to diversify the employment base. Large-scale manufacturing in consumer goods provided a degree of balance, though Barrow has never fully escaped its reliance on the yards. The facility also represents the post-war investment in industrial infrastructure that characterised regional development policy in the mid-twentieth century.",
  },

  gas_terminals_main_gates: {
    kid: "These big gates lead to the terminals where natural gas from the sea is brought ashore. There's a huge amount of natural gas under the Irish Sea, and the pipelines that bring it to land end up near here. It's one of the most important energy sites in the UK.",
    teen: "The Rampside gas terminals are one of the most strategically significant industrial facilities in the UK, though most people outside the region barely know they exist. Gas from the Morecambe Bay fields and other Irish Sea reserves comes ashore here before being fed into the national grid. At peak production, this area supplied a substantial fraction of UK domestic gas. It represents a different kind of industrial Barrow — one connected to the North Sea energy economy rather than the traditional shipbuilding story.",
    adult: "The gas terminals at Rampside represent Barrow's connection to the UK's offshore energy infrastructure. The Morecambe Bay gas field, one of the largest ever developed in UK waters, has its onshore processing facilities in this area. At peak production the field supplied roughly a third of UK domestic gas consumption. The terminals are now supplemented by LNG facilities as the indigenous fields decline and import dependency increases. The site is a reminder that Barrow's industrial story is not just about what happened in the Victorian era — it continues to evolve in the present.",
  },

  // ===================== PARK =====================

  park_bandstand_core: {
    kid: "This bandstand has been in Barrow Park for over a hundred years. On summer weekends, brass bands used to play here and the whole park would fill with families listening to the music. Can you imagine what it sounded like?",
    teen: "The bandstand is one of the most characteristic features of Victorian park design, and Barrow's is a fine example. Brass bands were central to working-class cultural life in industrial towns — almost every factory, workplace, and community had one. The bandstand gave them a public stage and made the park a place of genuine communal leisure, not just open space.",
    adult: "Barrow Park's bandstand is a surviving piece of Victorian civic leisure infrastructure. The park itself was deliberately designed to provide working-class families with access to green space, fresh air, and organised recreation — a response to the overcrowding and poor sanitation of the rapidly expanding industrial town. The bandstand was its cultural centrepiece, hosting performances that drew hundreds of people on summer weekends. The brass band tradition it supported was deeply embedded in Barrow's industrial working culture and persists in the town today.",
  },

  park_railway_core: {
    kid: "This miniature railway is one of the most loved things in Barrow Park. Little trains that people can actually ride! It's been giving families rides around the park for decades. Barrow loves its trains — after all, the railway is a big part of how this town came to exist.",
    teen: "The miniature railway is a perfect piece of park heritage. Built for leisure rather than industry, it's a gentle echo of the full-size railways that shaped Barrow's existence. The Furness Railway was instrumental in the town's development, and the presence of a miniature version in the town's main park feels almost symbolic — the railway domesticated, made playful, made available to everyone.",
    adult: "The miniature railway in Barrow Park is part of a tradition of leisure railways that developed across British parks from the late Victorian period onwards. In Barrow, where the railway was so fundamental to the town's origin and growth, it carries particular resonance. The Furness Railway was the vehicle through which the town's industrial potential was unlocked — it brought investment, workers, and markets. The park railway transforms that serious industrial history into something joyful and accessible, which is in its own way a fitting tribute.",
  },

  boating_lake_core: {
    kid: "The boating lake has been here for a very long time, giving families a place to mess around in boats without going out to sea. On a sunny day this lake is magical. It's one of the most peaceful spots in the whole town.",
    teen: "The boating lake was a deliberate part of the park's original design — a controlled aquatic leisure space that brought the pleasures of water to families who mostly worked near the sea but rarely had access to it for pleasure. It's a small but telling detail about how the park was conceived: as a counterweight to industrial life, a place of gentle recreation.",
    adult: "The boating lake is one of the surviving elements of the original Victorian park design. Parks of this era were carefully planned environments intended to provide specific forms of regulated leisure — the boating lake, the bandstand, the flower gardens, the bowling green — each serving a distinct social function. The lake in particular provided a kind of controlled engagement with water in a town defined by its proximity to the sea and estuary. The park was a curated version of the natural landscape, made safe and accessible to the working population.",
  },

  barrow_park_greenhouse: {
    kid: "This greenhouse in the park is where they grow all kinds of plants and flowers. Greenhouses are amazing — by trapping heat inside the glass, they can grow tropical plants even in cold, rainy Barrow! The park has been growing plants here since Victorian times.",
    teen: "The park greenhouse reflects the Victorian fascination with botany and with bringing nature under human control. At a time when botanical knowledge was advancing rapidly and exotic species were being collected from around the empire, the municipal greenhouse was a way of displaying that knowledge to ordinary people. It also produced the bedding plants that gave the park its distinctive seasonal colour.",
    adult: "The greenhouse represents an often-overlooked dimension of Victorian park culture. The pursuit of horticultural excellence in public parks was both aesthetic and political — a statement that working-class communities deserved access to beauty and to the products of botanical knowledge. The park's glasshouse tradition produced seasonal displays and maintained a collection of plants that gave the space a different character in every season. It reflects the depth of investment in what was considered the proper design and management of a Victorian public park.",
  },

  // ===================== ABBEY =====================

  furness_abbey_core: {
    kid: "Furness Abbey is over 900 years old! Monks used to live here, pray here, and work here. They farmed the land, made things, and kept books and knowledge alive. When the king ordered the monasteries to be destroyed, this beautiful place was torn apart. But the stones are still here — and they still tell the story.",
    teen: "Furness Abbey was one of the most powerful religious houses in northern England during the medieval period. Founded in 1127 by the Savigniac order and later absorbed into the Cistercians, it controlled vast tracts of land, trade routes, and communities across the Furness peninsula. Its dissolution in 1537 under Henry VIII was not just a religious event — it was a fundamental restructuring of power and land ownership in the entire region.",
    adult: "Furness Abbey's significance extends far beyond its architectural drama. As a Cistercian house at the height of its influence, it was a major economic, agricultural, and administrative power in medieval Furness — controlling granges, fisheries, ironworks, and shipping rights across a wide area. The dissolution was both a political act of the Reformation and an economic seizure on a massive scale. The ruins that remain are among the most complete and evocative Cistercian remains in Britain, and they sit in a landscape that still bears the traces of monastic land management. The abbey's story is inseparable from the longer story of the Furness peninsula.",
  },

  abbey_ruins_marker: {
    kid: "These old ruins are all that's left of a massive building that once stood here. The monks built it with enormous skill — no machines, no power tools, just people with stone and knowledge. It took generations to build, and was destroyed in just a few years.",
    teen: "The ruins mark the visible remains of what was once a vast complex of buildings — church, cloisters, chapter house, dormitories, kitchens, workshops. Medieval monastic construction was extraordinarily ambitious, and Furness Abbey was among the grandest examples in northern England. Walking through the ruins it's possible to trace the original layout and understand the scale of what was lost.",
    adult: "The ruins present one of the more complete plans of a Cistercian monastery in England. The site retains enough standing fabric to read the full monastic layout — the presbytery, the south transept, the chapter house, the infirmary, the outer court. The distinctive red sandstone of the Furness valley gives the ruins their extraordinary colour. Archaeological investigation has revealed much about the construction sequence and the abbey's development over four centuries, from its modest beginnings to its eventual scale and wealth.",
  },

  red_river_walk_core: {
    kid: "The Red River gets its colour from iron in the rocks — it's not blood, don't worry! This walk follows the river all the way to the Abbey. For hundreds of years, monks and travellers walked this same route. Imagine what they must have thought as the Abbey came into view.",
    teen: "The Red River's distinctive colouration comes from the iron-rich geology of the area — the same geological conditions that made this part of Cumbria valuable for iron production long before Barrow existed. The walk follows an ancient route to the abbey, and approaching from this direction gives a sense of how deliberately the abbey was positioned in the landscape — visible from a distance, framed by the valley, designed to impress.",
    adult: "The Red River walk follows the natural approach to Furness Abbey through the Vale of Nightshade. The route has medieval origins and the valley itself was part of the abbey's managed landscape — the iron-stained stream, the woodland, the farmland were all within the monastic estate. The distinctive red-brown colouration of the water results from iron hydroxide precipitation — a natural process that connects the local geology to the long history of ironworking in Furness. The approach to the abbey from this direction remains one of the most atmospheric in English heritage.",
  },

  abbey_chapter_house: {
    kid: "The chapter house was where the monks met every day to make decisions and read from their rule book. Every monastery had one. It was like a daily meeting room — but also a place of judgement, where monks could be questioned or punished for breaking the rules.",
    teen: "The chapter house was the administrative and disciplinary heart of the monastery. Every day the monks gathered here to hear a chapter of the Rule of Saint Benedict read aloud — that's where the name comes from. It was also where the abbot exercised his authority, where disputes were resolved, and where the business of the community was conducted. The room's position and design reflected its importance.",
    adult: "The chapter house at Furness represents one of the better-preserved elements of the monastic complex. In Cistercian monasteries, the chapter house occupied a specific and significant position in the east range of the cloister, signalling its central role in monastic governance. The daily chapter was the mechanism through which the Rule was maintained and community life was ordered. Abbots were also sometimes buried in or near the chapter house, and archaeological investigation has revealed evidence of burials at Furness consistent with this tradition.",
  },

  // ===================== ISLANDS =====================

  walney_lighthouse: {
    kid: "This lighthouse has been warning ships away from the dangerous rocks and sandbanks around Walney Island for hundreds of years. Before GPS, sailors depended completely on lighthouses to know where they were and how to stay safe. The lighthouse keeper's job was one of the loneliest in the world.",
    teen: "The Walney lighthouse marks the southern tip of Walney Island and has guided ships through some of the most treacherous waters on the northwest coast. The channels around Barrow and Walney are notoriously difficult — shifting sands, strong tides, and unpredictable weather have claimed many vessels over the centuries. The lighthouse was essential infrastructure for the growing port trade that developed with Barrow's industrialisation.",
    adult: "The Walney lighthouse is a significant element of the maritime navigation infrastructure that developed alongside Barrow's growth as a port. The waters of Morecambe Bay and the channels around Walney are genuinely hazardous — the combination of large tidal ranges, shifting sandbanks, and frequent poor visibility makes them among the more dangerous on the west coast of England. The lighthouse was part of a broader network of navigation aids that made the expansion of maritime trade through Barrow possible, and it continues to serve that function today.",
  },

  piel_castle: {
    kid: "Piel Castle is an amazing old ruin on a tiny island that you have to get a boat to visit. It was built to protect the trade coming in and out of the Furness peninsula. There's even an old pub on the island called the Ship Inn, and the landlord is crowned as the King of Piel every summer!",
    teen: "Piel Castle was built in the fourteenth century by the monks of Furness Abbey to protect their wool trade from pirates and raiders. The island's strategic position made it ideal for controlling the approach to the Furness coast. It later featured in one of the more dramatic moments of English history — Lambert Simnel landed here in 1487 with a mercenary army in an attempt to claim the English throne.",
    adult: "Piel Castle's history spans medieval monastic economics, dynastic warfare, and maritime trade. Built by Furness Abbey in the fourteenth century as a fortified warehouse and defensive position for the wool trade, it later served as the landing point for Lambert Simnel's ill-fated invasion in 1487 — one of the last serious challenges to the Tudor dynasty in its early years. The castle's isolation on Piel Island has preserved it in a remarkable state of picturesque ruin, and the eccentric tradition of the King of Piel — the pub landlord ceremonially crowned with a rusty helmet — is one of the more endearing pieces of local custom in the region.",
  },

  walney_bridge_entrance: {
    kid: "Before this bridge was built, the only way to get to Walney Island was by boat. Building the bridge changed everything for the people who lived there — suddenly they could walk or drive to the mainland. It connected an island community to the rest of Barrow.",
    teen: "Walney Bridge transformed the island from a relatively isolated settlement into an accessible suburb of Barrow. The bridge was a significant piece of engineering and its construction reflected the expansion of the town onto the island during the period of rapid growth. Vickerstown, the purpose-built workers' housing on Walney, was developed specifically to house shipyard workers and required the bridge as its essential connection to the yards.",
    adult: "Walney Bridge's construction in the early twentieth century was tied directly to the development of Vickerstown — the model workers' housing estate built by Vickers on the island to accommodate the expanding shipyard workforce. The bridge made it possible to develop residential areas on Walney at scale while keeping workers within commuting distance of the yards. The island's geography, with its long strip of land separated from the mainland by a narrow channel, made it an ideal extension of the town's residential capacity without disrupting the industrial areas.",
  },

  earnse_bay: {
    kid: "Earnse Bay is a beautiful wild beach on the west side of Walney Island. It looks out over the Irish Sea towards the Isle of Man. On a clear day you can see really far. This beach is a completely different world from the town and the shipyards just a few miles away.",
    teen: "Earnse Bay offers one of the most dramatic contrasts in the Barrow area — from the industrial intensity of the shipyards to this wild, exposed shoreline in a very short distance. Walney Island's west coast faces the full force of the Irish Sea, and the beach at Earnse Bay has a genuinely remote quality despite being so close to a major industrial town. The juxtaposition is one of the defining geographical features of the Barrow area.",
    adult: "Earnse Bay sits within the South Walney Nature Reserve and represents the remarkable environmental contrast that defines Walney Island. The west coast faces the Irish Sea with minimal shelter, creating a coastal habitat very different from the sheltered eastern shore. The reserve supports important populations of eider duck, gulls, and other coastal species. The beach itself is notable for its geology — glacial deposits, wave-worked cobbles, and occasional erratic boulders — that tell a story of the area's post-ice age formation. The proximity to one of the UK's most important defence industrial sites makes it an unusual landscape.",
  },

  roa_island_jetty: {
    kid: "Roa Island is a tiny little piece of land connected to the mainland by a narrow causeway. The jetty here is where boats set off to visit Piel Island. On a sunny day it's one of the most beautiful spots in the whole area — peaceful, quiet, and surrounded by water.",
    teen: "Roa Island occupies a curious position in the geography of the Furness peninsula. Connected to the mainland by a narrow causeway, it feels genuinely isolated despite its proximity to Barrow. The jetty was historically important for ferry connections and for the local fishing and shellfishing industry. Today it's the departure point for the ferry to Piel Island, maintaining a maritime connection that has existed for centuries.",
    adult: "Roa Island and its jetty have historical significance beyond their current recreational use. The island was an early focus for development in the Furness area — there were proposals in the Victorian period to develop it as the principal landing stage for the region before the decision was made to focus investment on Barrow harbour. Its sheltered position in the lee of Walney Island made it attractive as a maritime base, and the local fishing and shellfishing economy operated from here for generations. The ferry connection to Piel Island maintains what is one of the area's oldest maritime routes.",
  },

  south_walney_reserve_entrance: {
    kid: "South Walney is a nature reserve at the southern tip of Walney Island. It's home to hundreds of seals and huge colonies of seabirds. You can see them resting on the rocks and flying overhead. Nature like this is incredibly precious and this reserve protects it.",
    teen: "South Walney Nature Reserve is one of the most important wildlife sites in the northwest of England. The reserve hosts one of the largest herring gull and lesser black-backed gull colonies in Europe, along with significant populations of eider duck and grey seals. The fact that this extraordinary wildlife habitat sits at the end of an island attached to a major industrial town is one of the more remarkable geographical coincidences in the region.",
    adult: "South Walney represents one of the most significant wildlife conservation sites in Cumbria and the northwest generally. The reserve's importance rests on several factors: the large and internationally significant gull colonies, the seal haul-out sites, and the rare coastal habitats including shingle, salt marsh, and brackish pools. The site also has notable botanical interest. The coexistence of this reserve with the major industrial and defence infrastructure of the Barrow area is one of the more striking features of the peninsula's geography — the northern and southern ends of the same island contain two of the most contrasting environments imaginable.",
  },
};

/* =========================================================
   SPEAK FUNCTION
   Returns Tom's words for a given pin and tier
========================================================= */

export function speak(pinId, tier = "adult") {
  const lines = TOM_LINES[pinId];
  if (!lines) return null;

  const safeTier = ["kid", "teen", "adult"].includes(tier) ? tier : "adult";
  return lines[safeTier] || lines.adult || null;
}

/* =========================================================
   GET ALL PINS TOM COVERS
========================================================= */

export function getCoveredPins() {
  return Object.keys(TOM_LINES);
}

export function hasCoverage(pinId) {
  return !!TOM_LINES[pinId];
}

/* =========================================================
   SHOW TOM OVERLAY
   Displays Tom's words on screen at a pin
========================================================= */

export function showTomOverlay(pinId, tier = "adult", pinName = "") {
  const text = speak(pinId, tier);
  if (!text) return false;

  const old = document.getElementById("old-tom-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "old-tom-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:rgba(0,0,0,.88);
    display:flex;align-items:flex-end;justify-content:center;
    padding:20px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  overlay.innerHTML = `
    <div style="
      width:min(96vw,560px);
      border:2px solid rgba(255,213,74,.65);
      border-radius:28px;
      background:linear-gradient(180deg,#1a1508,#0a0c14);
      padding:22px;
      color:white;
      box-shadow:0 0 48px rgba(255,213,74,.2);
      margin-bottom:8px;
    ">
      <!-- TOM HEADER -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        <div style="
          width:52px;height:52px;border-radius:50%;
          background:linear-gradient(135deg,#2a1f08,#1a1508);
          border:2px solid #ffd54a;
          display:flex;align-items:center;justify-content:center;
          font-size:26px;flex-shrink:0;
        ">🧙</div>
        <div>
          <div style="font-size:14px;font-weight:1000;color:#ffd54a;">OLD TOM</div>
          <div style="font-size:12px;opacity:.75;margin-top:2px;">Barrow Historian</div>
        </div>
        <div style="
          margin-left:auto;font-size:11px;opacity:.6;
          padding:4px 10px;border-radius:10px;
          background:rgba(255,255,255,.08);
        ">${pinName || pinId}</div>
      </div>

      <!-- DIVIDER -->
      <div style="height:1px;background:rgba(255,213,74,.2);margin-bottom:16px;"></div>

      <!-- TOM'S WORDS -->
      <div style="
        font-size:15px;line-height:1.65;
        color:rgba(255,255,255,.92);
        font-style:italic;
      ">"${text}"</div>

      <!-- CLOSE -->
      <button id="btn-tom-close" type="button" style="
        width:100%;min-height:46px;border-radius:16px;
        background:rgba(255,213,74,.15);
        color:#ffd54a;font-weight:1000;font-size:14px;
        border:1px solid rgba(255,213,74,.35);
        cursor:pointer;margin-top:18px;
      ">UNDERSTOOD, TOM</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.getElementById("btn-tom-close")?.addEventListener("click", () => {
    overlay.remove();
  });

  return true;
}

/* =========================================================
   WIRE OLD TOM INTO APP
   Call this from app.js to make Tom available globally
========================================================= */

export function initOldTom() {
  window.oldTom = { speak, showTomOverlay, hasCoverage, getCoveredPins };
  console.log(`Old Tom initialised. Covering ${getCoveredPins().length} locations.`);
}

export default { speak, showTomOverlay, hasCoverage, getCoveredPins, initOldTom };
