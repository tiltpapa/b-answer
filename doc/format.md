Format Definition
===

Question
----
```json
{
    "type": <"choice" or "sort">,
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
    "answer": [<integer: 1 <= n => "total">, ...],
    "total": <integer 1 or more>,
    "required": <integer: 1 <= n => "total">
}
```
- "answer" means correct answer number
- "total" means numbers of choices
- "required" means numbers of choices that must be selected
