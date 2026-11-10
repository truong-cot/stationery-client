import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, Select, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import categoryServices from '~/services/category.service';
import type {IDetailCategory, PropsFormUpdateCategory} from './interfaces';

interface IFormUpdateCategory {
	name: string;
	description: string;
	parent_id: string;
}

const initForm: IFormUpdateCategory = {
	name: '',
	description: '',
	parent_id: '',
};

function FormUpdateCategory({_idCategory, onClose}: PropsFormUpdateCategory) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateCategory>(initForm);

	const {data: category, isSuccess} = useQuery<IDetailCategory>({
		queryKey: [QUERY_KEY.detailCategory, _idCategory],
		queryFn: () =>
			httpRequest({
				http: categoryServices.detail({
					_id: _idCategory,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_idCategory,
	});

	useEffect(() => {
		if (!!category && isSuccess) {
			setForm({
				name: category?.name || '',
				parent_id: category?.parent?._id || '',
				description: category?.description || '',
			});
		}
	}, [category, isSuccess]);

	const {data: categorys = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogCategory],
		queryFn: () =>
			httpRequest({
				http: categoryServices.catalog(),
			}),
	});

	const funcUpdateCategory = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa danh mục thành công!',
				http: categoryServices.update({
					_id: _idCategory,
					name: form.name,
					parent_id: form.parent_id,
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListCategory]});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.treeCategoryFull]});
		},
	});

	const handleUpdateCategory = () => {
		return funcUpdateCategory.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleUpdateCategory}>
			<Loading loading={funcUpdateCategory.isPending} />
			<WrapperFormPostion
				width={540}
				title='Chỉnh sửa danh mục'
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
				<WrapperForm title='Thông tin danh mục'>
					<FlexLayout column gap-16>
						<Input
							label={
								<span>
									Tên danh mục <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập tên danh mục'
							type='text'
							name='name'
							isRequired
							isBlur
						/>
						<Select
							placeholder='Lựa chọn'
							label='Danh mục cha'
							value={form.parent_id}
							options={categorys}
							onSelect={(data) =>
								setForm((prev) => ({
									...prev,
									parent_id: data._id,
								}))
							}
							onClean={() =>
								setForm((prev) => ({
									...prev,
									parent_id: '',
								}))
							}
							getOptionLabel={(opt) => opt.name}
							getOptionValue={(opt) => opt._id}
						/>
						<TextArea label='Mô tả' placeholder='Nhập ghi chú' name='description' />
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormUpdateCategory;
