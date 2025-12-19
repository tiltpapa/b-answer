Format Definition
===

Question
----
```json
{
    "type": <"choice" or "sort" or "bonus" or "point">,
    "question": { 
        "type": <"text" or "image">,
        "content": <arbitrary string or image link>
    },
    "choices": [
        { 
            "type": <"text" or "image">,
            "content": <arbitrary string or image link>,
            "explanation": <arbitrary string>
        },
        // ...
    ],
    "answer": [<positive integer, n => "total">, ...],
    "total": <integer, 1 or more>,
    "required": <positive integer, n => "total">,
    "point": <integer>,
    "prize": { type: <"single" or "split">, price: <integer> },
    "version": <version>
}
```
- `answer`は正解の選択肢番号を意味する
- `total`は選択肢の数を意味する
- `required`は正解の選択肢の数を意味する
- `version`はフォーマットのバージョンを意味する
