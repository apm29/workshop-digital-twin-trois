<template>
  <div ref="wrapperRef" style="width: 100vw; height: 100vh">
    <Renderer ref="rendererRef" antialias alpha :orbit-ctrl="{
      enableDamping: true,
      enablePan: true,
      dampingFactor: 0.05,
      screenSpacePanning: false,
      minDistance: 0.1,
      maxDistance: 1000,
      maxPolarAngle: (Math.PI / 2 / 90) * 85,
    }" :pointer="{ intersectRecursive: true }" shadow :resize="true">
      <Camera ref="cameraRef" :position="{ z: 20, x: 5, y: 20 }" :lookAt="{ z: 0, x: 5, y: 0 }" :fov="75"
        :aspect="wrapperWidth / wrapperHeight" :near="0.1" :far="5000" />
      <!-- <Raycaster @click="onPointerEvent" /> -->
      <Scene ref="sceneRef" background="#030303">
        <AmbientLight color="#808080" :position="{ x: 0, y: 20, z: 0 }" />
        <DirectionalLight ref="directionalLightRef" cast-shadow color="#ffffff" :position="{ x: 100, y: 300, z: 100 }"
          :shadowMapSize="{
            width: 2048,
            height: 2048,
          }" />
        <!-- <PointLight ref="pointLightRef" :shadow-map-size="{ width: 1024, height: 1024 }"
          :position="{ x: 0, y: 500, z: 0 }" />
        <PointLight :position="{ y: 50, x: 0 }" :shadow-map-size="{ width: 1024, height: 1024 }" /> -->
        <!-- sky -->
        <Mesh>
          <ShaderMaterial :props="{
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
          }" />
          <SphereGeometry :radius="4000" :width-segments="32" :height-segments="16" />
        </Mesh>
        <!-- ground grass -->
        <Mesh :position="{
          y: -0.2,
        }" :rotation="{
          x: -Math.PI / 2,
        }" receive-shadow>
          <PlaneGeometry :width="5000" :height="5000" />
          <PhongMaterial>
            <Texture src="/textures/grass.jpeg" :onLoad="configGroundTexture" />
          </PhongMaterial>
        </Mesh>
        <!-- ground cement -->
        <Plane :position="{
          y: 0.01,
        }" :rotation="{
          x: -Math.PI / 2,
        }" receive-shadow>
          <PlaneGeometry :width="200" :height="200" />
          <!-- <PhongMaterial>
            <Texture src="/textures/cement.jpeg" :props="{
              wrapS: THREE.RepeatWrapping,
              wrapT: THREE.RepeatWrapping,
            }" />
          </PhongMaterial> -->
          <PhongMaterial :props="{
            map: cementTexture,
          }" />
        </Plane>
        <!-- <Plane :width="200" :height="200" :rotation="{
          x: -Math.PI / 2,
        }" :position="{ y: 0.02 }" receive-shadow>
          <PhongMaterial color="#313131" />
        </Plane> -->
        <!-- Model -->
        <Group ref="selectableGroupRef">
          <MateialBucket @click="onPointerEvent" :onModelReady="onModelReady" :position="{
            z: 0,
          }">
          </MateialBucket>

          <MateialBucket @click="onPointerEvent" :onModelReady="onModelReady" :position="{
            z: 2,
            x: -1
          }" :rotation="{
            y: Math.PI / 12,
          }">
          </MateialBucket>
          <MateialBucket @click="onPointerEvent" :onModelReady="onModelReady" :position="{
            z: 4,
            x: -1
          }" :rotation="{
            y: -Math.PI / 12,
          }"></MateialBucket>
          <MateialBucket @click="onPointerEvent" :onModelReady="onModelReady" :position="{
            z: 6,
          }"></MateialBucket>
          <!-- 绞龙联合 -->
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/输送管聚.glb" :position="{
            x:2,
            y:7.5,
            z:7 
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
          <!-- 二楼楼板 -->
          <Box :position="{
            x:2,
            y:3.55,
            z:3
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }">
            <BoxGeometry :width="8" :height="0.1" :depth="8" />
            <PhongMaterial :props="{
              wireframe: false,
              flatShading: false,
            }" />
          </Box>
          <!-- 二楼储料 -->
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/给料槽.glb" :position="{
            x:0,
            y:3.56,
            z:0.65 
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/给料槽.glb" :position="{
            x:-1,
            y:3.56,
            z:2.4 
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/给料槽.glb" :position="{
            x:-1,
            y:3.56,
            z:4.9
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/给料槽.glb" :position="{
            x:0,
            y:3.56,
            z:6.65 
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
          <SpriteCanvasText text="给料槽" :position="{
            x:1,
            y:5,
            z:2.5
          }"></SpriteCanvasText>
          <!-- 三楼楼板 -->
          <Box :props="{
            castShadow: true,
            receiveShadow: true,
          }" :position="{
            x:4,
            y:7.10,
            z:3
           
          }">
            <BoxGeometry :width="6" :height="0.1" :depth="8" />
            <PhongMaterial :props="{
              wireframe: false,
              opacity: 0.5
            }" />
          </Box>
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/小料桶.glb" :position="{
            x:4,
            y:7.10,
            z:5
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />

          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/犁刀机.glb" :position="{
            x:2.8,
            y:2.6,
            z:5
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
          <SpriteCanvasText text="犁刀机" :position="{
            x:5.5,
            y:6,
            z:3
          }"></SpriteCanvasText>
          <!-- 致密机 -->
          <GltfModel @click="onPointerEvent" @load="onModelReady" src="/model/致密机.glb" :position="{
            x:6,
            y:0,
            z:4
          }" :props="{
            castShadow: true,
            receiveShadow: true,
          }" />
        </Group>

        <SpriteCanvasText text="致密机" :position="{
          x:9,
          y:4,
          z:2.5
        }"></SpriteCanvasText>

      </Scene>
      <!-- 后处理 -->
      <EffectComposer ref="composerRef">
        <RenderPass />
        <!-- <UnrealBloomPass :strength="1" /> -->
        <!-- <HalftonePass :radius="1" :scatter="0" /> -->
        <!-- <FXAAPass /> -->
        <EffectPass />
        <SMAAPass />
      </EffectComposer>
    </Renderer>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import Stats from "three/addons/libs/stats.module.js";
