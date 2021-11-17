import Breadcrumb from '@/src/components/Breadcrumb';
import { Layout } from '@/src/components/Layout';
import { useGetOrderDetailsQuery } from '@/src/services/getOrders';
import { Edit, ErrorOutlineRounded } from '@mui/icons-material';
import {
  Container,
  CircularProgress,
  Alert,
  AlertTitle,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  List,
  ListItem,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import NextLink from 'next/link';
import { getPaymentMethodLabel } from '@/src/utils/getPaymentMethodLabel';
import { PaymentMethod } from '@/src/app/cart';
import NextImage from 'next/image';

interface Props {}

const Order: React.FC<Props> = () => {
  const router = useRouter();
  const { isLoading, data: order } = useGetOrderDetailsQuery({
    id: router.query.id as string,
  });

  return (
    <Layout
      title={`Order Detail - ${
        order ? order._id : isLoading ? 'loading' : 'Not found'
      }`}
    >
      <Breadcrumb
        links={[
          { href: '/', label: 'Home' },
          { href: '/orders', label: 'orders' },
        ]}
        current={order ? order._id : isLoading ? 'loading' : 'Not found'}
      />
      {order?._id ? (
        <Grid container spacing={3} sx={{ marginTop: 5 }}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom>
              Order details
            </Typography>
            <Typography variant='body1' gutterBottom>
              Order ID: {order._id}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Delivery status: {order.isDelivered ? 'Delivered' : 'Pending'}
            </Typography>
          </Grid>
          <Grid item md={9} xs={12}>
            <Grid container gap={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' gutterBottom>
                      Shipping details
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      Name: {order.shippingDetails.name}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      Address: {order.shippingDetails.address}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      City: {order.shippingDetails.city}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      country: {order.shippingDetails.country}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      postal code: {order.shippingDetails.postalCode}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' gutterBottom>
                      Payment details
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      Payment method:{' '}
                      {getPaymentMethodLabel(
                        order.paymentMethod as PaymentMethod
                      )}
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      Status: {order.isPaid ? 'Paid' : 'Not paid'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' gutterBottom>
                      Order items
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align='right'>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item._id as string}>
                              <TableCell>
                                <NextImage
                                  src={item.image}
                                  width={86}
                                  height={86}
                                  objectFit='contain'
                                  alt={item.name}
                                />
                              </TableCell>
                              <TableCell>
                                <NextLink
                                  passHref
                                  href={`/products/${item.slug}`}
                                >
                                  <a>{item.name}</a>
                                </NextLink>
                              </TableCell>
                              <TableCell align='right'>
                                ${item.price * item.quantity}
                                <div>
                                  ${item.price} X {item.quantity}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant='h5'>Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        ${order.price.items}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${order.price.tax}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        ${order.price.shipping}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        <strong>${order.price.total}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Container maxWidth='sm' sx={{ marginTop: 5, textAlign: 'center' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Alert
              severity='error'
              elevation={3}
              icon={<ErrorOutlineRounded fontSize='large' />}
            >
              <AlertTitle>Order no found.</AlertTitle>
              <NextLink href='/orders'>See all orders</NextLink>
            </Alert>
          )}
        </Container>
      )}
    </Layout>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};