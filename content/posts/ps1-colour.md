---
title: "Changing Your PS1's Prompt Based on The Previous Command's Return Value"
date: 2021-06-25T21:17:06+10:00
Description: "Changing shell's PS1 prompt based on the return code"
draft: false
---

You may find it useful for your PS1 to signal if a previous command returned `0` or not. One neat way to do this that doesn't add clutter is to have your PS1 change colour based on the previous command's return value.

I find that it also works well for scrollback, allowing me to at a quick glance where things went wrong. It can also draw attention to nonzero return values for programs that don't properly signal that they didn't properly exit to a user.

Using the [man page for the console escape codes](https://man7.org/linux/man-pages/man4/console_codes.4.html) as reference, I wanted the `PS1` to be `red` or code `31` when there is a nonzero return value, and green or `32` for a zero return value.

I also keep my `PS1` prompt minimal being just a `$` character, but it should be trivial to adapt your own prompt.

## Setting the Colours

The green and red prompts for the `$` character can be set like so

```bash
# green prompt
PS1="\[\e[32m\]$ \[\e[0m\]"
# red prompt
PS1="\[\e[31m\]$ \[\e[0m\]"
```

where

- `\e` is the escape sequence
- `\e[0m` resets the attributes to the default at the end of the prompt.
- The `\[` and `\]` are used to wrap non-printing control sequences (in our case the colour escape sequences), so word wrapping doesn't break.

## Colour Switching on Return Value

We can use special shell variable `$?` that gives us the return value of the last executed command. What we want is to return the string `32` (green) if it's zero, and `31` (red) otherwise. Using bash conditionals, we can test this

```bash
$ true
$ [[ $? = 0 ]] && printf 32 || printf 31
32
$ false
$ [[ $? = 0 ]] && printf 32 || printf 31
31
```

## Putting it together

Inserting the conditional into the `PS1` where the colour sequence number was as a subshell we have

```bash
PS1='\[\e[$([[ $? = 0 ]] && printf 32 || printf 31)m\]$ \[\e[0m\]'
```

(Note that we use single quotes so that the subshell isn't evaluated when setting the `PS1` variable)

Now whenever you run a command and it returns `0` the prompt should be green, and if it's nonzero the prompt will turn red.
