<template>
  <div ref="wrapperRef" style="width: 100vw; height: 100vh">
    <Renderer
      ref="rendererRef"
      antialias
      alpha
      :orbit-ctrl="{
        enableDamping: true,
        enablePan: true,
        dampingFactor: 0.05,
        screenSpacePanning: false,
        minDistance: 0.1,
        maxDistance: 1000,
        maxPolarAngle: (Math.PI / 2 / 90) * 85,
      }"
      :pointer="{ intersectRecursive: true }"
      shadow
      :resize="true"
    >
      <Camera
        ref="cameraRef"
        :position="{ z: 10, x: 2, y: 5 }"
        :fov="75"
        :near="0.1"
        :far="5000"
      />
      <!-- <Raycaster
        intersect-mode="frame"
        @pointerEnter="onPointerOver"
        @click="onPointerEvent"
      /> -->
      <Scene ref="sceneRef" background="#030303">
        <HemisphereLight
          color="#FF3533"
          groundColor="#FF8080"
          :position="{ x: 0, y: 50, z: 0 }"
          cast-shadow
        />
        <DirectionalLight
          color="#FFFFFF"
          :position="{ x: 0, y: 1, z: 0 }"
          cast-shadow
          :shadowMapSize="{
            width: 2048,
            height: 2048,
          }"
        />
        <PointLight :position="{ x: 1, y: 1, z: 1 }" />
        <!-- sky -->
        <Mesh>
          <ShaderMaterial
            :props="{
              uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 },
              },
              vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(
      position, 1.0 ); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix
      * modelViewMatrix * vec4( position, 1.0 ); }`,
              fragmentShader: ` uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float
      exponent; varying vec3 vWorldPosition; void main() { float h = normalize(
      vWorldPosition + offset ).y; gl_FragColor = vec4( mix( bottomColor, topColor, max(
      pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 ); }`,
              side: THREE.BackSide,
            }"
          />
          <SphereGeometry :radius="4000" :width-segments="32" :height-segments="16" />
        </Mesh>
        <!-- ground grass -->
        <Mesh
          :position="{
            y: 0,
          }"
          :rotation="{
            x: -Math.PI / 2,
          }"
          receive-shadow
        >
          <PlaneGeometry :width="5000" :height="5000" />
          <BasicMaterial>
            <Texture src="/textures/grass.jpeg" :onLoad="configGroundTexture" />
          </BasicMaterial>
        </Mesh>
        <!-- ground cement -->
        <Mesh
          :position="{
            y: 0.01,
          }"
          :rotation="{
            x: -Math.PI / 2,
          }"
          receive-shadow
        >
          <PlaneGeometry :width="20" :height="20" />
          <BasicMaterial>
            <Texture src="/textures/cement.jpeg" />
          </BasicMaterial>
        </Mesh>
        <!-- Model -->
        <Group ref="selectableGroupRef">
          <GltfModel
            @click="onPointerEvent"
            @load="onModelReady"
            src="/model/储料桶.glb"
            :position="{
              x: 0.05,
              y: 1,
              z: 0.65,
            }"
            :props="{
              castShadow: true,
            }"
          />
          <GltfModel
            src="/model/给料槽.glb"
            @click="onPointerEvent"
            @load="onModelReady"
            :position="{
              x: 3,
              y: 0,
              z: 0.6,
            }"
          />
          <GltfModel
            src="/model/给料电机.glb"
            @click="onPointerEvent"
            @load="onModelReady"
            :position="{
              x: 0,
              y: 1,
              z: -0.05,
            }"
          />
          <GltfModel
            src="/model/给料螺旋.glb"
            @click="onPointerEvent"
            @load="onModelReady"
            :position="{
              x: 0,
              y: 0,
              z: 0,
            }"
          />
        </Group>
      </Scene>
      <!-- 后处理 -->
      <EffectComposer ref="composerRef">
        <RenderPass />
        <!-- <UnrealBloomPass :strength="1" /> -->
        <!-- <HalftonePass :radius="1" :scatter="0" /> -->
        <FXAAPass />
        <EffectPass />
      </EffectComposer>
    </Renderer>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ref, onMounted } from "vue";
import {
  Box,
  EffectComposer,
  UnrealBloomPass,
  FXAAPass,
  EffectPass,
  RenderPass,
  Mesh,
  GltfModel,
  Texture,
  Group,
  PlaneGeometry,
  SphereGeometry,
  BasicMaterial,
  Camera,
  LambertMaterial,
  HemisphereLight,
  DirectionalLight,
  PointLight,
  Renderer,
  Scene,
} from "troisjs";
const wrapperRef = ref();
const rendererRef = ref();
const sceneRef = ref();
const cameraRef = ref();
const composerRef = ref();
const selectableGroupRef = ref();
const moveOutlinePassRef = ref();

const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapperRef);
onMounted(() => {
  const renderer = rendererRef.value.renderer;
  const scene = sceneRef.value.scene;
  const camera = cameraRef.value.camera;
  const composer = composerRef.value.composer;
  const selectableGroup = selectableGroupRef.value.group;
  const width = wrapperWidth.value;
  const height = wrapperHeight.value;

  //雾
  scene.fog = new THREE.Fog(0xffffff, 1, 500);

  //render循环
  rendererRef.value.onBeforeRender(() => {});

  //选择时outline效果
  const moveOutlinePass = new OutlinePass(
    new THREE.Vector2(width, height),
    scene,
    camera
  );
  moveOutlinePass.visibleEdgeColor.set("#4f4ab1");
  moveOutlinePass.hiddenEdgeColor.set("#303030");
  moveOutlinePass.edgeStrength = 3;
  moveOutlinePass.edgeGlow = 0;
  moveOutlinePass.edgeThickness = 1;
  composer.addPass(moveOutlinePass);

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/textures/tri_pattern.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  moveOutlinePass.patternTexture = texture;
  moveOutlinePass.usePatternTexture = true;

  moveOutlinePassRef.value = moveOutlinePass;
});

function onPointerOver({ type, over, component, intersect }) {}

function onModelReady(model) {
  if (model.scene.traverse) {
    model.scene.traverse((o) => {
      if (o.isMesh) {
        // handle both multiple and single materials
        const asArray = Array.isArray(o.material) ? o.material : [o.material];
        // 0 works for matte materials - change as needed
        asArray.forEach((mat) => (mat.metalness = 0.1));
      }
    });
  }
}

const intersects = reactive([]);
function onPointerEvent({ component, intersect }) {
  //200ms内取第一个(离相机最近的)
  if (intersects.length === 0) {
    setTimeout(() => {
      moveOutlinePassRef.value.selectedObjects = [intersects[0]];
      console.log(intersects[0]);
      intersects.splice(0, intersects.length);
    }, 200);
  }
  intersects.push(intersect.object);
}

function configGroundTexture(texture) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.encoding = THREE.sRGBEncoding;
  //texture重复次数,5000 / 200 每张素材250 * 250 像素
  texture.repeat.set(200, 200);
  texture.anisotropy = 16;
}
</script>

<style>
body {
  margin: 0;
}
canvas {
  display: block;
}
</style>
