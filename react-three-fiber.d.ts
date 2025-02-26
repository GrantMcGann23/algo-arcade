/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
import { JSX as FiberJSX } from '@react-three/fiber';
import { Vector3, Vector2 } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends FiberJSX.IntrinsicElements {
      ambientLight: FiberJSX.IntrinsicElements['ambientLight'];
      directionalLight: FiberJSX.IntrinsicElements['directionalLight'];
      mesh: FiberJSX.IntrinsicElements['mesh'];
      planeGeometry: FiberJSX.IntrinsicElements['planeGeometry'];
      boxGeometry: FiberJSX.IntrinsicElements['boxGeometry'];
      sphereGeometry: FiberJSX.IntrinsicElements['sphereGeometry'];
      meshStandardMaterial: FiberJSX.IntrinsicElements['meshStandardMaterial'];
      group: FiberJSX.IntrinsicElements['group'];
      color: FiberJSX.IntrinsicElements['color'];
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: FiberJSX.MeshProps;
    ambientLight: FiberJSX.AmbientLightProps;
    directionalLight: FiberJSX.DirectionalLightProps;
  }
}