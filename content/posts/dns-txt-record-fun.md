---
title: "Fun with DNS TXT Records"
date: "2023-07-10"
draft: false
---

## TXT Record Specification Primer

Reading through the RFC [Using the Domain Name System To Store Arbitrary String Attributes to summarise](https://tools.ietf.org/html/rfc1464) the relevant part:

> Any printable ASCII character is permitted for the attribute name.

More importantly, on the `restrictions` section

> Some DNS server implementations place limits on the size or number of TXT records associated with a particular owner. Certain implementations may not support TXT records at all.

However in [rfc4408 section-3.1.3](https://tools.ietf.org/html/rfc4408) a limit is explicitly stated

> SPF or TXT records containing multiple strings are useful in constructing records that would exceed the 255-byte maximum length of a string within a single TXT or SPF RR record.

Searching online about the 255-byte limit shows a lot of posts by people trying to bypass it in BIND after the error invalid rdata format: ran out of space.

So we want to stay below that byte limit for maximum compatibility.

# Compression

Using `python`, `base64`, and `zlib`, we can naively compress the data then base64 encode it

```python
>>> lorem_ipsum = b"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions"
>>> len(lorem_ipsum)
558
>>> import base64, zlib
>>> lorem_ipsum_compressed = base64.b64encode(zlib.compress(lorem_ipsum,9))
>>> len(lorem_ipsum_compressed)
440
```

A reduction of 118 characters, not bad.

# Proof of Concept

I created a TXT record on message.theden.sh with the zlib + base64 method above

```
dig message.theden.sh TXT +short
"eNrzTFOozC9VL0pVKEpNTMnMS1coycgsVsgsUS9WKMnPV8hJLElVBAD3QAzt"
```

and to decompress it in one line

```
dig message.theden.sh TXT +short  | python3 -c "import sys, zlib, base64; print(zlib.decompress(base64.b64decode(sys.stdin.readlines()[0])))"
If you're reading this it's too late!
```

So it works as expected. Now we need an interesting use-case.

# DNS as a Password Manager?

It feels wrong, but here it goes. Let’s encrypt a secret with a password

```shell
# encrypt secret
echo -n 'mySuperSecretPassword1!!1!!' | openssl enc -e -aes-256-cbc -a -salt -pbkdf2
enter aes-256-cbc encryption password:
Verifying - enter aes-256-cbc encryption password:
U2FsdGVkX1/6QtzsEgPSLYdsSmIeVdH/0t7Tcwfr7ixWyDGzHu/Saz8YrKQ84kGd
```

I stored the encrypted secret on the TXT record under `pass.theden.sh`

```shell
dig pass.theden.sh TXT +short | sed 's/^"\(.*\)"$/\1/' | openssl aes-256-cbc -a -d -salt -pbkdf2
enter aes-256-cbc decryption password:
mySuperSecretPassword1!!1!!
```

You can try it yourself, the password to decrypt is `hackerman`.

some thoughts and ideas

- Encrypted passwords can be stored per domain, e.g., gmail.theden.sh, apple.theden.sh, and a distributed for you via propagation, in a decentralised manner, on a standard protocol without vendor lock-in, portability, and not having to worry about a password management service getting hacked. Down side: I guess you really have to believe that that a bad actor can’t decrypt it. And you have to pay for domain name.
- With only four TXT recrods that’s ~1KB of compressed data. Some demoscene intros can be stored in TXT records.
- You could theoretically store an arbitrary amount of data, if there is no limit on the number of TXT records you can create. I haven’t tried this, but would like to know what the limit is.
  More registrars need to have APIs for updating records. With an API, one could programatically update TXT records.