import {
  Box,
  Object3D,
  EffectComposer,
  UnrealBloomPass,
  FXAAPass,
  FilmPass,
  BokehPass,
  SMAAPass,
  SSAOPass,
  EffectPass,
  RenderPass,
  Mesh,
  GltfModel,
  Texture,
  Group,
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  PhongMaterial,
  PhysicalMaterial,
  BasicMaterial,
  Camera,
  LambertMaterial,
  HemisphereLight,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Renderer,
  Scene,
} from "troisjs";
import MateialBucket from "./components/MateialBucket.vue";
import SpriteCanvasText from "./components/SpriteCanvasText.vue";
const wrapperRef = ref();
const rendererRef = ref();
const sceneRef = ref();
const cameraRef = ref();
const composerRef = ref();
const selectableGroupRef = ref();
const pointLightRef = ref();
const directionalLightRef = ref();
const moveOutlinePassRef = ref();

const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapperRef);
onMounted(() => {
  const renderer = rendererRef.value.renderer;
  const scene = sceneRef.value.scene;
  const camera = cameraRef.value.camera;
  const composer = composerRef.value.composer;
  const selectableGroup = selectableGroupRef.value.group;
  // const pointLight = pointLightRef.value.light;
  const directionalLight = directionalLightRef.value.light;
  const width = wrapperWidth.value;
  const height = wrapperHeight.value;

  // directionalLight.shadow.mapSize.width = 2048;
  // directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  directionalLight.shadow.camera.far = 1000;
  directionalLight.shadow.bias = 0;
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // scene.add(pointLightHelper);
  // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
  // scene.add(directionalLightHelper);
  const axesHelper = new THREE.AxesHelper(100);
  axesHelper.position.y = 1;
  scene.add(axesHelper);
  //雾
  scene.fog = new THREE.Fog(0xffffff, 1, 500);

  //stats
  const stats = Stats()
  wrapperRef.value.appendChild(stats.domElement)
  //render循环
  rendererRef.value.onBeforeRender(() => {
    stats.update();
  });

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

function onPointerOver({ type, over, component, intersect }) { }

const textureLoader = new THREE.TextureLoader();
const cementTexture = textureLoader.load("/textures/cement.jpeg");
cementTexture.wrapS = THREE.RepeatWrapping;
cementTexture.wrapT = THREE.RepeatWrapping;
cementTexture.repeat.set(16, 16);
const texture = textureLoader.load("/textures/floor-wood.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
const metalTexture = textureLoader.load("/textures/metal.jpeg");
metalTexture.wrapS = THREE.MirroredRepeatWrapping;
metalTexture.wrapT = THREE.MirroredRepeatWrapping;
metalTexture.repeat.set(4, 4);
const pvcTexture = textureLoader.load("/textures/pvc.jpeg");
pvcTexture.wrapS = THREE.RepeatWrapping;
pvcTexture.wrapT = THREE.RepeatWrapping;

const defaultMaterial = new THREE.MeshLambertMaterial({
  // color: 0x3355aa,
});
defaultMaterial.map = pvcTexture
defaultMaterial.side = THREE.DoubleSide; // side
function onModelReady(model) {
  // console.log(model);
  model.scene.traverse((obj) => {
    if (obj.isMesh) {
      //把材质替换为Lambert
      const oldTexture = obj.material.map
      const defaultMaterial = new THREE.MeshLambertMaterial({
        // color: 0x3355aa,
      });
      obj.material = defaultMaterial
      obj.material.map = oldTexture
      obj.material.side = THREE.DoubleSide;
      obj.castShadow = true;
    }
  })
}

const intersects = reactive([]);
function onPointerEvent({ component, intersect }) {
  //200ms内取第一个(离相机最近的)
  if (intersects.length === 0) {
    setTimeout(() => {
      moveOutlinePassRef.value.selectedObjects = [intersects[0]];
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
