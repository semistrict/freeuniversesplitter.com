<script lang="ts">
	import BackButton from '$lib/BackButton.svelte';
</script>

<div class="about-content">
	<BackButton />

	<h1>Quantum Randomness API</h1>

	<p>
		The Free Universe Splitter provides a public API for accessing quantum randomness and monitoring the health of quantum sources. All endpoints return responses using true randomness from multiple international research institutions.
	</p>

	<h2>Public Endpoints</h2>

	<h3>GET /</h3>
	<p>
		Returns a quantum-selected outcome from the classic Magic 8-Ball responses or custom options.
	</p>
	<p><strong>Parameters:</strong></p>
	<ul>
		<li><code>outcome</code> - Custom outcomes to choose from (can be specified multiple times)</li>
		<li><code>max</code> - Generate numbered options from 1 to max</li>
	</ul>
	<p><strong>Example:</strong></p>
	<pre><code>curl "https://api.freeuniversesplitter.com/?outcome=Pizza&outcome=Tacos"
curl "https://api.freeuniversesplitter.com/?max=10"</code></pre>

	<h3>GET /rndnum</h3>
	<p>
		Returns a quantum random number generated from combined quantum sources.
	</p>
	<p><strong>Example:</strong></p>
	<pre><code>curl https://api.freeuniversesplitter.com/rndnum</code></pre>


	<h3>GET /status</h3>
	<p>
		Returns the latest status report from the most recent quantum source update, including timestamps and performance metrics.
	</p>
	<p><strong>Example:</strong></p>
	<pre><code>curl https://api.freeuniversesplitter.com/status</code></pre>

	<h2>Quantum Sources</h2>

	<p>The API combines randomness from seven diverse sources for maximum entropy and reliability:</p>
	<ul>
		<li><strong>Australian National University</strong> - Quantum vacuum fluctuations measured through laser interferometry</li>
		<li><strong>CURBy (NIST + University of Colorado)</strong> - Quantum entanglement measurements using Bell tests</li>
		<li><strong>Brazilian INMETRO Beacon</strong> - Cryptographically signed quantum pulses from government laboratory</li>
		<li><strong>German LfD Laboratory</strong> - ID Quantique hardware quantum generator using photon detection</li>
		<li><strong>NIST Randomness Beacon</strong> - U.S. government quantum randomness beacon with 60-second pulses</li>
		<li><strong>Random.org</strong> - Atmospheric noise converted to quantum randomness</li>
		<li><strong>Cloudflare Web Crypto</strong> - Cryptographically secure pseudorandom generator</li>
	</ul>

	<h2>Cryptographic Combining</h2>

	<p>
		The API uses SHA-256 cryptographic hashing to securely combine randomness from all successful sources. This ensures:
	</p>
	<ul>
		<li><strong>Uniform distribution</strong> - Hash functions create evenly distributed output</li>
		<li><strong>Avalanche effect</strong> - Small changes in any source dramatically change the result</li>
		<li><strong>Forward security</strong> - Previous outputs don't reveal information about future ones</li>
		<li><strong>Domain separation</strong> - Sources are combined with delimiters to prevent collision attacks</li>
	</ul>

	<h2>Reliability</h2>

	<p>
		The system automatically handles source failures gracefully. If some quantum sources are unavailable, the API continues operating with the remaining sources. The system maintains a minimum entropy threshold and includes timestamps and source counts in the cryptographic combination for additional randomness.
	</p>

	<p>
		Quantum sources are monitored hourly through automated cron jobs, with status information available through the <code>/status</code> endpoint. Response times and success rates are tracked for each source.
	</p>

	<h2>CORS Support</h2>

	<p>
		All endpoints include proper CORS headers (<code>Access-Control-Allow-Origin: *</code>) for browser-based applications and support both GET and OPTIONS requests.
	</p>

	<BackButton />
</div>