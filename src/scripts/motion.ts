import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    motionOK: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
  },
  (ctx) => {
    const { motionOK } = ctx.conditions as { motionOK: boolean };

    if (!motionOK) {
      gsap.set('[data-reveal]', { clearProps: 'all', autoAlpha: 1 });
      return;
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 첫 화면 아래 요소에만 data-reveal을 붙인다
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6, // TODO(design): tokens의 --dur-slow와 맞추기
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  },
);
