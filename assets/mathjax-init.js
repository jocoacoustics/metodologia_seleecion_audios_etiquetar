/* MathJax 3: TeX -> CHTML. Degradación segura: MathML nativo sin conexión o sin fuentes. */
window.MathJax = {
  tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']], processEscapes: true },
  chtml: { fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2' },
  startup: {
    typeset: false,
    ready() {
      MathJax.startup.defaultReady();
      MathJax.startup.promise.then(async () => {
        const nodes = [...document.querySelectorAll('figure.mathline .math-source')];
        try {
          await MathJax.typesetPromise(nodes);
          await document.fonts.ready;
          const faces = [...document.fonts].filter(face => /^MJX/.test(face.family));
          const failed = faces.some(face => face.status === 'error');
          // CSS fonts are remote. If unavailable, semantic native MathML stays visible.
          if (failed || !faces.length) return;
          for (const node of nodes) {
            if (node.querySelector('mjx-container')) node.parentElement.classList.add('math-enhanced');
          }
        } catch (e) {
          console.warn('MathJax no disponible; se mantiene MathML nativo:', e);
        }
      });
    }
  }
};
