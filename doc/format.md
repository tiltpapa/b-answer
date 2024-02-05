Format Definition
===

Question
----
```jsonc
{
    "type": <"choice" or "sort">,
    "question": <arbitrary string>,
    "choices": [
        { 
            "type": <"text" or "image">,
            "content": <arbitrary string or image link>
        },
        // ...
    ],
    "total": <integer>,
    "required": <integer>
}
```
- "total" means numbers of choices
- "required" means numbers of choices that must be selected
