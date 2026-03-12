'use client';

import {Fragment, useEffect, useState} from 'react';
import type {PropsMainCreateProduct} from './interfaces';
import {IDataUploadFile} from '~/components/common/UploadSingleFile/interfaces';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import colorServices from '~/services/color.service';
import sizeServices from '~/services/size.service';
import trademarkServices from '~/services/trademark.service';
import categoryServices from '~/services/category.service';
import {useRouter, useSearchParams} from 'next/navigation';
import productServices from '~/services/product.service';
import {price} from '~/funcs/convertCoin';
import {toastWarn} from '~/funcs/toast';
import uploadServices from '~/services/upload.service';
import Loading from '~/components/common/Loading';
import Form, {ContextForm, Input, Select, TextArea} from '~/components/common/Form';
import FlexLayout from '~/components/layout/FlexLayout';
import HeaderActions from '~/components/utils/HeaderActions';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import WrapperForm from '~/components/utils/WrapperForm';
import GridColumn from '~/components/layout/GridColumn';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import EditerContent from '~/components/utils/EditerContent';
import {Trash} from 'iconsax-react';
import {getQueryParams} from '~/funcs/queryParams';

interface IFormCreateProduct {
	name: string;
	price: string;
	pack_size: string;
	short_description: string;
	category_id: string;
	color_id: string;
	size_id: string;
	trademark_id: string;
	is_featured: string;
}

const initForm: IFormCreateProduct = {
	name: '',
	price: '0',
	pack_size: '',
	short_description: '',
	category_id: '',
	color_id: '',
	size_id: '',
	trademark_id: '',
	is_featured: '0',
};

