<script>
  import { onMount } from 'svelte';
  
  let showSignalLost = false;
  let signalLostInterval;
  let showScreenFutz = false;
  let screenFutzInterval;
  
  // Listen for universe splitting events
  onMount(() => {
    const handleSplitStart = () => {
      startSignalLostEffects();
    };
    
    const handleSplitEnd = () => {
      stopSignalLostEffects();
    };
    
    window.addEventListener('universe-split-start', handleSplitStart);
    window.addEventListener('universe-split-end', handleSplitEnd);
    
    return () => {
      window.removeEventListener('universe-split-start', handleSplitStart);
      window.removeEventListener('universe-split-end', handleSplitEnd);
      if (signalLostInterval) clearInterval(signalLostInterval);
    };
  });
  
  function startSignalLostEffects() {
    // Deterministic pattern: show signal lost at specific intervals
    const pattern = [800, 1200, 400, 1600, 600]; // milliseconds between effects
    let patternIndex = 0;
    let nextTimeout;
    
    function scheduleNext() {
      nextTimeout = setTimeout(() => {
        showSignalLost = true;
        setTimeout(() => {
          showSignalLost = false;
          patternIndex = (patternIndex + 1) % pattern.length;
          scheduleNext();
        }, 500); // Fixed 500ms duration
      }, pattern[patternIndex]);
    }
    
    scheduleNext();
    
    // Store timeout reference for cleanup
    signalLostInterval = { clear: () => clearTimeout(nextTimeout) };
  }
  
  function stopSignalLostEffects() {
    if (signalLostInterval) {
      if (signalLostInterval.clear) {
        signalLostInterval.clear();
      } else {
        clearInterval(signalLostInterval);
      }
      signalLostInterval = null;
    }
    showSignalLost = false;
  }
  
  function startScreenFutzEffects() {
    // Deterministic pattern for screen futz
    const futzPattern = [300, 150, 450, 100, 200, 350]; // milliseconds between effects
    let futzIndex = 0;
    let nextFutzTimeout;
    
    function scheduleNextFutz() {
      nextFutzTimeout = setTimeout(() => {
        showScreenFutz = true;
        setTimeout(() => {
          showScreenFutz = false;
          futzIndex = (futzIndex + 1) % futzPattern.length;
          scheduleNextFutz();
        }, 80); // Fixed 80ms duration for quick futz
      }, futzPattern[futzIndex]);
    }
    
    scheduleNextFutz();
    
    // Store timeout reference for cleanup
    screenFutzInterval = { clear: () => clearTimeout(nextFutzTimeout) };
  }
  
  function stopScreenFutzEffects() {
    if (screenFutzInterval) {
      if (screenFutzInterval.clear) {
        screenFutzInterval.clear();
      } else {
        clearInterval(screenFutzInterval);
      }
      screenFutzInterval = null;
    }
    showScreenFutz = false;
  }
</script>

