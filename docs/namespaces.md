# Namespaces

Namespaces in Underlay are human-readable strings that give context to the authority behind a given collection. A single namespace is given to each User and Community. The pool of available namespaces is shared amongst all users and communities.

Navigating to a namespace URL (e.g. `underlay.org/jordan` or `underlay.org/nasa`) will lead to a user's or organization's profile. The profile will list all collections associated with that namespace and other profile details. Collections live at a URL path after a namepsace, e.g. `underlay.org/${namespace}/${collection-slug}${collection-shortId}`.

Namespaces are not persistent! Users or communities may change the namespace over time (though, many won't), so they cannot and do not guarantee a persistent, permanent address.

It will be common practice to refer to a schema or collection using namespaces and collection slugs, but permanent URIs will use collection shortIds or full ids of the collection or namespace. For example

```
// Human-readable url
underlay.org/jordan/map-data
- or -
underlay.org/jordan/map-data-hsbga72
- or -
underlay.org/anything/anything-hsbga72


// Resolved information:
namespaceId: <uuid>
collectionId: <uuid>
collectionShortId: hsbga72
```

This allows us to resolve collections, specific schema or collection versions despite a namespace or collection-string changing, as long as the collection `shortId` is maintained.

Schemas will typically be addressed or be referenced by their most recent human-readable URI. For example:

```
schema: jordan/map-data-hsbga@2.1
```
::: tip
See the section on [versioning](versioning.md) to learn more about what the `2.1` version means in that example.
:::


<!-- 
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger OoPS
This is a **dangerous** *warning* :tada: :100: :smiling_imp:.
:::

::: details
This is a details block.
::: -->
