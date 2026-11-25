'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter, useSearchParams} from 'next/navigation';
import {Fragment, useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, Select, SelectMany, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import {IDataUploadFile} from '~/components/common/UploadSingleFile/interfaces';
import FlexLayout from '~/components/layout/FlexLayout';
import GridColumn from '~/components/layout/GridColumn';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {convertCoin, price} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {getQueryParams} from '~/funcs/queryParams';
import {toastWarn} from '~/funcs/toast';
import categoryServices from '~/services/category.service';
import classifyServices from '~/services/classify.service';
import productServices from '~/services/product.service';
import sizeServices from '~/services/size.service';
import trademarkServices from '~/services/trademark.service';
import uploadServices from '~/services/upload.service';
import {IDetailProduct} from '../MainDetailProduct/interfaces';
import type {PropsMainUpdateProduct} from './interfaces';

interface IFormUpdateProduct {
	name: string;
	price: string;
	pack_size: string;
	short_description: string;
	category_id: string;
	classify_ids: string[];
	size_id: string;
	trademark_id: string;
	is_featured: string;
	status: string;
}

const initForm: IFormUpdateProduct = {
	name: '',
	price: '0',
	pack_size: '',
	short_description: '',
	category_id: '',
	classify_ids: [],
	size_id: '',
	trademark_id: '',
	is_featured: '0',
	status: '1',
};

function MainUpdateProduct({_idProduct, onClose}: PropsMainUpdateProduct) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const {_id: queryId} = getQueryParams(searchParams);
	const _id = _idProduct || (queryId as string);

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
				pack_size: product?.pack_size || '',
				price: convertCoin(product.price) || '0',
				short_description: product?.short_description || '',
				category_id: product?.category?._id || '',
				classify_ids:
					product?.classifies?.map((v) => v._id) ||
					product?.colors?.map((v) => v._id) ||
					[],
				size_id: product?.size?._id || '',
				trademark_id: product?.trademark?._id || '',
				is_featured: product?.is_featured ? '1' : '0',
				status: product?.status !== undefined ? String(product.status) : '1',
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

	const {data: classifies = []} = useQuery<
		{
			_id: string;
			name: string;
		}[]
	>({
		queryKey: [QUERY_KEY.catalogClassify],
		queryFn: () =>
			httpRequest({
				http: classifyServices.catalog(),
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
				http: sizeServices.catalog(),
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
				http: trademarkServices.catalog(),
			}),
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
					pack_size: form.pack_size,
					name: form.name,
					price: price(form.price),
					short_description: form.short_description,
					category_id: form.category_id,
					classify_ids: form.classify_ids,
					size_id: form.size_id || undefined,
					trademark_id: form.trademark_id || undefined,
					is_featured: form.is_featured == '1' ? true : false,
					status: Number(form.status),
					images: body.images,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			setImages([]);
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListProduct]});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.detailProduct, _id]});
			if (onClose) {
				onClose();
			} else {
				router.back();
			}
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
				<WrapperFormPostion
					width={780}
					title='Chỉnh sửa sản phẩm'
					actions={
						<FlexLayout row items-center fit-height gap-8 wrap>
							<div>
								<Button p_8_24 rounded_8 white bold onClick={onClose || (() => router.back())}>
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
								<div>
									<Select
										placeholder='Lựa chọn'
										label={
											<span>
												Trạng thái <span style={{color: 'red'}}>* </span>
											</span>
										}
										value={form.status}
										options={[
											{_id: '1', name: 'Hiển thị'},
											{_id: '0', name: 'Ẩn'},
										]}
										onSelect={(data) =>
											setForm((prev) => ({
												...prev,
												status: data._id,
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
										}))
									}
									onClean={() =>
										setForm((prev) => ({
											...prev,
											category_id: '',
										}))
									}
									getOptionLabel={(opt) => opt.name}
									getOptionValue={(opt) => opt._id}
								/>
								<div>
									<SelectMany
										title='Phân loại'
										description='Thêm và lựa chọn phân loại'
										label='Phân loại'
										placeholder='Lựa chọn'
										checkeds={form.classify_ids}
										options={classifies?.map((m) => ({
											_id: m?._id,
											title: m?.name,
										}))}
										onSetDataCheckeds={(ids) =>
											setForm((prev) => ({
												...prev,
												classify_ids: ids,
											}))
										}
									/>
								</div>
								{/* <Select
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
				</WrapperFormPostion>
			</Form>
		</Fragment>
	);
}

export default MainUpdateProduct;
