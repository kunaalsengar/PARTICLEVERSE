import * as THREE from 'three';
import { ColorPaletteId, ColorPalette } from '../types';
import { COLOR_PALETTES } from '../constants/palettes';

export class ColorEngine {
  public static getPalette(id: ColorPaletteId): ColorPalette {
    const found = COLOR_PALETTES.find((p) => p.id === id);
    return (
      found || {
        id: 'pure-white',
        name: 'Pure White',
        primary: '#FFFFFF',
        secondary: '#E2E8F0',
        accent: '#94A3B8',
        ambientGlow: '#FFFFFF'
      }
    );
  }

  /**
   * Generates Float32Array RGB colors for the particle buffer
   */
  public static generateColors(
    paletteId: ColorPaletteId,
    count: number,
    positions: Float32Array,
    customColors?: { primary: string; secondary: string; accent: string }
  ): Float32Array {
    const colors = new Float32Array(count * 3);
    const palette = this.getPalette(paletteId);

    const c1 = new THREE.Color(customColors?.primary || palette.primary);
    const c2 = new THREE.Color(customColors?.secondary || palette.secondary);
    const c3 = new THREE.Color(customColors?.accent || palette.accent);

    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);

      if (paletteId === 'pure-white') {
        // Pure White foundational identity with subtle luminance shading
        const luminance = THREE.MathUtils.clamp(0.75 + (dist / 4.0) * 0.25, 0.7, 1.0);
        colors[i3] = luminance;
        colors[i3 + 1] = luminance;
        colors[i3 + 2] = luminance;
      } else if (paletteId === 'rainbow') {
        const hue = (i / count + dist * 0.1) % 1.0;
        tempColor.setHSL(hue, 0.9, 0.65);
        colors[i3] = tempColor.r;
        colors[i3 + 1] = tempColor.g;
        colors[i3 + 2] = tempColor.b;
      } else {
        // Blend across primary -> secondary -> accent based on radius & height
        const factor = THREE.MathUtils.clamp(dist / 3.5, 0, 1);
        if (factor < 0.5) {
          tempColor.copy(c1).lerp(c2, factor * 2.0);
        } else {
          tempColor.copy(c2).lerp(c3, (factor - 0.5) * 2.0);
        }

        colors[i3] = tempColor.r;
        colors[i3 + 1] = tempColor.g;
        colors[i3 + 2] = tempColor.b;
      }
    }

    return colors;
  }
}
