import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, InputColor, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import colorServices from '~/services/color.service';
import type {PropsFormCreateColor} from './interfaces';

interface IFormCreateColor {
	code: string;
	name: string;
	description: string;
}

const initForm: IFormCreateColor = {
	code: '',
	name: '',
	description: '',
};

function FormCreateColor({onClose}: PropsFormCreateColor) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateColor>(initForm);

	const funcCreateColor = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tạo màu sắc thành công!',
				http: colorServices.create({
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
		return funcCreateColor.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateColor}>
			<Loading loading={funcCreateColor.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thêm mới màu sắc'
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
				<WrapperForm title='Thông tin màu sắc'>
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

export default FormCreateColor;
