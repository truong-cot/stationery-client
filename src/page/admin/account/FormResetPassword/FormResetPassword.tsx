import {useMutation} from '@tanstack/react-query';
import {ShieldSecurity} from 'iconsax-reactjs';
import md5 from 'md5';
import {useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {httpRequest} from '~/funcs/httpRequest';
import accountServices from '~/services/account.service';
import type {PropsFormResetPassword} from './interfaces';

interface IFormResetPasswordAccount {
	password: string;
	rePassword: string;
}

const initForm: IFormResetPasswordAccount = {
	password: '',
	rePassword: '',
};

function FormResetPassword({_idAccount, onClose}: PropsFormResetPassword) {
	const [form, setForm] = useState<IFormResetPasswordAccount>(initForm);

	const funcResetPassword = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Reset mật khẩu thành công!',
				http: accountServices.resetPassword({
					_id: _idAccount,
					newPassword: md5(`${process.env.NEXT_PUBLIC_KEY_PASS}${form?.password}`),
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
		},
	});

	const handleResetPassword = () => {
		return funcResetPassword.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleResetPassword}>
			<Loading loading={funcResetPassword.isPending} />
			<WrapperFormPostion
				width={540}
				title='Reset mật khẩu'
				actions={
					<FlexLayout row gap-8>
						<Button p_8_24 rounded_8 white bold maxHeight onClick={onClose}>
							Hủy bỏ
						</Button>
						<ContextForm.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold maxHeight>
									Cập nhật
								</Button>
							)}
						</ContextForm.Consumer>
					</FlexLayout>
				}
			>
				<WrapperForm title='Thông tin mật khẩu'>
					<FlexLayout column gap-16>
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
							icon={<ShieldSecurity size='22' variant='Bold' />}
						/>
						<div>
							<Input
								label={
									<span>
										Xác nhận mật khẩu <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Xác nhận mật khẩu'
								type='password'
								name='rePassword'
								isRequired
								isBlur
								valueConfirm={form.password}
								icon={<ShieldSecurity size='22' variant='Bold' />}
							/>
						</div>
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormResetPassword;