function MainCreateProduct({}: PropsMainCreateProduct) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const {_idCategory} = getQueryParams(searchParams);

	const [form, setForm] = useState<IFormCreateProduct>(initForm);
	const [images, setImages] = useState<IDataUploadFile[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!!_idCategory) setForm((prev) => ({...prev, category_id: _idCategory as string}));
	}, [_idCategory]);

	const {data: colors = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogColor, form.category_id],
		queryFn: () =>
			httpRequest({
				http: colorServices.catalog({category_id: form.category_id}),
			}),
		enabled: !!form.category_id,
	});

	const {data: sizes = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogSize, form.category_id],
		queryFn: () =>
			httpRequest({
				http: sizeServices.catalog({category_id: form.category_id}),
			}),
		enabled: !!form.category_id,
	});

	const {data: trademarks = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogTrademark, form.category_id],
		queryFn: () =>
			httpRequest({
				http: trademarkServices.catalog({category_id: form.category_id}),
			}),
		enabled: !!form.category_id,
	});

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

	const funcCreateProduct = useMutation({
		mutationFn: (body: {images: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm sản phẩm thành công!',
				http: productServices.create({
					pack_size: form.pack_size,
					name: form.name,
					price: price(form.price),
					short_description: form.short_description,
					category_id: form.category_id,
					color_id: form.color_id,
					size_id: form.size_id,
					trademark_id: form.trademark_id,
					is_featured: form.is_featured == '1' ? true : false,
					images: body.images,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			router.back();
		},
	});

	const handleCreateProduct = async () => {
		if (!form.category_id) return toastWarn({msg: 'Chọn danh mục!'});
		if (price(form.price) == 0) return toastWarn({msg: 'Nhập giá sản phẩm!'});
		if (images.length === 0) return toastWarn({msg: 'Vui lòng chọn hình ảnh!'});

		const files = images?.map((v) => v?.file);

		const dataImages = await httpRequest({
			setLoading,
			showMessageFailed: true,
			http: uploadServices.uploadMultil(files),
		});

		return funcCreateProduct.mutate({
			images: dataImages,
		});
	};

	return (
		<Fragment>
			<Loading loading={loading || funcCreateProduct.isPending} />
			<Form heightFull={true} form={form} setForm={setForm} onSubmit={handleCreateProduct}>
				<FlexLayout column gap-12>
					<HeaderActions title='Thêm mới sản phẩm' />
					<Breadcrumb
						listUrls={[
							{
								title: 'Danh sách sản phẩm',
								path: PATH.AdminProduct,
							},
							{
								path: '',
								title: 'Thêm mới sản phẩm',
							},
						]}
						actions={
							<FlexLayout row gap-6>
								<Button p_8_24 rounded_8 white bold onClick={() => router.back()}>
									Hủy bỏ
								</Button>
								<ContextForm.Consumer>
									{({isDone}) => (
										<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold>
											Lưu lại
										</Button>
									)}
								</ContextForm.Consumer>
							</FlexLayout>
						}
					/>

					<FlexItem flex-1 overflow-x>
						<FlexLayout column gap-12>
							<WrapperForm title='Thông tin sản phẩm'>
								<FlexLayout column gap-16>
									<GridColumn col_2>
										<Input
											label={
												<span>
													Tên sản phẩm <span style={{color: 'red'}}>* </span>
												</span>
											}
											placeholder='Nhập tên sản phẩm'
											name='name'
											type='text'
											isRequired
										/>
										<div>
											<Input
												label={
													<span>
														Kích thước đóng gói <span style={{color: 'red'}}>* </span>
													</span>
												}
												placeholder='Nhập kích thước đóng gói'
												name='pack_size'
												type='text'
												isRequired
											/>
										</div>
										<Input
											label={
												<span>
													Giá sản phẩm <span style={{color: 'red'}}>* </span>
												</span>
											}
											placeholder='Nhập giá sản phẩm'
											name='price'
											type='text'
											isMoney
											isRequired
										/>
										<div>
											<Select
												placeholder='Lựa chọn'
												label={
													<span>
														Sản phẩm nổi bật <span style={{color: 'red'}}>* </span>
													</span>
												}
												value={form.is_featured}
												options={[
													{_id: '1', name: 'Có'},
													{_id: '0', name: 'Không'},
												]}
												onSelect={(data) =>
													setForm((prev) => ({
														...prev,
														is_featured: data._id,
													}))
												}
												getOptionLabel={(opt) => opt.name}
												getOptionValue={(opt) => opt._id}
											/>
										</div>
										<Select
											placeholder='Lựa chọn'
											label={
												<span>
													Danh mục <span style={{color: 'red'}}>* </span>
												</span>
											}
											value={form.category_id}
											options={categorys}
											onSelect={(data) =>
												setForm((prev) => ({
													...prev,
													category_id: data._id,
													color_id: '',
													size_id: '',
													trademark_id: '',
												}))
											}
											onClean={() =>
												setForm((prev) => ({
													...prev,
													category_id: '',
													color_id: '',
													size_id: '',
													trademark_id: '',
												}))
											}
											getOptionLabel={(opt) => opt.name}
											getOptionValue={(opt) => opt._id}
											readOnly={!!_idCategory}
										/>
										{/* <div>
											<Select
												placeholder='Lựa chọn'
												label='Màu sắc'
												value={form.color_id}
												options={colors}
												onSelect={(data) =>
													setForm((prev) => ({
														...prev,
														color_id: data._id,
													}))
												}
												onClean={() =>
													setForm((prev) => ({
														...prev,
														color_id: '',
													}))
												}
												getOptionLabel={(opt) => opt.name}
												getOptionValue={(opt) => opt._id}
											/>
										</div>
										<Select
											placeholder='Lựa chọn'
											label='Kích cỡ'
											value={form.size_id}
											options={sizes}
											onSelect={(data) =>
												setForm((prev) => ({
													...prev,
													size_id: data._id,
												}))
											}
											onClean={() =>
												setForm((prev) => ({
													...prev,
													size_id: '',
												}))
											}
											getOptionLabel={(opt) => opt.name}
											getOptionValue={(opt) => opt._id}
										/>
										<div>
											<Select
												placeholder='Lựa chọn'
												label='Thương hiệu'
												value={form.trademark_id}
												options={trademarks}
												onSelect={(data) =>
													setForm((prev) => ({
														...prev,
														trademark_id: data._id,
													}))
												}
												onClean={() =>
													setForm((prev) => ({
														...prev,
														trademark_id: '',
													}))
												}
												getOptionLabel={(opt) => opt.name}
												getOptionValue={(opt) => opt._id}
											/>
										</div> */}
									</GridColumn>
									{/* <TextArea label='Mô tả ngắn' placeholder='Nhập ghi chú' name='short_description' /> */}
									<div>
										<UploadMultipleFile
											label={
												<span>
													Hình ảnh sản phẩm <span style={{color: 'red'}}>*</span>
												</span>
											}
											images={images}
											setImages={setImages}
										/>
									</div>
								</FlexLayout>
							</WrapperForm>
						</FlexLayout>
					</FlexItem>
				</FlexLayout>
			</Form>
		</Fragment>
	);
}

export default MainCreateProduct;
