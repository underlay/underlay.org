# Using Collections
Our intent is to make it quick and simple to use existing Underlay collections. There will likely be several iterations on designing the best approach for achieving this. 

There are a number of important elements that a user of data may want to customize for their use case:

- Shape of the output data (e.g. how the data is nested and which fields are included)
- Key names of output data (e.g. to align with production systems)
- Format of the output data (e.g. JSON file, CSV file, hosted database, public API)
- Auto-versioning functionality (e.g. do you always want the latest version, or a specific version of the data )


## Re-use of exports
One social practice we notice in code and would like to mimic for data, is being able to see *how* people use public datasets. Having examples of the ways in which data is being exported and used can help guide people as they try to understand the most relevant and useful pieces of a dataset. Such information is also useful feedback for the data producer. 

## Current approach: Static cached files

At present, exports are generated as static, cached files. The files can either be CSV or JSON, and new cached files are produced for each new version of the collection.

Export files can specify a mapping that allows users to choose which fields they want included in their exported file, as well as rename those fields to align with their use case.

At present, there is no way to filter data from an export beyond including or excluding a specific class or attribute. 

## Future Approach: Queries

An improved interface for exports would be to allow users to generate a query whose result is cached and stored. The output result may be similar to static cached files (e.g. a JSON file or CSV file), but they would have more granular control over which data is included in these output files. 

## Future Approach: Hosted instances

One future interface we intend to implement is the ability to quickly stand up a private, hosted database that is populated with the collection's data or a queried subset of the data. This hosted instance would be production-grade and could be immediately used in a production environment. Settings on whether the content of the hosted instance is automatically incremented as new collection versions are published would be configurable. 

This would give users a simple way to take existing collections and use them in production environments quickly, and with low maintenance overhead.