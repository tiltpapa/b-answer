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


Game Master Profile
----
This system treats `pubkey` as a game.  
bech32-formatted strings that can be used to display game IDs. The bech32 prefix is `bans`.
```json
{
    "kind": 0,
    "tags": [
        ["client", "b-answer"]
    ]
}
```
- `content` is set to a stringified JSON object `{name: <title of game>, about: <explanation>, website: <link>}`


b-answer Profile
----
```json
{
    "kind": 30078,
    "tags": [
        ["d", "banswer-profile"],
        ["p", <Game Master id>],
        // ...
    ]
}
```
- `content` is set to a stringified JSON object `{name: <username>, pronunciation: <pronunciation>}`
- `p` tag, used to refer to participation history


Draft Folder
---
```json
{
    "kind": 30078,
    "tags": [
        ["d", "banswer-folder/<folder name>"],
        ["p", <Game Master pubkey>],
        ["e", <Draft Question id>],
        // ...
    ]
}
```


Start
---
```json
{
    "kind": 78,
    "tags": [
        ["d", "banswer-start"],
        ["a", <Display Format event>],
        ["p", <Player pubkey>],
        // ...
    ]
}
```
- `content` is set to a [Question](format.md#question) excluding `answer`
- `Player pubkey`, only use when you want to show the right to answer.


Seconds Left
---
```json
{
    "kind": 20078,
    "tags": [
        ["d", "banswer-left"],
        ["root", <Start id>]
    ]
}
```
- `content` is set to seconds left in the question


End
---
```json
{
    "kind": 78,
    "content": "End",
    "tags": [
        ["d", "banswer-end"],
        ["root", <Start id>]
    ]
}
```


Answer Check
---
```json
{
    "kind": 78,
    "content": "[<positive integer>,...]",
    "tags": [
        ["d", "banswer-answer-check"],
        ["root", <Start id>]
    ]
}
```


Answer
---
```json
{
    "kind": 78,
    "tags": [
        ["d", "banswer-answer"],
        ["root", <Start id>]
    ]
}
```
- `content` is set to a stringified object `answer` from [Question](format.md#question)