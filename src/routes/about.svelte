<style>
    * {
        font-family: monospace;
    }
</style>

<h1>Disclaimer</h1>

<p><b>I am not a physicist!</b> 
    
    This is all my best guess at what's going on as I understand it. 
    I do love thinking and talking about this stuff.

    I will add a contact sheet soon, for now you can <a href="https://github.com/semistrict/freeuniversesplitter.com">open an issue on GitHub</a>.
</p>

<p>
    Please use this responsibly: what you enter into this site is not sent to the server at all so I have no way 
    of knowing what you are using this for. 
</p>

<h1>FAQ</h1>

<h2>How does it work?</h2>

<p>
    It depends on the Everett (or Many Worlds) intepretation of Quantum Mechanics.
    Many physicists subscribe to this interpretation but it's not universally accepted.
</p>

<p>
    Basically I just call a <a href="https://qrng.anu.edu.au/">quantum random number generator API provided by ANU</a>
    and use that to select one of the outcomes in proportion to the number of universes you chose for that outcome.
</p>
    <p>
    My understanding is that the quantum randomness will effectively be different in each universe and so
    each universe will see a different outcome.
</p>

<p>So technically the universe is already split as soon as the quantum randomness is sampled. 
    
    The point of this app is to "amplify" the quantum randomness to
    the level of something meaninful so you can decide to do different things in different universes.</p>
    
<h2>Which universe do you end up in?</h2>

<p>You can't know ahead of time. This is called "self-locating uncertainty".</p>    

<h2>
    Is the Many Worlds / Evertt Interpretation correct?
</h2>

<p>
    I think it is and I think a majority of physicists who work in relevant fields now agree on this (citation needed).
</p>

<p>
    For many years we suffered under the Copenhagen Interpretation. 
    That's probably the one you've heard of about the "wave function collapse".
    This concept is intellectually bankrupt (IMO). 
    Everett basically gets rid of the concept of wave function collapse.
</p>

<h2>How is this different from a coin toss?</h2>

<p>
    When you toss a coin the outcome is actually pretty easy to deterimine if you know the exact position and
    forces involved. Another way to say this is that the coin always lands in the same position in all 
    universes (that branched off the start of the coin flip).
</p>

<p>
    Quantum randmess is truly random: unpredictable in principle. But this "randomness" is really just 
    an instance of self-locating uncertainty. QM under Everett is deterministic.
</p>

<h2>How do I know that the other universes are real?</h2>

<p>
    They are predicted by our best theory of how the world works at a fundamental level (Quantum Mechanics).
    You cannot accept the theory without accepting ALL its consequences.
</p>

<h2>Can I send a message to myself in the other universe?</h2>
<p>No. The splitting process (called decoherence) is one-way. There is no way to interact with the other branches.</p>

<h2>Why did you make this?</h2>
<p>
    A few reasons really. 
    I struggle with indecisiveness and I've been using the original 
    <a href="https://apps.apple.com/us/app/universe-splitter/id329233299">Universe Splitter app</a> 
    for a while to help me make some decisions with less anxiety. I wanted a version that allows me
    to change the number of univeses with each outcome. I also wanted to make something that 
    anyone could use for free.
</p>
<p>
    At a deeper level though, it's difficult to put into words how profoundly the many worlds idea has 
    affected my outlook on life. I will write more about this some day perhaps.
</p>

<h2>
    But what is really going on?
</h2>

<p>
    When we use words like "universe", "split" etc. these are all approximations.
</p>
<p>
    It is kind of like there are multiple classical universes 
    that split and from your perspective (pre-split)
    you can think of the probabilities as the chance of you ending up in each branch.
</p>
<p>
    But, really,<br>there are no separate universes,<br>there is no "you",<br>there's just wave function.
</p>

<h2>Media (will add more, PRs welcome)</h2>

<p>
    My introduction to this idea was David Deutsch's the Fabric of Reality and I highly recommend this book.
</p>
<p>
<a href="https://www.youtube.com/watch?v=qGLzM0i7a_A">Sean Carrol on Closer to Truth</a>
</p>
<p>
    <a href="https://github.com/semistrict/freeuniversesplitter.com">UI is here on GitHub</a>
    I plan to also make the server-side code available but for now it's just in a CloudFlare worker which I edited on their site.
</p>
