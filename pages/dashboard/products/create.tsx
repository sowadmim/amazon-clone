import { DashboardInfo, DashboardLayout } from '@/src/components/Dashboard';
import ProductForm from '@/src/components/Dashboard/Product/ProductForm';
import { AllOutSharp } from '@mui/icons-material';
import { NextPage } from 'next';

interface Props {
  //
}

const initialValues = {
  name: '',
  description: '',
  price: 0,
  countInStock: 0,
  category: '',
  brand: '',
};

const Create: NextPage<Props> = () => {
  return (
    <DashboardLayout>
      <DashboardInfo
        title='Create New Product'
        icon={<AllOutSharp />}
        link='/dashboard/products'
        linkText='All products'
      />
      <ProductForm initialValues={initialValues} />
    </DashboardLayout>
  );
};

export default Create;
