'use client';

import {Fragment, useEffect, useState} from 'react';
import styles from './MainUpdateProduct.module.scss';
import type {PropsMainUpdateProduct} from './interfaces';
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
import {convertCoin, price} from '~/funcs/convertCoin';
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
import {IDetailProduct} from '../MainDetailProduct/interfaces';

interface IFormUpdateProduct {
	name: string;
	price: string;
	code: string;
	short_description: string;
	detail_description: string;
	category_id: string;
	color_id: string;
	size_id: string;
	trademark_id: string;
	is_featured: string;
	specifications: {
		name: string;
		description: string;
	}[];
}

const initForm: IFormUpdateProduct = {
	name: '',
	price: '0',
	code: '',
	short_description: '',
	detail_description: '',
	category_id: '',
	color_id: '',
	size_id: '',
	trademark_id: '',
	is_featured: '1',
	specifications: [{name: '', description: ''}],
};

function MainUpdateProduct({}: PropsMainUpdateProduct) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const {_id} = getQueryParams(searchParams);

	const [form, setForm] = useState<IFormUpdateProduct>(initForm);
	const [images, setImages] = useState<IDataUploadFile[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const {data: product, isSuccess} = useQuery<IDetailProduct>({
		queryKey: [QUERY_KEY.detailProduct, _id],
		queryFn: () =>
			httpRequest({
				http: productServices.detail({
					_id: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_id,
	});

	useEffect(() => {
		if (!!product && isSuccess) {
			setForm({
				name: product?.name || '',
				code: product?.code || '',
				price: convertCoin(product.price) || '0',
				short_description: product?.short_description,
				detail_description: product?.detail_description,
				category_id: product?.category?._id,
				color_id: product?.color?._id || '',
				size_id: product?.size?._id || '',
				trademark_id: product?.trademark?._id || '',
				is_featured: product?.is_featured ? '1' : '0',
				specifications: product?.specifications?.length > 0 ? product?.specifications : [{name: '', description: ''}],
			});
			setImages(
				product?.images?.map((v) => ({
					file: null,
					url: '',
					path: v,
				}))
			);
		}
	}, [product, isSuccess]);

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

	const funcUpdateProduct = useMutation({
		mutationFn: (body: {images: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa sản phẩm thành công!',
				http: productServices.update({
					_id: _id as string,
					code: form.code,
					name: form.name,
					price: price(form.price),
					detail_description: form.detail_description,
					short_description: form.short_description,
					category_id: form.category_id,
					color_id: form.color_id,
					size_id: form.size_id,
					trademark_id: form.trademark_id,
					is_featured: form.is_featured == '1' ? true : false,
					specifications: form.specifications,
					images: body.images,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			router.back();
		},
	});

	const handleUpdateProduct = async () => {
		if (!form.category_id) return toastWarn({msg: 'Chọn danh mục!'});
		if (price(form.price) == 0) return toastWarn({msg: 'Nhập giá sản phẩm!'});
		if (images.length === 0) return toastWarn({msg: 'Vui lòng chọn hình ảnh!'});

		const files = images?.filter((v) => !!v.file)?.map((v) => v?.file);
		const paths = images?.filter((v) => !v?.file && !!v.path)?.map((v) => v?.path);

		if (files.length == 0) {
			return funcUpdateProduct.mutate({
				images: paths,
			});
		}

		const dataImages = await httpRequest({
			setLoading,
			http: uploadServices.uploadMultil(files),
		});

		return funcUpdateProduct.mutate({
			images: [...paths, ...dataImages],
		});
	};

	return (
		<Fragment>
			<Loading loading={loading || funcUpdateProduct.isPending} />
			<Form heightFull={true} form={form} setForm={setForm} onSubmit={handleUpdateProduct}>
				<FlexLayout column gap-12>
					<HeaderActions title='Chỉnh sửa sản phẩm' />
					<Breadcrumb
						listUrls={[
							{
								title: 'Danh sách sản phẩm',
								path: PATH.AdminProduct,
							},
							{
								path: '',
								title: 'Chỉnh sửa sản phẩm',
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
											Cập nhật
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
													Mã sản phẩm <span style={{color: 'red'}}>* </span>
												</span>
											}
											placeholder='Nhập mã sản phẩm'
											name='code'
											type='text'
											isRequired
											isUppercase
										/>
										<div>
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
										/>
										<div>
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
										</div>
									</GridColumn>
									<TextArea label='Mô tả ngắn' placeholder='Nhập ghi chú' name='short_description' />
								</FlexLayout>
							</WrapperForm>

							<WrapperForm title='Mô tả sản phẩm'>
								<FlexLayout column gap-16>
									<EditerContent
										label='Mô tả chi tiết'
										content={form.detail_description}
										setContent={(c) =>
											setForm((prev) => ({
												...prev,
												detail_description: typeof c === 'function' ? c(prev.detail_description) : c,
											}))
										}
									/>
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

							<WrapperForm
								title='Thông số kĩ thuật'
								actions={
									<Button
										p_4_8
										outline-green
										maxContent
										maxHeight
										bold
										onClick={() =>
											setForm((prev) => ({
												...prev,
												specifications: [
													...prev.specifications,
													{
														name: '',
														description: '',
													},
												],
											}))
										}
									>
										+ Thêm thông số kỹ thuật
									</Button>
								}
							>
								{form?.specifications?.map((spec, index) => (
									<div key={index} className={styles.grid}>
										<Input
											name=''
											type='text'
											label={index == 0 ? <span>Tên thông số</span> : null}
											placeholder='Nhập tên thông số'
											value={spec.name}
											isShowValue={true}
											onChangeValue={(value) => {
												setForm((prev) => ({
													...prev,
													specifications: prev.specifications.map((item, i) =>
														i === index ? {...item, name: value as string} : item
													),
												}));
											}}
										/>
										<div>
											<Input
												name=''
												type='text'
												label={index == 0 ? <span>Mô tả thông số</span> : null}
												placeholder='Nhập mô tả thông số'
												value={spec.description}
												isShowValue={true}
												onChangeValue={(value) => {
													setForm((prev) => ({
														...prev,
														specifications: prev.specifications.map((item, i) =>
															i === index ? {...item, description: value as string} : item
														),
													}));
												}}
											/>
										</div>
										<div
											className={styles.delete}
											onClick={() =>
												setForm((prev) => ({
													...prev,
													specifications:
														prev.specifications.length > 1
															? prev.specifications.filter((_, i) => i !== index)
															: [
																	{
																		name: '',
																		description: '',
																	},
																],
												}))
											}
										>
											<Trash color='#E54040' size={24} />
										</div>
									</div>
								))}
							</WrapperForm>
						</FlexLayout>
					</FlexItem>
				</FlexLayout>
			</Form>
		</Fragment>
	);
}

export default MainUpdateProduct;
