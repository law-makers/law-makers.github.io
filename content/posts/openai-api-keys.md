---
title: "Searching GitHub for OpenAI API Keys"
date: "2023-05-20"
description: "Searching GitHub for OpenAI API Keys"
draft: false
---

OpenAI API keys in the format

```
sk-<40 case-sensitive alphanumeric characters>
```

A simple regular expression for this would be

```
/sk-[a-zA-Z0-9]{40,}/
```

i.e., match any string that starts with "sk-" followed by at least 40 alphanumeric characters.

GitHub allows [regular expression search](https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax#using-regular-expressions), but note that if the search is too expensive you'll get a `5XX` response.

I noticed modifying it to limit to the start of a line, i.e., `/^sk-[a-zA-Z0-9]{40,}/` yields results.

[Click here to search for OpenAI API keys](https://github.com/search?q=%2F%5Esk-%5Ba-zA-Z0-9%5D%7B40%2C%7D%2F&type=code)

Right now it should return a few results. A few thoughts

- I'm not sure if GitHub is sending alerts for API keys being committed to codebases. They absolutely should if they're not
- OpenAI should allow permission scoping of API keys
- Limiting API keys based on IP CIDR ranges would also be useful

Fin.
