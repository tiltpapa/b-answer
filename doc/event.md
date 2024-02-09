Event Definition
===

Draft Question
----
Basically, it complies with [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md).
```json
{
    "kind": 78,
    "tags": [
        ["d", "banswer-draft"],
        ["a", <Display Format event>]
    ]
}
```
- "content" stores the encrypted version of [Question](format.md#question)