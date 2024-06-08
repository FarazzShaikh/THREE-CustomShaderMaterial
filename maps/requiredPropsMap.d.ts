/**
 * Map of props to their keywords
 * this is because Three only injects some defines if certain properties are set in the material options.
 *
 * For example, "clearcoat" must be set for 3js to include the #USE_CLEARCOAT define in the shader.
 * and thus for our custom clearcoar variant to work
 */
export declare const requiredPropsMap: {
    clearcoat: string[];
    transmission: string[];
    iridescence: string[];
};
