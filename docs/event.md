Event Definition
===

Common
----
全てのイベントについて、`client`タグを付与する。
ただし、置き換え可能なイベントについてはこの限りではない。
```json
{
    "tags": [
        ["client", "b-answer", "31990:tiltpapa-pubkey:b-answer", "wss://relay.b-answer.tiltpapa.tv"]
    ]
}
```
`tiltpapa-pubkey`は例示で実際のpubkeyが入る(固定値)

Game Master Profile
----
このシステムでは`pubkey`と1ゲームを対応させ、`Game Master ID`として扱う。ただしプレイヤーはその限りではなく、他のNostrクライアントと共通のIdentityとして使用することができる。  
bech32-formatted strings that can be used to display game IDs. The bech32 prefix is `bans`.

- `content` is set to a stringified JSON object `{name: <title of game>, about: <explanation>, website: <link>}`


b-answer Profile
----
プレイヤーのプロフィールです。
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
- `content` is set to a stringified JSON object `{name: <username>, pronunciation: <pronunciation>, eula: <version or false>}`
- eulaは同意した場合そのeulaのバージョンを記述、同意しなかった場合false
- `p`タグは過去に参加したゲームの履歴として使用される



## Draft
### Draft Question
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


### Draft Folder
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
`Draft Question`をまとめるため、紛失しないために使用する

## Playing
### Start
```json
{
    "kind": 78,
    "tags": [
        ["d", "start"],
        ["a", <Display Format event>],
        ["p", <Player pubkey>],
        // ...
    ]
}
```
- `content` is set to a [Question](format.md#question) excluding `answer`
- `Player pubkey`は回答権のあるプレイヤーを指定したい時に使う


### Seconds Left
```json
{
    "kind": 20078,
    "tags": [
        ["d", "banswer-left"],
        ["e", <Start id>]
    ]
}
```
- `content`には残り秒数をセットする


### End
```json
{
    "kind": 78,
    "content": "End",
    "tags": [
        ["d", "banswer-end"],
        ["e", <Start id>]
    ]
}
```


### Answer Check
```json
{
    "kind": 78,
    "content": "[<positive integer>,...]",
    "tags": [
        ["d", "banswer-answer-check"],
        ["e", <Start id>]
    ]
}
```
プレイヤーが各選択肢に回答した人数を共有する

### Answer
```json
{
    "kind": 78,
    "tags": [
        ["d", "banswer-answer"],
        ["e", <Start id>]
    ]
}
```
- `content` is set to a stringified object `answer` from [Question](format.md#question)