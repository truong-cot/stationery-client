import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {httpRequest} from '~/funcs/httpRequest';
import authServices from '~/services/auth.service';
import {RootState} from '~/store';
import {setInfoUser} from '~/store/user.slice';
import type {PropsFormUpdateInfoProfile} from './interfaces';
import {QUERY_KEY} from '~/constants/config/enum';

interface IFormUpdateInfoProfile {
	name: string;
	username: string;
	description: string;
}

const initForm: IFormUpdateInfoProfile = {
	name: '',
	username: '',
	description: '',
};

function FormUpdateInfoProfile({onClose}: PropsFormUpdateInfoProfile) {
	const dispatch = useDispatch();
	const queryClient = useQueryClient();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [form, setForm] = useState<IFormUpdateInfoProfile>(initForm);

	useEffect(() => {
		if (!!infoUser) {
			setForm({
				name: infoUser?.name || '',
				username: infoUser?.username || '',
				description: infoUser?.description || '',
			});
		}
	}, [infoUser]);

	const funcUpdateInfoProfile = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật thông tin thành công!',
				http: authServices.updateInfoProfile({
					name: form.name,
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			dispatch(
				setInfoUser({
					_id: infoUser?._id!,
					username: infoUser?.username!,
					name: form.name,
					description: form.description,
				})
			);
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListAccount]});
		},
	});

	const handleUpdateInfoProfile = () => {
		return funcUpdateInfoProfile.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleUpdateInfoProfile}>
			<Loading loading={funcUpdateInfoProfile.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thông tin cá nhân'
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

export default FormUpdateInfoProfile;
