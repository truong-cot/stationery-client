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
import type {IDetailClassify, PropsFormUpdateClassify} from './interfaces';
import classifyServices from '~/services/classify.service';

interface IFormUpdateClassify {
	name: string;
	description: string;
}

const initForm: IFormUpdateClassify = {
	name: '',
	description: '',
};

function FormUpdateClassify({_idClassify, onClose}: PropsFormUpdateClassify) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateClassify>(initForm);

	const {data: classify, isSuccess} = useQuery<IDetailClassify>({
		queryKey: [QUERY_KEY.detailClassify, _idClassify],
		queryFn: () =>
			httpRequest({
				http: classifyServices.detail({
					_id: _idClassify,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_idClassify,
	});

	useEffect(() => {
		if (!!classify && isSuccess) {
			setForm({
				name: classify?.name || '',
				description: classify?.description || '',
			});
		}
	}, [classify, isSuccess]);

	const funcUpdateClassify = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa phân loại thành công!',
				http: classifyServices.update({
					_id: _idClassify,
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

	const handleUpdateClassify = () => {
		return funcUpdateClassify.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleUpdateClassify}>
			<Loading loading={funcUpdateClassify.isPending} />
			<WrapperFormPostion
				width={540}
				title='Chỉnh sửa phân loại'
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

export default FormUpdateClassify;
