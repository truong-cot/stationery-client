import {useMutation, useQueryClient} from '@tanstack/react-query';
import md5 from 'md5';
import {useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import accountServices from '~/services/account.service';
import type {PropsFormCreateAccount} from './interfaces';

interface IFormCreateAccount {
	name: string;
	username: string;
	password: string;
	description: string;
}

const initForm: IFormCreateAccount = {
	name: '',
	username: '',
	password: '',
	description: '',
};

function FormCreateAccount({onClose}: PropsFormCreateAccount) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateAccount>(initForm);

	const funcCreateAccount = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tạo tài khoản thành công!',
				http: accountServices.create({
					name: form.name,
					username: form.username,
					password: md5(`${process.env.NEXT_PUBLIC_KEY_PASS}${form?.password}`),
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListAccount]});
		},
	});

	const handleCreateAccount = () => {
		return funcCreateAccount.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateAccount}>
			<Loading loading={funcCreateAccount.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thêm mới tài khoản'
				actions={
					<FlexLayout row gap-8>
						<Button p_8_24 rounded_8 white bold maxHeight onClick={onClose}>
							Hủy bỏ
						</Button>
						<ContextForm.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold maxHeight>
									Lưu lại
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
									Họ và tên <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập họ và tên'
							type='text'
							name='name'
							isRequired
							isBlur
						/>
						<div>
							<Input
								label={
									<span>
										Tài khoản đăng nhập <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập tài khoản đăng nhập'
								type='text'
								name='username'
								isRequired
								isBlur
							/>
						</div>
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
						/>
						<TextArea label='Mô tả' placeholder='Nhập ghi chú' name='description' />
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormCreateAccount;
