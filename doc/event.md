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
- `content` stores the encrypted version of [Question](format.md#question)


b-answer Profile
----
```json
{
    "kind": 30078,
    "tags": [
        ["d", "banswer-profile"],
        ["p", <Game Master id>]
        // ...
    ]
}
```
- `content` is set to a stringified JSON object `{name: <username>, pronunciation: <pronunciation>}`
