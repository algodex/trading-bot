import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Checkbox from '@mui/material/Checkbox';

const registerSchema = object({
  assetId: string()
    .nonempty('Asset Id is required')
    .max(32, 'Name must be less than 100 characters'),
  orderAlgoSize: string().nonempty('Email is required').email('Email is invalid'),
  mnemonic: string()
    .nonempty('Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  numOrders: string().nonempty('Please confirm your password'),
  spreadPercent: string().nonempty('Please add a spread'),
    terms: literal(true, {
    invalid_type_error: 'Accept Terms is required',
  }),
});

type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    console.log(values);
  };
  console.log(errors);

  return (
    <Grid container sx={{ height: "100%", width: "100%"}}>
      <Grid item lg={5} sx={{padding:"30px"}}>
        <Box sx={{ maxWidth: '30rem' }}>
          <Typography variant='h4' component='h1' sx={{ mb: '2rem' }}>
            Algodex Market Making Bot
          </Typography>
          <Box
            component='form'
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <TextField
              sx={{ mb: 2 }}
              label='Asset Id'
              fullWidth
              required
              error={!!errors['assetId']}
              helperText={errors['assetId'] ? errors['assetId'].message : ''}
              {...register('assetId')}
            />
            <TextField
              sx={{ mb: 2 }}
              label='Order Size (Algo)'
              fullWidth
              required
              type='orderAlgoSize'
              error={!!errors['orderAlgoSize']}
              helperText={errors['orderAlgoSize'] ? errors['orderAlgoSize'].message : ''}
              {...register('orderAlgoSize')}
            />
            <TextField
              sx={{ mb: 2 }}
              label='Mnemonic'
              fullWidth
              required
              type='mnemonic'
              error={!!errors['mnemonic']}
              helperText={errors['mnemonic'] ? errors['mnemonic'].message : ''}
              {...register('mnemonic')}
            />
            <TextField
              sx={{ mb: 2 }}
              label='Spread Percentage'
              fullWidth
              required
              type='spreadPercent'
              error={!!errors['spreadPercent']}
              helperText={errors['spreadPercent'] ? errors['spreadPercent'].message : ''}
              {...register('spreadPercent')}
            />
            <TextField
              sx={{ mb: 2 }}
              label='Num Orders'
              fullWidth
              required
              type='numOrders'
              error={!!errors['numOrders']}
              helperText={
                errors['numOrders'] ? errors['numOrders'].message : ''
              }
              {...register('numOrders')}
            />

            <LoadingButton
              variant='contained'
              fullWidth
              type='submit'
              loading={loading}
              sx={{ py: '0.8rem', mt: '1rem' }}
            >
              Start Bot
            </LoadingButton>
          </Box>
        </Box>
    </Grid>
    <Grid  lg={7} sx={{padding:"30px"}}>
      <Box>
        <TextField
          placeholder="MultiLine with rows: 2 and rowsMax: 4"
          multiline
          rows={20}
          maxRows={20}
          fullWidth
        />
      </Box>
    </Grid>
    </Grid>

  );
};

export default RegisterPage;
