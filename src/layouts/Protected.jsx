import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
  Stack,
  Avatar,
  Image,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaBell,
  FaClipboardCheck,
  FaRss,
  FaUserCheck,
  FaArrowLeft,
} from 'react-icons/fa';
import { AiFillGift } from 'react-icons/ai';
import { BsGearFill } from 'react-icons/bs';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { HiCode, HiCollection } from 'react-icons/hi';
import { MdHome } from 'react-icons/md';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import Logo from './logo.png';
import EEDCLogo from './logoaudit.png';
//import EEDC from './eedclogo.png';

export default function Protected({ history, children, ...rest }) {
  const sidebar = useDisclosure();

  const NavItem = props => {
    const { icon, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        mx="2"
        rounded="xl"
        py="3"
        cursor="pointer"
        color="whiteAlpha.800"
        _hover={{
          bg: 'blackAlpha.300',
          color: 'whiteAlpha.900',
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
      >
        <Link href={`/${children.toLowerCase()}`}>
          {icon && (
            <Icon
              mr="2"
              boxSize="4"
              _groupHover={{
                color: 'black.300',
              }}
              as={icon}
            />
          )}
          {children}
        </Link>
      </Flex>
    );
  };

  const SidebarContent = props => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="blue.400"
      borderColor="blackAlpha.300"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Image
          src={EEDCLogo}
          bg="white.100"
          height="100"
          width="50"
          alt="EEDC Logo"
        />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="xl"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={MdHome}>Home</NavItem>
        {/* <NavItem icon={FaRss}>Articles</NavItem> */}
        <NavItem icon={HiCollection}>Reports</NavItem>
        {/* <NavItem icon={FaClipboardCheck}>Checklists</NavItem>
        <NavItem icon={HiCode}>Integrations</NavItem>
        <NavItem icon={AiFillGift}>Changelog</NavItem>
        <NavItem icon={BsGearFill}>Settings</NavItem> */}
      </Flex>
    </Box>
  );
  return (
    <ChakraProvider theme={theme}>
      <Box
        as="section"
        bg={useColorModeValue('blue.50', 'blue.700')}
        minH="100vh"
      >
        <SidebarContent display={{ base: 'none', md: 'unset' }} />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="blue.400"
            borderBottomWidth="1px"
            borderColor="blackAlpha.300"
            h="20"
          >
            {/* <ColorModeSwitcher justifySelf="flex-end" size="md" /> */}
            <IconButton
              aria-label="Menu"
              display={{ base: 'inline-flex', md: 'none' }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />

            <Flex align="center">
              {/* <Icon size="lg" ml="4" color="white.500" as={FaUserCheck} cursor="pointer" /> */}
              <Stack direction="row" spacing={4}>
                {/* <Link href="https://chakra-ui.com" isExternal>
                  Chakra Design system <ExternalLinkIcon mx="2px" />
                </Link> */}
                <Link href="/logout">
                  <Button
                    leftIcon={<FaArrowLeft />}
                    colorScheme="orange"
                    variant="solid"
                  >
                    Logout
                  </Button>
                </Link>
              </Stack>
              <Avatar
                ml="4"
                size="lg"
                name="anubra266"
                src={EEDCLogo}
                cursor="pointer"
              />
            </Flex>
          </Flex>

          <Box as="main" p="4">
            {/* Add content here, remove div below  */}
            {/* <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="96" /> */}
            {children}
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
