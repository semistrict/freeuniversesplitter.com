<div class="crt-screen">
  <div class="crt-bezel">
    <div class="crt-content">
      <div class="content-area">
        <slot/>
      </div>
      <div class="scanlines"></div>
      <div class="vignette"></div>
      <div class="flicker"></div>
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
  
  @media (max-width: 768px) {
    .crt-screen {
      padding: 1vh 1vw;
    }
    
    .crt-content {
      border-radius: 20px;
    }
  }
</style>