<template>
  <div>

  </div>
</template>

<script setup>
import * as THREE from "three"
import { SceneInjectionKey } from 'troisjs'
const props = defineProps({
  size: {
    type: Number,
    default: 50
  },
  text: String,
  position: Object
})
const scene = inject(SceneInjectionKey)
const ctx = document.createElement('canvas').getContext('2d');
const borderSize = 10;
const size = props.size
const text = props.text
const x = props.position.x
const y = props.position.y
const z = props.position.z
const font = `${size}px bold sans-serif`;
ctx.font = font;
// measure how long the name will be
const textWidth = ctx.measureText(text).width;
const baseWidth = 120
const doubleBorderSize = borderSize * 2;
const width = baseWidth + doubleBorderSize;
const height = size + doubleBorderSize;
ctx.canvas.width = width;
ctx.canvas.height = height;

// need to set font again after resizing canvas
ctx.font = font;
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

ctx.fillStyle = '#3344FF';
ctx.fillRect(0, 0, width, height);

// scale to fit but don't stretch
const scaleFactor = Math.min(1, baseWidth / textWidth);
ctx.translate(width / 2, height / 2);
ctx.scale(scaleFactor, 1);
ctx.fillStyle = 'white';
ctx.fillText(text, 0, 0);

const texture = new THREE.CanvasTexture(ctx.canvas);
texture.minFilter = THREE.LinearFilter;
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;

const labelMaterial = new THREE.SpriteMaterial({
  map: texture,
  transparent: true,
});
const label = new THREE.Sprite(labelMaterial);
label.position.x = x;
label.position.y = y;
label.position.z = z;
const labelBaseScale = 0.01;
label.scale.x = ctx.canvas.width * labelBaseScale;
label.scale.y = ctx.canvas.height * labelBaseScale;

scene.add(label)
</script>

<style lang="scss" scoped>

</style>
