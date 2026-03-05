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
import authServices from '~/services/auth.service';
import type {PropsFormChangePassword} from './interfaces';

interface IFormChangePassword {
	oldPassword: string;
	newPassword: string;
	rePassword: string;
}

const initForm: IFormChangePassword = {
	oldPassword: '',
	newPassword: '',
	rePassword: '',
};

function FormChangePassword({onClose}: PropsFormChangePassword) {
	const [form, setForm] = useState<IFormChangePassword>(initForm);

	const funcChangeMyPassword = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Đổi mật khẩu thành công!',
				http: authServices.changeMyPassword({
					oldPassword: md5(`${process.env.NEXT_PUBLIC_KEY_PASS}${form?.oldPassword}`),
					newPassword: md5(`${process.env.NEXT_PUBLIC_KEY_PASS}${form?.newPassword}`),
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
		},
	});

	const handleCreateAccount = () => {
		return funcChangeMyPassword.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateAccount}>
			<Loading loading={funcChangeMyPassword.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thay đổi mật khẩu'
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
				<WrapperForm title='Thông tin tài khoản'>
					<FlexLayout column gap-16>
						<Input
							label={
								<span>
									Mật khẩu cũ <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập mật khẩu cũ'
							type='password'
							name='oldPassword'
							isRequired
							isBlur
							icon={<ShieldSecurity size='22' variant='Bold' />}
						/>
						<div>
							<Input
								label={
									<span>
										Mật khẩu mới <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập mật khẩu mới'
								type='password'
								name='newPassword'
								isRequired
								isBlur
								icon={<ShieldSecurity size='22' variant='Bold' />}
							/>
						</div>
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
							valueConfirm={form.newPassword}
							icon={<ShieldSecurity size='22' variant='Bold' />}
						/>
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormChangePassword;
