declare module "vanta/dist/vanta.birds.min" {
    export interface BirdsEffect {
      destroy: () => void;
    }
  
    export interface BirdsOptions {
      el: HTMLElement | string;                 // we'll ensure non-null in code
      THREE?: typeof import("three");           // pass THREE instance
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      backgroundColor?: number;
      color1?: number;
      color2?: number;
      birdSize?: number;
      wingSpan?: number;
      speedLimit?: number;
      separation?: number;
      alignment?: number;
      cohesion?: number;
      quantity?: number;
      backgroundAlpha?: number;
      [key: string]: unknown;                   // allow extra options without `any`
    }
  
    export default function BIRDS(options: BirdsOptions): BirdsEffect;
  }
  