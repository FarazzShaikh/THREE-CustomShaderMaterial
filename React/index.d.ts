import { CustomShaderMaterialProps } from './types';
import { default as CustomShaderMaterialImpl, MaterialConstructor } from '../index';
import { Material } from 'three';
import { AttachType } from '@react-three/fiber/dist/declarations/src/core/renderer';

import * as React from "react";
declare const _default: <T extends MaterialConstructor = typeof Material>(props: CustomShaderMaterialProps<T> & {
    ref?: React.Ref<CustomShaderMaterialImpl<T>>;
    attach?: AttachType;
}) => React.ReactElement;
export default _default;
export { type CustomShaderMaterialProps } from './types';
