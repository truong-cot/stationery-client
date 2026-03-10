'use client';

import {useMutation} from '@tanstack/react-query';
import {ShieldSecurity, User} from 'iconsax-reactjs';
import md5 from 'md5';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import {httpRequest} from '~/funcs/httpRequest';
import authServices from '~/services/auth.service';
import {RootState} from '~/store';
import {setAccessToken, setDataLoginStorage, setRememberPassword, setStateLogin} from '~/store/auth.slice';
import styles from './MainLogin.module.scss';
import {PropsMainLogin} from './interfaces';

function MainLogin({}: PropsMainLogin) {
	const router = useRouter();
	const dispatch = useDispatch();

	const {rememberPassword, dataLoginStorage} = useSelector((state: RootState) => state.auth);

	const [form, setForm] = useState<{
		username: string;
		password: string;
	}>({
		username: '',
		password: '',
	});

	useEffect(() => {
		if (rememberPassword) {
			setForm({
				username: dataLoginStorage?.usernameStorage || '',
				password: dataLoginStorage?.passwordStorage || '',
			});
		} else {
			setForm({
				username: '',
				password: '',
			});
		}
	}, []);

	const funcLogin = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Đăng nhập thành công!',
				http: authServices.login({
					username: form.username,
					password: md5(`${process.env.NEXT_PUBLIC_KEY_PASS}${form?.password}`),
				}),
			}),
		onSuccess: (data) => {
			dispatch(setAccessToken(data.access_token));
			dispatch(setStateLogin(true));
			router.replace(PATH.AdminAccount);
		},
	});

	const handleLogin = () => {
		if (rememberPassword) {
			dispatch(
				setDataLoginStorage({
					usernameStorage: form.username,
					passwordStorage: form.password,
				})
			);
		} else {
			dispatch(setDataLoginStorage(null));
		}

		return funcLogin.mutate();
	};

	return (
		<div className={styles.login}>
			<Loading loading={funcLogin.isPending} />
			<Form form={form} setForm={setForm} onSubmit={handleLogin}>
				<Link href={PATH.Home}>
					<Image alt='Logo' src={icons.logo_small} className={styles.logo} width={80} height={80} />
				</Link>
				<h4 className={styles.title}>Mừng trở lại</h4>
				<p className={styles.des}>Vui lòng đăng nhập vào tài khoản của bạn</p>
				<div className={styles.form}>
					<Input
						label={
							<span>
								Tài khoản <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Tài khoản'
						type='text'
						name='username'
						isRequired
						isBlur
						showDone
						icon={<User size='22' variant='Bold' />}
					/>
					<Input
						label={
							<span>
								Mật khẩu <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Mật khẩu'
						type='password'
						name='password'
						isRequired
						isBlur
						showDone
						icon={<ShieldSecurity size='22' variant='Bold' />}
					/>

					<div className={styles.flex}>
						<div className={styles.remember_password}>
							<input
								id='rememberPassword'
								type='checkbox'
								name='rememberPassword'
								checked={rememberPassword}
								onChange={() => dispatch(setRememberPassword(!rememberPassword))}
							/>
							<label htmlFor='rememberPassword'>Nhớ mật khẩu</label>
						</div>
					</div>

					<ContextForm.Consumer>
						{({isDone}) => (
							<div className={styles.btn}>
								<Button disable={!isDone} p_10_24 green rounded_8 bold>
									Đăng nhập
								</Button>
							</div>
						)}
					</ContextForm.Consumer>
				</div>
			</Form>
		</div>
	);
}

export default MainLogin;
