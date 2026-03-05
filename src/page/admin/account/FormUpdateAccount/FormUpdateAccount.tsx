import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import accountServices from '~/services/account.service';
import type {IDetailAccount, PropsFormUpdateAccount} from './interfaces';

interface IFormUpdateAccount {
	name: string;
	username: string;
	description: string;
}

const initForm: IFormUpdateAccount = {
	name: '',
	username: '',
	description: '',
};

function FormUpdateAccount({_idAccount, onClose}: PropsFormUpdateAccount) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateAccount>(initForm);

	const {data: account, isSuccess} = useQuery<IDetailAccount>({
		queryKey: [QUERY_KEY.detailAccount, _idAccount],
		queryFn: () =>
			httpRequest({
				http: accountServices.detail({
					_id: _idAccount,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_idAccount,
	});

	useEffect(() => {
		if (!!account && isSuccess) {
			setForm({
				name: account?.name || '',
				username: account?.username || '',
				description: account?.description || '',
			});
		}
	}, [account, isSuccess]);

	const funcUpdateAccount = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa tài khoản thành công!',
				http: accountServices.update({
					_id: _idAccount,
					name: form.name,
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListAccount]});
		},
	});

	const handleUpdateAccount = () => {
		return funcUpdateAccount.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleUpdateAccount}>
			<Loading loading={funcUpdateAccount.isPending} />
			<WrapperFormPostion
				width={540}
				title='Chỉnh sửa tài khoản'
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
								readOnly
							/>
						</div>
						<TextArea label='Mô tả' placeholder='Nhập ghi chú' name='description' />
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormUpdateAccount;
