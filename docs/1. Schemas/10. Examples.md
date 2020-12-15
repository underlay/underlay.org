# Example schemas

(under construction)

## RDF

```tasl
namespace ex http://example.com/

class ex:BlankNode !

class ex:Statement {
  ex:subject -> [
    ex:blankNode >- * ex:BlankNode;
    ex:iri >- <>;
  ];
  ex:predicate -> <>;
  ex:object -> [
    ex:blankNode >- * ex:BlankNode;
    ex:iri >- <>;
    ex:literal >- {
      ex:value -> string;
      ex:languageOrDatatype -> [
        ex:language >- string;
        ex:datatype >- <>;
      ]
    }
  ];
  ex:graph -> [
    ex:defaultGraph;
    ex:blankNode >- * ex:BlankNode;
    ex:iri >- <>
  ];
}
```
