# Collections

Collections are the primary element in Underlay and its associated protocols. Most simply, a collection has two components: a schema and data. These two basic components allow for all of the features and processes that a collection facilitates.

A collection should be portable - it should contain everything about itself (e.g. [Discussions](/discussions) should be stored as data within the collection, not in another format outside of the collection itself). 

Collections have a human-readable name and a canonical `shortId`. These are concatenated to produce the URL of the collection: `underlay.org/jordan/${human-readable-name}-${shortId}`.

The canonical `shortId` provides a persistent means for routing to a collection across changes in namespace, transfers of collections to other owners, collection renames, and namespace or collection-name typos.

## Collections as building blocks
In the early days of the Underlay, we envisioned a singular, monolithic knowledge graph akin to Freebase or Google's knowledge graph. As the project matured, we realized that a misalignment of that approach with our mission is that a singular graph can only possibly represent a single curatorial perspective. We don't believe such a singular perspective can exist ethically or logistically (who is going to curate such a thing?!). 

Our current vision for the Underlay is one where many such graphs are created by using collections as building blocks. Each collection represents a focused, curated set of data. Piecing many of them together, like using Legos to construct a larger structure, it is possible to build a large, expert-curated, deeply provenanced knowledge graph. We envision there will many large collections that are simply curated perspectives on which sub-collections are trustworthy, verifiable, and appropriate. Similar to how a single open-source codebase  can have a deeply nested tree of dependencies, we envision collections that have a deeply nested tree of dependency-collections.

Similar to how an open-source code package defines an API that is used to integrate it into a larger codebase, Underlay collections define a schema that allows the data to be mapped into a larger database appropriately. 

