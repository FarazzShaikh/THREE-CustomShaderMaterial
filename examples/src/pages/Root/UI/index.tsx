import {
  Box,
  Button,
  Flex,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useLayoutEffect, useRef, useState } from "react";
import { BsGear } from "react-icons/bs";
import { IoIosClose, IoIosCode } from "react-icons/io";
import { Presets } from "./Presets";
import "./styles.css";

interface UIProps {
  vs: string;
  fs: string;
  setShader: (shader: [string, string]) => void;
}

export function UI({ vs, fs, setShader }: UIProps) {
  const [open, setOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const breakpoint = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const toast = useToast();

  useLayoutEffect(() => {
    // Override console.error to set error state
    const originalError = console.error;
    console.error = (...args: any[]) => {
      originalError(...args);

      const errorText = args.join(" ");
      if (errorText.includes("THREE.WebGLProgram: Shader Error")) {
        const shaderType = errorText.includes("FRAGMENT")
          ? "Fragment"
          : "Vertex";

        toast({
          title: `${shaderType} Shader compile error: Please check your code.`,
        });
      }
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const fsEditorRef = useRef<HTMLTextAreaElement>(null!);
  const vsEditorRef = useRef<HTMLTextAreaElement>(null!);
  const onCompile = () => {
    setShader([vsEditorRef.current.value, fsEditorRef.current.value]);
  };

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      zIndex={2000}
      w={breakpoint === "sm" ? "100%" : "50%"}
      height="100%"
      maxW={breakpoint === "sm" ? "unset" : "400px"}
      background={"#ffffff80"}
      transform={`translateX(${open ? 0 : "-100%"})`}
      transition="transform 0.3s"
    >
      <Box position="relative" w="100%" h="100%">
        <IconButton
          aria-label="Open Shader Editor"
          icon={<IoIosCode />}
          onClick={() => setOpen((s) => !s)}
          position="absolute"
          top="0"
          right="0"
          transform={`translate(100%, 0) scale(${open ? 0 : 1})`}
          zIndex={1000}
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
        />

        <Tabs variant="line" h="100%">
          <TabList backgroundColor="white">
            <Tab>Preset</Tab>
            <Tab>Vertex</Tab>
            <Tab>Fragment</Tab>
            <Flex flex="1" justify="flex-end">
              <IconButton
                variant="ghost"
                aria-label="Open Shader Editor"
                icon={<IoIosClose size={32} />}
                onClick={() => setOpen(false)}
              />
            </Flex>
          </TabList>
          <TabPanels h="100%">
            <TabPanel h="calc(100% - 2rem)">
              <Presets />
            </TabPanel>

            <TabPanel h="calc(100% - 2rem)">
              <VStack h="full">
                <CodeEditor
                  data-color-mode="dark"
                  ref={vsEditorRef}
                  className="code-editor"
                  value={vs}
                  language="glsl"
                  placeholder="Please enter glsl code."
                />
                <Button
                  flex="1"
                  w="full"
                  rightIcon={<BsGear />}
                  alignItems="center"
                  colorScheme="teal"
                  onClick={onCompile}
                >
                  Compile
                </Button>
              </VStack>
            </TabPanel>
            <TabPanel h="calc(100% - 2rem)">
              <VStack h="full">
                <CodeEditor
                  ref={fsEditorRef}
                  className="code-editor"
                  value={fs}
                  language="glsl"
                  placeholder="Please enter glsl code."
                />
                <Button
                  flex="1"
                  w="full"
                  rightIcon={<BsGear />}
                  alignItems="center"
                  colorScheme="teal"
                  onClick={onCompile}
                >
                  Compile
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
