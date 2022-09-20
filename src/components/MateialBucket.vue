<template>
  <Group ref="selectableGroupRef" v-bind="$attrs">
    <GltfModel v-for="model of models" @load="onModelReady" :src="model.path" :position="model.position" :props="{
      castShadow: true,
      receiveShadow: true,
    }" />
  </Group>
</template>

<script setup>
import * as THREE from "three";
import { GltfModel, Group } from "troisjs";
const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x3355aa });
defaultMaterial.side = THREE.DoubleSide; // side

defineProps({
  onModelReady: Function
})

const models = ref([
  {
    path: "/model/储料桶.glb",
    position: {
      x: 0.1,
      y: 1,
      z: 0.65,
    },
  },
  {
    path: "/model/给料螺旋.glb",
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  {
    path: "/model/给料电机.glb",
    position: {
      x: 0,
      y: 0.8,
      z: -0.05,
    },
  },
  {
    path: "/model/输送提升.glb",
    position: {
      x: 2.65,
      y: 0.8,
      z: 0.35,
    },
  },
]);
</script>

<style lang="scss" scoped>

</style>
