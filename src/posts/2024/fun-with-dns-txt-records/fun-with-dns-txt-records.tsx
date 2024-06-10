import {Post} from '../../Post';

export class FunWithDNSTxtRecords extends Post {
    public name = 'Fun with DNS TXT Records';
    public slug = 'fun-with-dns-txt-records';
    public date = new Date('10 Jun 2024');
    public hidden = false;
    public excerpt = 'Exploring the potential of DNS TXT records for storing data.';
    public keywords = ['DNS', 'TXT Records', 'compression', 'security'];
    public render() {
        return (
	<>
		<h1>Fun with DNS TXT Records</h1>
		<h2>TXT Record Specification Primer</h2>
		<p>
			Reading through the RFC Using the Domain Name System To Store Arbitrary String Attributes to summarise the relevant part:
		</p>
		<blockquote>
			Any printable ASCII character is permitted for the attribute name.
		</blockquote>
		<p>
			More importantly, on the restrictions section:
		</p>
		<blockquote>
			Some DNS server implementations place limits on the size or number of TXT records associated with a particular owner. Certain implementations may not support TXT records at all.
		</blockquote>
		<p>
			However, in RFC 4408 section 3.1.3 a limit is explicitly stated:
		</p>
		<blockquote>
			SPF or TXT records containing multiple strings are useful in constructing records that would exceed the 255-byte maximum length of a string within a single TXT or SPF RR record.
		</blockquote>
		<p>
			Searching online about the 255-byte limit shows a lot of posts by people trying to bypass it in BIND after the error <i>invalid rdata format: ran out of space</i>.
		</p>
		<p>
			So we want to stay below that byte limit for maximum compatibility.
		</p>

		<h2>Compression</h2>
		<p>
			Using Python, base64, and zlib, we can naively compress the data then base64 encode it:
		</p>
		<pre>
			<code>
				{`>>> lorem_ipsum = b"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions"
>>> len(lorem_ipsum)
558
>>> import base64, zlib
>>> lorem_ipsum_compressed = base64.b64encode(zlib.compress(lorem_ipsum,9))
>>> len(lorem_ipsum_compressed)
440`}
			</code>
		</pre>
		<p>A reduction of 118 characters, not bad.</p>

		<h2>Proof of Concept</h2>
		<p>
			I created a TXT record on <code>message.theden.sh</code> with the zlib + base64 method above:
		</p>
		<pre>
			<code>
				dig message.theden.sh TXT +short<br/>
				"eNrzTFOozC9VL0pVKEpNTMnMS1coycgsVsgsUS9WKMnPV8hJLElVBAD3QAzt"
			</code>
		</pre>
		<p>and to decompress it in one line:</p>
		<pre>
			<code>
				dig message.theden.sh TXT +short | python3 -c "import sys, zlib, base64; print(zlib.decompress(base64.b64decode(sys.stdin.readlines()[0])))"
			</code>
		</pre>
		<p>If you're reading this it's too late!</p>
		<p>So it works as expected. Now we need an interesting use-case.</p>

		<h2>DNS as a Password Manager?</h2>
		<p>It feels wrong, but here it goes. Let’s encrypt a secret with a password:</p>
		<pre>
			<code>
				{`# encrypt secret
echo -n 'mySuperSecretPassword1!!1!!' | openssl enc -e -aes-256-cbc -a -salt -pbkdf2
enter aes-256-cbc encryption password:
Verifying - enter aes-256-cbc encryption password:
U2FsdGVkX1/6QtzsEgPSLYdsSmIeVdH/0t7Tcwfr7ixWyDGzHu/Saz8YrKQ84kGd`}
			</code>
		</pre>
		<p>
			I stored the encrypted secret on the TXT record under <code>pass.theden.sh</code>:
		</p>
		<pre>
			<code>
				dig pass.theden.sh TXT +short | sed 's/^"\(.*\)"$/\1/' | openssl aes-256-cbc -a -d -salt -pbkdf2
			</code>
		</pre>
		<p>
			enter aes-256-cbc decryption password:
		</p>
		<pre>
			<code>mySuperSecretPassword1!!1!!</code>
		</pre>
		<p>
			You can try it yourself, the password to decrypt is <code>hackerman</code>.
		</p>

		<h2>Some Thoughts and Ideas</h2>
		<ul>
			<li>
				Encrypted passwords can be stored per domain, e.g., <code>gmail.theden.sh</code>, <code>apple.theden.sh</code>, and distributed for you via propagation, in a decentralised manner, on a standard protocol without vendor lock-in, portability, and not having to worry about a password management service getting hacked.
			</li>
			<li>
				Downside: I guess you really have to believe that a bad actor can’t decrypt it. And you have to pay for a domain name.
			</li>
			<li>
				With only four TXT records that’s ~1KB of compressed data. Some demoscene intros can be stored in TXT records.
			</li>
			<li>
				You could theoretically store an arbitrary amount of data, if there is no limit on the number of TXT records you can create. I haven’t tried this, but would like to know what the limit is.
			</li>
			<li>
				More registrars need to have APIs for updating records. With an API, one could programmatically update TXT records.
			</li>
		</ul>
	</>
        );
    }
}
