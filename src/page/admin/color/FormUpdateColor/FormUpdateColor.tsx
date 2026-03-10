import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, InputColor, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import type {IDetailColor, PropsFormUpdateColor} from './interfaces';
import colorServices from '~/services/color.service';

interface IFormUpdateColor {
	code: string;
	name: string;
	description: string;
}

const initForm: IFormUpdateColor = {
	code: '',
	name: '',
	description: '',
};

function FormUpdateColor({_idColor, onClose}: PropsFormUpdateColor) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateColor>(initForm);

	const {data: color, isSuccess} = useQuery<IDetailColor>({
		queryKey: [QUERY_KEY.detailColor, _idColor],
		queryFn: () =>
			httpRequest({
				http: colorServices.detail({
					_id: _idColor,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_idColor,
	});

	useEffect(() => {
		if (!!color && isSuccess) {
			setForm({
				name: color?.name || '',
				code: color?.code || '',
				description: color?.description || '',
			});
		}
	}, [color, isSuccess]);

	const funcUpdateColor = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa màu sắc thành công!',
				http: colorServices.update({
					_id: _idColor,
					name: form.name,
					code: form.code,
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListColor]});
		},
	});

	const handleCreateColor = () => {
		return funcUpdateColor.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateColor}>
			<Loading loading={funcUpdateColor.isPending} />
			<WrapperFormPostion
				width={540}
				title='Chỉnh sửa màu sắc'
				actions={
					<FlexLayout row items-center fit-height gap-8 wrap>
						<div>
							<Button p_8_24 rounded_8 white bold div onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<ContextForm.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold d_block>
										Cập nhật
									</Button>
								</div>
							)}
						</ContextForm.Consumer>
					</FlexLayout>
				}
			>
				<WrapperForm title='Thông tin tài màu sắc'>
					<FlexLayout column gap-16>
						<InputColor
							label={
								<span>
									Mã màu <span style={{color: 'red'}}>*</span>
								</span>
							}
							color={form.code}
							onSetColor={(color) =>
								setForm((prev) => ({
									...prev,
									code: color,
								}))
							}
						/>
						<Input
							label={
								<span>
									Tên màu sắc <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập tên màu sắc'
							type='text'
							name='name'
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

export default FormUpdateColor;
