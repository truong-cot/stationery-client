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
import sizeServices from '~/services/size.service';
import type {IDetailSize, PropsFormUpdateSize} from './interfaces';

interface IFormUpdateSize {
	name: string;
	description: string;
}

const initForm: IFormUpdateSize = {
	name: '',
	description: '',
};

function FormUpdateSize({_idSize, onClose}: PropsFormUpdateSize) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateSize>(initForm);

	const {data: size, isSuccess} = useQuery<IDetailSize>({
		queryKey: [QUERY_KEY.detailSize, _idSize],
		queryFn: () =>
			httpRequest({
				http: sizeServices.detail({
					_id: _idSize,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_idSize,
	});

	useEffect(() => {
		if (!!size && isSuccess) {
			setForm({
				name: size?.name || '',
				description: size?.description || '',
			});
		}
	}, [size, isSuccess]);

	const funcUpdateSize = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa kích cỡ thành công!',
				http: sizeServices.update({
					_id: _idSize,
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
		return funcUpdateSize.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateSize}>
			<Loading loading={funcUpdateSize.isPending} />
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

export default FormUpdateSize;
