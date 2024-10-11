import { Button, Stack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { SHADERS } from "../../../Examples";

export function Presets() {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const currentShader =
    Object.values(SHADERS).find((shader) => shader.slug === slug) ||
    SHADERS.WAVES;

  const groupedShaders = Object.values(SHADERS).reduce((acc, shader) => {
    if (!acc[shader.category]) {
      acc[shader.category] = [];
    }
    acc[shader.category].push(shader as typeof SHADERS.WAVES);
    return acc;
  }, {} as Record<string, (typeof SHADERS.WAVES)[]>);

  return (
    <Stack w="100%">
      {Object.entries(groupedShaders).map(([category, shaders]) => (
        <Stack key={category} spacing={2}>
          <Text fontSize="2xl">{category}</Text>
          {shaders.map((shader) => (
            <Button
              pointerEvents={
                shader.slug === currentShader.slug ? "none" : "auto"
              }
              key={shader.label}
              w="100%"
              justifyContent="flex-start"
              colorScheme={shader.slug === currentShader.slug ? "teal" : null}
              as={Link}
              to={`/${shader.slug}`}
            >
              {shader.label}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
