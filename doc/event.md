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
        ["p", <Game Master id>],
        ["e", <Draft Question id>],
        // ...
    ]
}
```


Timing Synchronization
---
### Start
```json
{
    "kind": 78,
    "tags": [
        ["d", "banswer-timing"],
        ["a", <Display Format event>],
        ["p", <Game Master id>],
        ["p", <Player>],
        // ...
    ]
}
```
- `content` is set to a [Question](format.md#question) excluding `answer`
- `b-answer Profile id`, only use when you want to show the right to answer.

### Seconds Left
```json
{
    "kind": 20078,
    "tags": [
        ["d", "banswer-timing"],
        ["p", <Game Master id>],
        ["root", <Timing Synchronization(Start) id>]
    ]
}
```
- `content` is set to seconds left in the question