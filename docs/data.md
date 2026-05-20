# Data

Data in Underlay can be stored in any manner technically appropriate for a given architecture. The key consistency is making data available to other collections and to [exports](using.md) with a consistent interface. Whether data is stored in flat files, a database, or some future architecture should be irrelevant. In this way, we say that Underlay data is 'storage agnostic'. Underlay does not prescribe how data is stored, rather, the interfaces that must be implemented in making that data available.

## Current implementation
At present, data is added to collections by uploaded CSV files. This basic approach is the most common one we've heard requested. A user with sufficient permissions to a collection can upload a CSV file which, along with its Mapping produce an [assertion](protocol.md). 
<!-- What is a Mapping? -->

Our intent is to implement many modes of adding data that all generate a compliant assertion. Some example input approaches:

- **Web UX:** Building a table-like data editor directly into underlay.org. Values in the table can be edited, new rows can be inserted, or deletions can be made. Such an interface could be made available to different permission levels, some requiring approval by an administrator before being included as a viable assertion.
- **API:** Building an API to allow programmatic insertion, editing, and deletion of collection data. This would allow scripts to be written that automate the process of shaping and uploading new data into a collection.
- **Web Forms:** Using the API to provide hosted web forms that can be used to generate schema-compliant data additions. Analogous to a web form populating a new row in a spreadsheet, we can have web forms populate a new set of entities in a collection.

## Collaborative data
In supporting the social dynamics of building a public dataset, we intend to support workflows that allow data to be inserted, edited, or deleted by a broad set of participants. We envision a system with a review process (akin to Github Pull Requests or Gitlab Merge Requests) that allows contributions to be made, audited, and explicitly approved before being merged as a new assertion.