<div class="crt-screen">
  <div class="crt-bezel">
    <div class="crt-content">
      <div class="content-area">
        <slot/>
      </div>
      <div class="scanlines"></div>
      <div class="vignette"></div>
      <div class="flicker"></div>
      {#if showSignalLost}
        <div class="signal-lost">
          <div class="signal-lost-text">SIGNAL LOST</div>
          <div class="signal-lost-static"></div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .crt-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .crt-bezel {
    width: min(90vw, 80vh * 4/3);
    height: min(90vw * 3/4, 80vh);
    max-width: 1200px;
    max-height: 900px;
    background: linear-gradient(45deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-radius: 60px;
    padding: 40px;
    box-sizing: border-box;
    position: relative;
    box-shadow: 
      inset 0 0 50px rgba(0,0,0,0.8),
      0 0 100px rgba(0,0,0,0.5);
  }
  
  @media (max-width: 768px) {
    .crt-bezel {
      width: 95vw;
      height: 85vh;
      max-width: none;
      max-height: none;
      border-radius: 30px;
      padding: 20px;
    }
  }
  
  .crt-content {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, transparent 70%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.4) 100%);
    border-radius: 40px;
    position: relative;
    overflow: hidden;
  }
  
  .crt-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.15) 0%,
      transparent 30%,
      transparent 70%,
      rgba(255,255,255,0.08) 100%
    );
    z-index: 100;
    pointer-events: none;
  }
  
  .crt-content::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse 200px 300px at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
      radial-gradient(ellipse 150px 200px at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);
    z-index: 101;
    pointer-events: none;
  }
  
  .content-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 30px;
    box-sizing: border-box;
    contain: layout;
  }
  
  .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0,0,0,0.1) 1px,
      rgba(0,0,0,0.1) 2px
    );
    pointer-events: none;
    z-index: 1;
  }
  
  .vignette {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 2;
  }
  
  .flicker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(65,255,0,0.02);
    pointer-events: none;
    z-index: 3;
    animation: flicker 2s infinite;
  }
  
  @keyframes flicker {
    0%, 50%, 100% { opacity: 0.8; }
    25% { opacity: 0.9; }
    75% { opacity: 0.85; }
  }
  
  .signal-lost {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: signalLostFlicker 0.1s infinite;
  }
  
  .signal-lost-text {
    font-size: 32pt;
    color: #ff0000;
    font-weight: bold;
    text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
    z-index: 201;
    animation: signalLostPulse 0.2s infinite;
  }
  
  @keyframes signalLostPulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .signal-lost-static {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.3) 0px,
        rgba(255, 255, 255, 0.3) 2px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.2) 0px,
        rgba(255, 255, 255, 0.2) 1px,
        transparent 1px,
        transparent 3px
      );
    animation: staticNoise 0.05s infinite;
  }
  
  @keyframes signalLostFlicker {
    0% { opacity: 1; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  
  @keyframes staticNoise {
    0% { transform: translateX(0px) translateY(0px); opacity: 1; }
    20% { transform: translateX(-2px) translateY(2px); opacity: 0.8; }
    40% { transform: translateX(3px) translateY(-1px); opacity: 0.9; }
    60% { transform: translateX(-1px) translateY(-2px); opacity: 0.7; }
    80% { transform: translateX(2px) translateY(1px); opacity: 0.85; }
    100% { transform: translateX(-3px) translateY(3px); opacity: 1; }
  }
  
  
  .crt-bezel::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border-radius: 50px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .signal-lost {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: signalLostFlicker 0.1s infinite;
  }
  
  .signal-lost-text {
    font-size: 32pt;
    color: #ff0000;
    font-weight: bold;
    text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
    z-index: 201;
    animation: signalLostPulse 0.2s infinite;
  }
  
  @keyframes signalLostPulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .signal-lost-static {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.3) 0px,
        rgba(255, 255, 255, 0.3) 2px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.2) 0px,
        rgba(255, 255, 255, 0.2) 1px,
        transparent 1px,
        transparent 3px
      );
    animation: staticNoise 0.05s infinite;
  }
  
  @keyframes signalLostFlicker {
    0% { opacity: 1; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  
  @keyframes staticNoise {
    0% { transform: translateX(0px) translateY(0px); opacity: 1; }
    20% { transform: translateX(-2px) translateY(2px); opacity: 0.8; }
    40% { transform: translateX(3px) translateY(-1px); opacity: 0.9; }
    60% { transform: translateX(-1px) translateY(-2px); opacity: 0.7; }
    80% { transform: translateX(2px) translateY(1px); opacity: 0.85; }
    100% { transform: translateX(-3px) translateY(3px); opacity: 1; }
  }
  
  .screen-futz {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 2%,
        transparent 4%,
        transparent 96%,
        rgba(255, 255, 255, 0.1) 98%,
        transparent 100%
      );
    z-index: 300;
    pointer-events: none;
    animation: screenFutzEffect 0.08s linear infinite;
  }
  
  @keyframes screenFutzEffect {
    0% { 
      transform: translateX(0px) scaleY(1);
      opacity: 0.8;
    }
    25% { 
      transform: translateX(-1px) scaleY(0.98);
      opacity: 0.9;
    }
    50% { 
      transform: translateX(1px) scaleY(1.02);
      opacity: 0.7;
    }
    75% { 
      transform: translateX(-2px) scaleY(0.99);
      opacity: 0.85;
    }
    100% { 
      transform: translateX(0px) scaleY(1);
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    .crt-screen {
      padding: 1vh 1vw;
    }
    
    .crt-content {
      border-radius: 20px;
    }
    
    .signal-lost-text {
      font-size: 24pt;
    }
  }
</style>