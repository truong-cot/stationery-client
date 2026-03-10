import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import sizeServices from '~/services/size.service';
import type {PropsFormCreateSize} from './interfaces';

interface IFormCreateSize {
	name: string;
	description: string;
}

const initForm: IFormCreateSize = {
	name: '',
	description: '',
};

function FormCreateSize({onClose}: PropsFormCreateSize) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateSize>(initForm);

	const funcCreateSize = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tạo kích cỡ thành công!',
				http: sizeServices.create({
					name: form.name,
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListSize]});
		},
	});

	const handleCreateSize = () => {
		return funcCreateSize.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateSize}>
			<Loading loading={funcCreateSize.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thêm mới kích cỡ'
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
										Lưu lại
									</Button>
								</div>
							)}
						</ContextForm.Consumer>
					</FlexLayout>
				}
			>
				<WrapperForm title='Thông tin kích cỡ'>
					<FlexLayout column gap-16>
						<Input
							label={
								<span>
									Tên kích cỡ <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập tên kích cỡ'
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

export default FormCreateSize;
