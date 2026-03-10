import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, Select, SelectMany, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import categoryServices from '~/services/category.service';
import colorServices from '~/services/color.service';
import sizeServices from '~/services/size.service';
import trademarkServices from '~/services/trademark.service';
import type {IDetailCategory, PropsFormUpdateCategory} from './interfaces';

interface IFormUpdateCategory {
	name: string;
	description: string;
	parent_id: string;
	color_ids: string[];
	size_ids: string[];
	trademark_ids: string[];
}

const initForm: IFormUpdateCategory = {
	name: '',
	description: '',
	parent_id: '',
	color_ids: [],
	size_ids: [],
	trademark_ids: [],
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
				color_ids: category?.colors?.map((v) => v._id),
				size_ids: category?.sizes?.map((v) => v._id),
				trademark_ids: category?.trademarks?.map((v) => v._id),
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

	const {data: colors = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogColor],
		queryFn: () =>
			httpRequest({
				http: colorServices.catalog({category_id: ''}),
			}),
	});

	const {data: sizes = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogSize],
		queryFn: () =>
			httpRequest({
				http: sizeServices.catalog({category_id: ''}),
			}),
	});

	const {data: trademarks = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogTrademark],
		queryFn: () =>
			httpRequest({
				http: trademarkServices.catalog({category_id: ''}),
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
					color_ids: form.color_ids,
					size_ids: form.size_ids,
					trademark_ids: form.trademark_ids,
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

	const handleCreateCategory = () => {
		return funcUpdateCategory.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateCategory}>
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
						<SelectMany
							title='Màu sắc'
							description='Thêm và lựa chọn màu sắc'
							label='Màu sắc'
							placeholder='Lựa chọn'
							checkeds={form.color_ids}
							options={colors?.map((m) => ({
								_id: m?._id,
								title: m?.name,
							}))}
							onSetDataCheckeds={(ids) =>
								setForm((prev) => ({
									...prev,
									color_ids: ids,
								}))
							}
						/>
						<div>
							<SelectMany
								title='Kích cỡ'
								description='Thêm và lựa chọn kích cỡ'
								label='Kích cỡ'
								placeholder='Lựa chọn'
								checkeds={form.size_ids}
								options={sizes?.map((m) => ({
									_id: m?._id,
									title: m?.name,
								}))}
								onSetDataCheckeds={(ids) =>
									setForm((prev) => ({
										...prev,
										size_ids: ids,
									}))
								}
							/>
						</div>
						<SelectMany
							title='Thương hiệu'
							description='Thêm và lựa chọn thương hiệu'
							label='Thương hiệu'
							placeholder='Lựa chọn'
							checkeds={form.trademark_ids}
							options={trademarks?.map((m) => ({
								_id: m?._id,
								title: m?.name,
							}))}
							onSetDataCheckeds={(ids) =>
								setForm((prev) => ({
									...prev,
									trademark_ids: ids,
								}))
							}
						/>
						<TextArea label='Mô tả' placeholder='Nhập ghi chú' name='description' />
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormUpdateCategory;
