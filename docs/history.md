# History

The ideas behind the Underlay were first discussed in conversations between Danny Hillis, SJ Klein, and Travis Rich in 2016. This page will share some specifics that have led to updates in our thinking and resulted in the project as it is today.

Over time, the project has considered various outputs (e.g. a standalone platform, an open-source CLI tool, a protocol) and built with the goal of various value propositions. As we've iterated on ideas, it has been challenging to communicate which notions are deprecated and which are active. The content on this documentation site can be understood as canonical. If it's not mentioned in the docs here, it is no longer an active line of research and development. We maintain this history page to provide additional narration and context to ideas we have explored in the past, but may not necessarily be included in our current approach.

## Catalysts
There were several catalysts that led discussions about a new project called the Underlay (credit to SJ for coining the name).

- Danny's experience with founding [Metaweb](https://en.wikipedia.org/wiki/Metaweb) and their development (and eventual sale) of [Freebase](https://en.wikipedia.org/wiki/Freebase_(database)). Freebase was [shut down by Google in 2016](https://groups.google.com/g/freebase-discuss/c/WEnyO8f7xOQ), and Danny knew an open version of a global knowledge graph still possible and critical.
- Travis and Thariq Shihipar had been developing early versions of [PubPub](https://www.pubpub.org) in 2015 and 2016. Initially, PubPub was both a frontend for fast iteration of scholarly articles, and a backend for long-term archival of such documents. Merging these two things created a very uncomfortable interface — one that was simultaneously trying to reduce friction to make quick, iterative changes while also notifying people that all changes would be permanently catalogued in a distributed database forever. Yikes. The archival layer of PubPub was broken off as it became clear there was value in having a separate system for long-term collaborative storage of persistent data.
- SJ's experience and involvement with WikiData led to enthusiasm about the opportunities in this space and insight into what was still lacking.
- As part of his PhD general exames, Travis built [DbDb](https://notes.knowledgefutures.org/pub/hevceylu). The idea behind DbDb was to allow users to publish not just datasets, but the lineage of how a dataset was processed and transformed over time, allowing alternative analyses to be 'forked' from any point in a datasets processing timeline.

## Support from Protocol Labs
Beginning in 2018, Joel Gustafson began working at [Protocol Labs](https://protocol.ai/), who generously allowed him to work full-time on research and development of the Underlay project. Until 2021, Joel was the only person working full-time on the technical components of the project.

Joel made significant contributions to the idea and technical underpinnings of the Underlay project. Some of his most referenced work includes:
- [[Talk] The Underlay: A Distributed Public Knowledge Graph](https://www.youtube.com/watch?v=QIZV1Y71F8A)
- [[Article] What is a Distributed Knowledge Graph](https://notes.knowledgefutures.org/pub/belji1gd)
- [[Article] Underlay Architecture](https://notes.knowledgefutures.org/pub/underlay-architecture)
- [[Article] Underlay Research Directions](https://notes.knowledgefutures.org/pub/underlay-research)
- [[Docs] tasl: Tiny Algabraic Schema Language](https://tasl.io/)

## RFCs
For several years we maintained an RFC (Request for Comments) series to document our ideas, proposals, progress, and plans. RFCs represent snapshots of thinking and may contain outdated or deprecated ideas. For a more thorough description, see Danny Hillis's [**RFC 0**](https://notes.knowledgefutures.org/pub/urfcs). Historical documents have been retrospectively mapped into this RFC series with negative numbering (e.g. RFC -2).

[**RFC 1: A Short Introduction**](https://notes.knowledgefutures.org/pub/underlay-short-intro)
<br/>*Aug 2, 2020 · Danny Hillis*

[**RFC 0: Underlay RFCs**](https://notes.knowledgefutures.org/pub/urfcs/release/1)
<br/>*Aug 2, 2020 · Danny Hillis*

[**RFC -1: Understander: A Science Annotator**](https://notes.knowledgefutures.org/pub/annotator/release/2)
<br/>*May 14, 2020 · Samuel Klein* 

[**RFC -2: Open Research Questions (2019)**](https://notes.knowledgefutures.org/pub/research-questions/release/1)
<br/>*Nov 26, 2019 · Joel Gustafson*

[**RFC -3: Content-Addressing Semantic Data**](https://notes.knowledgefutures.org/pub/ic0grz58/release/3) 
<br/>*Oct 24, 2019 (updated Aug 31, 2020) · Joel Gustafson*

[**RFC -4: Data and Model Sharing**](https://notes.knowledgefutures.org/pub/data-sharing-questions/release/16)
<br/>*Sept 17, 2019 (updated Sep 20, 2020) · Samuel Klein*

[**RFC -5: Underlay Architecture**](https://notes.knowledgefutures.org/pub/underlay-architecture/release/4)
<br/>*Apr 24, 2019 · Joel Gustafson*

[**RFC -6: The Future of Knowledge**](https://notes.knowledgefutures.org/pub/future/release/5)
<br/>*Jul 18, 2018 · Danny Hillis, Samuel Klein, and Travis Rich*

[**RFC -7: Patterns for Crystallizing Knowledge**](https://notes.knowledgefutures.org/pub/up/release/5)
<br/>*Jul 9, 2018 · Samuel Klein*

[**RFC -8: Underlay: A First Description**](https://notes.knowledgefutures.org/pub/h67iji6d/release/1)
<br/>*Mar 22, 2018 · Danny Hillis, Samuel Klein, and Travis Rich*

## Our approach to collaborative knowledge graphs
Early models of Underlay were inspired by models used by Freebase and Wikipedia/Wikidata. Specifically, the notion of a singular, curated space that served as the canonical 'instance' of the project. We knew from early days that we were interested in pursuing a variation of that model that supported a distributed architecture, but the idea of there still being a singular 'underlay' persisted. 

However, unlike those inspiration projects, we did not think of ourselves as the group that would do the curation or maintain the curational community. We knew that external communities were already playing this role, and sought a way to empower them to continue their curational work. This led to the idea of 'registries' - essentially clusters or nodes of servers that would be maintained by a specific organization, and feed into a singular Underlay knowledge graph. 

With time, we realized that the idea of a singular knowledge graph was rather fragile. Primarily because it required eventual consensus amongst parties. Further, it pushed participants to have a model of the entire knowledge graph in order to make a single contribution. This is when our thinking began to shift.

Instead of a single, global, distributed knowledge graph, the notion of Collections emerged. A collection can be thought of as a contained, singularly curated, knowledge graph. This could be as broad as 'all human knowledge' or as narrow as 'taco shops in my neighborhood'. The critical feature of collections though is that they can be designed to be composable. That is, larger and broader knowledge graphs could be built by pulling together smaller knowledge graphs curated by experts on the given topic. And as an extension, many such large and broad knowledge graphs could exist simultaneously based on which collections they decide are relevant for their collection. 

Collections thus can be viewed as a knowledge graph of specific size, authority, trustworthyness, and purpose that represent a singular curational perspective. So rather than a singular, global knowledge graph - we have a network of knowledge graphs that can be assembled, composed, and re-mixed to match a given purpose and perspective.
