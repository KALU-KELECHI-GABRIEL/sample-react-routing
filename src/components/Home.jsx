import { React, useEffect, useState, useRef } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Flex,
  Stack,
  Heading,
  Input,
  Button,
  Spinner,
  Select,
  Icon,
  useColorModeValue,
  createIcon,
  useDisclosure,
  FormLabel,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Logo } from '../Logo';
import Auth from '../routes/Auth';

function Home() {
  //320615594069
  //console.log(Auth.requestHeader());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState({
    applicationRef: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const [data, setData] = useState({});
  const [updates, setUpdates] = useState({
    orderReference: data.orderReference || '',
    amountPaid: data.amountPaid || '',
    differentialOrderReference: data.differentialOrderReference || '',
    reasonForDifferentialPayment: data.amountPaid || '',
    newMeterRecommended: data.amountPaid || '',
  });
  const [isErrorApplicationRef, setIsErrorApplicationRef] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const initialRef = useRef();
  const finalRef = useRef();

  axios.defaults.headers.common['Authorization'] = Auth.requestHeader();

  const loginError = mesg => {
    Swal.fire({
      title: 'Error!',
      text: mesg,
      type: 'error',
      confirmButtonText: 'OK',
    });
  };

  const loginSuccess = () => {
    console.log(updates);
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });

    Toast.fire({
      type: 'success',
      title: 'Application Reference Valid',
    });
  };

  const onChange = e => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    console.log(values);
  };

  const onChangeUpdate = e => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setUpdates({ ...values, [name]: value });
    console.log(updates);
  };

  const onSubmit = e => {
    setIsLoading(true);
    e.preventDefault();
    if (!values.applicationRef) {
      setIsErrorApplicationRef(values.email === '');
      setIsLoading(false);
      return 0;
    } else {
      axios
        .get(
          `http://cdap.myeedc.com:2001/api/v1/map/customer/orderreference/${values.applicationRef}`
        )
        .then(res => {
          console.log('The Result from server: res.data ', res.data);
          if (res.data.success) {
            setIsLoading(false);
            loginSuccess();
            //window.location = '/';
            setData(res.data.data);
            setUpdates({
              orderReference: res.data.data.mojecOrderReference,
              amountPaid: res.data.data.differentialPaymentAmount,
              differentialOrderReference:
                res.data.data.differentialOrderReference,
              reasonForDifferentialPayment:
                res.data.data.reasonForDifferentialPayment,
              newMeterRecommended: res.data.data.meterRecommendation.name,
            });
            onOpen();
          } else if (res.data.error) {
            setIsLoading(false);
            console.log('The Result from server: res.data ', res.data);
            loginError(res.data.error);
          } else {
            setIsLoading(false);
            loginError(
              'Unexpected error: Kindly check your internet connection or contact the admin'
            );
          }
        })
        .catch(err => {
          setIsLoading(false);
          loginError(err);
        });
    }
  };

  const onSubmitUpdates = () => {
    setIsLoadingUpdates(true);
    if (
      !updates.amountPaid ||
      !updates.orderReference ||
      !updates.differentialOrderReference ||
      !updates.newMeterRecommended ||
      !updates.reasonForDifferentialPayment
    ) {
      setIsErrorApplicationRef(values.email === '');
      console.log(updates);
      setIsLoadingUpdates(false);
      return 0;
    } else {
      console.log(updates);
      axios
        .post(
          'http://cdap.myeedc.com:2001/api/v1/map/vendor/differential/payment/confirmation',
          updates
        )
        .then(res => {
          console.log('The Result from server: res.data ', res.data);
          if (res.data.success) {
            setIsLoadingUpdates(false);
            loginSuccess();
            //window.location = '/';
            setData(res.data.data);
            console.log(res.data.data);
            setUpdates({
              orderReference: res.data.data.mojecOrderReference,
              amountPaid: res.data.data.differentialPaymentAmount,
              differentialOrderReference:
                res.data.data.differentialOrderReference,
              reasonForDifferentialPayment:
                res.data.data.reasonForDifferentialPayment,
              newMeterRecommended: res.data.data.meterRecommendation.name,
            });
            onClose();
          } else if (res.data.error) {
            setIsLoadingUpdates(false);
            onClose();
            console.log('The Result from server: res.data ', res.data);
            loginError(res.data.message);
            onClose();
          } else {
            setIsLoadingUpdates(false);
            loginError(
              'Unexpected error: Kindly check your internet connection or contact the admin'
            );
            onClose();
          }
        })
        .catch(err => {
          setIsLoadingUpdates(false);
          console.log(err.response);
          onClose();
          loginError(err.response.data.message);
        });
    }
  };

  return (
    <>
      <Modal
        size="6xl"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Application Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex>
              <Box
                p="4"
                w="50%"
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="md"
                textTransform="uppercase"
                ml="2"
              >
                <FormControl>
                  <FormLabel>Amount Paid</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Amount Paid"
                    name="amountPaid"
                    value={updates.amountPaid}
                    onChange={e => onChangeUpdate(e)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>New Order Reference(New RRR)</FormLabel>
                  <Input
                    placeholder="New Order Reference"
                    name="differentialOrderReference"
                    value={updates.differentialOrderReference}
                    onChange={e => onChangeUpdate(e)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Reason For Upgrade</FormLabel>
                  <Input
                    placeholder="Reason For Upgrade"
                    name="reasonForDifferentialPayment"
                    value={updates.reasonForDifferentialPayment}
                    onChange={e => onChangeUpdate(e)}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Meter To Upgrade To</FormLabel>
                  <Select name="newMeterRecommended">
                    <option selected>Select Option</option>
                    <option value="1-Phase">1-Phase</option>
                    <option value="3-Phase">3-Phase</option>
                    <option value="HVMD-33KV">HVMD-33KV</option>
                    <option value="HVMD-11KV">HVMD-11KV</option>
                    <option value="100/5A-LVMD">100/5A-LVMD</option>
                    <option value="200/5A-LVMD">200/5A-LVMD</option>
                    <option value="300/5A-LVMD">300/5A-LVMD</option>
                    <option value="500/5A-LVMD">500/5A-LVMD</option>
                    <option value="800/5A-LVMD">800/5A-LVMD</option>
                    <option value="1-Phase DIN-RAIL">1-Phase DIN-RAIL</option>
                    <option value="50/1A PANEL METER">50/1A PANEL METER</option>
                    <option value="100/1A PANEL METER">
                      100/1A PANEL METER
                    </option>
                    <option value="300/1A PANEL METER">
                      300/1A PANEL METER
                    </option>
                    <option value="30/1A PANEL METER">30/1A PANEL METER</option>
                    <option value="400/1A PANEL METER">
                      400/1A PANEL METER
                    </option>
                    <option value="20/1A PANEL METER">20/1A PANEL METER</option>
                    <option value="600/1A PANEL METER">
                      600/1A PANEL METER
                    </option>
                    <option value="200/1A PANEL METER">
                      200/1A PANEL METER
                    </option>
                    <option value="15/1A PANEL METER">15/1A PANEL METER</option>
                    <option value="10/1A PANEL METER">10/1A PANEL METER</option>
                    <option value="150/5A PANEL METER">
                      150/5A PANEL METER
                    </option>
                    <option value="200/5A PANEL METER">
                      200/5A PANEL METER
                    </option>
                    <option value="100/5A PANEL METER">
                      100/5A PANEL METER
                    </option>
                    <option value="50/5A PANEL METER">50/5A PANEL METER</option>
                    <option value="400/5A PANEL METER">
                      400/5A PANEL METER
                    </option>
                    <option value="30/5A PANEL METER">30/5A PANEL METER</option>
                    <option value="300/5A PANEL METER">
                      300/5A PANEL METER
                    </option>
                    <option value="250/5A PANEL METER">
                      250/5A PANEL METER
                    </option>
                  </Select>
                </FormControl>
              </Box>
              <Box
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="md"
                color="blue.400"
                textTransform="uppercase"
              >
                <Text fontSize="xl" ml="2" fontWeight="bold">
                  Customer Name: {data.customerName}
                </Text>
                <Text fontSize="xl" ml="2" fontWeight="semibold">
                  Application ID: {data.applicantNo}
                </Text>
                <Text fontSize="xl" ml="2" fontWeight="semibold">
                  Address: {data.address}
                </Text>
                <Text fontSize="xl" ml="2" fontWeight="semibold">
                  MOJEC ORDER REFERENCE: {data.mojecOrderReference}
                </Text>
                <Text fontSize="xl" ml="2" fontWeight="semibold">
                  PreSurvey Approval Status:{' '}
                  {data.preSurveyApproved ? 'Approved' : 'Not Approved'}
                </Text>
                <Text fontSize="xl" ml="2" fontWeight="semibold">
                  Payment Status: {data.applicantNo}
                </Text>
                <Text fontSize="xl" ml="2" fontWeight="semibold">
                  Amount On Teller: {data.amountOnTeller}
                </Text>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            {isLoadingUpdates ? (
              <Spinner size="md" />
            ) : (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={e => onSubmitUpdates()}
              >
                Update Meter Recommendation
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        py={12}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack
          boxShadow={'2xl'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          w="8xl"
          h="xl"
          p={10}
          spacing={8}
          align={'center'}
        >
          <Icon as={NotificationIcon} w="3xl" h={24} />
          <Stack align={'center'} spacing={2}>
            <Heading
              textTransform={'uppercase'}
              fontSize={'2xl'}
              color={useColorModeValue('gray.800', 'gray.200')}
            >
              Search For Meter Application
            </Heading>
          </Stack>
          <Stack
            spacing={4}
            direction={{ base: 'column', md: 'row' }}
            w={'full'}
          >
            <Input
              name="applicationRef"
              value={values.applicationRef}
              onChange={e => onChange(e)}
              type={'text'}
              size="md"
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              placeholder={'Map Reference Order'}
              color={useColorModeValue('gray.800', 'gray.200')}
              bg={useColorModeValue('gray.100', 'gray.600')}
              rounded={'full'}
              border={0}
              _focus={{
                bg: useColorModeValue('gray.200', 'gray.800'),
                outline: 'none',
              }}
            />
            {isLoading ? (
              <Spinner size="md" />
            ) : (
              <Button
                bg={'blue.400'}
                rounded={'full'}
                color={'white'}
                size="md"
                flex={'1 0 auto'}
                _hover={{ bg: 'blue.500' }}
                _focus={{ bg: 'blue.500' }}
                onClick={e => onSubmit(e)}
              >
                Search
              </Button>
            )}
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}

export default Home;

const NotificationIcon = createIcon({
  displayName: 'Notification',
  viewBox: '0 0 128 128',
  path: (
    <g id="Notification">
      <rect
        className="cls-1"
        x="1"
        y="45"
        fill={'#fbcc88'}
        width="108"
        height="82"
      />
      <circle className="cls-2" fill={'#8cdd79'} cx="105" cy="86" r="22" />
      <rect
        className="cls-3"
        fill={'#f6b756'}
        x="1"
        y="122"
        width="108"
        height="5"
      />
      <path
        className="cls-4"
        fill={'#7ece67'}
        d="M105,108A22,22,0,0,1,83.09,84a22,22,0,0,0,43.82,0A22,22,0,0,1,105,108Z"
      />
      <path
        fill={'#f6b756'}
        className="cls-3"
        d="M109,107.63v4A22,22,0,0,1,83.09,88,22,22,0,0,0,109,107.63Z"
      />
      <path
        className="cls-5"
        fill={'#d6ac90'}
        d="M93,30l16,15L65.91,84.9a16,16,0,0,1-21.82,0L1,45,17,30Z"
      />
      <path
        className="cls-6"
        fill={'#cba07a'}
        d="M109,45,65.91,84.9a16,16,0,0,1-21.82,0L1,45l2.68-2.52c43.4,40.19,41.54,39.08,45.46,40.6A16,16,0,0,0,65.91,79.9l40.41-37.42Z"
      />
      <path
        className="cls-7"
        fill={'#dde1e8'}
        d="M93,1V59.82L65.91,84.9a16,16,0,0,1-16.77,3.18C45.42,86.64,47,87.6,17,59.82V1Z"
      />
      <path
        className="cls-8"
        fill={'#c7cdd8'}
        d="M74,56c-3.56-5.94-3-10.65-3-17.55a16.43,16.43,0,0,0-12.34-16,5,5,0,1,0-7.32,0A16,16,0,0,0,39,38c0,7.13.59,12-3,18a3,3,0,0,0,0,6H50.41a5,5,0,1,0,9.18,0H74a3,3,0,0,0,0-6ZM53.2,21.37a3,3,0,1,1,3.6,0,1,1,0,0,0-.42.7,11.48,11.48,0,0,0-2.77,0A1,1,0,0,0,53.2,21.37Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M46.09,86.73,3,127H1v-1c6-5.62-1.26,1.17,43.7-40.78A1,1,0,0,1,46.09,86.73Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M109,126v1h-2L63.91,86.73a1,1,0,0,1,1.39-1.49C111,127.85,103.11,120.51,109,126Z"
      />
      <path
        className="cls-8"
        fill={'#c7cdd8'}
        d="M93,54.81v5L65.91,84.9a16,16,0,0,1-16.77,3.18C45.42,86.64,47,87.6,17,59.82v-5L44.09,79.9a16,16,0,0,0,21.82,0Z"
      />
      <path
        className="cls-9"
        fill={'#fff'}
        d="M101,95c-.59,0-.08.34-8.72-8.3a1,1,0,0,1,1.44-1.44L101,92.56l15.28-15.28a1,1,0,0,1,1.44,1.44C100.21,96.23,101.6,95,101,95Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M56.8,18.38a3,3,0,1,0-3.6,0A1,1,0,0,1,52,20,5,5,0,1,1,58,20,1,1,0,0,1,56.8,18.38Z"
      />
      <path
        className="cls-1"
        fill={'#fbcc88'}
        d="M71,42.17V35.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,39,35c0,7.33.58,12-3,18H74A21.06,21.06,0,0,1,71,42.17Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M74,53H36a21.36,21.36,0,0,0,1.86-4H72.14A21.36,21.36,0,0,0,74,53Z"
      />
      <path className="cls-3" fill={'#f6b756'} d="M59.59,59a5,5,0,1,1-9.18,0" />
      <path
        className="cls-1"
        fill={'#fbcc88'}
        d="M74,59H36a3,3,0,0,1,0-6H74a3,3,0,0,1,0,6Z"
      />
    </g>
  ),
});

// import {
//     Avatar,
//     Box,
//     Drawer,
//     DrawerContent,
//     DrawerOverlay,
//     Flex,
//     Icon,
//     IconButton,
//     Input,
//     InputGroup,
//     InputLeftElement,
//     Text,
//     useColorModeValue,
//     useDisclosure,
//   } from "@chakra-ui/react";
//   import { FaBell, FaClipboardCheck, FaRss } from "react-icons/fa";
//   import { AiFillGift } from "react-icons/ai";
//   import { BsGearFill } from "react-icons/bs";
//   import { FiMenu, FiSearch } from "react-icons/fi";
//   import { HiCode, HiCollection } from "react-icons/hi";
//   import { MdHome } from "react-icons/md";
//   import React from "react";
//   import { Logo } from "@choc-ui/logo";

//   export default function Swibc() {
//     const sidebar = useDisclosure();

//     const NavItem = (props) => {
//       const { icon, children, ...rest } = props;
//       return (
//         <Flex
//           align="center"
//           px="4"
//           mx="2"
//           rounded="md"
//           py="3"
//           cursor="pointer"
//           color="whiteAlpha.700"
//           _hover={{
//             bg: "blackAlpha.300",
//             color: "whiteAlpha.900",
//           }}
//           role="group"
//           fontWeight="semibold"
//           transition=".15s ease"
//           {...rest}
//         >
//           {icon && (
//             <Icon
//               mr="2"
//               boxSize="4"
//               _groupHover={{
//                 color: "gray.300",
//               }}
//               as={icon}
//             />
//           )}
//           {children}
//         </Flex>
//       );
//     };

//     const SidebarContent = (props) => (
//       <Box
//         as="nav"
//         pos="fixed"
//         top="0"
//         left="0"
//         zIndex="sticky"
//         h="full"
//         pb="10"
//         overflowX="hidden"
//         overflowY="auto"
//         bg="brand.600"
//         borderColor="blackAlpha.300"
//         borderRightWidth="1px"
//         w="60"
//         {...props}
//       >
//         <Flex px="4" py="5" align="center">
//           <Logo />
//           <Text fontSize="2xl" ml="2" color="white" fontWeight="semibold">
//             Choc UI
//           </Text>
//         </Flex>
//         <Flex
//           direction="column"
//           as="nav"
//           fontSize="sm"
//           color="gray.600"
//           aria-label="Main Navigation"
//         >
//           <NavItem icon={MdHome}>Home</NavItem>
//           <NavItem icon={FaRss}>Articles</NavItem>
//           <NavItem icon={HiCollection}>Collections</NavItem>
//           <NavItem icon={FaClipboardCheck}>Checklists</NavItem>
//           <NavItem icon={HiCode}>Integrations</NavItem>
//           <NavItem icon={AiFillGift}>Changelog</NavItem>
//           <NavItem icon={BsGearFill}>Settings</NavItem>
//         </Flex>
//       </Box>
//     );
//     return (
//       <Box
//         as="section"
//         bg={useColorModeValue("gray.50", "gray.700")}
//         minH="100vh"
//       >
//         <SidebarContent display={{ base: "none", md: "unset" }} />
//         <Drawer
//           isOpen={sidebar.isOpen}
//           onClose={sidebar.onClose}
//           placement="left"
//         >
//           <DrawerOverlay />
//           <DrawerContent>
//             <SidebarContent w="full" borderRight="none" />
//           </DrawerContent>
//         </Drawer>
//         <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
//           <Flex
//             as="header"
//             align="center"
//             justify="space-between"
//             w="full"
//             px="4"
//             bg={useColorModeValue("white", "gray.800")}
//             borderBottomWidth="1px"
//             borderColor="blackAlpha.300"
//             h="14"
//           >
//             <IconButton
//               aria-label="Menu"
//               display={{ base: "inline-flex", md: "none" }}
//               onClick={sidebar.onOpen}
//               icon={<FiMenu />}
//               size="sm"
//             />
//             <InputGroup w="96" display={{ base: "none", md: "flex" }}>
//               <InputLeftElement color="gray.500">
//                 <FiSearch />
//               </InputLeftElement>
//               <Input placeholder="Search for articles..." />
//             </InputGroup>

//             <Flex align="center">
//               <Icon color="gray.500" as={FaBell} cursor="pointer" />
//               <Avatar
//                 ml="4"
//                 size="sm"
//                 name="anubra266"
//                 src="https://avatars.githubusercontent.com/u/30869823?v=4"
//                 cursor="pointer"
//               />
//             </Flex>
//           </Flex>

//           <Box as="main" p="4">
//             {/* Add content here, remove div below  */}
//             <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="96" />
//           </Box>
//         </Box>
//       </Box>
//     );
//   }
