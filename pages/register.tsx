/* 
 * Algodex Trading Bot 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { literal, object, string, TypeOf } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
// import { LoadingButton } from '@mui/lab';
// import Checkbox from '@mui/material/Checkbox';

// const registerSchema = object({
//   name: string()
//     .nonempty('Name is required')
//     .max(32, 'Name must be less than 100 characters'),
//   email: string().nonempty('Email is required').email('Email is invalid'),
//   password: string()
//     .nonempty('Password is required')
//     .min(8, 'Password must be more than 8 characters')
//     .max(32, 'Password must be less than 32 characters'),
//   passwordConfirm: string().nonempty('Please confirm your password'),
//   terms: literal(true, {
//     invalid_type_error: 'Accept Terms is required',
//   }),
// }).refine((data) => data.password === data.passwordConfirm, {
//   path: ['passwordConfirm'],
//   message: 'Passwords do not match',
// });

// type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  // const [loading, setLoading] = useState(false);

  // const {
  //   register,
  //   formState: { errors, isSubmitSuccessful },
  //   reset,
  //   handleSubmit,
  // } = useForm<RegisterInput>({
  //   resolver: zodResolver(registerSchema),
  // });

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSubmitSuccessful]);

  // const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
  //   console.log(values);
  // };
  // console.log(errors);

  return (
    <Box sx={{ maxWidth: '30rem' }}>
      {/* <Typography variant='h4' component='h1' sx={{ mb: '2rem' }}>
        Register
      </Typography>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <TextField
          sx={{ mb: 2 }}
          label='Name'
          fullWidth
          required
          error={!!errors['name']}
          helperText={errors['name'] ? errors['name'].message : ''}
          {...register('name')}
        />
        <TextField
          sx={{ mb: 2 }}
          label='Email'
          fullWidth
          required
          type='email'
          error={!!errors['email']}
          helperText={errors['email'] ? errors['email'].message : ''}
          {...register('email')}
        />
        <TextField
          sx={{ mb: 2 }}
          label='Password'
          fullWidth
          required
          type='password'
          error={!!errors['password']}
          helperText={errors['password'] ? errors['password'].message : ''}
          {...register('password')}
        />
        <TextField
          sx={{ mb: 2 }}
          label='Confirm Password'
          fullWidth
          required
          type='password'
          error={!!errors['passwordConfirm']}
          helperText={
            errors['passwordConfirm'] ? errors['passwordConfirm'].message : ''
          }
          {...register('passwordConfirm')}
        />

        <FormGroup>
          <FormControlLabel
            control={<Checkbox required />}
            {...register('terms')}
            label={
              <Typography color={errors['terms'] ? 'error' : 'inherit'}>
                Accept Terms and Conditions
              </Typography>
            }
          />
          <FormHelperText error={!!errors['terms']}>
            {errors['terms'] ? errors['terms'].message : ''}
          </FormHelperText>
        </FormGroup>

        <LoadingButton
          variant='contained'
          fullWidth
          type='submit'
          loading={loading}
          sx={{ py: '0.8rem', mt: '1rem' }}
        >
          Register
        </LoadingButton>
      </Box> */}
    </Box>
  );
};

export default RegisterPage;
