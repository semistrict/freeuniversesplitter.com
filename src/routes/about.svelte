<script lang="ts">
	import BackButton from '$lib/BackButton.svelte';

	function showDebugInfo() {
		var ua = navigator.userAgent || navigator.vendor;
		window.alert(`UserAgent: ${ua}`);
	}
</script>

<div class="about-content">
	<BackButton />

	<p>
		<a href="/about-mcp">MCP Server</a> | <a href="/about-api">Quantum Randomness API</a>
	</p>

	<h1>Disclaimer</h1>

	<p>
		<b>I am not a physicist!</b>
	</p>

	<p>Remember: the outcomes this app selects are as random as random gets! Use with caution.</p>

	<h1>FAQ</h1>

	<h2>How does it work?</h2>

	<p>
		It assumes the Everett (aka "Many Worlds") intepretation of Quantum Mechanics. Many physicists
		subscribe to this interpretation but it's not universally accepted.
	</p>

	<p>
		Basically I just periodically retrieve quantum randomness from multiple sources and combine them
		to maximize entropy and reliability. These sources include:
	</p>
	<ul>
		<li>
			<a href="https://qrng.anu.edu.au/">Australian National University</a> - quantum vacuum fluctuations
		</li>
		<li>
			<a href="https://random.colorado.edu/">NIST CURBy Beacon</a> - quantum entanglement measurements
		</li>
		<li>
			<a href="https://beacon.inmetro.gov.br/">Brazilian INMETRO Beacon</a> - cryptographically signed quantum pulses
		</li>
		<li>
			<a href="https://lfdr.de/QRNG/">German LfD Laboratory</a> - ID Quantique hardware quantum generator
		</li>
		<li>
			<a href="https://beacon.nist.gov/">NIST Randomness Beacon</a> - government-grade quantum randomness
		</li>
		<li>
			<a href="https://www.random.org/">Random.org</a> - atmospheric noise quantum randomness
		</li>
		<li>
			<a href="https://developers.cloudflare.com/workers/runtime-apis/web-crypto/">Cloudflare Web Crypto</a> - cryptographically secure randomness
		</li>
	</ul>
	<p>
		I then use this combined quantum randomness to select one of the outcomes in proportion to the
		number of universes you chose for that outcome.
	</p>
	<p>
		My understanding is that the quantum randomness will effectively be different in different
		branches of the universe and so each branch will see a different outcome.
	</p>

	<p>
		So technically the universe is already split as soon as the quantum randomness is sampled. The
		point of this app is to "amplify" the quantum randomness to the level of something meaninful so
		you can decide to do different things in different universes.
	</p>

	<h2>Which branch of the universe do you end up in?</h2>

	<p>
		You will end up in all of them! According to the Everett interpretation, you are a quantum
		system because you're made up of quantum systems and so you (your body, your brain, your
		consciousness) will split into many copies along with the rest of the universe.
	</p>
	<p>
		Subjectively, it will seem like one of the outcomes happened at random but this is just because
		your memory and experience was split. This is related to "self-locating uncertainty".
	</p>

	<h2>Do I have to do whatever it says?</h2>
	<p>
		No! Think of it like a magic 8 ball. The universe is split regardless of whether you actually
		perform whatever action you input.
	</p>

	<h2>Is the Many Worlds / Evertt Interpretation correct?</h2>

	<p>
		I think it is and I think a majority of physicists who work in relevant fields now agree on this
		(citation needed).
	</p>

	<p>
		For many years we suffered under the Copenhagen Interpretation. That's probably the one you've
		heard of about the "wave function collapse". Everett gets rid of the concept of wave function
		collapse (for which there is no evidence).
	</p>

	<h2>How is this different from a coin toss?</h2>

	<p>
		When you toss a coin the outcome is pretty easy to deterimine if you know the exact position and
		forces involved. So doing this does not cause the universe to branch: only one outcome ever
		happens.
	</p>

	<p>
		Quantum randmess is truly random: unpredictable in principle. But this "randomness" is really
		just an instance of self-locating uncertainty from your perspective. There is nothing
		non-deterministic going on (unlike in the Copenhagen Interpretation).
	</p>

	<h2>How do I know that the other branches are real?</h2>

	<p>
		They are predicted by our best theory of how the world works at a fundamental level, the basis
		for most 20th century technology. You cannot accept a scientific theory without accepting all
		its consequences!
	</p>

	<p>
		It is important to note that the Everett interpretation does not start off <em>assuming</em> the
		existence of the other branches. They "fall out" as a natural consequence of the math. Pretending
		that they don't really exist is just a kind of existential chauvinism, in my opinion.
	</p>

	<h2>Can I send a message to myself in the other universe?</h2>
	<p>
		No. The splitting process (called decoherence) is one-way. There is no way to interact with the
		other branches or for them to influence one another that we know of.
	</p>

	<h2>Why did you make this?</h2>
	<p>
		A few reasons really: I struggle with indecisiveness and I've been using the original paid
		<a href="https://apps.apple.com/us/app/universe-splitter/id329233299">Universe Splitter app</a>
		for a while to help me make some decisions with less anxiety. I wanted a version that allows me to
		change the probabilities of each outcome. I also wanted to make something that anyone could use for
		free because the multiverse belongs to us all.
	</p>
	<p>
		At a deeper level, it's difficult to put into words how profoundly the many worlds idea has
		affected my outlook on life. <a href="eclipse">This is one example</a>. I hope to write more
		about this in the future.
	</p>

	<h2>But what is really going on?</h2>

	<p>
		When we use words like "universe", "split" etc. these are all approximations to the underlying
		mathematic model.
	</p>
	<p>
		It is "kind of like" there are multiple classical universes that split and from your perspective
		(pre-split) you can think of the probabilities as the chance of you ending up in each branch.
	</p>
	<p>
		But, really<br />there are no separate universes<br />there is no "you"<br />there's just wave
		function.
	</p>

	<h2>Media</h2>

	<p>
		My introduction to this idea was David Deutsch's the Fabric of Reality and I highly recommend
		this book.
	</p>
	<p>
		<a href="https://www.youtube.com/watch?v=qGLzM0i7a_A">Sean Carrol on Closer to Truth</a>
	</p>
	<p>
		<a href="https://github.com/semistrict/freeuniversesplitter.com"
			>This website is open source on GitHub</a
		>
	</p>

	<h2>Do you store the outcomes of the split?</h2>
	<p>
		Nothing you enter into this site is sent to the server at all. So no, there is no way for me to
		even know what you entered let alone store it.
	</p>

	<p>This app does not use cookies or local storage.</p>

	<h2>Is this a quantum computer?</h2>
	<p>
		No. Quantum random numbers are pretty easy to generate with the right hardware because the world
		around us is quantum at a fundamental level so you just need to be able to measure these
		miniscule fluctuations. Most computers do not have hardware to do this, so we rely on quantum
		randomness from multiple research institutions worldwide that provide public quantum random number
		generation services.
	</p>

	<h2>Is there a native iPhone/Android app?</h2>
	<p>
		Not right now. On iPhones, you can install this to your home screen by clicking the "Share"
		button in Safari and selecting "Add to Home Screen",
		<a href="https://www.youtube.com/watch?v=I4e1aoi0P-o">like this.</a>
		There is probably something analogous in Android/Chrome but I don't know how to do it there.
	</p>

	<p>
		I do have a native Apple Watch app that is in private beta. See contact details below if you
		would like to try it out.
	</p>

	<h2>How do I get in touch?</h2>

	<p>
		Feel free to <a href="https://github.com/semistrict/freeuniversesplitter.com/issues/new"
			>file issues on GitHub</a
		>
		for feature requests or bugs.
	</p>

	<div>
		<button on:click={showDebugInfo}>Debug Info</button>
	</div>

	<h2>Credits</h2>
	<ul>
		<li><a href="https://laemeur.sdf.org/fonts/">Less Perfect DOS VGA font</a></li>
	</ul>

	<BackButton />
</div>
