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
import classifyServices from '~/services/classify.service';
import type {PropsFormCreateClassify} from './interfaces';

interface IFormCreateClassify {
	name: string;
	description: string;
}

const initForm: IFormCreateClassify = {
	name: '',
	description: '',
};

function FormCreateClassify({onClose}: PropsFormCreateClassify) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateClassify>(initForm);

	const funcCreateClassify = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tạo phân loại thành công!',
				http: classifyServices.create({
					name: form.name,
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListClassify]});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.catalogClassify]});
		},
	});

	const handleCreateClassify = () => {
		return funcCreateClassify.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateClassify}>
			<Loading loading={funcCreateClassify.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thêm mới phân loại'
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
				<WrapperForm title='Thông tin phân loại'>
					<FlexLayout column gap-16>
						<Input
							label={
								<span>
									Tên phân loại <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập tên phân loại'
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

export default FormCreateClassify;
