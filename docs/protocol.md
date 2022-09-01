# Protocol

Early in our work on Underlay, we struggled to pin down what the Underlay is specifically. Is it a layer over a database? A provenance signing protocol? A network protocol for sending data?

To answer that, it is also important to identify what purpose Underlay is serving.

Our current answer is that the purpose of the Underlay is to make public data more accessible and effective. To make that data easier to understand, integrate, and maintain. [More about that purpose is explored here](https://notes.knowledgefutures.org/pub/1id7h71i).

With that in mind, it is often easier to identify what parts of that problem Underlay does _not_ address. For example, we are not trying to increase query-speed of data (i.e. we're not a database), and we're not trying to improve transfer sizes (i.e. we're not a compression algorithm).

In fact, nearly all of the technical components that one typically thinks of when considering public datasets have already been considered and addressed by past efforts around the Semantic Web, RDF, and modern efforts on IPFS, IPLD, Dat, and other open data projects. However, despite the technical expertise brought to these projects, the reality of public data still leaves us wanting. As such, we identify that a missing piece we can address is the social dynamics of using public data. Our approach is to identify simple, well-established technical components that can serve as the basis for facilitating more effective, equitable, and sustainble processes.

The Underlay is premised on the idea that a knowledge graph can be constructed from a series of distributed transactions called assertions. Multiple assertions are combined through a process called reduction and can be curated into useful groupings using collections.

## Assertions

An assertion is simply a set of data with some form of attribution. In general, this attribution could by a cryptographic signature or any sort of pointer to an identity. For most development, we use JSON blobs to send data around, so we will use that for these examples, but the approach is not specific to JSON serialization - any would do just fine and the specific choice should be one of technical appropriateness, not protocol mandate.

A toy example of an assertion is simply something like

```
{
	data: { name: 'Rosalind Franklin', birthYear: '1920' },
	signature: 'Jude'
}
```

In english: 'Jude says that Rosalind Franklin was born in 1920'.

## Reduction

Now, say we have two assertions:

```
[
	{
		data: [{ name: 'Rosalind Franklin', birthYear: '1919', favoriteColor: 'red' }],
		signature: 'Jude'
	},
	{
		data: [{ name: 'Rosalind Franklin', birthYear: '1920' }],
		signature: 'Ash'
	}
]
```
We want a way to take multiple assertions and process them such that we end up with a singular output state. 

There are many ways we could 'reduce' these toy assertions into a single state. We could:
- Overwrite old assertions with newer ones
  ```
  ///Output
  {
    data: [{ name: 'Rosalind Franklin', birthYear: '1920' }],
  }
  ```
- Append assertions
  ```
  ///Output
  {
    data: [
    	{ name: 'Rosalind Franklin', birthYear: '1920' },
    	{ name: 'Rosalind Franklin', birthYear: '1919', favoriteColor: 'red' }
    ]
  }
  ```
- Merge assertions 
	```
  ///Output
  {
	data: [
		{ name: 'Rosalind Franklin', birthYear: '1920', favoriteColor: 'red' },
	]
  }
  ```

And of course, we could do such transactions with any set of filters (e.g. Filter out all assertions that aren't from Jude).

In reality, we need a bit more than is described in the toy example. Specifically, we need a [schema](schemas.md) which allows us to specify important elements such as unique identifiers (in order to know *how* to merge), and we need some way of maintaining provenance into the output data. In practice, a set of input assertions and resulting outputs look more like this:

```
// Schema
{
		id: "schemaEntityUUID",
		key: "Person",
		attributes: [
			{ id: "uuid2", key: "name", type: "Text", isUID: true,  isOptional: false },
			{ id: "uuid3", key: "age",  type: "Text", isUID: false, isOptional: false },
		],
	},

// Input Assertions
// Note that each assertion is a full schema-compliant dataset that could stand on its own. Reduction is the process of taking these schema-compliant datasets and producing a singular output shcema-compliant dataset. 
[
	{
    	Person: [
    		{ _ulid: "idA", _ulprov: "provA", name: "John", age: 13 },
    		{ _ulid: "idB", _ulprov: "provA", name: "Mary" },
    	],
    },
	{
		Person: [
      		{ _ulid: "idG", _ulprov: "provB", name: "John", age: 27 },
      		{ _ulid: "idL", _ulprov: "provB", name: "Mary" },
      		{ _ulid: "idH", _ulprov: "provB", name: "Darren" },
		]
	}
]

// Merge Output
{
	Person: [
    	{ _ulid: "idA", _ulprov: "provA,provB", name: "John", age: 27 },
    	{ _ulid: "idB", _ulprov: "provA", name: "Mary" },
    	{ _ulid: "idH", _ulprov: "provB", name: "Darren" },
    ]
}


```
The simple process is to start at the beginning of your list of assertions, and one-by-one reduce the assertion into the previous dataset state.

## Deletions
The set of assertions that represent typical database operations may not necessarily be obvious. For example, the least clever reduction-friendly technique for deleting an entity from a dataset is to issue an assertion with an identical dataset with the deleted entity missing and using an `overwrite` reduction technique. This is a bit inverted from how you think about deleting. Typically you just think "remove this item", you don't think "re-state every other item except this one". Shorthands can be implemented to handle such cases without being overly verbose or storage-intensive. The reason we don't simply have a `delete` reduction technique is that each assertion is intended to be a *positive* statement, and one that can stand as its own schema-compliant dataset. A list of items to delete is not a positive statement, and it does not make sense as a stand-alone dataset.

