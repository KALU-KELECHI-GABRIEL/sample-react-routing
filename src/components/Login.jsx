import { React, useState, useEffect } from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Image,
  Text,
  useColorModeValue,
  Grid,
  theme,
  Spinner,
  Container,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Logo } from '../Logo';

export default function Login() {
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  //const toast = useToast();

  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const loginError = mesg => {
    Swal.fire({
      title: 'Error!',
      text: mesg,
      type: 'error',
      confirmButtonText: 'OK',
    });
  };

  const loginSuccess = () => {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });

    Toast.fire({
      type: 'success',
      title: 'Signed in successfully',
    });
  };

  const onChange = e => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
    console.log(login);
  };

  const onSubmit = e => {
    setIsLoading(true);
    e.preventDefault();
    if (!login.email || !login.password) {
      setIsErrorEmail(login.email === '');
      setIsErrorPassword(login.password === '');
      setIsLoading(false);
      return 0;
    } else {
      axios
        .post('http://cdap.myeedc.com:2001/api/v1/map/auth/login', {
          email: login.email,
          password: login.password,
        })
        .then(res => {
          console.log('The Result from server: res.data ', res);
          if (res.data.success) {
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('lat', Date.now());
            setIsLoading(false);
            loginSuccess();
            window.location = '/';
          } else if (res.data.error) {
            setIsLoading(false);
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

  return (
    <ChakraProvider theme={theme}>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={4} w={'full'} maxW={'xl'}>
            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
            <form onSubmit={e => onSubmit(e)}>
              <FormControl id="email" isInvalid={isErrorEmail}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={login.email}
                  onChange={e => onChange(e)}
                />
                {!isErrorEmail ? (
                  <FormHelperText>
                    Enter the email you're Registered with on MAP.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>Email is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl id="password" isInvalid={isErrorPassword}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={login.password}
                  onChange={e => onChange(e)}
                />
                {!isErrorPassword ? (
                  <FormHelperText>Password on MAP.</FormHelperText>
                ) : (
                  <FormErrorMessage>Password is required.</FormErrorMessage>
                )}
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                ></Stack>
                {isLoading ? (
                  <Spinner size="xl" />
                ) : (
                  <Button colorScheme={'blue'} variant={'solid'} type="submit">
                    Sign in
                  </Button>
                )}
              </Stack>
            </form>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
            }
          />
        </Flex>
      </Stack>
    </ChakraProvider>
  );
}
